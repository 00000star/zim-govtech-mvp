# RESERVE BANK OF ZIMBABWE (RBZ)
## FINTECH REGULATORY SANDBOX FORMAL APPLICATION PITCH
**Portal Submission Target:** `frs.rbz.co.zw`  
**Governing Framework:** National Payment Systems Act [Chapter 24:23], Reserve Bank of Zimbabwe Act [Chapter 22:15], and Bank Use Promotion Act [Chapter 24:24]  
**Innovation Cohort:** RegTech / GovTech / Statutory Dual-Currency Payment Gateway  

---

### 1. APPLICANT INFORMATION & INNOVATION OVERVIEW

| Field | Detail |
|---|---|
| **Applicant Entity** | ZimGovTech Digital Solutions (Pvt) Ltd (in collaboration with CIPZ) |
| **Product Name** | Zimbabwe GovTech Statutory Company Formation & Dual-Currency Gateway |
| **Innovation Category** | RegTech & Payment Systems Integration |
| **Primary Sandbox Rail** | Multi-Currency Instant Settlement (Zimbabwe Gold `ZiG` & United States Dollar `USD`) |
| **Target Launch Date** | Q1 2027 Sandbox Cohort |
| **Contact Executive** | Managing Director & Head of Regulatory Engineering |

---

### 2. PROBLEM STATEMENT & STATUTORY JUSTIFICATION

#### 2.1 Current Market Friction
1. **Inefficient Enterprise Formalization:** Registering a Private Limited Company under the Companies and Other Business Entities (COBE) Act [Chapter 24:31] historically takes 7 to 21 days due to fragmented paper lodgements across Form CR 2 (Name Reservation), Form CR 5 (Registered Office), Form CR 6 (Directors), and Form CR 16 (Beneficial Ownership).
2. **Dual-Currency Friction:** Micro, Small, and Medium Enterprises (MSMEs) struggle to settle statutory government fees across volatile multi-tier currency channels, causing accounting mismatches and delayed revenue remittal to the Consolidated Revenue Fund.
3. **AML/CFT Beneficial Ownership Gaps:** Traditional filing processes lack real-time validation of beneficial owners holding $\ge 20\%$ equity, creating vulnerabilities under FATF Recommendation 24 and the Money Laundering & Proceeds of Crime Act [Chapter 9:24].

#### 2.2 Solution Value Proposition
The platform introduces an end-to-end conversational intake engine that validates statutory rules in real time, checks Mod-23 citizen identifiers against the civil registry, provides automated generation of S.I. 46 of 2020 PDF dossiers, and processes instantaneous dual-currency statutory settlements in both ZiG and USD with atomic clearing.

---

### 3. DUAL-CURRENCY CLEARING & SETTLEMENT ARCHITECTURE

```
[Citizen / MSME Payer]
       │
       ├─── Option A: ZiG Rail ───> [ZimSwitch ZIPIT / EcoCash ZiG] ───┐
       │                                                                │
       └─── Option B: USD Rail ───> [InnBucks / EcoCash USD / O-Mari] ──┴─> [RBZ ZETSS / CIPZ Account]
                                                                                │
                                                                       [Atomic Receipting]
                                                                                │
                                                                   [Statutory PDF Generation]
```

#### 3.1 Exchange Rate Determination & Statutory Pricing
- **Rate Benchmark:** Rates are pegged strictly to the Reserve Bank of Zimbabwe willing-buyer willing-seller (WBWS) interbank closing rate.
- **Statutory Fee Schedule:**
  - Form CR 2 (Name Reservation): US$ 10.00 / ZiG 265.00
  - Full Incorporation Dossier (CR 5, CR 6, CR 16): US$ 20.00 / ZiG 530.00
  - Expedited Digital Lodgement: US$ 5.00 / ZiG 132.50
  - **Total Statutory Incorporation Package:** **US$ 35.00 / ZiG 927.50** (at 26.50 benchmark)
- **Zero Currency Speculation:** The platform operates strictly as a straight-through processing (STP) gateway. No foreign currency balances are warehoused or converted on private accounts; collected funds route directly to CIPZ exchequer accounts.

---

### 4. AML/CFT & BENEFICIAL OWNERSHIP COMPLIANCE (FATF REC 24)

1. **Mandatory Beneficial Ownership Capture:** Section 72 of the COBE Act and Form CR 16 statutory requirements are hard-coded into the pipeline. No transaction can execute unless natural persons holding $\ge 20\%$ equity or voting control are validated.
2. **Mod-23 Citizen Authentication:** Identity tokens are validated using the national Mod-23 checksum algorithm `int(digits_before_letter) % 23 == mapped_letter` and cross-referenced with the Zimbabwe Population Registry System (ZPRS).
3. **Sanctions & PEP Screening:** Directors and beneficial owners are screened against the national Financial Intelligence Unit (FIU) Designated Persons list and international sanctions lists prior to transaction authorization.

---

### 5. SANDBOX TESTING PARAMETERS & RISK CONTROLS

#### 5.1 Cohort Test Boundaries
- **Testing Duration:** 6 months from sandbox authorization.
- **Participant Volume:** Capped at 2,500 company incorporations during the live trial.
- **Maximum Transaction Value:** Capped at statutory package fees (maximum US$ 50.00 or ZiG equivalent per corporate entity). No general banking or non-statutory remittances permitted.
- **Target User Groups:** Tech startups, youth-owned MSMEs, and rural agricultural enterprises in Harare, Bulawayo, and Ruwa Local Board jurisdictions.

#### 5.2 Technical Safeguards
- **AES-256-GCM Vault:** PII stored in compliance with the Cyber and Data Protection Act [Chapter 12:07] and POTRAZ S.I. 155 of 2024.
- **HMAC-SHA256 Blind Indexing:** Fast indexation without exposing cleartext National Identity Numbers.
- **Atomic Rollback:** If payment fails on ZimSwitch rails, no statutory certificate or reservation code is committed. If document assembly fails, payment is held in escrow and automatically refunded within 120 seconds.

---

### 6. CONSUMER PROTECTION & EXIT STRATEGY

#### 6.1 Consumer Protection Safeguards
- **Transparent Fee Disclosure:** Clear display of both ZiG and USD statutory tariffs prior to payment confirmation.
- **Dispute Resolution Mechanism:** Dedicated 24/7 digital dispute ticketing integrated with National Payment Systems consumer protection guidelines. Unsettled transactions automatically reversed via ISO 8583 reversal messaging.

#### 6.2 Sandbox Exit Plan
- **Successful Exit Criteria:**
  1. Over 99.8% uptime across 2,500 live incorporations.
  2. Zero currency reconciliation discrepancies between ZimSwitch/wallet rails and CIPZ revenue ledgers.
  3. 100% adherence to Mod-23 and Form CR 16 beneficial ownership compliance.
- **Full Commercial Licensing:** Transition into a licensed Payment System Operator (PSO) / Third-Party Payment Provider (TPPO) under the National Payment Systems Act [Chapter 24:23].

---

### 7. REQUESTED REGULATORY RELIEF / SAFE HARBOR

The applicant respectfully requests the following specific sandbox accommodations:
1. **Interim Dual-Currency Settlement Authorization:** Safe harbor approval to settle statutory CIPZ revenue across both ZiG and USD mobile channels simultaneously without requiring separate dual merchant licenses.
2. **Direct ZimSwitch National Switch Integration:** Expedited test-rail connectivity to the ZimSwitch ZIPIT API sandbox for automated corporate fee clearing.
3. **Digital Signature Acceptance:** Recognition of digital Form CR 6 and Form CR 16 declarations submitted through the platform as satisfying the signature requirement under Section 300 of the COBE Act [Chapter 24:31].

---

**Signed on behalf of the Applicant:**  
*Lead Regulatory Engineer & FinTech Sandbox Liaison*  
*Harare, Zimbabwe*
