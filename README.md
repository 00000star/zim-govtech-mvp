# Zimbabwe GovTech MVP 🇿🇼
### Next-Gen Statutory Company Formation & CIPZ Gateway
**Republic of Zimbabwe | Ministry of Justice, Legal & Parliamentary Affairs**

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=flat&logo=github)](https://00000star.github.io/zim-govtech-mvp/)
[![Statutory Law](https://img.shields.io/badge/COBE_Act-%5BCh_24%3A31%5D-blue)](docs/DPIA_POTRAZ.md)
[![Data Protection](https://img.shields.io/badge/POTRAZ_Compliant-S.I._155_of_2024-green)](docs/DPIA_POTRAZ.md)
[![RBZ Sandbox](https://img.shields.io/badge/RBZ_Sandbox-Dual--Currency-orange)](docs/RBZ_SANDBOX_APPLICATION.md)

---

## 🏛️ Executive Summary

The **Zimbabwe GovTech MVP** modernizes statutory company incorporation under the **Companies and Other Business Entities (COBE) Act [Chapter 24:31]** and **Statutory Instrument 46 of 2020 (COBE Regulations)**.

The system replaces manual, error-prone registry submissions with an automated statutory pipeline featuring real-time legal rule validation, Civil Registry Department Mod-23 checksum verification, AES-256-GCM encrypted citizen PII storage with HMAC-SHA256 blind indexing, dual-currency fee settlement (Zimbabwe Gold / ZiG and US Dollars), and automated ReportLab PDF synthesis for statutory forms.

---

## 🌐 Live Web Prototype

The interactive web prototype is accessible on GitHub Pages:
🔗 **[https://00000star.github.io/zim-govtech-mvp/](https://00000star.github.io/zim-govtech-mvp/)**

- **Pre-loaded Compliant Entity**: Click **"Load Sample Entity"** to test full COBE compliance for *Vanguard Agro-Logistics (Pvt) Ltd*.
- **Mod-23 National ID Checksum**: Click **"Check Mod-23 ID"** to test against the Zimbabwe Civil Registry Department validation algorithm.
- **Dual Currency Rail**: Toggle between ZiG and USD payments via EcoCash, InnBucks, and ZimSwitch ZIPIT.
- **Direct PDF Downloads**: Download generated statutory filings (CR 2, CR 5, CR 6, CR 16).

---

## 📜 Statutory Legal Grounding

1. **Companies and Other Business Entities (COBE) Act [Chapter 24:31]**
   - **Section 195**: Mandatory minimum of 2 directors for a Private Limited Company, requiring at least one director to be ordinarily resident in Zimbabwe.
   - **Section 216**: Mandatory statutory appointment of a Company Secretary.
   - **Section 112**: Mandatory registered physical office located within Zimbabwe (a post office box alone is statutorily invalid).
   - **Section 72**: Mandatory beneficial ownership disclosure for any natural person holding $\ge 20\%$ equity or voting control.
   - **Section 25 & 26**: Prohibited and restricted corporate name vetting.

2. **Statutory Instrument 46 of 2020 (COBE Regulations)**
   - **Form CR 2**: Application for Reservation of Company Name (up to 3 proposed names in priority order).
   - **Form CR 5**: Notice of Situation of Registered Office & Postal Address.
   - **Form CR 6**: List of Directors and Principal Officers (including Zimbabwe residence certifications).
   - **Form CR 16**: Register of Beneficial Owners and Significant Control.

3. **Cyber and Data Protection Act [Chapter 12:07] & S.I. 155 of 2024**
   - Strict cryptographic isolation of Citizen PII.
   - Multi-tenant AES-256-GCM symmetric encryption with 96-bit random nonces.
   - HMAC-SHA256 blind indexing to allow deterministic querying without plaintext exposure.
   - POTRAZ Data Protection Impact Assessment (DPIA) filed under [docs/DPIA_POTRAZ.md](docs/DPIA_POTRAZ.md).

4. **Reserve Bank of Zimbabwe (RBZ) FinTech Regulatory Sandbox**
   - Dual-currency settlement architecture honoring statutory conversion rates.
   - Full regulatory proposal documented in [docs/RBZ_SANDBOX_APPLICATION.md](docs/RBZ_SANDBOX_APPLICATION.md).
   - Interoperability with ZimSwitch ZIPIT and mobile money channels detailed in [docs/ZIMSWITCH_DUAL_CURRENCY.md](docs/ZIMSWITCH_DUAL_CURRENCY.md).

---

## 🛠️ Technical Architecture & Modules

```
zim-govtech-mvp/
├── index.html                 # Web portal UI (hosted on GitHub Pages)
├── style.css                  # Production GovTech responsive design
├── app.js                     # Dual-mode controller (FastAPI + Standalone Fallback)
├── app.py                     # FastAPI statutory backend & REST API
├── crypto_vault.py            # AES-256-GCM PII Vault & HMAC-SHA256 Blind Index
├── statutory_validator.py     # COBE statutory validation & Mod-23 ID engine
├── mock_registry_api.py       # CIPZ ZimConnect, ZPRS, and Dual-Currency Rails
├── pdf_assembler.py           # ReportLab statutory form synthesis (CR2, 5, 6, 16)
├── generated_forms/           # Authentic statutory PDF artifacts
│   ├── CR2_name_reservation_vanguard_agro-logist.pdf
│   ├── CR5_registered_office_vanguard_agro-logist.pdf
│   ├── CR6_directors_officers_vanguard_agro-logist.pdf
│   └── CR16_beneficial_ownership_vanguard_agro-logist.pdf
├── docs/                      # Statutory & Regulatory Dossiers
│   ├── DPIA_POTRAZ.md         # POTRAZ Data Protection Impact Assessment
│   ├── RBZ_SANDBOX_APPLICATION.md # RBZ Fintech Sandbox Application
│   ├── ZIMSWITCH_DUAL_CURRENCY.md # ZimSwitch & EcoCash Architecture
│   └── MUNICIPAL_PILOT_PROPOSAL.md # City of Harare By-law Integration
├── static/                    # Mirrored assets for FastAPI StaticFiles
└── citizens_vault.db          # Encrypted SQLite storage for citizen identity
```

---

## 🚀 Local Deployment

### 1. Environment Setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn pydantic cryptography reportlab
```

### 2. Run API & Portal
```bash
python3 app.py
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### 3. API Endpoints
- `POST /api/chat` - Conversational statutory intake
- `POST /api/validate` - COBE legal rules validator
- `POST /api/confirm` - HITL confirmation, PII vaulting & PDF synthesis
- `GET /download/{filename}` - Statutory PDF download
- `GET /api/fee-schedule` - Dual-currency fee schedule

---

## 🇿🇼 Republic of Zimbabwe Compliance Attestation
Authored for compliance with the Ministry of Justice, Legal & Parliamentary Affairs and Companies & Intellectual Property Zimbabwe (CIPZ).
