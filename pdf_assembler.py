"""
Zimbabwe GovTech MVP - Statutory Forms PDF Assembler
Compliant with S.I. 46 of 2020 & Companies and Other Business Entities Act [Ch 24:31].
Generates:
1. Form CR 2: Application for Reservation of Name (Section 21)
2. Form CR 5: Notice of Situation of Registered Office & Postal Address (Section 112)
3. Form CR 6: List of Directors and Principal Officers (Replaces CR 14) (Section 195/216)
4. Form CR 16: Declaration of Beneficial Ownership (Section 72)
"""

import os
from typing import Dict, Any, List
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

OUTPUT_DIR = "/sdcard/Antigravity_Projects/zim-govtech-mvp/generated_forms"


def get_custom_styles():
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "GovTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        alignment=1,  # Center
        textColor=colors.HexColor("#1b4332")
    )
    sub_title_style = ParagraphStyle(
        "GovSubTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        alignment=1,  # Center
        textColor=colors.HexColor("#2d6a4f")
    )
    legal_ref_style = ParagraphStyle(
        "GovLegalRef",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=8,
        leading=11,
        alignment=1,
        textColor=colors.HexColor("#495057")
    )
    body_style = ParagraphStyle(
        "GovBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#212529")
    )
    bold_cell_style = ParagraphStyle(
        "GovBoldCell",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1b4332")
    )
    cell_style = ParagraphStyle(
        "GovCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#212529")
    )
    badge_style = ParagraphStyle(
        "GovBadge",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        alignment=1,
        textColor=colors.HexColor("#081c15")
    )
    return {
        "title": title_style,
        "sub_title": sub_title_style,
        "legal_ref": legal_ref_style,
        "body": body_style,
        "bold_cell": bold_cell_style,
        "cell": cell_style,
        "badge": badge_style
    }


def add_gov_header(elements: list, form_code: str, form_title: str, cobe_ref: str, styles: dict):
    elements.append(Paragraph("REPUBLIC OF ZIMBABWE", styles["title"]))
    elements.append(Paragraph("COMPANIES AND OTHER BUSINESS ENTITIES ACT [CHAPTER 24:31]", styles["sub_title"]))
    elements.append(Paragraph(f"<b>STATUTORY FORM {form_code}</b> - {form_title.upper()}", styles["sub_title"]))
    elements.append(Paragraph(f"(Section {cobe_ref}; Statutory Instrument 46 of 2020)", styles["legal_ref"]))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1b4332"), spaceAfter=10))


def generate_form_cr2(data: Dict[str, Any], filepath: str) -> str:
    """Generate Form CR 2: Application for Reservation of Name."""
    doc = SimpleDocTemplate(filepath, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = get_custom_styles()
    elements = []

    add_gov_header(elements, "CR 2", "Application for Reservation of Name", "21 & 27", styles)

    # Applicant details
    elements.append(Paragraph("<b>PART I: PARTICULARS OF APPLICANT</b>", styles["bold_cell"]))
    applicant_data = [
        [Paragraph("Applicant Full Name:", styles["bold_cell"]), Paragraph(data.get("applicant_name", "Tendai Chidzero"), styles["cell"])],
        [Paragraph("National ID / Passport:", styles["bold_cell"]), Paragraph(data.get("applicant_id", "63-1000002-R-42"), styles["cell"])],
        [Paragraph("Physical Address:", styles["bold_cell"]), Paragraph(data.get("applicant_address", "14 Samora Machel Ave, Harare"), styles["cell"])],
        [Paragraph("Email & Telephone:", styles["bold_cell"]), Paragraph(data.get("applicant_contact", "+263 77 123 4567 / info@business.co.zw"), styles["cell"])],
    ]
    t1 = Table(applicant_data, colWidths=[150, 370])
    t1.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ced4da")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e8f5e9")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(t1)
    elements.append(Spacer(1, 10))

    # Proposed Names Table
    elements.append(Paragraph("<b>PART II: PROPOSED NAMES (IN ORDER OF PREFERENCE)</b>", styles["bold_cell"]))
    proposed_names = data.get("proposed_names", [
        "Vanguard Agro-Logistics (Pvt) Ltd",
        "Vanguard Distribution & Freight (Pvt) Ltd",
        "Vanguard Grain Supply (Pvt) Ltd"
    ])

    name_rows = [
        [Paragraph("<b>Order</b>", styles["bold_cell"]),
         Paragraph("<b>Proposed Name (including Pvt Ltd)</b>", styles["bold_cell"]),
         Paragraph("<b>Registrar Recommendation</b>", styles["bold_cell"])]
    ]
    for idx, name in enumerate(proposed_names, start=1):
        status_note = "Priority 1 (Primary)" if idx == 1 else f"Alternative {idx-1}"
        name_rows.append([
            Paragraph(f"{idx}", styles["cell"]),
            Paragraph(f"<b>{name}</b>", styles["cell"]),
            Paragraph(status_note, styles["cell"])
        ])

    t2 = Table(name_rows, colWidths=[50, 320, 150])
    t2.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ced4da")),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#c8e6c9")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(t2)
    elements.append(Spacer(1, 10))

    # Part III: Main Objects
    elements.append(Paragraph("<b>PART III: PRINCIPAL OBJECTS & MAIN BUSINESS</b>", styles["bold_cell"]))
    objects_text = data.get("main_objects", (
        "Agricultural commodities processing, haulage logistics, warehousing, "
        "and nationwide distribution of foodstuffs and agricultural inputs."
    ))
    t3 = Table([[Paragraph(objects_text, styles["cell"])]], colWidths=[520])
    t3.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ced4da")),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8f9fa")),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(t3)
    elements.append(Spacer(1, 14))

    # Declaration
    elements.append(Paragraph("<b>PART IV: STATUTORY DECLARATION</b>", styles["bold_cell"]))
    elements.append(Paragraph(
        "I hereby apply for reservation of the above name in terms of section 21 of the Act "
        "and confirm that the name is not calculated to deceive or mislead.",
        styles["body"]
    ))
    elements.append(Spacer(1, 16))

    sig_table = Table([
        [Paragraph("<b>Signature of Applicant/Agent:</b> ____________________", styles["cell"]),
         Paragraph(f"<b>Date:</b> {data.get('date', '2026-10-06')}", styles["cell"])],
        [Paragraph("<b>Official CIPZ ZimConnect Filing Ref:</b> ZW-CR2-2026-09824", styles["cell"]),
         Paragraph("<b>Statutory Fee Paid:</b> ZiG 250.00 / US$ 10.00", styles["cell"])]
    ], colWidths=[300, 220])
    sig_table.setStyle(TableStyle([
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(sig_table)

    doc.build(elements)
    return filepath


def generate_form_cr5(data: Dict[str, Any], filepath: str) -> str:
    """Generate Form CR 5: Notice of Situation of Registered Office & Postal Address."""
    doc = SimpleDocTemplate(filepath, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = get_custom_styles()
    elements = []

    add_gov_header(elements, "CR 5", "Notice of Situation of Registered Office & Postal Address", "112", styles)

    company_name = data.get("company_name", "Vanguard Agro-Logistics (Pvt) Ltd")
    elements.append(Paragraph(f"<b>Company Name:</b> {company_name}", styles["bold_cell"]))
    elements.append(Paragraph(f"<b>Registration Number / Reference:</b> {data.get('reg_number', 'PENDING - COBE-2026-8812')}", styles["body"]))
    elements.append(Spacer(1, 10))

    addr_rows = [
        [Paragraph("<b>Statutory Office Component</b>", styles["bold_cell"]),
         Paragraph("<b>Address Details (Physical Street Location Mandatory)</b>", styles["bold_cell"])],
        [
            Paragraph("<b>Physical Situation of Registered Office:</b><br/><i>(COBE Sec 112 strictly forbids P.O. Box alone)</i>", styles["bold_cell"]),
            Paragraph(data.get("registered_office_physical", "Stand 412, Workington Industrial Area, Paisley Road, Harare, Zimbabwe"), styles["cell"])
        ],
        [
            Paragraph("<b>Postal Address:</b>", styles["bold_cell"]),
            Paragraph(data.get("registered_office_postal", "P.O. Box CY 1290, Causeway, Harare, Zimbabwe"), styles["cell"])
        ],
        [
            Paragraph("<b>Effective Date:</b>", styles["bold_cell"]),
            Paragraph(data.get("effective_date", "2026-10-06 (Date of Incorporation)"), styles["cell"])
        ]
    ]
    t = Table(addr_rows, colWidths=[180, 340])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ced4da")),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#c8e6c9")),
        ("BACKGROUND", (0, 1), (0, -1), colors.HexColor("#f1f8e9")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("<b>DECLARATION BY DIRECTOR / PRINCIPAL OFFICER</b>", styles["bold_cell"]))
    elements.append(Paragraph(
        "I hereby give notice that the situation of the registered office and the postal address "
        "of the company are as stated above in accordance with Section 112 of the Companies and "
        "Other Business Entities Act [Chapter 24:31].",
        styles["body"]
    ))
    elements.append(Spacer(1, 18))

    sig_table = Table([
        [Paragraph("<b>Signature:</b> ___________________________", styles["cell"]),
         Paragraph(f"<b>Date:</b> {data.get('date', '2026-10-06')}", styles["cell"])],
        [Paragraph("<b>Capacity:</b> Director / Designated Secretary", styles["cell"]),
         Paragraph("<b>Seal / Stamp:</b> [ CIPZ OFFICIAL LODGEMENT ]", styles["cell"])]
    ], colWidths=[280, 240])
    elements.append(sig_table)

    doc.build(elements)
    return filepath


def generate_form_cr6(data: Dict[str, Any], filepath: str) -> str:
    """Generate Form CR 6: List of Directors and Principal Officers (replaces CR 14)."""
    doc = SimpleDocTemplate(filepath, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = get_custom_styles()
    elements = []

    add_gov_header(elements, "CR 6", "List of Directors and Principal Officers & Notice of Appointments", "195 & 216", styles)

    company_name = data.get("company_name", "Vanguard Agro-Logistics (Pvt) Ltd")
    elements.append(Paragraph(f"<b>Company Name:</b> {company_name}", styles["bold_cell"]))
    elements.append(Paragraph(f"<b>Reference:</b> {data.get('reg_number', 'PENDING - COBE-2026-8812')}", styles["body"]))
    elements.append(Spacer(1, 8))

    elements.append(Paragraph("<b>PART I: PARTICULARS OF DIRECTORS (Minimum 2, At least 1 Resident in Zim)</b>", styles["bold_cell"]))
    directors = data.get("directors", [
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
    ])

    dir_headers = [
        Paragraph("<b>Full Legal Name</b>", styles["bold_cell"]),
        Paragraph("<b>National ID / Passport</b>", styles["bold_cell"]),
        Paragraph("<b>Nationality & Residence</b>", styles["bold_cell"]),
        Paragraph("<b>Residential Address</b>", styles["bold_cell"]),
        Paragraph("<b>Appointed</b>", styles["bold_cell"])
    ]
    dir_rows = [dir_headers]
    for d in directors:
        res_tag = "ZIM RESIDENT" if d.get("ordinarily_resident_zim") else "NON-RESIDENT"
        dir_rows.append([
            Paragraph(f"<b>{d.get('full_name')}</b>", styles["cell"]),
            Paragraph(d.get("national_id", ""), styles["cell"]),
            Paragraph(f"{d.get('nationality', 'Zimbabwean')}<br/><b>({res_tag})</b>", styles["cell"]),
            Paragraph(d.get("residential_address", ""), styles["cell"]),
            Paragraph(d.get("date_of_appointment", "2026-10-06"), styles["cell"]),
        ])

    t_dir = Table(dir_rows, colWidths=[110, 95, 95, 150, 70])
    t_dir.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ced4da")),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#c8e6c9")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_dir)
    elements.append(Spacer(1, 10))

    # Secretary
    elements.append(Paragraph("<b>PART II: PARTICULARS OF COMPANY SECRETARY (COBE Sec 216)</b>", styles["bold_cell"]))
    sec = data.get("company_secretary", {
        "full_name": "Farai Munetsi",
        "national_id": "63-1000004-T-42",
        "residential_address": "52 Enterprise Road, Highlands, Harare, Zimbabwe",
        "date_of_appointment": "2026-10-06"
    })
    sec_rows = [
        [Paragraph("<b>Full Name:</b>", styles["bold_cell"]), Paragraph(sec.get("full_name", ""), styles["cell"])],
        [Paragraph("<b>National ID / Reg No:</b>", styles["bold_cell"]), Paragraph(sec.get("national_id", ""), styles["cell"])],
        [Paragraph("<b>Address:</b>", styles["bold_cell"]), Paragraph(sec.get("residential_address", ""), styles["cell"])],
        [Paragraph("<b>Date Appointed:</b>", styles["bold_cell"]), Paragraph(sec.get("date_of_appointment", "2026-10-06"), styles["cell"])],
    ]
    t_sec = Table(sec_rows, colWidths=[140, 380])
    t_sec.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ced4da")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f1f8e9")),
        ("PADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_sec)
    elements.append(Spacer(1, 12))

    # Declaration
    elements.append(Paragraph("<b>PART III: STATUTORY CERTIFICATE OF CONSENT & APPOINTMENT</b>", styles["bold_cell"]))
    elements.append(Paragraph(
        "We, the undersigned, certify that the persons named above have consented to act as "
        "directors and secretary of the company and that none of them is disqualified under "
        "Section 196 of the Companies and Other Business Entities Act [Chapter 24:31].",
        styles["body"]
    ))
    elements.append(Spacer(1, 14))

    sig_table = Table([
        [Paragraph("<b>Signature of Director:</b> _______________________", styles["cell"]),
         Paragraph("<b>Signature of Secretary:</b> _______________________", styles["cell"])],
        [Paragraph(f"<b>Date:</b> {data.get('date', '2026-10-06')}", styles["cell"]),
         Paragraph("<b>CIPZ Filing Code:</b> CR6-2026-VERIFIED", styles["cell"])]
    ], colWidths=[260, 260])
    elements.append(sig_table)

    doc.build(elements)
    return filepath


def generate_form_cr16(data: Dict[str, Any], filepath: str) -> str:
    """Generate Form CR 16: Declaration of Beneficial Ownership (Section 72)."""
    doc = SimpleDocTemplate(filepath, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = get_custom_styles()
    elements = []

    add_gov_header(elements, "CR 16", "Declaration of Beneficial Ownership", "72", styles)

    company_name = data.get("company_name", "Vanguard Agro-Logistics (Pvt) Ltd")
    elements.append(Paragraph(f"<b>Company Name:</b> {company_name}", styles["bold_cell"]))
    elements.append(Paragraph(
        "<i>Statutory Mandate: Any natural person who ultimately owns or controls 20% or more "
        "of shares or voting rights must be declared herein under penalty of perjury.</i>",
        styles["legal_ref"]
    ))
    elements.append(Spacer(1, 8))

    owners = data.get("beneficial_owners", [
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
    ])

    owner_headers = [
        Paragraph("<b>Beneficial Owner Full Name</b>", styles["bold_cell"]),
        Paragraph("<b>National ID / Passport</b>", styles["bold_cell"]),
        Paragraph("<b>Address & Nationality</b>", styles["bold_cell"]),
        Paragraph("<b>% Holding (>=20%)</b>", styles["bold_cell"]),
        Paragraph("<b>Nature of Control / Interest</b>", styles["bold_cell"])
    ]
    owner_rows = [owner_headers]
    for b in owners:
        owner_rows.append([
            Paragraph(f"<b>{b.get('full_name')}</b>", styles["cell"]),
            Paragraph(b.get("national_id", ""), styles["cell"]),
            Paragraph(f"{b.get('residential_address', '')}<br/>(Zimbabwean)", styles["cell"]),
            Paragraph(f"<b>{b.get('shareholding_percentage', 0.0)}%</b>", styles["bold_cell"]),
            Paragraph(b.get("nature_of_interest", "Direct Equity"), styles["cell"]),
        ])

    t_bo = Table(owner_rows, colWidths=[110, 95, 135, 75, 105])
    t_bo.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ced4da")),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#c8e6c9")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_bo)
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("<b>PART II: STATUTORY AFFIRMATION UNDER OATH</b>", styles["bold_cell"]))
    elements.append(Paragraph(
        "I declare that the information provided in this Form CR 16 is true, accurate and complete. "
        "I understand that providing false or misleading beneficial ownership information constitutes "
        "a criminal offence under Section 72(8) of the Companies and Other Business Entities Act [Chapter 24:31] "
        "and Money Laundering & Proceeds of Crime Act [Chapter 9:24].",
        styles["body"]
    ))
    elements.append(Spacer(1, 16))

    sig_table = Table([
        [Paragraph("<b>Signature of Declarant:</b> ___________________________", styles["cell"]),
         Paragraph(f"<b>Date:</b> {data.get('date', '2026-10-06')}", styles["cell"])],
        [Paragraph("<b>Commissioner of Oaths / Registrar Stamp:</b>", styles["cell"]),
         Paragraph("<b>CIPZ Beneficial Ownership Registry (AML/CFT Tier 1)</b>", styles["cell"])]
    ], colWidths=[280, 240])
    elements.append(sig_table)

    doc.build(elements)
    return filepath


def generate_all_statutory_forms(data: Dict[str, Any], output_dir: str = OUTPUT_DIR) -> Dict[str, str]:
    """Generate all 4 statutory PDFs and return dictionary of filepaths."""
    os.makedirs(output_dir, exist_ok=True)
    slug = data.get("company_name", "company").lower().replace(" ", "_").replace("(", "").replace(")", "").replace(".", "")[:20]

    cr2_path = os.path.join(output_dir, f"CR2_name_reservation_{slug}.pdf")
    cr5_path = os.path.join(output_dir, f"CR5_registered_office_{slug}.pdf")
    cr6_path = os.path.join(output_dir, f"CR6_directors_officers_{slug}.pdf")
    cr16_path = os.path.join(output_dir, f"CR16_beneficial_ownership_{slug}.pdf")

    generate_form_cr2(data, cr2_path)
    generate_form_cr5(data, cr5_path)
    generate_form_cr6(data, cr6_path)
    generate_form_cr16(data, cr16_path)

    return {
        "form_cr2": cr2_path,
        "form_cr5": cr5_path,
        "form_cr6": cr6_path,
        "form_cr16": cr16_path
    }


if __name__ == "__main__":
    sample_data = {
        "company_name": "Vanguard Agro-Logistics (Pvt) Ltd",
        "proposed_names": [
            "Vanguard Agro-Logistics (Pvt) Ltd",
            "Vanguard Freight & Distribution (Pvt) Ltd",
            "Vanguard Grain Supply (Pvt) Ltd"
        ],
        "registered_office_physical": "Stand 412, Workington Industrial Area, Paisley Road, Harare, Zimbabwe",
        "registered_office_postal": "P.O. Box CY 1290, Causeway, Harare, Zimbabwe",
        "applicant_name": "Tendai Chidzero",
        "applicant_id": "63-1000002-R-42",
        "applicant_address": "14 Samora Machel Avenue, Harare, Zimbabwe",
        "applicant_contact": "+263 77 123 4567 / info@vanguard.co.zw",
        "main_objects": "Agricultural commodities logistics, grain haulage, cold chain storage and distribution across Zimbabwe and SADC.",
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

    files = generate_all_statutory_forms(sample_data)
    for k, v in files.items():
        print(f"[OK] Generated {k}: {v} (size: {os.path.getsize(v)} bytes)")
