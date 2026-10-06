"""
Zimbabwe GovTech MVP - Statutory Validator
Grounding:
- Companies and Other Business Entities (COBE) Act [Chapter 24:31]
- S.I. 46 of 2020 (COBE Regulations and Statutory Forms)
- Cyber and Data Protection Act [Chapter 12:07]
- S.I. 155 of 2024 (Data Protection Regulations)
"""

import re
from typing import Dict, Any, List, Optional, Tuple

# Mod-23 Checksum mapping per Zimbabwe Civil Registry Department
MOD23_MAPPING: Dict[int, str] = {
    0: "Z", 1: "A", 2: "B", 3: "C", 4: "D",
    5: "E", 6: "F", 7: "G", 8: "H", 9: "J",
    10: "K", 11: "L", 12: "M", 13: "N", 14: "P",
    15: "Q", 16: "R", 17: "S", 18: "T", 19: "V",
    20: "W", 21: "X", 22: "Y"
}

MOD23_REVERSE_MAPPING: Dict[str, int] = {v: k for k, v in MOD23_MAPPING.items()}

# Strict Zimbabwe National ID regex:
# Format: XX-XXXXXXX-L-XX or XXXXXXXXXLXX
# Group 1: 2-digit district code
# Group 2: 6 to 7 digit sequential number
# Group 3: Check letter (excluding I, O, U)
# Group 4: 2-digit birth/origin code
ZIM_ID_REGEX = re.compile(r"^(\d{2})-?(\d{6,7})-?([A-HJ-NP-Z])-?(\d{2})$", re.IGNORECASE)

# Prohibited/Restricted names in Zimbabwe company registration unless specially licensed
RESTRICTED_NAME_WORDS = [
    "GOVERNMENT", "STATE", "PRESIDENT", "MINISTRY",
    "RESERVE BANK", "MUNICIPAL", "PARLIAMENT", "CHARTERED"
]


def calculate_expected_mod23_letter(digits: str) -> str:
    """Calculate the expected Mod-23 letter for numeric string."""
    clean_digits = re.sub(r"\D", "", digits)
    if not clean_digits:
        return ""
    rem = int(clean_digits) % 23
    return MOD23_MAPPING[rem]


def validate_zimbabwe_national_id(nid: str) -> Dict[str, Any]:
    """
    Validate Zimbabwe National ID against:
    1. Standard regex pattern: ^(\\d{2})-?(\\d{6,7})-?([A-HJ-NP-Z])-?(\\d{2})$
    2. Mod-23 checksum validation: int(digits_before_letter) % 23 == mapped_letter
    """
    if not nid or not isinstance(nid, str):
        return {
            "valid": False,
            "error": "National ID must be a non-empty string.",
            "district": None,
            "number": None,
            "letter": None,
            "suffix": None,
            "canonical": None
        }

    trimmed = nid.strip().upper()
    match = ZIM_ID_REGEX.match(trimmed)
    if not match:
        return {
            "valid": False,
            "error": (
                "Format invalid. Must match pattern 63-1234567-X-42 "
                "(District: 2 digits, Number: 6-7 digits, Check Letter, Suffix: 2 digits)."
            ),
            "district": None,
            "number": None,
            "letter": None,
            "suffix": None,
            "canonical": trimmed
        }

    district, num_part, letter, suffix = match.groups()
    letter = letter.upper()

    # Digits before letter can be calculated on full prefix (district + num_part)
    # or on sequential number part.
    digits_full = f"{district}{num_part}"
    expected_full = MOD23_MAPPING.get(int(digits_full) % 23)
    expected_seq = MOD23_MAPPING.get(int(num_part) % 23)

    checksum_passed = (letter == expected_full or letter == expected_seq)
    expected_letter = expected_full if letter == expected_full else (expected_seq if letter == expected_seq else expected_full)

    if not checksum_passed:
        return {
            "valid": False,
            "error": (
                f"Mod-23 checksum failed. Given '{letter}', expected '{expected_letter}' "
                f"for digits '{digits_full}'."
            ),
            "district": district,
            "number": num_part,
            "letter": letter,
            "expected_letter": expected_letter,
            "suffix": suffix,
            "canonical": f"{district}-{num_part}-{letter}-{suffix}"
        }

    canonical = f"{district}-{num_part}-{letter}-{suffix}"
    return {
        "valid": True,
        "error": None,
        "district": district,
        "number": num_part,
        "letter": letter,
        "expected_letter": expected_letter,
        "suffix": suffix,
        "canonical": canonical
    }


def validate_registered_office(physical_address: str, postal_address: Optional[str] = None) -> Dict[str, Any]:
    """
    COBE Act Section 112 & S.I. 46 of 2020 Form CR5:
    - Registered office physical address must be a physical location in Zimbabwe.
    - P.O. Box alone is strictly prohibited as a physical office.
    """
    if not physical_address or len(physical_address.strip()) < 8:
        return {
            "valid": False,
            "error": "Registered office physical address is mandatory and cannot be empty."
        }

    addr_upper = physical_address.strip().upper()

    # Prohibit P.O. Box alone as physical address
    po_box_patterns = [
        r"^P\.?\s*O\.?\s*BOX",
        r"^POST\s*OFFICE\s*BOX",
        r"^P/\s*BAG",
        r"^PRIVATE\s*BAG"
    ]
    for pat in po_box_patterns:
        if re.search(pat, addr_upper):
            # If it only contains PO box or starts with it without a street location
            if not any(st in addr_upper for st in ["STREET", "AVENUE", "AVE", "ROAD", "RD", "WAY", "LANE", "DRIVE", "BUILDING", "COMPLEX", "HOUSE", "FLOOR"]):
                return {
                    "valid": False,
                    "error": (
                        "Statutory Violation (COBE Section 112): A P.O. Box or Private Bag "
                        "cannot serve as the physical registered office address. "
                        "A street address within Zimbabwe is legally required."
                    )
                }

    # Must mention Zimbabwe or a recognized Zimbabwean municipality/town
    zim_locales = [
        "ZIMBABWE", "HARARE", "BULAWAYO", "CHITUNGWIZA", "MUTARE", "GWERU",
        "KWEKWE", "KADOMA", "MASVINGO", "CHINHOYI", "MARONDERA", "NORTON",
        "RUWA", "ZVISHAVANE", "HWANGE", "VICTORIA FALLS", "BEITBRIDGE", "BINDURA"
    ]
    has_zim_locale = any(loc in addr_upper for loc in zim_locales)
    if not has_zim_locale:
        return {
            "valid": False,
            "error": "Registered office address must be located within Zimbabwe."
        }

    return {
        "valid": True,
        "error": None,
        "physical_address": physical_address.strip(),
        "postal_address": postal_address.strip() if postal_address else physical_address.strip()
    }


def validate_directors(directors: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    COBE Act Section 195:
    - Minimum 2 directors for a Private Limited Company (Pvt Ltd).
    - At least 1 director ordinarily resident in Zimbabwe (COBE Sec 195(2)).
    - Each director must provide valid name, nationality, national ID/passport, residential address.
    """
    if not directors or len(directors) < 2:
        return {
            "valid": False,
            "error": (
                f"Statutory Defect (COBE Sec 195): A Private Limited Company must have at least 2 directors. "
                f"Currently provided: {len(directors) if directors else 0}."
            ),
            "resident_count": 0,
            "total_count": len(directors) if directors else 0
        }

    resident_count = 0
    validated_directors = []

    for idx, d in enumerate(directors, start=1):
        name = d.get("full_name", "").strip()
        is_resident = bool(d.get("ordinarily_resident_zim", False))
        nationality = d.get("nationality", "Zimbabwean").strip()
        nid = d.get("national_id", "").strip()
        passport = d.get("passport_number", "").strip()
        address = d.get("residential_address", "").strip()

        if not name:
            return {"valid": False, "error": f"Director #{idx} is missing full name."}

        if not address:
            return {"valid": False, "error": f"Director '{name}' is missing residential address."}

        # Validate ID or passport
        if nid:
            nid_val = validate_zimbabwe_national_id(nid)
            if not nid_val["valid"]:
                return {
                    "valid": False,
                    "error": f"Director '{name}' National ID invalid: {nid_val['error']}"
                }
            canonical_id = nid_val["canonical"]
        elif passport:
            canonical_id = passport.upper()
        else:
            return {
                "valid": False,
                "error": f"Director '{name}' must have either a Zimbabwe National ID or Passport Number."
            }

        if is_resident:
            resident_count += 1

        validated_directors.append({
            "full_name": name,
            "ordinarily_resident_zim": is_resident,
            "nationality": nationality,
            "national_id": canonical_id,
            "residential_address": address,
            "date_of_appointment": d.get("date_of_appointment", "2026-10-06")
        })

    if resident_count < 1:
        return {
            "valid": False,
            "error": (
                "Statutory Defect (COBE Sec 195(2)): At least one director must be "
                "ordinarily resident in Zimbabwe."
            ),
            "resident_count": 0,
            "total_count": len(directors)
        }

    return {
        "valid": True,
        "error": None,
        "resident_count": resident_count,
        "total_count": len(directors),
        "directors": validated_directors
    }


def validate_company_secretary(secretary: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """
    COBE Act Section 216:
    - Every company must have at least one company secretary.
    - Company secretary may be an individual or body corporate.
    """
    if not secretary:
        return {
            "valid": False,
            "error": "Statutory Defect (COBE Sec 216): Every company must have a designated Company Secretary."
        }

    name = secretary.get("full_name", "").strip()
    address = secretary.get("residential_address", "").strip()
    nid_or_passport = secretary.get("national_id", "").strip() or secretary.get("passport_number", "").strip()

    if not name:
        return {"valid": False, "error": "Company Secretary full name is required."}
    if not address:
        return {"valid": False, "error": f"Company Secretary '{name}' address is required."}
    if not nid_or_passport:
        return {"valid": False, "error": f"Company Secretary '{name}' National ID or Reg/Passport number is required."}

    return {
        "valid": True,
        "error": None,
        "secretary": {
            "full_name": name,
            "residential_address": address,
            "national_id": nid_or_passport,
            "date_of_appointment": secretary.get("date_of_appointment", "2026-10-06")
        }
    }


def validate_beneficial_owners(owners: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    COBE Act Section 72 & Form CR16:
    - Any natural person who holds directly or indirectly >= 20% of shares or voting rights
      must be declared on Form CR16.
    """
    if not owners:
        return {
            "valid": False,
            "error": (
                "Statutory Defect (COBE Sec 72 / Form CR16): Beneficial ownership declaration is mandatory. "
                "At least one beneficial owner holding >= 20% shareholding must be declared."
            )
        }

    total_percentage = 0.0
    validated_owners = []

    for idx, b in enumerate(owners, start=1):
        name = b.get("full_name", "").strip()
        share_pct = float(b.get("shareholding_percentage", 0.0))
        nid = b.get("national_id", "").strip()
        address = b.get("residential_address", "").strip()

        if not name:
            return {"valid": False, "error": f"Beneficial owner #{idx} missing name."}
        if share_pct <= 0 or share_pct > 100:
            return {"valid": False, "error": f"Beneficial owner '{name}' has invalid percentage: {share_pct}%"}

        if not nid:
            return {"valid": False, "error": f"Beneficial owner '{name}' missing National ID/Passport."}

        total_percentage += share_pct
        validated_owners.append({
            "full_name": name,
            "shareholding_percentage": share_pct,
            "national_id": nid,
            "residential_address": address or "Harare, Zimbabwe",
            "nature_of_interest": b.get("nature_of_interest", "Direct Shareholding & Voting Rights")
        })

    # Check if there is at least one >= 20% declaration
    has_twenty_pct = any(o["shareholding_percentage"] >= 20.0 for o in validated_owners)
    if not has_twenty_pct:
        return {
            "valid": False,
            "error": (
                "Statutory Requirement (COBE Sec 72): At least one beneficial owner holding >= 20% "
                "of voting rights or equity must be recorded in Form CR16."
            )
        }

    return {
        "valid": True,
        "error": None,
        "total_declared_percentage": total_percentage,
        "beneficial_owners": validated_owners
    }


def validate_proposed_names(names: List[str]) -> Dict[str, Any]:
    """
    COBE Act S.I. 46/2020 Form CR2:
    - Up to 5 proposed names in order of preference.
    - Check for restricted words and private limited suffix.
    """
    if not names or len(names) < 1:
        return {
            "valid": False,
            "error": "At least one proposed company name must be supplied."
        }
    if len(names) > 5:
        return {
            "valid": False,
            "error": "A maximum of 5 proposed names may be reserved under Form CR2."
        }

    validated_names = []
    for raw_name in names:
        n = raw_name.strip()
        if not n:
            continue
        # Check restricted words
        for rw in RESTRICTED_NAME_WORDS:
            if rw in n.upper():
                return {
                    "valid": False,
                    "error": (
                        f"Proposed name '{n}' contains restricted statutory word '{rw}'. "
                        f"Requires prior Ministerial consent under COBE Act."
                    )
                }
        validated_names.append(n)

    return {
        "valid": True,
        "error": None,
        "proposed_names": validated_names
    }


def validate_company_formation(company_payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Comprehensive statutory validation for Zimbabwe Private Limited Company formation.
    Evaluates:
    - Form CR2 (Names)
    - Form CR5 (Registered Office)
    - Form CR6 (Directors & Secretary)
    - Form CR16 (Beneficial Ownership)
    """
    results: Dict[str, Any] = {
        "overall_valid": True,
        "statutory_compliance_badge": "PENDING",
        "errors": [],
        "details": {}
    }

    # 1. Names
    names = company_payload.get("proposed_names", [])
    val_names = validate_proposed_names(names)
    results["details"]["form_cr2_names"] = val_names
    if not val_names["valid"]:
        results["overall_valid"] = False
        results["errors"].append(val_names["error"])

    # 2. Registered Office
    phys_addr = company_payload.get("registered_office_physical", "")
    post_addr = company_payload.get("registered_office_postal", "")
    val_office = validate_registered_office(phys_addr, post_addr)
    results["details"]["form_cr5_office"] = val_office
    if not val_office["valid"]:
        results["overall_valid"] = False
        results["errors"].append(val_office["error"])

    # 3. Directors
    directors = company_payload.get("directors", [])
    val_directors = validate_directors(directors)
    results["details"]["form_cr6_directors"] = val_directors
    if not val_directors["valid"]:
        results["overall_valid"] = False
        results["errors"].append(val_directors["error"])

    # 4. Secretary
    sec = company_payload.get("company_secretary")
    val_sec = validate_company_secretary(sec)
    results["details"]["form_cr6_secretary"] = val_sec
    if not val_sec["valid"]:
        results["overall_valid"] = False
        results["errors"].append(val_sec["error"])

    # 5. Beneficial Owners
    owners = company_payload.get("beneficial_owners", [])
    val_owners = validate_beneficial_owners(owners)
    results["details"]["form_cr16_beneficial_owners"] = val_owners
    if not val_owners["valid"]:
        results["overall_valid"] = False
        results["errors"].append(val_owners["error"])

    if results["overall_valid"]:
        results["statutory_compliance_badge"] = "COBE [CH 24:31] & S.I. 46/2020 COMPLIANT"
    else:
        results["statutory_compliance_badge"] = "STATUTORY DEFECTS DETECTED"

    return results


if __name__ == "__main__":
    print("Testing Zimbabwe Statutory Validator...")
    # Test valid ID
    test_num = "63-1000002-R-42"
    id_res = validate_zimbabwe_national_id(test_num)
    print("ID Validation Result:", id_res)
    assert id_res["valid"] is True, "Expected valid ID"

    # Test invalid checksum
    bad_id = "63-1000002-Z-42"
    bad_res = validate_zimbabwe_national_id(bad_id)
    print("Bad ID Result:", bad_res["error"])
    assert bad_res["valid"] is False, "Expected invalid ID"

    print("[OK] Statutory validator unit tests passed successfully!")
