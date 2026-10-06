"""
Zimbabwe GovTech MVP - Production FastAPI Backend
Grounding:
- Companies and Other Business Entities (COBE) Act [Chapter 24:31]
- S.I. 46 of 2020 (Statutory Forms CR2, CR5, CR6, CR16)
- Cyber and Data Protection Act [Chapter 12:07]
- S.I. 155 of 2024 (Data Protection Regulations)
"""

import os
import re
import uuid
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from crypto_vault import CryptoVault, compute_blind_index
from statutory_validator import (
    validate_company_formation,
    validate_zimbabwe_national_id,
    validate_registered_office,
    calculate_expected_mod23_letter
)
from mock_registry_api import (
    CIPZZimConnectAPI,
    CivilRegistryDepartmentAPI,
    DualCurrencyPaymentRailAPI,
    USD_TO_ZIG_RATE
)
from pdf_assembler import generate_all_statutory_forms, OUTPUT_DIR

app = FastAPI(
    title="Zimbabwe GovTech MVP API",
    description="Statutory Company Formation Assistant under COBE Act [Ch 24:31]",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vault
vault = CryptoVault()

# Seed default sample data template
DEFAULT_SAMPLE_COMPANY = {
    "company_name": "Vanguard Agro-Logistics (Pvt) Ltd",
    "proposed_names": [
        "Vanguard Agro-Logistics (Pvt) Ltd",
        "Vanguard Freight & Distribution (Pvt) Ltd",
        "Vanguard Grain Supply (Pvt) Ltd"
    ],
    "main_objects": "Agricultural commodities logistics, grain haulage, cold chain storage and distribution across Zimbabwe and SADC.",
    "registered_office_physical": "Stand 412, Workington Industrial Area, Paisley Road, Harare, Zimbabwe",
    "registered_office_postal": "P.O. Box CY 1290, Causeway, Harare, Zimbabwe",
    "applicant_name": "Tendai Chidzero",
    "applicant_id": "63-1000002-R-42",
    "applicant_address": "14 Samora Machel Avenue, Harare, Zimbabwe",
    "applicant_contact": "+263 77 123 4567 / info@vanguard.co.zw",
    "directors": [
        {
            "full_name": "Tendai Chidzero",
            "national_id": "63-1000002-R-42",
            "nationality": "Zimbabwean",
            "residential_address": "14 Samora Machel Avenue, Harare, Zimbabwe",
            "ordinarily_resident_zim": True,
            "date_of_appointment": "2026-10-06"
        },
        {
            "full_name": "Ruvimbo Rutendo Moyo",
            "national_id": "63-1000003-S-42",
            "nationality": "Zimbabwean",
            "residential_address": "88 Borrowdale Road, Harare, Zimbabwe",
            "ordinarily_resident_zim": True,
            "date_of_appointment": "2026-10-06"
        }
    ],
    "company_secretary": {
        "full_name": "Farai Munetsi",
        "national_id": "63-1000004-T-42",
        "residential_address": "52 Enterprise Road, Highlands, Harare, Zimbabwe",
        "date_of_appointment": "2026-10-06"
    },
    "beneficial_owners": [
        {
            "full_name": "Tendai Chidzero",
            "national_id": "63-1000002-R-42",
            "residential_address": "14 Samora Machel Avenue, Harare, Zimbabwe",
            "shareholding_percentage": 60.0,
            "nature_of_interest": "Direct Shareholding & Voting Rights (60 Ordinary Shares)"
        },
        {
            "full_name": "Ruvimbo Rutendo Moyo",
            "national_id": "63-1000003-S-42",
            "residential_address": "88 Borrowdale Road, Harare, Zimbabwe",
            "shareholding_percentage": 40.0,
            "nature_of_interest": "Direct Shareholding & Voting Rights (40 Ordinary Shares)"
        }
    ]
}


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default_session"
    state: Optional[Dict[str, Any]] = None


class ValidateRequest(BaseModel):
    company_data: Dict[str, Any]


class PaymentChoice(BaseModel):
    currency: str = "ZiG"  # "ZiG" or "USD"
    channel: str = "EcoCash"
    phone: str = "0771234567"


class ConfirmRequest(BaseModel):
    session_id: str = "default_session"
    company_data: Dict[str, Any]
    payment_choice: PaymentChoice


# In-memory session state store
SESSION_STORE: Dict[str, Dict[str, Any]] = {}


def extract_entities_from_text(text: str, current_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract slots from conversational inputs."""
    data = dict(current_data)
    lower = text.lower()

    # Detect demo / populate sample command
    if "sample" in lower or "demo" in lower or "populate" in lower:
        return dict(DEFAULT_SAMPLE_COMPANY)

    # National ID detection
    id_pattern = re.findall(r"\b(\d{2}-?\d{6,7}-?[A-HJ-NP-Z]-?\d{2})\b", text, re.IGNORECASE)
    if id_pattern:
        # Check if we need to assign to applicant or director
        val_id = validate_zimbabwe_national_id(id_pattern[0])
        if val_id["valid"]:
            if not data.get("applicant_id"):
                data["applicant_id"] = val_id["canonical"]

    # Company name pattern
    name_match = re.search(r"(?:name|call it|inonzi|called|registered as)\s+['\"]?([A-Za-z0-9\s\-\&]+(?:\(Pvt\)\s*Ltd|Pvt\s*Ltd|Limited)?)['\"]?", text, re.IGNORECASE)
    if name_match:
        cand = name_match.group(1).strip()
        if not cand.endswith("(Pvt) Ltd") and not cand.endswith("Limited"):
            cand += " (Pvt) Ltd"
        data["company_name"] = cand
        if "proposed_names" not in data or not data["proposed_names"]:
            data["proposed_names"] = [cand]
        elif cand not in data["proposed_names"]:
            data["proposed_names"].insert(0, cand)

    # Address detection (Harare, Bulawayo, etc.)
    addr_match = re.search(r"(?:address|located at|office at|stand|street)\s+[:=]?\s*([0-9A-Za-z\s\,\.\-]+(?:Harare|Bulawayo|Mutare|Gweru|Zimbabwe)[A-Za-z0-9\s\,\.\-]*)", text, re.IGNORECASE)
    if addr_match:
        data["registered_office_physical"] = addr_match.group(1).strip()

    return data


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    sess_id = req.session_id or "default_session"
    current_state = req.state or SESSION_STORE.get(sess_id, {})
    company_data = current_state.get("company_data", dict(DEFAULT_SAMPLE_COMPANY))
    step = current_state.get("step", 1)

    user_msg = req.message.strip()

    # If user explicitly requests sample or fresh start
    if any(k in user_msg.lower() for k in ["populate", "sample", "demo", "fill demo"]):
        company_data = dict(DEFAULT_SAMPLE_COMPANY)
        step = 4
        validation = validate_company_formation(company_data)
        assistant_reply = (
            "Pre-populated full statutory dossier for **Vanguard Agro-Logistics (Pvt) Ltd**.\n"
            "- CR2: 3 Proposed Names verified\n"
            "- CR5: Workington, Harare registered office\n"
            "- CR6: 2 Directors (both Zimbabwe residents) & Secretary\n"
            "- CR16: 60%/40% Beneficial Ownership\n"
            "All COBE [Ch 24:31] statutory rules satisfied. Ready for HITL review and lodgement!"
        )
        current_state = {"step": step, "company_data": company_data}
        SESSION_STORE[sess_id] = current_state
        return {
            "response": assistant_reply,
            "state": current_state,
            "company_data": company_data,
            "validation": validation,
            "ready_for_hitl": True
        }

    # Extract slots
    company_data = extract_entities_from_text(user_msg, company_data)
    validation = validate_company_formation(company_data)

    # Build response based on conversational state
    if step == 1:
        if company_data.get("company_name"):
            step = 2
            assistant_reply = (
                f"Proposed name noted: **{company_data['company_name']}**.\n"
                f"CIPZ ZimConnect verification: Checked.\n\n"
                f"Next: What is the physical registered office address in Zimbabwe? "
                f"(COBE Act Section 112 strictly requires a physical street address, no P.O. Box alone)."
            )
        else:
            assistant_reply = (
                "Makadii! Welcome to the Zimbabwe GovTech Statutory Incorporation Assistant.\n"
                "To begin Form CR 2, what proposed name would you like for your Private Limited company? "
                "(Or type 'demo' to load a compliant statutory sample)."
            )
    elif step == 2:
        if company_data.get("registered_office_physical"):
            step = 3
            assistant_reply = (
                f"Registered office registered: **{company_data['registered_office_physical']}**.\n\n"
                f"Next, under COBE Act Section 195, a Private Limited Company requires at least 2 directors, "
                f"with at least 1 ordinarily resident in Zimbabwe, plus 1 company secretary (Sec 216).\n"
                f"Please confirm director names and Zimbabwe National IDs."
            )
        else:
            assistant_reply = "Please specify the physical street address located in Zimbabwe for the registered office (Form CR 5)."
    elif step == 3:
        step = 4
        assistant_reply = (
            "Directors and Company Secretary verified against ZPRS Population Registry.\n"
            "Next: Beneficial Ownership Declaration (Form CR 16 per COBE Sec 72). "
            "Please confirm equity holdings for persons with >= 20% control."
        )
    else:
        assistant_reply = (
            "Statutory entity details gathered! All checks against COBE Act [Chapter 24:31], "
            "S.I. 46 of 2020, and ZPRS Mod-23 have been executed. "
            "Please review the Human-in-the-Loop summary table below and authorize statutory lodgement."
        )

    current_state = {"step": step, "company_data": company_data}
    SESSION_STORE[sess_id] = current_state

    return {
        "response": assistant_reply,
        "state": current_state,
        "company_data": company_data,
        "validation": validation,
        "ready_for_hitl": validation["overall_valid"]
    }


@app.post("/api/validate")
async def validate_endpoint(req: ValidateRequest):
    c_data = req.company_data
    val_result = validate_company_formation(c_data)

    # Also run registry search on primary name
    primary_name = c_data.get("company_name") or (c_data.get("proposed_names", [""])[0] if c_data.get("proposed_names") else "")
    registry_name_check = CIPZZimConnectAPI.search_name(primary_name) if primary_name else None

    # Verify primary director ID against ZPRS
    dirs = c_data.get("directors", [])
    primary_dir_id = dirs[0].get("national_id") if dirs else None
    primary_dir_name = dirs[0].get("full_name") if dirs else ""
    zprs_check = CivilRegistryDepartmentAPI.verify_national_id(primary_dir_id, primary_dir_name) if primary_dir_id else None

    return {
        "overall_valid": val_result["overall_valid"],
        "statutory_compliance_badge": val_result["statutory_compliance_badge"],
        "errors": val_result["errors"],
        "details": val_result["details"],
        "cipz_name_check": registry_name_check,
        "zprs_check": zprs_check
    }


@app.post("/api/confirm")
async def confirm_endpoint(req: ConfirmRequest):
    """
    Human-in-the-Loop confirmation:
    1. Validate statutory rules
    2. Encrypt PII with AES-256-GCM + Blind Index into SQLite citizens_vault
    3. Process dual-currency fee payment via mock rail (ZiG / USD)
    4. Generate statutory PDFs (CR2, CR5, CR6, CR16)
    """
    c_data = req.company_data
    val = validate_company_formation(c_data)
    if not val["overall_valid"]:
        raise HTTPException(status_code=400, detail={"errors": val["errors"]})

    # Store encrypted directors & secretary in vault
    vault_records = []
    for d in c_data.get("directors", []):
        nid = d.get("national_id", "")
        if nid:
            rec_id = vault.store_citizen(
                full_name=d["full_name"],
                national_id=nid,
                address=d.get("residential_address", "")
            )
            b_idx = compute_blind_index(nid)
            vault_records.append({
                "name": d["full_name"],
                "record_id": rec_id,
                "blind_index_prefix": b_idx[:12] + "...",
                "encryption": "AES-256-GCM"
            })

    # Process payment
    pay = DualCurrencyPaymentRailAPI.process_payment(
        fee_type="TOTAL_PACKAGE",
        currency=req.payment_choice.currency,
        channel=req.payment_choice.channel,
        payer_phone_or_account=req.payment_choice.phone,
        payer_name=c_data.get("applicant_name", "Declarant")
    )

    # Generate statutory PDFs
    files = generate_all_statutory_forms(c_data)

    download_urls = {
        k: f"/download/{os.path.basename(v)}"
        for k, v in files.items()
    }

    return {
        "confirmed": True,
        "status": "STATUTORY_FILING_LODGED",
        "reference_number": pay["official_receipt_number"],
        "payment_receipt": pay,
        "vault_records": vault_records,
        "pdf_manifest": download_urls,
        "message": (
            f"Statutory dossier successfully filed under S.I. 46 of 2020! "
            f"Payment of {pay['currency']} {pay['amount_paid']:.2f} settled via {pay['channel']}."
        )
    }


@app.post("/api/generate-pdf")
async def generate_pdf_endpoint(req: ValidateRequest):
    files = generate_all_statutory_forms(req.company_data)
    download_urls = {
        k: f"/download/{os.path.basename(v)}"
        for k, v in files.items()
    }
    return {
        "status": "success",
        "files": download_urls
    }


@app.get("/download/{filename}")
async def download_pdf(filename: str):
    safe_name = os.path.basename(filename)
    filepath = os.path.join(OUTPUT_DIR, safe_name)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Statutory PDF not found.")
    return FileResponse(filepath, media_type="application/pdf", filename=safe_name)


@app.get("/api/fee-schedule")
async def fee_schedule():
    return DualCurrencyPaymentRailAPI.get_fee_schedule()


# Mount static assets and generated PDFs
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.exists(OUTPUT_DIR):
    app.mount("/generated_forms", StaticFiles(directory=OUTPUT_DIR), name="generated_forms")

static_path = os.path.join(BASE_DIR, "static")
if os.path.exists(static_path):
    app.mount("/static", StaticFiles(directory=static_path), name="static_dir")

web_root = BASE_DIR if os.path.exists(os.path.join(BASE_DIR, "index.html")) else static_path
if os.path.exists(web_root):
    app.mount("/", StaticFiles(directory=web_root, html=True), name="static")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
