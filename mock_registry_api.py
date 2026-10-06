"""
Zimbabwe GovTech MVP - Mock Registry & Payment APIs
Simulates:
1. CIPZ ZimConnect e-Registry Name Search API (Companies & Intellectual Property Zimbabwe)
2. Civil Registry Department (ZPRS - Zimbabwe Population Registry System) ID Verification
3. ZimSwitch / RBZ Dual-Currency (ZiG and USD) Payment Rail API
"""

import time
import uuid
from typing import Dict, Any, List
from statutory_validator import validate_zimbabwe_national_id

# District codes mapping per Zimbabwe Civil Registry Department
ZIM_DISTRICT_CODES: Dict[str, str] = {
    "63": "Harare Central / Metropolitan",
    "08": "Bulawayo Central / Metropolitan",
    "75": "Mutare (Manicaland)",
    "29": "Gweru (Midlands)",
    "43": "Kwekwe (Midlands)",
    "58": "Masvingo Urban",
    "15": "Chinhoyi (Mashonaland West)",
    "48": "Marondera (Mashonaland East)",
    "26": "Gwanda (Matabeleland South)",
    "05": "Beitbridge (Matabeleland South)",
    "02": "Bindura (Mashonaland Central)",
    "38": "Hwange (Matabeleland North)",
    "70": "Zvishavane (Midlands)"
}

# Pre-registered companies in CIPZ ZimConnect database to simulate collisions
MOCK_REGISTERED_COMPANIES = [
    "ECONET WIRELESS ZIMBABWE (PVT) LTD",
    "DELTA CORPORATION LIMITED",
    "CBZ HOLDINGS LIMITED",
    "OLD MUTUAL ZIMBABWE LIMITED",
    "SEED CO LIMITED",
    "INNBUCKS MICROFINANCE (PVT) LTD",
    "CASSAVA SMARTECH ZIMBABWE (PVT) LTD",
    "ZIMBABWE FERTILIZER COMPANY (PVT) LTD",
    "DAIRIBORD HOLDINGS LIMITED",
    "VANGUARD TECHNOLOGIES (PVT) LTD",
    "NATIONAL FOODS HOLDINGS LIMITED",
    "OK ZIMBABWE LIMITED",
    "MEIKLES LIMITED"
]

# Official interbank / RBZ willing-buyer willing-seller rate benchmark
USD_TO_ZIG_RATE = 26.50


class CIPZZimConnectAPI:
    """Mock CIPZ ZimConnect e-Registry Name Search API."""

    @staticmethod
    def search_name(proposed_name: str) -> Dict[str, Any]:
        clean = proposed_name.strip().upper()
        # Clean suffix for comparison
        clean_core = clean.replace("(PVT) LTD", "").replace("LIMITED", "").replace("PVT LTD", "").strip()

        # Check restricted keywords
        prohibited = ["GOVERNMENT", "STATE", "PRESIDENT", "MINISTRY", "RESERVE BANK", "PARLIAMENT"]
        for p in prohibited:
            if p in clean:
                return {
                    "name": proposed_name,
                    "status": "REJECTED",
                    "reason": f"Statutory prohibition: Name contains restricted term '{p}'. Prior Ministerial approval required under COBE Act.",
                    "available": False,
                    "reservation_code": None
                }

        # Check exact collision
        for existing in MOCK_REGISTERED_COMPANIES:
            if clean == existing:
                return {
                    "name": proposed_name,
                    "status": "EXACT_COLLISION",
                    "reason": f"Name is identical to registered entity '{existing}'.",
                    "available": False,
                    "reservation_code": None
                }

        # Check high similarity
        for existing in MOCK_REGISTERED_COMPANIES:
            ex_core = existing.replace("(PVT) LTD", "").replace("LIMITED", "").replace("PVT LTD", "").strip()
            if clean_core == ex_core or (len(clean_core) > 5 and clean_core in ex_core):
                return {
                    "name": proposed_name,
                    "status": "SIMILAR_COLLISION",
                    "reason": f"Name closely resembles existing entity '{existing}'. May cause public deception under COBE Sec 21.",
                    "available": False,
                    "reservation_code": None
                }

        res_code = f"ZW-CIPZ-RES-2026-{uuid.uuid4().hex[:6].upper()}"
        return {
            "name": proposed_name,
            "status": "AVAILABLE",
            "reason": "Name cleared for statutory reservation under Form CR 2.",
            "available": True,
            "reservation_code": res_code,
            "reservation_expiry_days": 60
        }

    @classmethod
    def batch_search(cls, names: List[str]) -> List[Dict[str, Any]]:
        return [cls.search_name(n) for n in names]


class CivilRegistryDepartmentAPI:
    """Mock ZPRS (Zimbabwe Population Registry System) Identity Verification API."""

    # Mock database of registered citizens for verification
    CITIZEN_DB: Dict[str, Dict[str, Any]] = {
        "63-1000002-R-42": {
            "full_name": "Tendai Chidzero",
            "gender": "Male",
            "birth_date": "1988-04-18",
            "birth_place": "Harare",
            "citizenship": "Zimbabwean",
            "status": "ACTIVE_CITIZEN",
            "voter_registered": True
        },
        "63-1000003-S-42": {
            "full_name": "Ruvimbo Rutendo Moyo",
            "gender": "Female",
            "birth_date": "1992-11-04",
            "birth_place": "Harare",
            "citizenship": "Zimbabwean",
            "status": "ACTIVE_CITIZEN",
            "voter_registered": True
        },
        "63-1000004-T-42": {
            "full_name": "Farai Munetsi",
            "gender": "Male",
            "birth_date": "1985-08-21",
            "birth_place": "Harare",
            "citizenship": "Zimbabwean",
            "status": "ACTIVE_CITIZEN",
            "voter_registered": True
        },
        "08-2194812-D-08": {
            "full_name": "Sipho Ndlovu",
            "gender": "Male",
            "birth_date": "1983-02-15",
            "birth_place": "Bulawayo",
            "citizenship": "Zimbabwean",
            "status": "ACTIVE_CITIZEN",
            "voter_registered": True
        }
    }

    @classmethod
    def verify_national_id(cls, national_id: str, claimed_name: str = "") -> Dict[str, Any]:
        # 1. Mod-23 Algorithm Check
        val = validate_zimbabwe_national_id(national_id)
        if not val["valid"]:
            return {
                "verified": False,
                "error": f"Statutory Mod-23 failure: {val['error']}",
                "status": "INVALID_CHECKSUM",
                "district_office": None,
                "demographics": None
            }

        canon_id = val["canonical"]
        district_num = val["district"]
        district_name = ZIM_DISTRICT_CODES.get(district_num, f"District {district_num} Sub-Office")

        # 2. Check ZPRS Database
        record = cls.CITIZEN_DB.get(canon_id)
        if record:
            name_match = True
            if claimed_name:
                name_match = claimed_name.strip().lower() in record["full_name"].lower()

            return {
                "verified": True,
                "status": record["status"],
                "canonical_id": canon_id,
                "issuing_district": district_name,
                "demographics": {
                    "full_name": record["full_name"],
                    "citizenship": record["citizenship"],
                    "birth_date": record["birth_date"],
                    "name_match_confirmed": name_match
                },
                "audit_ref": f"ZPRS-KYC-{uuid.uuid4().hex[:8].upper()}"
            }

        # If not in mock seed database but passed Mod-23, simulate live registry hit
        synthetic_name = claimed_name if claimed_name else "Registered Citizen"
        return {
            "verified": True,
            "status": "ACTIVE_CITIZEN",
            "canonical_id": canon_id,
            "issuing_district": district_name,
            "demographics": {
                "full_name": synthetic_name,
                "citizenship": "Zimbabwean",
                "birth_date": "1990-01-01",
                "name_match_confirmed": True
            },
            "audit_ref": f"ZPRS-LIVE-{uuid.uuid4().hex[:8].upper()}"
        }


class DualCurrencyPaymentRailAPI:
    """Mock ZimSwitch / EcoCash / Innbucks Dual-Currency Payment Rail (ZiG & USD)."""

    STATUTORY_FEES_USD = {
        "CR2_NAME_SEARCH": 10.00,
        "COMPANY_INCORPORATION_DOSSIER": 20.00,
        "EXPEDITED_FILING": 5.00,
        "TOTAL_PACKAGE": 35.00
    }

    @classmethod
    def get_fee_schedule(cls) -> Dict[str, Any]:
        schedule = {}
        for item, usd_amt in cls.STATUTORY_FEES_USD.items():
            zig_amt = round(usd_amt * USD_TO_ZIG_RATE, 2)
            schedule[item] = {
                "usd": usd_amt,
                "zig": zig_amt,
                "effective_rate": USD_TO_ZIG_RATE
            }
        return schedule

    @classmethod
    def process_payment(
        cls,
        fee_type: str,
        currency: str,
        channel: str,
        payer_phone_or_account: str,
        payer_name: str
    ) -> Dict[str, Any]:
        """
        Channels: 'ECOCASH', 'INNBUCKS', 'ZIMSWITCH_ZIPIT', 'OMARI', 'BANK_TRANSFER'
        Currencies: 'ZiG', 'USD'
        """
        curr = currency.upper()
        if curr not in ["ZIG", "USD"]:
            return {
                "success": False,
                "error": f"Unsupported currency '{currency}'. Zimbabwe legal tender: ZiG or USD."
            }

        base_usd = cls.STATUTORY_FEES_USD.get(fee_type, cls.STATUTORY_FEES_USD["TOTAL_PACKAGE"])
        amount = base_usd if curr == "USD" else round(base_usd * USD_TO_ZIG_RATE, 2)

        tx_ref = f"ZIM-PAY-{curr}-{int(time.time())}-{uuid.uuid4().hex[:4].upper()}"
        receipt_no = f"ZW-REV-2026-{uuid.uuid4().hex[:6].upper()}"

        return {
            "success": True,
            "status": "SETTLED",
            "transaction_ref": tx_ref,
            "official_receipt_number": receipt_no,
            "fee_type": fee_type,
            "currency": curr,
            "amount_paid": amount,
            "exchange_rate": USD_TO_ZIG_RATE if curr == "ZIG" else 1.0,
            "channel": channel.upper(),
            "payer_name": payer_name,
            "payer_account": payer_phone_or_account,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "clearing_house": "ZimSwitch Instant Clearing (ZETSS/ZEEPAY)",
            "statutory_allocation": "CIPZ Consolidated Revenue Fund"
        }


if __name__ == "__main__":
    print("Testing Mock CIPZ & ZPRS APIs...")
    # Name Search
    res_avail = CIPZZimConnectAPI.search_name("Vanguard Agro-Logistics (Pvt) Ltd")
    print("Name Search (Available):", res_avail["status"], res_avail["reservation_code"])
    res_coll = CIPZZimConnectAPI.search_name("Econet Wireless Zimbabwe (Pvt) Ltd")
    print("Name Search (Collision):", res_coll["status"], res_coll["reason"])

    # ID Verification
    id_test = CivilRegistryDepartmentAPI.verify_national_id("63-1000002-R-42", "Tendai Chidzero")
    print("ZPRS ID Verification:", id_test["verified"], id_test["issuing_district"])

    # Dual-Currency Payment
    pay_zig = DualCurrencyPaymentRailAPI.process_payment(
        "TOTAL_PACKAGE", "ZiG", "EcoCash", "0771234567", "Tendai Chidzero"
    )
    print("Payment ZiG Result:", pay_zig["status"], f"ZiG {pay_zig['amount_paid']}", pay_zig["official_receipt_number"])

    pay_usd = DualCurrencyPaymentRailAPI.process_payment(
        "TOTAL_PACKAGE", "USD", "InnBucks", "0771234567", "Tendai Chidzero"
    )
    print("Payment USD Result:", pay_usd["status"], f"US$ {pay_usd['amount_paid']}", pay_usd["official_receipt_number"])
    print("[OK] Mock APIs functional!")
