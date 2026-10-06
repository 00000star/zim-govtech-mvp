# DATA PROTECTION IMPACT ASSESSMENT (DPIA)
## Statutory Submission to the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ) / Data Protection Authority of Zimbabwe (DPAZ)
**Statutory Basis:** Cyber and Data Protection Act [Chapter 12:07] and Statutory Instrument 155 of 2024 (Cyber and Data Protection (Licensing and Inspection of Cyber Security and Data Protection Services) Regulations)

---

### EXECUTIVE SUMMARY
- **System Name:** Zimbabwe GovTech Statutory Company Formation Portal (ZimGov-MVP)
- **Data Controller:** Ministry of Justice, Legal and Parliamentary Affairs / Companies and Intellectual Property Zimbabwe (CIPZ)
- **Data Processor:** GovTech Platform Engineering Unit
- **Designated Data Protection Officer (DPO):** Legal Officer & Cybersecurity Compliance Lead
- **Assessment Date:** 6 October 2026
- **Status:** Approved for Sandbox Pilot & Statutory Registry Demonstration

---

### SECTION 1: SYSTEM DESCRIPTION & SCOPE OF PROCESSING

#### 1.1 Nature and Scope of Processing
The ZimGov-MVP platform provides automated, conversational intake and validation for statutory company incorporation in Zimbabwe under the Companies and Other Business Entities (COBE) Act [Chapter 24:31] and Statutory Instrument 46 of 2020. 

Processing activities encompass:
1. Citizen Identity Verification: Ingesting Zimbabwe National Registration Numbers and names to verify against the Zimbabwe Population Registry System (ZPRS).
2. Public Record Statutory Form Generation: Generating Forms CR 2, CR 5, CR 6, and CR 16.
3. Beneficial Ownership Tracking: Capturing natural persons controlling $\ge 20\%$ equity under Section 72 of COBE [Ch 24:31].
4. Dual-Currency Payment Settlement: Processing statutory revenue in Zimbabwe Gold (ZiG) and United States Dollars (USD) via national clearing rails.

#### 1.2 Data Elements Collected and Processed
| Data Category | Specific Elements | Statutory Classification (Act [Ch 12:07]) |
|---|---|---|
| Citizen Demographics | Full Name, National ID Number, Date of Birth, Gender | Standard Personal Data |
| Contact & Location | Residential Address, Registered Office Physical Address, Phone, Email | Standard Personal Data |
| Beneficial Ownership | Shareholding percentage, nature of voting control, directorship appointments | Regulated Corporate Data |
| Transaction Data | Mobile Money Phone Number, Transaction Reference, Amount (ZiG/USD) | Financial Transaction Data |
| Cryptographic Artifacts | HMAC-SHA256 Blind Index, Nonce, AES-256-GCM Ciphertext | Protected Pseudonymized Data |

---

### SECTION 2: LEGAL BASIS AND STATUTORY NECESSITY (ACT [CH 12:07] SEC 13-17)

Processing of personal data is grounded in the following lawful bases:
1. **Compliance with Statutory Legal Obligation (Section 15(c)):** The processing is strictly mandatory to fulfill legal duties imposed by the *Companies and Other Business Entities Act [Chapter 24:31]*, specifically:
   - Section 21 & 27: Name Reservation (Form CR 2)
   - Section 112: Registered Office Notice (Form CR 5)
   - Section 195 & 216: Appointment of Directors and Secretary (Form CR 6)
   - Section 72: Register of Beneficial Owners (Form CR 16)
2. **Public Interest and Official Authority (Section 15(e)):** Maintenance of the national company register is an essential public function vested in the Chief Registrar of Companies.
3. **Explicit Consent (Section 14):** At the conversational intake and Human-in-the-Loop (HITL) confirmation stage, data subjects provide affirmative consent to process identity documents for company incorporation.

---

### SECTION 3: DATA MINIMIZATION AND PROPORTIONALITY

1. **Strict Field Minimization:** Only statutory fields mandated by S.I. 46 of 2020 are ingested. Non-statutory biometric telemetry, device identifiers, and extraneous financial records are strictly discarded at the edge.
2. **Deterministic Pseudonymization:** In the persistent database, plain National Identity Numbers and residential street addresses are never stored in cleartext. Lookups are executed solely through canonicalized HMAC-SHA256 blind indexing.
3. **Ephemeral Session Lifecycle:** Raw chat session memory is stored in transient memory caches and purged upon lodgement confirmation or session expiration (60 minutes).

---

### SECTION 4: TECHNICAL AND ORGANIZATIONAL SAFEGUARDS (S.I. 155 OF 2024)

#### 4.1 Cryptographic Architecture
- **Field-Level Encryption:** Sensitive PII (National ID, Residential Address, Passport Number) is encrypted using **AES-256-GCM** (Galois/Counter Mode). Each encryption operation utilizes a unique 96-bit cryptographically secure pseudorandom nonce (`os.urandom(12)`), ensuring both confidentiality and cryptographic authenticity (tamper-proofing).
- **HMAC-SHA256 Blind Indexing:** To avoid storing plaintext searchable indexes while retaining high-performance exact-match queries, identifiers are normalized (whitespace removed, uppercase, hyphens stripped) and hashed using HMAC-SHA256 with a dedicated secret key stored in Hardware Security Modules (HSM).
- **Zero-Knowledge Decryption:** Applications only decrypt PII fields upon authenticated, authorized HITL review or authorized statutory registrar audit.

#### 4.2 Architectural Diagram
```
Citizen Intake ---> [Normalization] ---> [HMAC-SHA256] ---> Blind Index Lookup
                          |
                          v
                 [AES-256-GCM + Nonce] ---> Encrypted Ciphertext Vault
```

#### 4.3 Access Controls and Audit Logging
- Role-Based Access Control (RBAC) enforced on all administrative endpoints.
- Immutable append-only audit trail logging every decryption event, referencing user identity, timestamp, and legal justification.

---

### SECTION 5: DATA SUBJECT RIGHTS AND BALANCING WITH PUBLIC RECORD LAWS

| Right under Act [Ch 12:07] | Implementation in ZimGov-MVP | Statutory Limitations |
|---|---|---|
| **Right of Access (Sec 20)** | Citizens can query their stored entity profiles via authorized portal login. | Full access granted to personal entries. |
| **Right to Rectification (Sec 21)** | Facility to file amended Form CR 6 or Form CR 5 to rectify outdated addresses or names. | Must comply with formal notice periods under COBE Act. |
| **Right to Erasure ("Right to be Forgotten", Sec 22)** | Personal data stored in draft or abandoned intake queues is automatically purged. | **Exempted** for registered statutory forms once incorporated; COBE Section 11 requires public availability of corporate registers for AML/CFT integrity. |
| **Right to Object (Sec 23)** | Data subjects can withdraw intake prior to lodgement payment. | Post-filing objections subject to High Court winding-up / deregistration proceedings. |

---

### SECTION 6: RISK ASSESSMENT MATRIX & MITIGATION

| Identified Threat / Risk | Likelihood | Impact | Severity | Statutory Mitigation Implemented |
|---|---|---|---|---|
| Unauthorized database breach leaking director National IDs | Low | High | Medium | AES-256-GCM encryption at rest; attackers only obtain ciphertext and HMAC hashes. |
| Rainbow table attack against stored ID hashes | Low | High | Medium | Canonical normalization + secret-keyed HMAC-SHA256; no unsalted SHA256 hashes used. |
| Mod-23 Checksum spoofing / Identity theft | Low | High | Medium | Algorithmic Mod-23 pre-validation combined with live ZPRS verification endpoint. |
| Beneficial Ownership falsification (AML loophole) | Medium | High | High | Form CR 16 statutory affirmation under oath with criminal penalties under Money Laundering Act [Ch 9:24]. |
| Dual-currency double spending / reconciliation drift | Low | Medium | Low | ZimSwitch idempotent transaction identifiers and centralized clearing receipt tokens. |

---

### SECTION 7: CROSS-BORDER TRANSFERS AND RETENTION

1. **Data Sovereignty (Section 28):** All primary database volumes (`citizens_vault.db`), cryptographic keys, and generated statutory PDFs are hosted on domestic server infrastructure located within the Republic of Zimbabwe. No cross-border replication occurs without prior POTRAZ written authorization.
2. **Retention Periods:**
   - Draft Sessions: 30 days maximum, followed by cryptographic wipe.
   - Incorporated Entity Files: Retained indefinitely in accordance with the National Archives of Zimbabwe Act [Chapter 25:06] and COBE Act Section 112.

### CONCLUSION & DPO SIGN-OFF
The ZimGov-MVP architecture fully adheres to the principles of lawful processing, data minimization, cryptographic storage, and citizen transparency prescribed under the Cyber and Data Protection Act [Chapter 12:07] and S.I. 155 of 2024. POTRAZ approval is recommended for public sandbox deployment.
