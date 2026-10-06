/**
 * Zimbabwe Entrepreneur Launchpad - Frontend Controller & Co-Pilot
 * Grounding:
 * - Companies and Other Business Entities (COBE) Act [Chapter 24:31]
 * - Statutory Instrument 46 of 2020 (Model Articles, Forms CR2, CR5, CR6, CR16)
 * - Cyber and Data Protection Act [Chapter 12:07] & S.I. 155 of 2024
 * - Urban Councils Act [Chapter 29:15] & Shop Licences Act [Chapter 14:17]
 * - Income Tax Act [Chapter 23:06] Section 80 (30% Withholding Tax)
 */

// =====================================================================
// 1. DATA STRUCTURES: 8 SECTORS
// =====================================================================
const SECTORS = [
  {
    id: "energy",
    name: "Energy & Solar",
    regulator: "ZERA (Zimbabwe Energy Regulatory Authority)",
    icon: "☀️",
    description: "Photovoltaic generation, commercial mini-grids, clean energy distribution, and battery storage.",
    items: [
      {
        id: "st6-energy-zera",
        title: "ZERA Electricity Generation / Solar Distribution Permit",
        authority: "ZERA",
        category: "Sector Regulator",
        shortDesc: "Obtain statutory generation licence or commercial installer clearance from ZERA.",
        why: "Section 40 of Electricity Act [Ch 13:19] strictly prohibits operating commercial power facilities without ZERA certification.",
        how: "Lodge technical feasibility report, grid interconnection agreement with ZETDC, and apply via ZERA licensing portal.",
        costTime: "$100 - $500 USD • 14 to 28 Days",
        docs: "Feasibility study, Environmental approval, Company CR6, Engineering qualifications."
      },
      {
        id: "st6-energy-ema",
        title: "EMA Environmental Impact Assessment (EIA) Certificate",
        authority: "EMA",
        category: "Environmental",
        shortDesc: "Obtain Environmental Impact Assessment prospectus clearance from EMA.",
        why: "Environmental Management Act [Ch 20:27] mandates environmental audit for power installations.",
        how: "Commission an EMA-certified consultant to produce project prospectus and lodge with Harare EMA Head Office.",
        costTime: "1% - 1.5% of project cost / $250+ USD • 14 to 21 Days",
        docs: "EIA Prospectus Report, Site Survey Plan, Council Local Authority consent."
      },
      {
        id: "st6-energy-saz",
        title: "SAZ Solar Equipment & Inverter Quality Standards Certification",
        authority: "SAZ",
        category: "Standards",
        shortDesc: "Verify imported solar PV panels, inverters, and lithium battery banks comply with SAZ standards.",
        why: "Prevents customs seizure and guarantees compliance with national fire safety grid codes.",
        how: "Submit technical datasheets and test samples to Standards Association of Zimbabwe in Belgravia, Harare.",
        costTime: "$80 - $200 USD • 7 to 10 Days",
        docs: "Manufacturer ISO certificates, factory test results, import bill of entry."
      }
    ]
  },
  {
    id: "agri",
    name: "Agriculture & Grain",
    regulator: "AMA (Agricultural Marketing Authority)",
    icon: "🌽",
    description: "Commodity haulage, contract farming, grain processing, cold chain logistics, and export supply.",
    items: [
      {
        id: "st6-agri-ama",
        title: "AMA Contractor & Buyer Registration Certificate",
        authority: "AMA",
        category: "Sector Regulator",
        shortDesc: "Statutory registration as an agricultural merchant, buyer, or contract farming scheme operator.",
        why: "Under Agricultural Marketing Authority Act [Ch 18:24], purchasing grains or seed cotton without AMA licence is a criminal offense.",
        how: "Complete AMA Form A1, submit proof of financial guarantee or grower database, and remit statutory fee.",
        costTime: "$150 - $400 USD / ZiG Equiv • 5 to 10 Days",
        docs: "Certificate of Incorporation, CR6, Tax Clearance ITF 263, Bank statement."
      },
      {
        id: "st6-agri-gmb",
        title: "GMB Controlled Products Movement Permit",
        authority: "GMB",
        category: "Commodity Control",
        shortDesc: "Permit for transporting or milling controlled commodities (maize, wheat, soya beans).",
        why: "S.I. 145 of 2019 restricts trading in maize outside GMB authorized channels.",
        how: "Apply at local Grain Marketing Board depot with transport fleet registration and farmer off-take contracts.",
        costTime: "$20 - $50 USD • 2 to 4 Days",
        docs: "Vehicle registration books, consignment notes, AMA contractor permit."
      },
      {
        id: "st6-agri-quarantine",
        title: "Plant Quarantine & Phytosanitary Health Certificate",
        authority: "Ministry of Lands & Agriculture",
        category: "Biosecurity",
        shortDesc: "Agricultural produce clearance for regional export and cross-border transport.",
        why: "Required for SADC export corridors to prevent plant pests under Plant Pests and Diseases Act [Ch 19:08].",
        how: "Request produce inspection at Mazowe Plant Quarantine Station or Harare Agricultural Research Centre.",
        costTime: "$30 - $80 USD • 3 to 5 Days",
        docs: "Inspection request, warehouse location, consignment packing list."
      }
    ]
  },
  {
    id: "tech",
    name: "Tech, Telecoms & FinTech",
    regulator: "POTRAZ & RBZ",
    icon: "💻",
    description: "Software platforms, electronic communications, FinTech payments, ISP services, and data processing.",
    items: [
      {
        id: "st6-tech-potraz",
        title: "POTRAZ Class Licence or Value-Added Service (VAS) Clearance",
        authority: "POTRAZ",
        category: "Sector Regulator",
        shortDesc: "Statutory operating licence for digital telecommunications, SMS gateways, and cloud infrastructure.",
        why: "Postal and Telecommunications Act [Ch 12:05] requires prior clearance for commercial digital networks.",
        how: "Submit network architecture diagram, technical equipment specifications, and lodge application at POTRAZ Mount Pleasant.",
        costTime: "$200 - $1,000 USD • 14 to 30 Days",
        docs: "Network architecture plan, CR6, Directors Mod-23 IDs, Data protection policy."
      },
      {
        id: "st6-tech-dpo",
        title: "POTRAZ Data Protection Officer (DPO) Registration (S.I. 155/2024)",
        authority: "POTRAZ Data Protection Authority",
        category: "Data Privacy",
        shortDesc: "Mandatory appointment and registration of Data Protection Officer under Cyber & Data Protection Act [Ch 12:07].",
        why: "Statutory Instrument 155 of 2024 imposes heavy administrative fines for unregistered commercial data controllers.",
        how: "Lodge Form DP-1 identifying appointed DPO, PII encryption architecture, and privacy policy.",
        costTime: "$50 - $150 USD • 7 to 14 Days",
        docs: "Designation letter of DPO, Data Protection Policy, System encryption audit summary."
      },
      {
        id: "st6-tech-rbz",
        title: "RBZ National Payment Systems Clearance (FinTech / B2B Pay)",
        authority: "Reserve Bank of Zimbabwe (NPS)",
        category: "Monetary Rail",
        shortDesc: "Regulatory Sandbox clearance or Payment System Provider approval for processing digital transactions.",
        why: "National Payment Systems Act [Ch 24:23] prohibits unapproved digital wallets and payment switches.",
        how: "Submit sandbox admission application to RBZ NPS Division with anti-money laundering (AML) controls.",
        costTime: "Varies (Sandbox is Free) • 21 to 45 Days",
        docs: "AML/CFT Compliance Manual, System Security Penetration Report, Trust Account arrangements."
      }
    ]
  },
  {
    id: "logistics",
    name: "Logistics, Haulage & Fleet",
    regulator: "Ministry of Transport (RMT) & VID",
    icon: "🚚",
    description: "Commercial freight forwarding, road haulage, cross-border cargo, and warehouse distribution.",
    items: [
      {
        id: "st6-log-rmt",
        title: "Road Motor Transportation (RMT) Commercial Operator's Licence",
        authority: "Ministry of Transport / RMT",
        category: "Transport",
        shortDesc: "Statutory public service vehicle (PSV) operator's licence for goods and cargo trucks.",
        why: "Road Motor Transportation Act [Ch 13:15] requires an Operator's Licence for carrying commercial freight.",
        how: "Apply at RMT offices in Harare/Bulawayo with vehicle registration books and certified VID fitness discs.",
        costTime: "$100 - $250 USD per fleet • 7 to 14 Days",
        docs: "Vehicle registration books (ZINARA), VID fitness certificates, Passenger/Goods insurance policy."
      },
      {
        id: "st6-log-sadc",
        title: "SADC Cross-Border Bilateral Transport Permits",
        authority: "Ministry of Transport",
        category: "Cross-Border",
        shortDesc: "Bilateral road transit permits for haulage operations into Mozambique, Zambia, and South Africa.",
        why: "Mandatory under SADC Transport Protocol for moving freight across Beitbridge, Chirundu, or Forbes borders.",
        how: "Submit cross-border route application with proof of valid COMESA Yellow Card third-party insurance.",
        costTime: "$150 USD per vehicle • 5 to 10 Days",
        docs: "Valid RMT licence, COMESA Yellow Card insurance, customs bond."
      },
      {
        id: "st6-log-vid",
        title: "VID Certificate of Fitness Inspection Disc",
        authority: "Vehicle Inspection Department (VID)",
        category: "Road Safety",
        shortDesc: "Semi-annual physical roadworthiness inspection and brake test certification for commercial vehicles.",
        why: "Police road blocks will impound commercial haulage trucks lacking current VID inspection discs.",
        how: "Present vehicle at VID depot for brake efficiency, lighting, chassis, and axle weight tests.",
        costTime: "$30 - $60 USD per vehicle • 1 to 2 Days",
        docs: "Vehicle registration book, fire extinguisher, warning triangles, reflective tapes."
      }
    ]
  },
  {
    id: "retail",
    name: "Retail, Wholesale & FMCG",
    regulator: "Local Authority & Trade Measures",
    icon: "🛍️",
    description: "Supermarkets, general dealers, wholesale distribution, hardware stores, and fast-moving goods.",
    items: [
      {
        id: "st6-ret-shop",
        title: "Municipal Commercial Trading Licence (Form SL2 Stamped)",
        authority: "Local Licensing Authority",
        category: "Municipal Trade",
        shortDesc: "Official Shop Licence issued under Section 14 of Shop Licences Act [Chapter 14:17].",
        why: "Trading from any physical shop without a council licence is a criminal offense subject to closure.",
        how: "Final municipal committee approval following newspaper advertisement and council health report.",
        costTime: "$100 - $250 USD • 10 to 14 Days",
        docs: "Council health inspection report, Fire clearance, Newspaper tear sheets."
      },
      {
        id: "st6-ret-weights",
        title: "Trade Measures Inspectorate Verification of Scales & Measures",
        authority: "Ministry of Industry & Commerce",
        category: "Consumer Law",
        shortDesc: "Official stamping and verification of commercial scales, barcode scanners, and weighing instruments.",
        why: "Trade Measures Act [Ch 14:23] imposes severe fines for unverified commercial measurement devices.",
        how: "Inspector visits premises to test weights against national standards and applies verification lead seals.",
        costTime: "$20 - $50 USD • 3 to 5 Days",
        docs: "Equipment serial numbers, calibration reports, municipal trading address."
      },
      {
        id: "st6-ret-food",
        title: "Public Health Food Handlers Medical Examination Certificates",
        authority: "City Health Department",
        category: "Public Health",
        shortDesc: "Medical screening and certification of all retail staff handling groceries and consumables.",
        why: "Public Health Act [Ch 15:17] mandates annual typhoid, tuberculosis, and hygiene screening.",
        how: "Staff undergo chest X-rays and medical tests at Beatrice Road Infectious Diseases Hospital or municipal clinic.",
        costTime: "$15 USD per staff member • 2 to 3 Days",
        docs: "National IDs of staff, medical test results, clinic stamping."
      }
    ]
  },
  {
    id: "mining",
    name: "Mining & Mineral Beneficiation",
    regulator: "Ministry of Mines & Mining Development",
    icon: "⛏️",
    description: "Mineral exploration, gold milling, lithium processing, quarrying, and chrome extraction.",
    items: [
      {
        id: "st6-min-prospect",
        title: "Ministry of Mines Prospecting Licence & Mining Claims Verification",
        authority: "Ministry of Mines",
        category: "Mining Law",
        shortDesc: "Statutory Prospecting Licence issued under Mines and Minerals Act [Chapter 21:05].",
        why: "Prospecting or pegging mining blocks without an official licence is illegal and claims will be forfeited.",
        how: "Apply through Provincial Mining Director (PMD) with verified corporate identity and location coordinates.",
        costTime: "$200 - $1,000 USD • 14 to 30 Days",
        docs: "Certificate of Incorporation, CR6, Coordinates map, PMD clearance."
      },
      {
        id: "st6-min-ema",
        title: "EMA Mining Environmental Management Plan & Toxic Substances Licence",
        authority: "EMA",
        category: "Environmental",
        shortDesc: "Clearance for tailings storage facilities, cyanide handling, and environmental rehabilitation funds.",
        why: "Operating a mine without approved EMA mitigation results in immediate environmental shutdown orders.",
        how: "Submit comprehensive Environmental Management Plan and register all hazardous storage units.",
        costTime: "$500 - $2,500 USD • 21 to 45 Days",
        docs: "Detailed EIA report, chemical storage plan, decommissioning commitment."
      },
      {
        id: "st6-min-fidelity",
        title: "Fidelity Gold Refinery / MMCZ Mineral Marketing Licence",
        authority: "Fidelity Printers / MMCZ",
        category: "Beneficiation",
        shortDesc: "Official buying or dealing permit with Fidelity Gold Refinery or Minerals Marketing Corporation of Zimbabwe.",
        why: "Gold Trade Act [Ch 21:03] makes possession of unrefined gold without Fidelity permit a mandatory prison term.",
        how: "Lodge corporate credentials, bank guarantees, and security vetting at Fidelity Head Office in Msasa, Harare.",
        costTime: "$500 - $2,000 USD • 14 to 28 Days",
        docs: "Police clearance of directors, company statutory returns, approved security vault."
      }
    ]
  },
  {
    id: "health",
    name: "Healthcare & Pharmaceuticals",
    regulator: "MCAZ (Medicines Control Authority of Zimbabwe)",
    icon: "🏥",
    description: "Community pharmacies, medical clinics, pharmaceutical wholesale, and diagnostic laboratories.",
    items: [
      {
        id: "st6-hea-mcaz",
        title: "MCAZ Pharmaceutical Premises & Wholesale Licence",
        authority: "MCAZ",
        category: "Sector Regulator",
        shortDesc: "Statutory premises inspection and licensing under Medicines and Allied Substances Control Act [Ch 15:03].",
        why: "Trading or storing registered pharmaceuticals without MCAZ licensing constitutes an immediate felony.",
        how: "Submit architectural floor plans, temperature-controlled storage logs, and book MCAZ inspector audit.",
        costTime: "$300 - $800 USD • 21 to 45 Days",
        docs: "Premises floor plan, superintendent pharmacist registration, air-conditioning calibration."
      },
      {
        id: "st6-hea-pcz",
        title: "Pharmacist Council of Zimbabwe (PCZ) Superintendent Approval",
        authority: "PCZ",
        category: "Professional Body",
        shortDesc: "Registration of appointed licensed Superintendent Pharmacist in full-time charge.",
        why: "A corporate body may not operate pharmacy premises without an active registered pharmacist on duty.",
        how: "Submit contract of employment and PCZ annual practicing certificate of the pharmacist in charge.",
        costTime: "$100 - $250 USD • 7 to 14 Days",
        docs: "PCZ practicing certificate, Employment contract, Curriculum vitae."
      },
      {
        id: "st6-hea-dd",
        title: "Dangerous Drugs Act [Chapter 15:02] Security Storage Clearance",
        authority: "Ministry of Health / Police",
        category: "Controlled Substances",
        shortDesc: "Special vault inspection and lockable safe clearance for scheduled prescription drugs.",
        why: "Statutory requirement to prevent diversion of narcotic and psychotropic medicines.",
        how: "Police and Ministry inspectors verify steel-reinforced safe bolted to floor and dual-key register.",
        costTime: "$50 USD • 7 to 10 Days",
        docs: "Safe specifications, keyholder register, security company alarm link."
      }
    ]
  },
  {
    id: "tourism",
    name: "Tourism & Hospitality",
    regulator: "ZTA (Zimbabwe Tourism Authority)",
    icon: "🦁",
    description: "Hotels, safari lodges, travel agencies, tour operators, restaurants, and conference facilities.",
    items: [
      {
        id: "st6-tou-zta",
        title: "ZTA Designated Tourist Facility Operator Licence",
        authority: "ZTA",
        category: "Sector Regulator",
        shortDesc: "Official classification and operating permit under Tourism Act [Chapter 14:20].",
        why: "Operating tourist hospitality facilities without ZTA licensing is illegal and bars collecting tourism levies.",
        how: "Lodge facility inspection application with ZTA Quality Assurance team at Tourism House, Harare.",
        costTime: "$150 - $500 USD • 14 to 28 Days",
        docs: "Public liability insurance ($100k+), Fire certificate, Municipal health clearance."
      },
      {
        id: "st6-tou-liquor",
        title: "Liquor Licensing Board Operating Licence",
        authority: "Liquor Licensing Board",
        category: "Hospitality Permit",
        shortDesc: "Statutory licence for retailing alcoholic beverages under Liquor Act [Chapter 14:12].",
        why: "Serving alcoholic beverages without an active liquor licence triggers immediate police confiscation and closure.",
        how: "Publish two notices in Government Gazette, obtain police clearance, and appear before magistrate board.",
        costTime: "$200 - $600 USD • 21 to 45 Days",
        docs: "Police report (Form 17), Gazette notices, Health certificate, Lease agreement."
      },
      {
        id: "st6-tou-zimparks",
        title: "ZIMPARKS Commercial Tour Operating Permit",
        authority: "ZIMPARKS",
        category: "Conservation",
        shortDesc: "Permit to conduct commercial game drives, boat cruises, or guided tours in national parks.",
        why: "Parks and Wild Life Act [Ch 20:14] strictly regulates commercial tour vehicles and wildlife interactions.",
        how: "Submit vehicle tracking credentials, professional guide qualifications, and pay concession fees.",
        costTime: "$200 - $750 USD • 10 to 20 Days",
        docs: "Professional Guide licence, Vehicle roadworthiness discs, Insurance cover."
      }
    ]
  }
];

// =====================================================================
// 2. DATA STRUCTURES: 7 STAGES (28 STATUTORY MILESTONES)
// =====================================================================
const BASE_STAGES = [
  {
    stageNum: 1,
    title: "Pre-Incorporation & Structuring",
    authority: "CIPZ & Legal",
    costEstimate: "$5 USD / ZiG 135",
    timeEstimate: "24 - 48 Hours",
    summary: "Establish foundation under COBE Act [Ch 24:31]: reserve name, structure shares, verify director residency.",
    items: [
      {
        id: "st1-name-vetting",
        title: "Form CR 2 Name Search & Availability Vetting",
        authority: "CIPZ Registrar",
        category: "Legal Formation",
        shortDesc: "Submit up to 4 proposed names to CIPZ Registrar under Section 26 of COBE Act [Ch 24:31].",
        why: "Unchecked names risk rejection, infringement on existing trademarks, or duplicate company registrations.",
        how: "Submit Form CR 2 with proposed names in order of preference to CIPZ with statutory search fee.",
        costTime: "$5 USD / ZiG 135 • 24 to 48 Hours",
        docs: "Completed Form CR 2, National ID copy of applicant."
      },
      {
        id: "st1-director-structure",
        title: "Director Quorum & Ordinary Residence Verification (Sec 195)",
        authority: "CIPZ / Legal",
        category: "Governance",
        shortDesc: "Appoint minimum 2 directors, with at least 1 verified as ordinarily resident in Zimbabwe.",
        why: "Mandatory statutory quorum under COBE Act Section 195; non-resident-only filings are summarily rejected.",
        how: "Verify National IDs, proof of physical residence, and prepare consent-to-act statements.",
        costTime: "Free (Internal) • 1 Day",
        docs: "National IDs / Passports of all directors, Proof of Residence utility bills."
      },
      {
        id: "st1-office-address",
        title: "Physical Registered Office & Stand Number (Sec 112)",
        authority: "Local Council / CIPZ",
        category: "Legal / Domicile",
        shortDesc: "Secure physical street address within Zimbabwe (Stand number, street, city) for legal service of process.",
        why: "COBE Act Section 112 prohibits using solely a Postal Box address without physical street premises.",
        how: "Obtain commercial lease agreement or landlord consent affidavit for the premises Stand.",
        costTime: "Lease Dependent • 1 to 2 Days",
        docs: "Lease Agreement or Landlord Consent Affidavit, municipal rates bill."
      },
      {
        id: "st1-bo-mapping",
        title: "Beneficial Ownership Structure Mapping (≥20% Equity)",
        authority: "CIPZ / FIU",
        category: "AML Compliance",
        shortDesc: "Identify every natural person who ultimately owns or controls 20% or more of share capital or voting rights.",
        why: "Section 276 of COBE Act carries severe financial and criminal penalties for concealing beneficial owners.",
        how: "Map equity percentages to natural persons and collect national IDs / passports.",
        costTime: "Free • 1 Day",
        docs: "Shareholding diagram, Certified IDs of all beneficial owners."
      }
    ]
  },
  {
    stageNum: 2,
    title: "Statutory CIPZ Incorporation",
    authority: "Companies & Intellectual Property Zimbabwe",
    costEstimate: "$40 USD / ZiG 1,060",
    timeEstimate: "3 - 5 Days",
    summary: "File official statutory returns under S.I. 46 of 2020: Forms CR2, CR5, CR6, CR16, and Table A Articles.",
    items: [
      {
        id: "st2-cr2-clearance",
        title: "Form CR 2 Official Name Reservation Certificate Issued",
        authority: "CIPZ Registrar",
        category: "CIPZ Statutory",
        shortDesc: "Receive formal CIPZ stamped name reservation confirmation valid for 30 days.",
        why: "Without cleared Form CR 2, the Registrar cannot accept Memorandum or Articles of Association.",
        how: "CIPZ issues reservation voucher number after vetting against registered database.",
        costTime: "Included in CR2 fee • 24 Hours",
        docs: "Cleared Form CR 2 receipt / reservation slip."
      },
      {
        id: "st2-memo-articles",
        title: "Memorandum & Articles of Association Execution (Table A)",
        authority: "CIPZ Statutory",
        category: "Company Constitution",
        shortDesc: "Adopt standard or tailored Articles under First Schedule Table A of COBE Act [Ch 24:31].",
        why: "Constitutional contract binding shareholders and outlining director authority and share transfers.",
        how: "Draft share capital ($1,000 divided into 1,000 shares), sign subscribers table before witnesses.",
        costTime: "Included in statutory bundle • 1 Day",
        docs: "2 sets of signed and witnessed Memorandum and Articles."
      },
      {
        id: "st2-cr5-filing",
        title: "Form CR 5: Notice of Situation of Registered Office Lodged",
        authority: "CIPZ Statutory",
        category: "Statutory Return",
        shortDesc: "Official notification to Registrar of physical domicile of company within Zimbabwe.",
        why: "Statutory requirement under S.I. 46 of 2020 Section 112; determines High Court jurisdiction.",
        how: "File Form CR 5 with Stand survey number, street name, and city.",
        costTime: "$10 USD Statutory Fee • 2 to 3 Days",
        docs: "Form CR 5 signed by director or corporate secretary."
      },
      {
        id: "st2-cr6-filing",
        title: "Form CR 6: Register of Directors & Officers (Replaces CR 14)",
        authority: "CIPZ Statutory",
        category: "Statutory Return",
        shortDesc: "Official filing of directors and appointed Corporate Secretary under COBE Act Sections 195 & 216.",
        why: "Replaces former Form CR 14; mandatory legal evidence of authorized corporate officers.",
        how: "Populate CR 6 with ZPRS Mod-23 IDs, nationality, residential addresses, and appointment dates.",
        costTime: "$15 USD Statutory Fee • 2 to 3 Days",
        docs: "Completed Form CR 6, consent letters, National IDs."
      },
      {
        id: "st2-cr16-filing",
        title: "Form CR 16: Declaration of Beneficial Ownership Lodged",
        authority: "CIPZ Statutory",
        category: "AML Return",
        shortDesc: "Statutory disclosure of ultimate beneficial owners owning 20% or more under Section 276.",
        why: "Mandatory under anti-money laundering regulations; failure blocks incorporation.",
        how: "Complete Form CR 16 detailing natural person owners and percentage control.",
        costTime: "Included in bundle • 2 to 3 Days",
        docs: "Completed Form CR 16 signed by Corporate Secretary."
      }
    ]
  },
  {
    stageNum: 3,
    title: "Revenue & Tax Registration (ZIMRA)",
    authority: "Zimbabwe Revenue Authority (Domestic Taxes)",
    costEstimate: "Free (Statutory)",
    timeEstimate: "2 - 5 Days",
    summary: "Acquire Corporate BP Number and critical ITF 263 Tax Clearance to protect against 30% withholding deductions.",
    items: [
      {
        id: "st3-zimra-bp",
        title: "Corporate Business Partner (BP) Number Allocation",
        authority: "ZIMRA Domestic Taxes",
        category: "Tax Master",
        shortDesc: "Register company on ZIMRA e-Services to obtain central Corporate BP number.",
        why: "All corporate tax heads (Income Tax, PAYE, VAT) anchor to this BP number.",
        how: "Submit incorporation certificate, CR5, CR6, and bank confirmation via ZIMRA portal.",
        costTime: "Free of charge • 2 to 4 Days",
        docs: "Certificate of Incorporation, CR5, CR6, Directors Mod-23 IDs, Bank confirmation letter."
      },
      {
        id: "st3-itf263-clearance",
        title: "ITF 263 Tax Clearance Certificate (Prevents 30% WHT)",
        authority: "ZIMRA Domestic Taxes",
        category: "Tax Shield",
        shortDesc: "Obtain digital ITF 263 tax clearance certificate from ZIMRA Domestic Taxes division.",
        why: "CRITICAL: Under Section 80 of Income Tax Act [Ch 23:06], any paying customer MUST deduct 30% if you lack ITF 263!",
        how: "Request priority Tier 1 new incorporation clearance via ZIMRA e-Services portal.",
        costTime: "Free of charge • 1 to 3 Days",
        docs: "Active BP number, director tax details, valid corporate email."
      },
      {
        id: "st3-fiscalisation",
        title: "RevMax Fiscalisation & Electronic Fiscal Device (EFD) Setup",
        authority: "ZIMRA / Tech Provider",
        category: "Fiscalisation",
        shortDesc: "Connect electronic fiscal device or cloud fiscal server under S.I. 25 of 2024.",
        why: "All VAT-registered operators must transmit real-time encrypted fiscal invoices to ZIMRA servers.",
        how: "Procure an approved ZIMRA fiscal printer or cloud fiscalization API integration.",
        costTime: "$150 - $350 USD • 3 to 5 Days",
        docs: "ZIMRA BP Certificate, physical address proof, configuration token."
      },
      {
        id: "st3-vat-assessment",
        title: "Value Added Tax (VAT) Category Registration",
        authority: "ZIMRA Domestic Taxes",
        category: "Indirect Tax",
        shortDesc: "Assess expected annual turnover against statutory VAT threshold ($25,000 USD).",
        why: "Compulsory if threshold exceeded; voluntary registration allows claiming back input VAT on capital goods.",
        how: "Lodge VAT 1 registration form through ZIMRA e-Services portal.",
        costTime: "Free of charge • 3 to 7 Days",
        docs: "Sales projection schedules, contract agreements, lease agreement."
      }
    ]
  },
  {
    stageNum: 4,
    title: "Municipal Licensing & Zoning Clearance",
    authority: "Local Authority (Harare City Council / Local Municipality)",
    costEstimate: "$50 - $250 USD",
    timeEstimate: "7 - 14 Days",
    summary: "Verify commercial zoning under Urban Councils Act [Ch 29:15] and obtain Form SL2 Shop Licence.",
    items: [
      {
        id: "st4-zoning-clearance",
        title: "Stand Commercial/Industrial Zoning Verification (Urban Councils Act)",
        authority: "City Town Planning Department",
        category: "Town Planning",
        shortDesc: "Confirm that Stand survey number carries proper commercial or industrial town planning zoning.",
        why: "Operating commercial trade in an unzoned residential Stand triggers municipal shutdown and fines.",
        how: "Request zoning verification letter at Town House / Municipal Planning Office.",
        costTime: "$30 - $80 USD • 5 to 10 Days",
        docs: "Stand survey diagram, Title Deed / Lease agreement."
      },
      {
        id: "st4-sl2-shop-licence",
        title: "Form SL 2 Municipal Shop Licence Application Lodged",
        authority: "Local Licensing Authority",
        category: "Municipal Licence",
        shortDesc: "File Form SL 2 application under Shop Licences Act [Chapter 14:17].",
        why: "Trading from any physical shop or warehouse without a licence results in premises padlocking.",
        how: "Lodge Form SL 2 after publishing statutory public notices in Government Gazette and daily newspaper.",
        costTime: "$50 - $200 USD • 10 to 14 Days",
        docs: "Form SL 2, 2 newspaper advertisement clippings, CR6, Certificate of Incorporation."
      },
      {
        id: "st4-health-inspection",
        title: "City Health Department Sanitary & Hygiene Inspection",
        authority: "Municipal Health Department",
        category: "Public Health",
        shortDesc: "Undergo on-site sanitary inspection for ventilation, sanitation, water, and waste management.",
        why: "Prerequisite clearance before municipal licensing committee grants operating permit.",
        how: "Schedule municipal health inspector visit, remediate minor snags, and obtain report.",
        costTime: "$20 - $50 USD • 3 to 7 Days",
        docs: "Premises floor plan, municipal water account, waste contract."
      },
      {
        id: "st4-fire-certificate",
        title: "Chief Fire Officer Clearance & Serviced Extinguishers",
        authority: "Municipal Fire Brigade",
        category: "Fire Safety",
        shortDesc: "Install serviced 9kg DCP extinguishers, emergency exits, and pass fire prevention inspection.",
        why: "Mandatory public safety clearance before commercial premises occupancy permit is signed.",
        how: "Arrange Fire Brigade site audit and display serviced extinguisher inspection tags.",
        costTime: "$25 - $60 USD • 3 to 5 Days",
        docs: "Extinguisher purchase / service receipt, premises escape plan."
      }
    ]
  },
  {
    stageNum: 5,
    title: "Statutory Social Security & Procurement",
    authority: "NSSA, ZIMDEF & PRAZ",
    costEstimate: "$20 - $120 USD",
    timeEstimate: "3 - 7 Days",
    summary: "Register workforce with NSSA under NSSA Act [Ch 17:04] and register with PRAZ for government tenders.",
    items: [
      {
        id: "st5-nssa-p1p2",
        title: "NSSA Employer Registration (Form P1 & Form P2)",
        authority: "NSSA",
        category: "Labor Law",
        shortDesc: "Register as an employer under National Social Security Authority Act [Chapter 17:04].",
        why: "Compulsory within 30 days of hiring first worker (including paid executive directors).",
        how: "Lodge NSSA Forms P1 and P2 at nearest NSSA office or online self-service portal.",
        costTime: "Free to register (Monthly statutory split applies) • 2 to 4 Days",
        docs: "Form CR6, Certificate of Incorporation, Staff National ID list, proof of physical address."
      },
      {
        id: "st5-wcif-fund",
        title: "Workers' Compensation Insurance Fund (WCIF) Activation",
        authority: "NSSA WCIF",
        category: "Workplace Safety",
        shortDesc: "Activate employer insurance covering staff against industrial accidents and disease.",
        why: "Protects directors from personal civil liability in event of workplace accidents.",
        how: "Calculated based on industry risk assessment tariff applied to gross wage bill.",
        costTime: "Assessment rate on payroll • 2 to 3 Days",
        docs: "NSSA P1 confirmation, company sector classification."
      },
      {
        id: "st5-zimdef-levy",
        title: "ZIMDEF 1% Manpower Training Levy Account Activation",
        authority: "Ministry of Higher Education",
        category: "Training Levy",
        shortDesc: "Register employer account under Manpower Planning & Development Act [Chapter 28:02].",
        why: "Mandatory monthly 1% gross payroll contribution towards national vocational skills training.",
        how: "Register employer profile on ZIMDEF portal and file first monthly payroll declaration.",
        costTime: "Free registration (1% gross payroll monthly) • 1 to 2 Days",
        docs: "Certificate of Incorporation, CR6, ZIMRA BP Certificate."
      },
      {
        id: "st5-praz-listing",
        title: "PRAZ Government Supplier Registration (Procurement Portal)",
        authority: "PRAZ",
        category: "Public Tenders",
        shortDesc: "Register company under specific procurement categories on PRAZ portal.",
        why: "Essential requirement to bid for government ministries, parastatals, and municipal tenders.",
        how: "Complete online portal registration and upload valid ZIMRA ITF 263 tax clearance.",
        costTime: "$20 - $120 USD (Annual tier) • 2 to 3 Days",
        docs: "Certificate of Incorporation, CR6, ITF 263 Tax Clearance, Company Profile."
      }
    ]
  },
  {
    stageNum: 6,
    title: "Sector-Specific Regulatory Licensing",
    authority: "Designated National Regulator (Dynamic)",
    costEstimate: "Sector Dependent",
    timeEstimate: "7 - 21 Days",
    summary: "Industry-specific statutory permits tailored dynamically to your selected sector.",
    items: [] // Injected dynamically from active sector
  },
  {
    stageNum: 7,
    title: "Dual-Currency Banking & Instant Settlement",
    authority: "Commercial Bank, ZimSwitch & RBZ",
    costEstimate: "$20 - $100 USD",
    timeEstimate: "2 - 4 Days",
    summary: "Open dual-currency accounts (USD Nostro + ZiG) and activate merchant settlement rails.",
    items: [
      {
        id: "st7-board-resolution",
        title: "Certified Board Resolution to Open Corporate Accounts",
        authority: "Corporate Governance",
        category: "Banking Mandate",
        shortDesc: "Formal board resolution authorizing opening of multi-currency accounts and designating signatories.",
        why: "Banks cannot open corporate accounts without an official resolution certified under seal.",
        how: "Adopt standard board resolution template, signed by Chairman and Corporate Secretary.",
        costTime: "Free • 1 Day",
        docs: "Signed board minutes / extract resolution, Specimen signature cards."
      },
      {
        id: "st7-dual-accounts",
        title: "Multi-Currency Corporate Accounts (USD FCA Nostro + ZiG Domestic)",
        authority: "Commercial Bank (Stanbic / CABS / CBZ / FBC)",
        category: "Commercial Banking",
        shortDesc: "Open dual ledgers allowing domestic transactions in Zimbabwe Gold (ZiG) and international trade in USD.",
        why: "Reserve Bank of Zimbabwe dual-currency regulations mandate separate accounts for ZiG and USD.",
        how: "Submit verified KYC bundle to commercial bank business banking department.",
        costTime: "$20 - $100 USD Opening Deposit • 2 to 4 Days",
        docs: "Certified Certificate of Incorporation, CR6, CR5, ZIMRA BP, ITF 263, Director IDs."
      },
      {
        id: "st7-kyc-mod23",
        title: "Director KYC & ZPRS Mod-23 Identity Verification",
        authority: "Bank Compliance / ZPRS",
        category: "AML Vetting",
        shortDesc: "Bank compliance verification of all directors and beneficial owners holding ≥20%.",
        why: "Mandated under Money Laundering & Proceeds of Crime Act [Chapter 9:24].",
        how: "Present original national IDs and utility bills under 3 months old.",
        costTime: "Free • 1 to 2 Days",
        docs: "Certified National IDs, Utility bills, Passport photographs."
      },
      {
        id: "st7-pos-ecocash",
        title: "Merchant POS & EcoCash Merchant Code Activation",
        authority: "ZimSwitch / EcoCash",
        category: "Payment Rails",
        shortDesc: "Activate point-of-sale swipe machine, ZimSwitch ZIPIT, and EcoCash B2B merchant code.",
        why: "Enables instant acceptance of customer payments in both ZiG and US Dollars across all retail channels.",
        how: "Apply through bank merchant services or EcoCash Business portal.",
        costTime: "$10 - $50 USD • 2 to 5 Days",
        docs: "Bank account confirmation, Certificate of Incorporation, CR6."
      }
    ]
  }
];

// =====================================================================
// 3. DATA STRUCTURES: 8 STATUTORY STARTER KIT TEMPLATES
// =====================================================================
const TEMPLATES = [
  {
    id: "memo-articles",
    title: "Standard Memorandum & Articles of Association (Table A)",
    act: "COBE Act [Ch 24:31] First Schedule Table A",
    desc: "Complete statutory founding constitution for a Private Company Limited by Shares under S.I. 46 of 2020.",
    filename: "Memorandum_and_Articles_of_Association_Table_A.txt",
    content: `REPUBLIC OF ZIMBABWE
COMPANIES AND OTHER BUSINESS ENTITIES ACT [CHAPTER 24:31]
STATUTORY INSTRUMENT 46 OF 2020

MEMORANDUM OF ASSOCIATION OF [COMPANY NAME] (PRIVATE) LIMITED

1. The name of the Company is:
   [COMPANY NAME] (PRIVATE) LIMITED

2. The registered office of the Company will be situated in Zimbabwe.

3. The objects for which the Company is established are:
   (a) To carry on the business of [PRIMARY BUSINESS PURPOSE, e.g. Clean solar energy systems, engineering works, and equipment distribution].
   (b) To purchase, take on lease, or in exchange, hire or otherwise acquire any movable or immovable property in Zimbabwe.
   (c) To exercise all the ancillary objects and powers set out in the Second Schedule to the Companies and Other Business Entities Act [Chapter 24:31].

4. The liability of the members is limited.

5. The share capital of the Company is USD $1,000.00 (One Thousand United States Dollars) divided into 1,000 (One Thousand) Ordinary Shares of USD $1.00 each.

We, the several persons whose names and addresses are subscribed, desire to be formed into a Company in pursuance of this Memorandum of Association:

1. Full Legal Name: [FOUNDER 1 NAME]
   National Identity: [MOD-23 ID NUMBER]
   Address: [PHYSICAL RESIDENTIAL ADDRESS]
   Number of Shares: 600 Ordinary Shares
   Signature: ______________________ Date: ______________

2. Full Legal Name: [FOUNDER 2 NAME]
   National Identity: [MOD-23 ID NUMBER]
   Address: [PHYSICAL RESIDENTIAL ADDRESS]
   Number of Shares: 400 Ordinary Shares
   Signature: ______________________ Date: ______________

In the presence of:
Witness Full Name: [WITNESS NAME]
National Identity: [WITNESS ID]
Address: [WITNESS ADDRESS]
Signature: ______________________ Date: ______________

---------------------------------------------------------------------
ARTICLES OF ASSOCIATION OF [COMPANY NAME] (PRIVATE) LIMITED
(Regulations for the management of a Private Company Limited by Shares)

1. PRELIMINARY
The regulations contained in Table A of the First Schedule to the Companies and Other Business Entities Act [Chapter 24:31] as read with Statutory Instrument 46 of 2020 shall apply to the Company save in so far as modified herein.

2. DIRECTORS
(a) The number of directors shall not be less than two (2).
(b) In compliance with Section 195 of the Act, at least one (1) director shall be ordinarily resident in Zimbabwe.
(c) The initial directors of the Company shall be:
    (i) [DIRECTOR 1 NAME]
    (ii) [DIRECTOR 2 NAME]

3. SECRETARY
The directors shall appoint a Company Secretary in compliance with Section 216 of the Act.

DATED at HARARE this ______ day of ______________, 2026.`
  },
  {
    id: "board-res",
    title: "Board Resolution to Open Corporate Bank Account",
    act: "Banking & RBZ Multi-Currency Compliance",
    desc: "Certified board extract authorizing opening of dual-currency FCA USD Nostro and ZiG accounts with designated signing mandates.",
    filename: "Board_Resolution_Open_Corporate_Bank_Account.txt",
    content: `[COMPANY NAME] (PRIVATE) LIMITED
Incorporation No: [ZW-CIPZ-XXXXXX]
Registered Office: [PHYSICAL STREET ADDRESS, CITY, ZIMBABWE]

CERTIFIED EXTRACT OF RESOLUTION PASSED BY THE BOARD OF DIRECTORS
HELD AT THE REGISTERED OFFICE ON [DATE]

PRESENT:
- [DIRECTOR 1 NAME] (Chairman & Managing Director)
- [DIRECTOR 2 NAME] (Executive Director)
- [SECRETARY NAME] (Company Secretary)

IT WAS NOTED THAT:
The Company requires multi-currency corporate banking facilities in United States Dollars (USD FCA Nostro) and Zimbabwe Gold (ZiG) to conduct commercial operations and settle statutory commitments.

IT WAS RESOLVED UNANIMOUSLY THAT:
1. A corporate bank account or accounts in United States Dollars (FCA Nostro) and Zimbabwe Gold (ZiG) be opened in the name of [COMPANY NAME] (PRIVATE) LIMITED with [BANK NAME, e.g. Stanbic Bank Zimbabwe / CABS / CBZ Bank Limited].

2. The following persons are hereby designated as Authorized Signatories of the Company:
   SIGNATORY 1:
   Full Name: [NAME]
   Designation: Managing Director
   National ID: [MOD-23 ID NUMBER]
   Specimen Signature: ___________________________

   SIGNATORY 2:
   Full Name: [NAME]
   Designation: Executive Director
   National ID: [MOD-23 ID NUMBER]
   Specimen Signature: ___________________________

3. SIGNING MANDATE:
   The Bank is hereby authorized to honor all cheques, promissory notes, transfers, electronic banking mandates, and Point-of-Sale merchant agreements signed by:
   [CHOOSE: Any two signatories jointly / Either signatory solely].

4. The Company Secretary is hereby instructed to deliver a certified copy of this resolution together with the Company's Certificate of Incorporation, Form CR6, Form CR5, and ZIMRA ITF 263 Tax Clearance to the Bank.

CERTIFIED AS A TRUE AND ACCURATE EXTRACT:

______________________________         ______________________________
[DIRECTOR 1 NAME]                      [SECRETARY NAME]
Chairman of the Board                  Company Secretary
Date: ________________________         Date: ________________________`
  },
  {
    id: "landlord-affidavit",
    title: "Landlord Consent & Proof of Residence Affidavit",
    act: "COBE Act Sec 112 & Urban Councils Act [Ch 29:15]",
    desc: "Sworn affidavit of property owner or head leaseholder consenting to the use of premises as statutory registered office.",
    filename: "Landlord_Consent_Affidavit_Registered_Office.txt",
    content: `REPUBLIC OF ZIMBABWE
IN THE MATTER OF THE COMPANIES AND OTHER BUSINESS ENTITIES ACT [CHAPTER 24:31]
AND IN THE MATTER OF FORM CR 5 REGISTERED OFFICE

SWORN AFFIDAVIT OF PROPERTY OWNER / LANDLORD CONSENT

I, the undersigned,
Full Legal Name: [LANDLORD / PROPERTY OWNER NAME]
National Identity Number: [MOD-23 ID NUMBER]
Residential Address: [RESIDENTIAL ADDRESS]
Telephone: [PHONE NUMBER]

Do hereby make oath and declare that:

1. I am the lawful registered owner / authorized head leaseholder of the immovable commercial/residential property situated at:
   Stand Number: [STAND NUMBER]
   Street Address: [PHYSICAL STREET ADDRESS]
   Suburb / Area: [SUBURB, e.g. Workington Industrial / Eastlea]
   City: [CITY, e.g. Harare / Bulawayo]

2. I have entered into a valid commercial lease agreement / tenancy arrangement with [COMPANY NAME] (PRIVATE) LIMITED (represented by its Directors).

3. In terms of Section 112 of the Companies and Other Business Entities Act [Chapter 24:31], I hereby grant full and unconditional consent for [COMPANY NAME] (PRIVATE) LIMITED to utilize the aforesaid premises as its official Registered Office and commercial domicile for the service of statutory legal documents and notices.

4. I confirm that the premises are equipped with street frontage and are subject to the commercial bylaws of the [NAME OF MUNICIPALITY / CITY COUNCIL].

DEPONENT: _________________________________
Date: _____________________________________

SWORN BEFORE ME at HARARE this ______ day of ______________, 2026.

___________________________________________
COMMISSIONER OF OATHS
Full Name: ________________________________
Designation / Force Number: _______________
Area / Address: ___________________________`
  },
  {
    id: "cr2-template",
    title: "Form CR 2: Application for Reservation of Name",
    act: "COBE Act Sec 26 & S.I. 46 of 2020",
    desc: "Statutory application to reserve up to 4 alternative corporate names with the CIPZ Registrar.",
    filename: "Form_CR2_Name_Reservation_Application.txt",
    content: `REPUBLIC OF ZIMBABWE
COMPANIES AND OTHER BUSINESS ENTITIES ACT [CHAPTER 24:31]
STATUTORY INSTRUMENT 46 OF 2020

FORM CR 2
APPLICATION FOR RESERVATION OF NAME (Section 26)

To: The Registrar of Companies and Other Business Entities
P.O. Box CY 177, Causeway, Harare, Zimbabwe

1. APPLICANT DETAILS:
   Full Name: [APPLICANT FULL NAME]
   National Identity: [MOD-23 ID NUMBER]
   Address: [PHYSICAL ADDRESS, CITY, ZIMBABWE]
   Email / Phone: [EMAIL AND PHONE]

2. PROPOSED NAMES IN ORDER OF PREFERENCE:
   Preference 1: [NAME 1] (PRIVATE) LIMITED
   Preference 2: [NAME 2] (PRIVATE) LIMITED
   Preference 3: [NAME 3] (PRIVATE) LIMITED
   Preference 4: [NAME 4] (PRIVATE) LIMITED

3. NATURE OF PRINCIPAL BUSINESS:
   [DESCRIBE NATURE OF BUSINESS, e.g. Renewable solar equipment distribution, engineering civil works, and grain logistics].

4. JUSTIFICATION / TRADEMARK CONSENT (IF APPLICABLE):
   The proposed names are coined and do not conflict with existing registered trade names under the Trademarks Act [Chapter 26:04].

DATED this ______ day of ______________, 2026.

Signature of Applicant: ___________________________`
  },
  {
    id: "cr5-template",
    title: "Form CR 5: Notice of Situation of Registered Office",
    act: "COBE Act Sec 112 & S.I. 46 of 2020",
    desc: "Statutory notice lodged with the CIPZ Registrar declaring the exact physical street address of the company.",
    filename: "Form_CR5_Registered_Office_Notice.txt",
    content: `REPUBLIC OF ZIMBABWE
COMPANIES AND OTHER BUSINESS ENTITIES ACT [CHAPTER 24:31]
STATUTORY INSTRUMENT 46 OF 2020

FORM CR 5
NOTICE OF SITUATION OF REGISTERED OFFICE (Section 112)

Name of Company: [COMPANY NAME] (PRIVATE) LIMITED
Company Incorporation No: [ZW-CIPZ-XXXXXX]

To: The Registrar of Companies and Other Business Entities

Notice is hereby given that the registered office of the above-named Company is situated at:

1. PHYSICAL STREET ADDRESS:
   Stand Number: [STAND NUMBER]
   Building / Suite: [BUILDING NAME / SUITE NO]
   Street Name: [STREET NAME]
   Suburb / Industrial Area: [SUBURB, e.g. Workington / Msasa / Belmont]
   City / Town: [CITY, e.g. Harare / Bulawayo]

2. POSTAL ADDRESS:
   [P.O. BOX OR SAME AS PHYSICAL ADDRESS]

3. EFFECTIVE DATE OF SITUATION:
   With effect from the ______ day of ______________, 2026.

DATED at HARARE this ______ day of ______________, 2026.

___________________________________________
Signature: Director / Secretary
Full Name: [OFFICER FULL NAME]
Capacity: [DIRECTOR / COMPANY SECRETARY]`
  },
  {
    id: "cr6-template",
    title: "Form CR 6: Register of Directors and Secretaries",
    act: "COBE Act Sec 195 & 216 (Replaces former CR 14)",
    desc: "Official statutory return detailing directors, nationality, residency, Mod-23 IDs, and appointed Corporate Secretary.",
    filename: "Form_CR6_Register_Directors_and_Secretaries.txt",
    content: `REPUBLIC OF ZIMBABWE
COMPANIES AND OTHER BUSINESS ENTITIES ACT [CHAPTER 24:31]
STATUTORY INSTRUMENT 46 OF 2020

FORM CR 6
REGISTER OF DIRECTORS AND SECRETARIES (Sections 195 & 216)
(Replaces former Form CR 14)

Name of Company: [COMPANY NAME] (PRIVATE) LIMITED
Company Incorporation No: [ZW-CIPZ-XXXXXX]

1. DIRECTORS PARTICULARS:
   (a) Full Legal Name: [DIRECTOR 1 NAME]
       National Identity (Mod-23): [MOD-23 ID NUMBER]
       Nationality: Zimbabwean
       Residential Address: [PHYSICAL RESIDENTIAL ADDRESS]
       Ordinarily Resident in Zimbabwe: YES
       Date of Appointment: [DATE OF INCORPORATION]

   (b) Full Legal Name: [DIRECTOR 2 NAME]
       National Identity (Mod-23): [MOD-23 ID NUMBER]
       Nationality: Zimbabwean
       Residential Address: [PHYSICAL RESIDENTIAL ADDRESS]
       Ordinarily Resident in Zimbabwe: YES
       Date of Appointment: [DATE OF INCORPORATION]

2. COMPANY SECRETARY PARTICULARS (Section 216):
   Full Legal Name: [SECRETARY NAME]
   National Identity (Mod-23): [MOD-23 ID NUMBER]
   Nationality: Zimbabwean
   Residential Address: [PHYSICAL RESIDENTIAL ADDRESS]
   Postal Address: [POSTAL ADDRESS]
   Date of Appointment: [DATE OF INCORPORATION]

3. STATUTORY COMPLIANCE DECLARATION:
   I hereby certify that in terms of Section 195(1) of the Act, at least one director of the company is ordinarily resident in Zimbabwe.

DATED at HARARE this ______ day of ______________, 2026.

___________________________________________
Signature: Corporate Secretary / Director
Full Name: [NAME]`
  },
  {
    id: "cr16-template",
    title: "Form CR 16: Declaration of Beneficial Ownership",
    act: "COBE Act Sec 276 & Anti-Money Laundering Framework",
    desc: "Mandatory statutory return disclosing all natural persons holding 20% or more equity, voting rights, or operational control.",
    filename: "Form_CR16_Declaration_Beneficial_Ownership.txt",
    content: `REPUBLIC OF ZIMBABWE
COMPANIES AND OTHER BUSINESS ENTITIES ACT [CHAPTER 24:31]
STATUTORY INSTRUMENT 46 OF 2020

FORM CR 16
DECLARATION OF BENEFICIAL OWNERSHIP (Section 276)

Name of Company: [COMPANY NAME] (PRIVATE) LIMITED
Company Registration No: [ZW-CIPZ-XXXXXX]

WARNING: Under Section 276(6) of the Act, any officer who knowingly submits false, misleading, or incomplete particulars of beneficial ownership commits an offense and is liable to statutory fines and imprisonment.

PARTICULARS OF NATURAL PERSON BENEFICIAL OWNERS (HOLDING ≥ 20%):

1. BENEFICIAL OWNER 1:
   (a) Full Legal Name: [FOUNDER 1 NAME]
   (b) National Identity / Passport: [MOD-23 ID NUMBER]
   (c) Date of Birth: [DOB]
   (d) Residential Address: [PHYSICAL RESIDENTIAL ADDRESS]
   (e) Nationality: Zimbabwean
   (f) Nature of Beneficial Ownership: Direct Equity Shareholder
   (g) Percentage of Shares Held: 60%
   (h) Percentage of Voting Rights: 60%
   (i) Date on which Beneficial Ownership Acquired: [DATE]

2. BENEFICIAL OWNER 2:
   (a) Full Legal Name: [FOUNDER 2 NAME]
   (b) National Identity / Passport: [MOD-23 ID NUMBER]
   (c) Date of Birth: [DOB]
   (d) Residential Address: [PHYSICAL RESIDENTIAL ADDRESS]
   (e) Nationality: Zimbabwean
   (f) Nature of Beneficial Ownership: Direct Equity Shareholder
   (g) Percentage of Shares Held: 40%
   (h) Percentage of Voting Rights: 40%
   (i) Date on which Beneficial Ownership Acquired: [DATE]

I, [SECRETARY FULL NAME], being the duly appointed Company Secretary, declare that the above particulars are true and complete.

DATED at HARARE this ______ day of ______________, 2026.

___________________________________________
Signature of Company Secretary`
  },
  {
    id: "sl2-template",
    title: "Form SL 2: Municipal Shop Licence Application Checklist",
    act: "Shop Licences Act [Chapter 14:17] & Harare City Council",
    desc: "Standard municipal application and document bundle for physical trading premises clearance and licensing.",
    filename: "Form_SL2_Municipal_Shop_Licence_Bundle.txt",
    content: `REPUBLIC OF ZIMBABWE
SHOP LICENCES ACT [CHAPTER 14:17]
CITY OF HARARE / LOCAL MUNICIPAL LICENSING AUTHORITY

FORM SL 2
APPLICATION FOR NEW SHOP LICENCE / COMMERCIAL PERMIT

1. APPLICANT PARTICULARS:
   Name of Entity: [COMPANY NAME] (PRIVATE) LIMITED
   Trading Style / Brand: [TRADING NAME, e.g. Vanguard SunEnergy Store]
   Certificate of Incorporation No: [ZW-CIPZ-XXXXXX]

2. PREMISES SITUATION:
   Stand Number: [STAND NUMBER, e.g. Stand 412 Workington]
   Street Name: [STREET NAME, e.g. Paisley Road]
   City / Municipality: [CITY, e.g. Harare]
   Town Planning Zone: [e.g. Zone IND-4 General Industry / Commercial]

3. TRADE OR BUSINESS FOR WHICH LICENCE REQUIRED:
   [e.g. Retail and wholesale distribution of solar panels, electrical equipment, and ancillary hardware].

4. ATTACHMENT BUNDLE CHECKLIST (MANDATORY):
   [X] Certified Copy of Certificate of Incorporation (CIPZ)
   [X] Certified Copy of Form CR 6 (Directors & Officers Register)
   [X] Certified Copy of Form CR 5 (Registered Office Notice)
   [X] Sworn Landlord Consent Affidavit / Commercial Lease Agreement
   [X] Municipal Commercial Zoning Clearance Certificate
   [X] City Health Department Sanitary Inspection Clearance
   [X] Chief Fire Officer Premises Certificate
   [X] Two (2) Original Newspaper Notices (Government Gazette & Daily Newspaper)
   [X] Proof of Payment of Municipal Application Fee

DATED at HARARE this ______ day of ______________, 2026.

___________________________________________
Signature of Applicant / Managing Director
Full Name: [NAME]`
  }
];

// =====================================================================
// 4. DATA STRUCTURES: 11 FOUNDER ACADEMY QUESTIONS & ANSWERS
// =====================================================================
const ACADEMY_ITEMS = [
  {
    id: "ac-1",
    question: "Why is CIPZ Certificate of Incorporation only Step 2 of 7?",
    tag: "Entity Formation",
    answer: `Many first-time entrepreneurs celebrate when their lawyer hands them a Certificate of Incorporation from CIPZ, believing their company is fully registered and open for business.

In statutory reality, the Certificate of Incorporation only gives birth to the corporate legal person. It gives your business a name and legal capacity under the Companies and Other Business Entities Act [Chapter 24:31].

However:
1. You cannot invoice corporate clients legally without a **ZIMRA Business Partner (BP) Number** and an **ITF 263 Tax Clearance Certificate** (otherwise 30% is deducted from every invoice).
2. You cannot open a physical shop, counter, or warehouse without a **Municipal Shop Licence (Form SL2)** under the Shop Licences Act [Chapter 14:17].
3. You cannot employ workers without registering for social security under the **NSSA Act [Chapter 17:04]**.
4. You cannot tender for parastatal contracts without a **PRAZ listing**.

Treating CIPZ incorporation as the finish line is why over 70% of micro-enterprises in Zimbabwe run into municipal fines, tax audits, or bank freezes within their first 12 months.`
  },
  {
    id: "ac-2",
    question: "What is the 30% ZIMRA Withholding Tax Trap (ITF 263) & How to Avoid It?",
    tag: "Tax Shield",
    answer: `Section 80 of the Zimbabwe Income Tax Act [Chapter 23:06] mandates that any registered business, government department, or parastatal making a commercial payment to a payee MUST withhold **30% of the gross invoice amount** if that payee cannot furnish a valid ZIMRA Tax Clearance Certificate (Form ITF 263).

What this means in practice:
If you invoice a corporate client for USD $10,000, and you do not possess an active ITF 263:
- The customer is legally bound to pay you only USD $7,000.
- The remaining USD $3,000 must be remitted directly to ZIMRA as withholding tax.
- This creates an immediate cash flow catastrophe for a newly formed startup.

How to avoid it:
As soon as you receive your Certificate of Incorporation, immediately proceed to Stage 3 of this Launchpad: register on the ZIMRA e-Services portal, obtain your Corporate BP number, and request a **Priority Tier 1 New Incorporation Tax Clearance Certificate**. Newly formed companies with no trading history are entitled to an immediate clean ITF 263.`
  },
  {
    id: "ac-3",
    question: "Who can be a Company Secretary under the COBE Act [Ch 24:31]?",
    tag: "Corporate Governance",
    answer: `Under Section 216 of the Companies and Other Business Entities Act [Chapter 24:31], every private limited company in Zimbabwe **must have at least one secretary**.

Key statutory rules:
1. **Can a director also be the secretary?** Yes, provided there is more than one director. However, where an act requires both a director and secretary to sign (such as sealing certain deeds), a person acting in both capacities cannot sign twice.
2. **Sole Director Prohibition:** A company cannot have a sole director who is also the sole secretary.
3. **Residency:** While private companies have flexibility, public companies require a professionally qualified secretary (CGI, ICAZ, Law Society). For a private limited company, the secretary must be an adult of sound mind not disqualified under Section 197.

The Company Secretary is personally responsible for lodging annual returns, maintaining the beneficial ownership register (Form CR16), and ensuring the company remains in good standing with CIPZ.`
  },
  {
    id: "ac-4",
    question: "Can I use my residential home address for Form CR 5 Registered Office?",
    tag: "Municipal & Domicile",
    answer: `Yes, under the COBE Act [Chapter 24:31], you may designate your residential home address as your company's Registered Office (Form CR 5), provided it is a physical street address with a verified stand number (not just a P.O. Box).

However, you must be aware of municipal town planning zoning:
- Under the **Urban Councils Act [Chapter 29:15]** and Harare City Council Town Planning Schemes, residential suburbs (low-density and high-density zones) are zoned primarily for residential dwelling.
- If your business is an administrative office or consultancy with no walk-in customers or heavy traffic, council tolerance is standard.
- However, if customers, delivery trucks, or physical inventory arrive at the residential premises, neighbors can lodge a complaint, and council town planning will issue an **Enforcement Order** to cease trading unless you obtain a **Special Consent Permit** from the City Council.`
  },
  {
    id: "ac-5",
    question: "What does 'Ordinarily Resident in Zimbabwe' mean for Directors (Section 195)?",
    tag: "Board Compliance",
    answer: `Section 195(1) of the COBE Act [Chapter 24:31] establishes that every private company must have at least two directors, and **at least one of those directors must be ordinarily resident in Zimbabwe**.

Statutory meaning:
- "Ordinarily resident" means a natural person who is habitually, physically present in Zimbabwe as part of the regular order of their life.
- A Zimbabwean citizen residing in the Diaspora (UK, South Africa, Australia) is **not ordinarily resident** unless they have returned and established their principal home in Zimbabwe.
- A foreign expatriate with a permanent residence permit or long-term employment permit who lives in Harare or Bulawayo **does qualify** as ordinarily resident.

If foreign founders incorporate a Zimbabwean company, they must appoint at least one local co-founder or resident professional director to satisfy Section 195. Non-compliance results in the summary rejection of Form CR 6 by the CIPZ Registrar.`
  },
  {
    id: "ac-6",
    question: "What is Beneficial Ownership and why does Form CR 16 carry criminal penalties?",
    tag: "AML / Anti-Corruption",
    answer: `Under Section 276 of the COBE Act and Statutory Instrument 46 of 2020, every company must identify and lodge a declaration of its **Ultimate Beneficial Owners (Form CR 16)**.

A beneficial owner is defined as any natural person who directly or indirectly holds:
- **20% or more** of the share capital; or
- **20% or more** of the voting rights; or
- Ultimate effective control through trusts, nominee shareholding, or family arrangements.

Why there are criminal penalties:
Zimbabwe's Financial Intelligence Unit (FIU) and international FATF standards require transparency to stop illicit financial flows, money laundering, and tax evasion. Under Section 276(6), any corporate officer who knowingly conceals a beneficial owner or submits false records is guilty of a criminal offense, liable to a Level 10 statutory fine, and imprisonment for up to one year.`
  },
  {
    id: "ac-7",
    question: "How does dual-currency banking work (USD Nostro vs ZiG Domestic)?",
    tag: "Monetary Rails",
    answer: `Zimbabwe operates a multicurrency settlement environment anchored by the Reserve Bank of Zimbabwe (RBZ). Commercial businesses operate dual-currency bank accounts:

1. **Foreign Currency Account (FCA Nostro USD):**
   - Holds United States Dollars (cash notes, inward telegraphic transfers, export receipts).
   - Used for international imports, foreign supplier settlements, and domestic USD transactions.

2. **Zimbabwe Gold (ZiG) Domestic Account:**
   - Holds domestic Zimbabwe Gold currency backed by foreign exchange reserves and gold bullion.
   - Used for domestic tax payments (ZIMRA mandates 50% of provisional tax in ZiG), municipal rates, local labor wages, and ZimSwitch transactions.

When you open a corporate account (Stage 7), the bank will issue dual account numbers and configure Point-of-Sale (POS) terminals that automatically switch between ZiG and USD depending on customer currency selection.`
  },
  {
    id: "ac-8",
    question: "What is Form SL 2 Municipal Shop Licence and why do councils shut shops down?",
    tag: "Local Government",
    answer: `Under the Shop Licences Act [Chapter 14:17], no person may carry on any commercial trade or business from physical premises within a municipal area without an active **Municipal Shop Licence (Form SL 2)** issued by the Local Licensing Authority (e.g. City of Harare Town House).

Why premises get shut down:
Municipal police carry out regular enforcement crackdowns. If a business operates without a valid shop licence:
- Municipal officers will padlock the premises and serve an administrative closure notice.
- Heavy municipal spot fines are levied.
- The business owner faces prosecution in the municipal magistrate court.

To obtain Form SL 2, you must provide proof of:
- Clean Town Planning commercial zoning (IND or COM zone).
- Sanitary inspection clearance from the City Health Department.
- Chief Fire Officer safety certificate.
- Proof of publishing two notices in the Government Gazette and a daily national newspaper.`
  },
  {
    id: "ac-9",
    question: "When is NSSA Social Security registration mandatory?",
    tag: "Labor Compliance",
    answer: `Under the National Social Security Authority Act [Chapter 17:04], employer registration with NSSA is **strictly mandatory within 30 days of employing your first staff member**.

Crucial nuances:
- **Working Directors Count as Employees:** If a founder or director draws a monthly executive salary or wage from the company, NSSA law treats them as an employee requiring registration.
- **Statutory Split:** Monthly contributions are split equally between the employer and the employee up to the statutory ceiling.
- **Workers' Compensation (WCIF):** NSSA also manages the Workers' Compensation Insurance Fund, which protects your business if an employee suffers an injury at work.

Failure to register or remit contributions attracts compound penalty interest of up to 100% and can result in garnishee orders placed directly on your corporate bank account.`
  },
  {
    id: "ac-10",
    question: "How do I get on the PRAZ supplier list for Government tenders?",
    tag: "Procurement / PRAZ",
    answer: `The Procurement Regulatory Authority of Zimbabwe (PRAZ) governs all tenders floated by Government Ministries, State-Owned Parastatals, and Municipal Councils under the Public Procurement and Disposal of Public Assets Act [Chapter 22:23].

To get registered:
1. Complete Stages 1, 2, and 3 of this Launchpad to ensure you have your CIPZ incorporation bundle and ZIMRA ITF 263.
2. Log onto the PRAZ supplier portal (praz.gov.zw).
3. Select your procurement category codes (e.g., Solar & Electrical Equipment, Agricultural Inputs, IT Hardware, Office Stationery).
4. Upload certified copies of Form CR 6, Certificate of Incorporation, and valid ZIMRA Tax Clearance Certificate.
5. Pay the annual statutory category registration fee ($20 to $120 USD depending on tier).

Once registered, your company appears on the official gazetted PRAZ supplier list, making you immediately eligible to submit bids for public procurement tenders.`
  },
  {
    id: "ac-11",
    question: "Private Limited Company ((Pvt) Ltd) vs Private Business Corporation (PBC): Which should I choose?",
    tag: "Entity Selection",
    answer: `The COBE Act [Chapter 24:31] provides two primary business vehicles for small to medium businesses:

**1. Private Limited Company ((Pvt) Ltd):**
- Governed by share capital and shareholders.
- Requires minimum 2 directors and 1 corporate secretary.
- The gold standard for commercial credibility: required by banks for major loans, mandatory for foreign investors, and preferred by PRAZ and corporate tenders.
- Greater structural formality (CR2, CR5, CR6, CR16, Memorandum & Articles Table A).

**2. Private Business Corporation (PBC):**
- Governed by members holding percentage interests (no share capital).
- Can be founded by a single solo member (1 to 20 members max).
- No requirement for a formal company secretary.
- Cheaper statutory fees, ideal for solo traders, artisans, or small family stores.

**Verdict:** If your ambition is to raise capital, bid for government tenders, or trade with international partners, always form a **Private Limited Company ((Pvt) Ltd)**.`
  }
];

// =====================================================================
// 5. GLOBAL STATE & LOCAL STORAGE PERSISTENCE
// =====================================================================
const STORAGE_CHECKS_KEY = "zim_launchpad_checks";
const STORAGE_SECTOR_KEY = "zim_launchpad_sector";
const STORAGE_VAULT_KEY  = "zim_launchpad_vault";

let appState = {
  activeTab: "roadmap",
  activeSectorId: "energy",
  checkedItems: {},
  vaultFiles: {}, // itemId: { fileName, fileSize, dateVaulted }
  searchQuery: "",
  activeStageFilter: "all",
  demoRunning: false,
  demoPaused: false,
  demoStepIndex: 0,
  demoTimer: null
};

// =====================================================================
// 6. INITIALIZATION & STORAGE LOADERS
// =====================================================================
function initApp() {
  loadStoredState();
  buildSectorPills();
  renderRoadmap();
  renderChecklist();
  renderTemplates();
  renderAcademy();
  updateReadinessCalculations();
  setupEventListeners();
  setupDrawer();
}

function loadStoredState() {
  try {
    const storedSector = localStorage.getItem(STORAGE_SECTOR_KEY);
    if (storedSector && SECTORS.some(s => s.id === storedSector)) {
      appState.activeSectorId = storedSector;
    }

    const storedChecks = localStorage.getItem(STORAGE_CHECKS_KEY);
    if (storedChecks) {
      appState.checkedItems = JSON.parse(storedChecks);
    }

    const storedVault = localStorage.getItem(STORAGE_VAULT_KEY);
    if (storedVault) {
      appState.vaultFiles = JSON.parse(storedVault);
    }
  } catch (err) {
    console.warn("Storage load warning:", err);
  }
}

function saveStoredState() {
  try {
    localStorage.setItem(STORAGE_SECTOR_KEY, appState.activeSectorId);
    localStorage.setItem(STORAGE_CHECKS_KEY, JSON.stringify(appState.checkedItems));
    localStorage.setItem(STORAGE_VAULT_KEY, JSON.stringify(appState.vaultFiles));
  } catch (err) {
    console.warn("Storage save error:", err);
  }
}

// Get active stages including dynamic sector items in Stage 6
function getActiveStages() {
  const currentSector = SECTORS.find(s => s.id === appState.activeSectorId) || SECTORS[0];
  return BASE_STAGES.map(stage => {
    if (stage.stageNum === 6) {
      return {
        ...stage,
        authority: currentSector.regulator,
        summary: `Mandatory sector licensing for ${currentSector.name} governed by ${currentSector.regulator}.`,
        items: currentSector.items
      };
    }
    return stage;
  });
}

// Flatten all 28 items
function getAllActiveItems() {
  const stages = getActiveStages();
  let items = [];
  stages.forEach(st => {
    items = items.concat(st.items.map(item => ({ ...item, stageNum: st.stageNum })));
  });
  return items;
}

// =====================================================================
// 7. SECTOR SELECTION RENDERING
// =====================================================================
function buildSectorPills() {
  const grid = document.getElementById("sectorPillsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  SECTORS.forEach(sec => {
    const isSelected = sec.id === appState.activeSectorId;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `sector-pill-btn ${isSelected ? "selected" : ""}`;
    btn.dataset.sectorId = sec.id;
    btn.innerHTML = `
      <span class="sector-pill-icon">${sec.icon}</span>
      <div class="sector-pill-text">
        <span class="sector-pill-name">${sec.name}</span>
        <span class="sector-pill-regulator">${sec.regulator.split('(')[0].trim()}</span>
      </div>
    `;

    btn.addEventListener("click", () => {
      setSector(sec.id);
    });

    grid.appendChild(btn);
  });

  updateActiveSectorLabel();
}

function setSector(sectorId) {
  appState.activeSectorId = sectorId;
  saveStoredState();

  // Update pills UI
  document.querySelectorAll(".sector-pill-btn").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.sectorId === sectorId);
  });

  updateActiveSectorLabel();
  renderRoadmap();
  renderChecklist();
  updateReadinessCalculations();

  const sec = SECTORS.find(s => s.id === sectorId);
  showToast(`Regulator updated: Stage 6 adapted for ${sec.name} (${sec.regulator.split('(')[0].trim()})`, "info");
}

function updateActiveSectorLabel() {
  const label = document.getElementById("activeSectorLabel");
  if (!label) return;
  const current = SECTORS.find(s => s.id === appState.activeSectorId) || SECTORS[0];
  label.innerHTML = `Selected: ${current.icon} ${current.name} (${current.regulator.split('(')[0].trim()})`;
}

// =====================================================================
// 8. ROADMAP TAB RENDERING
// =====================================================================
function renderRoadmap() {
  const grid = document.getElementById("roadmapStagesGrid");
  if (!grid) return;

  const stages = getActiveStages();
  grid.innerHTML = "";

  stages.forEach(stage => {
    const totalItems = stage.items.length;
    const completedItems = stage.items.filter(it => appState.checkedItems[it.id]).length;
    const isStageComplete = completedItems === totalItems && totalItems > 0;
    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    let statusClass = "not-started";
    let statusText = "Not Started";
    if (isStageComplete) {
      statusClass = "completed";
      statusText = "✓ Compliant";
    } else if (completedItems > 0) {
      statusClass = "in-progress";
      statusText = `In Progress (${completedItems}/${totalItems})`;
    }

    const card = document.createElement("div");
    card.className = `stage-card ${isStageComplete ? "stage-complete" : ""}`;
    card.innerHTML = `
      <div class="stage-card-top">
        <div class="stage-badge-row">
          <span class="stage-num-pill">Stage ${stage.stageNum} of 7</span>
          <span class="stage-status-badge ${statusClass}">${statusText}</span>
        </div>
        <h4 class="stage-title">${stage.title}</h4>
        <div class="stage-authority">Authority: ${stage.authority}</div>
        
        <div class="stage-meta-row">
          <span class="stage-meta-chip">💰 ${stage.costEstimate}</span>
          <span class="stage-meta-chip">⏱️ ${stage.timeEstimate}</span>
        </div>

        <div class="stage-progress-bar-wrap">
          <div class="stage-progress-label">
            <span>Progress</span>
            <span>${percent}% (${completedItems}/${totalItems})</span>
          </div>
          <div class="stage-progress-track">
            <div class="stage-progress-fill" style="width: ${percent}%;"></div>
          </div>
        </div>

        <ul class="stage-items-preview">
          ${stage.items.map(it => {
            const done = appState.checkedItems[it.id];
            return `<li class="${done ? "item-done" : ""}">${escapeHtml(it.title)}</li>`;
          }).join('')}
        </ul>
      </div>

      <button type="button" class="btn-stage-action" data-stage="${stage.stageNum}">
        <span>Inspect Stage in Checklist</span>
        <span>→</span>
      </button>
    `;

    // Action button jump
    const btn = card.querySelector(".btn-stage-action");
    btn.addEventListener("click", () => {
      jumpToChecklistStage(stage.stageNum);
    });

    grid.appendChild(card);
  });
}

function jumpToChecklistStage(stageNum) {
  switchTab("checklist");
  appState.activeStageFilter = String(stageNum);
  
  // Update filter pills UI
  document.querySelectorAll(".sfilter-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.stage === String(stageNum));
  });

  renderChecklist();
  window.scrollTo({ top: 120, behavior: "smooth" });
}

// =====================================================================
// 9. CHECKLIST & VAULT TAB RENDERING
// =====================================================================
function renderChecklist() {
  const container = document.getElementById("checklistItemsContainer");
  if (!container) return;

  const allItems = getAllActiveItems();
  const filter = appState.activeStageFilter;
  const query = appState.searchQuery.toLowerCase().trim();

  // Filter items
  const filtered = allItems.filter(item => {
    const matchesStage = filter === "all" || String(item.stageNum) === filter;
    const matchesSearch = !query || 
      item.title.toLowerCase().includes(query) ||
      item.shortDesc.toLowerCase().includes(query) ||
      item.authority.toLowerCase().includes(query) ||
      item.why.toLowerCase().includes(query);

    return matchesStage && matchesSearch;
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-light);">
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">No matching requirements found</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Try modifying your search or switching to "All Stages".</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const isChecked = !!appState.checkedItems[item.id];
    const vaulted = appState.vaultFiles[item.id];

    const card = document.createElement("div");
    card.className = `checklist-item-card ${isChecked ? "is-checked" : ""}`;
    card.id = `card-${item.id}`;

    card.innerHTML = `
      <div class="checklist-item-main-row">
        
        <!-- Custom Checkbox -->
        <label class="custom-checkbox-wrapper" title="Mark milestone complete">
          <input 
            type="checkbox" 
            class="custom-checkbox-input" 
            data-item-id="${item.id}"
            ${isChecked ? "checked" : ""}
          >
          <span class="custom-checkbox-box"></span>
        </label>

        <!-- Main Content -->
        <div class="checklist-item-content">
          <div class="item-badges-row">
            <span class="item-stage-tag">Stage ${item.stageNum}</span>
            <span class="item-authority-tag">${escapeHtml(item.authority)}</span>
            <span class="item-category-tag">${escapeHtml(item.category)}</span>
          </div>

          <h4 class="item-title-text">${escapeHtml(item.title)}</h4>
          <p class="item-short-desc">${escapeHtml(item.shortDesc)}</p>

          <!-- Vault Attachment Area -->
          <div class="item-actions-footer">
            <button type="button" class="btn-toggle-details" data-item-id="${item.id}">
              <span class="detail-toggle-icon">▼</span>
              <span>Why this matters &amp; How to obtain</span>
            </button>

            <div class="vault-attachment-actions" id="vault-area-${item.id}">
              ${vaulted ? `
                <div class="vaulted-file-badge" title="Uploaded ${vaulted.dateVaulted} • AES-256 Mock Encrypted">
                  <span>🔒 ${escapeHtml(vaulted.fileName)} (${vaulted.fileSize})</span>
                  <button type="button" class="btn-remove-vaulted" data-item-id="${item.id}" title="Remove file">✕</button>
                </div>
              ` : `
                <label class="btn-vault-attach" title="Attach physical proof or scan to secure vault">
                  <span>📎 Attach Document</span>
                  <input type="file" style="display: none;" class="vault-file-input" data-item-id="${item.id}">
                </label>
              `}
            </div>
          </div>

          <!-- Expandable Details Accordion -->
          <div class="item-expandable-box" id="expand-${item.id}" style="display: none;">
            <div class="expandable-grid">
              <div class="expand-detail-col">
                <h5>💡 Why this matters</h5>
                <p>${escapeHtml(item.why)}</p>
              </div>
              <div class="expand-detail-col">
                <h5>📋 How to get it in Zimbabwe</h5>
                <p>${escapeHtml(item.how)}</p>
                <div class="cost-timeline-pill">💰 ${escapeHtml(item.costTime)}</div>
              </div>
              <div class="expand-detail-col">
                <h5>📄 Required Physical Documents</h5>
                <p>${escapeHtml(item.docs)}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;

    // Event: Checkbox toggle
    const checkbox = card.querySelector(".custom-checkbox-input");
    checkbox.addEventListener("change", (e) => {
      toggleCheckItem(item.id, e.target.checked);
    });

    // Event: Toggle Details
    const toggleBtn = card.querySelector(".btn-toggle-details");
    const expandBox = card.querySelector(`#expand-${item.id}`);
    toggleBtn.addEventListener("click", () => {
      const isHidden = expandBox.style.display === "none";
      expandBox.style.display = isHidden ? "block" : "none";
      toggleBtn.querySelector(".detail-toggle-icon").textContent = isHidden ? "▲" : "▼";
    });

    // Event: File attachment
    const fileInput = card.querySelector(".vault-file-input");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        handleFileUpload(item.id, e.target.files);
      });
    }

    // Event: Remove vaulted file
    const removeBtn = card.querySelector(".btn-remove-vaulted");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        removeVaultFile(item.id);
      });
    }

    container.appendChild(card);
  });
}

function toggleCheckItem(itemId, isChecked) {
  if (isChecked) {
    appState.checkedItems[itemId] = true;
  } else {
    delete appState.checkedItems[itemId];
  }

  saveStoredState();

  // Update card visual
  const card = document.getElementById(`card-${itemId}`);
  if (card) {
    card.classList.toggle("is-checked", isChecked);
  }

  updateReadinessCalculations();
  renderRoadmap();
}

function handleFileUpload(itemId, files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  const sizeKb = Math.round(file.size / 1024);
  const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

  appState.vaultFiles[itemId] = {
    fileName: file.name,
    fileSize: sizeStr,
    dateVaulted: new Date().toLocaleDateString('en-GB')
  };

  // Auto-mark milestone as cleared when physical document is vaulted!
  appState.checkedItems[itemId] = true;
  saveStoredState();

  renderChecklist();
  updateReadinessCalculations();
  renderRoadmap();

  showToast(`🔒 Document vaulted: ${file.name} (AES-256 encrypted)`, "success");
}

function removeVaultFile(itemId) {
  delete appState.vaultFiles[itemId];
  saveStoredState();
  renderChecklist();
  updateReadinessCalculations();
  showToast("Document removed from vault.", "info");
}

// =====================================================================
// 10. STARTER KIT TEMPLATES TAB
// =====================================================================
function renderTemplates() {
  const grid = document.getElementById("templatesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  TEMPLATES.forEach(tpl => {
    const card = document.createElement("div");
    card.className = "template-card";
    card.innerHTML = `
      <div class="template-header">
        <div class="template-badge-row">
          <span class="template-act-tag">${escapeHtml(tpl.act)}</span>
        </div>
        <h4>${escapeHtml(tpl.title)}</h4>
        <p class="template-desc">${escapeHtml(tpl.desc)}</p>
      </div>

      <pre class="template-code-box"><code>${escapeHtml(tpl.content)}</code></pre>

      <div class="template-actions">
        <button type="button" class="btn-template-action btn-template-copy" data-tpl-id="${tpl.id}">
          <span>📋</span>
          <span>Copy Template</span>
        </button>
        <button type="button" class="btn-template-action btn-template-download" data-tpl-id="${tpl.id}">
          <span>⬇️</span>
          <span>Download (.txt)</span>
        </button>
      </div>
    `;

    // Copy action
    const btnCopy = card.querySelector(".btn-template-copy");
    btnCopy.addEventListener("click", () => {
      copyToClipboard(tpl.content);
      showToast(`Copied ${tpl.title} to clipboard!`, "success");
    });

    // Download action
    const btnDown = card.querySelector(".btn-template-download");
    btnDown.addEventListener("click", () => {
      downloadTextFile(tpl.filename, tpl.content);
      showToast(`Downloaded ${tpl.filename}`, "info");
    });

    grid.appendChild(card);
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =====================================================================
// 11. FOUNDER ACADEMY TAB
// =====================================================================
function renderAcademy() {
  const container = document.getElementById("academyAccordionContainer");
  if (!container) return;

  container.innerHTML = "";

  ACADEMY_ITEMS.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "academy-item";
    card.id = `academy-${item.id}`;

    card.innerHTML = `
      <button type="button" class="academy-header-btn" data-academy-id="${item.id}">
        <div class="academy-title-group">
          <span class="academy-q-num">${idx + 1}</span>
          <div>
            <span class="pill-tag" style="margin-bottom: 2px; display: inline-block;">${escapeHtml(item.tag)}</span>
            <div class="academy-question-text">${escapeHtml(item.question)}</div>
          </div>
        </div>
        <span class="academy-chevron">▼</span>
      </button>

      <div class="academy-body" style="display: none;">
        ${item.answer.split('\n\n').map(p => `<p>${escapeHtml(p).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`).join('')}
      </div>
    `;

    const btn = card.querySelector(".academy-header-btn");
    const body = card.querySelector(".academy-body");

    btn.addEventListener("click", () => {
      const isOpen = card.classList.contains("is-open");
      card.classList.toggle("is-open", !isOpen);
      body.style.display = isOpen ? "none" : "block";
    });

    container.appendChild(card);
  });
}

// =====================================================================
// 12. READINESS CALCULATIONS & DYNAMIC REPORT
// =====================================================================
function updateReadinessCalculations() {
  const allItems = getAllActiveItems();
  const totalCount = allItems.length;
  const completedCount = allItems.filter(it => appState.checkedItems[it.id]).length;
  const vaultedCount = Object.keys(appState.vaultFiles).length;

  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Header Meter
  const headerPercent = document.getElementById("headerPercentText");
  const headerBar = document.getElementById("headerProgressBar");
  const headerSub = document.getElementById("headerSubLabel");
  if (headerPercent) headerPercent.textContent = `${percent}%`;
  if (headerBar) headerBar.style.width = `${percent}%`;
  if (headerSub) headerSub.textContent = `${completedCount} of ${totalCount} statutory milestones completed`;

  // Checklist Tab Badge
  const tabBadge = document.getElementById("tabChecklistBadge");
  if (tabBadge) tabBadge.textContent = `${completedCount}/${totalCount}`;

  // Vault Controls Stats
  const vComp = document.getElementById("vaultCompletedCount");
  const vFiles = document.getElementById("vaultFilesCount");
  if (vComp) vComp.textContent = `${completedCount}/${totalCount}`;
  if (vFiles) vFiles.textContent = `${vaultedCount}`;

  // Report Scorecard
  updateReportScorecard(percent, completedCount, totalCount, vaultedCount);
}

function updateReportScorecard(percent, completedCount, totalCount, vaultedCount) {
  const scoreVal = document.getElementById("reportScoreVal");
  const scoreCircle = document.getElementById("reportScoreCircle");
  const statusBadge = document.getElementById("reportStatusBadge");
  const statusSummary = document.getElementById("reportStatusSummary");

  if (scoreVal) scoreVal.textContent = `${percent}%`;

  // SVG Circle Stroke Dashoffset (Circumference ~ 264)
  if (scoreCircle) {
    const offset = 264 - (264 * percent) / 100;
    scoreCircle.style.strokeDashoffset = offset;
  }

  // Status Tier
  if (statusBadge && statusSummary) {
    if (percent === 100) {
      statusBadge.textContent = "✓ FULLY COMPLIANT • TRADE READY";
      statusBadge.style.color = "#10b981";
      statusSummary.textContent = "Outstanding achievement! All statutory company formation, ZIMRA tax clearance, municipal licensing, NSSA labor registration, and banking requirements are completely satisfied.";
    } else if (percent >= 70) {
      statusBadge.textContent = "Nearly Ready for Commercial Launch";
      statusBadge.style.color = "var(--zim-gold)";
      statusSummary.textContent = "Core incorporation and registrations completed. Finalise remaining municipal clearance or banking settlement to achieve 100% compliance.";
    } else if (percent >= 40) {
      statusBadge.textContent = "Mid-Stage Formation In Progress";
      statusBadge.style.color = "#3b82f6";
      statusSummary.textContent = "Statutory formation underway. Ensure ZIMRA ITF 263 tax clearance is secured promptly to avoid 30% withholding deductions.";
    } else {
      statusBadge.textContent = "Pre-Trading / Initial Phase";
      statusBadge.style.color = "#f59e0b";
      statusSummary.textContent = "Preliminary structuring phase. Critical statutory steps including CIPZ incorporation, ZIMRA BP number, and municipal licensing remain outstanding.";
    }
  }

  // Stats Subgrid
  const stages = getActiveStages();
  const stagesComplete = stages.filter(st => {
    return st.items.every(it => appState.checkedItems[it.id]);
  }).length;

  const repStages = document.getElementById("repStatStages");
  const repMilestones = document.getElementById("repStatMilestones");
  const repVaulted = document.getElementById("repStatVaulted");
  const repSector = document.getElementById("repStatSector");

  if (repStages) repStages.textContent = `${stagesComplete} / 7`;
  if (repMilestones) repMilestones.textContent = `${completedCount} / ${totalCount}`;
  if (repVaulted) repVaulted.textContent = `${vaultedCount} Vaulted`;

  const currentSector = SECTORS.find(s => s.id === appState.activeSectorId) || SECTORS[0];
  if (repSector) repSector.textContent = `${currentSector.icon} ${currentSector.name}`;

  // Stage Breakdown List
  renderReportStageBreakdown(stages);

  // Outstanding Blockers List
  renderReportBlockers();
}

function renderReportStageBreakdown(stages) {
  const container = document.getElementById("reportStageBreakdownList");
  if (!container) return;

  container.innerHTML = "";

  stages.forEach(stage => {
    const total = stage.items.length;
    const completed = stage.items.filter(it => appState.checkedItems[it.id]).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isComplete = completed === total && total > 0;

    const row = document.createElement("div");
    row.className = "rep-stage-row";
    row.innerHTML = `
      <div class="rep-stage-title">
        Stage ${stage.stageNum}: ${escapeHtml(stage.title)}
      </div>
      <div class="rep-stage-bar-wrap">
        <div class="rep-stage-track">
          <div class="rep-stage-fill" style="width: ${pct}%;"></div>
        </div>
        <span class="rep-stage-percent">${pct}%</span>
      </div>
      <span class="rep-stage-status ${isComplete ? 'stage-status-badge completed' : 'stage-status-badge in-progress'}">
        ${isComplete ? '✓ Compliant' : `${completed}/${total} Done`}
      </span>
    `;

    container.appendChild(row);
  });
}

function renderReportBlockers() {
  const container = document.getElementById("reportBlockersList");
  const card = document.getElementById("reportBlockersCard");
  if (!container || !card) return;

  const allItems = getAllActiveItems();
  const uncompleted = allItems.filter(it => !appState.checkedItems[it.id]);

  container.innerHTML = "";

  if (uncompleted.length === 0) {
    card.style.display = "none";
    return;
  }

  card.style.display = "block";

  // Display top 5 critical blockers
  uncompleted.slice(0, 5).forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "blocker-item";
    itemEl.innerHTML = `
      <span class="blocker-icon">⚠️</span>
      <div class="blocker-text">
        <strong>Stage ${item.stageNum}: ${escapeHtml(item.title)} (${escapeHtml(item.authority)})</strong>
        <span>${escapeHtml(item.why)}</span>
      </div>
    `;
    container.appendChild(itemEl);
  });

  if (uncompleted.length > 5) {
    const moreEl = document.createElement("div");
    moreEl.style.fontSize = "0.78rem";
    moreEl.style.color = "var(--text-muted)";
    moreEl.style.paddingLeft = "1rem";
    moreEl.textContent = `... and ${uncompleted.length - 5} additional requirements outstanding.`;
    container.appendChild(moreEl);
  }
}

// =====================================================================
// 13. 30-SECOND MINISTER / INVESTOR DEMO CONTROLLER
// =====================================================================
function setupDemo() {
  const btnLaunch = document.getElementById("execDemoBtn");
  const ctrlBar = document.getElementById("demoControllerBar");
  const btnPause = document.getElementById("btnPauseDemo");
  const btnFast = document.getElementById("btnFastForward");
  const btnExit = document.getElementById("btnExitDemo");

  if (!btnLaunch) return;

  btnLaunch.addEventListener("click", startDemo);
  if (btnPause) btnPause.addEventListener("click", togglePauseDemo);
  if (btnFast) btnFast.addEventListener("click", fastForwardDemo);
  if (btnExit) btnExit.addEventListener("click", stopDemo);
}

function startDemo() {
  if (appState.demoRunning) return;

  appState.demoRunning = true;
  appState.demoPaused = false;
  appState.demoStepIndex = 1;

  const bar = document.getElementById("demoControllerBar");
  if (bar) bar.style.display = "block";

  updateDemoStatus("Step 1: Navigating 7-Stage Formation Roadmap & Selecting Energy (ZERA)", 1);
  runDemoStep1();
}

function runDemoStep1() {
  if (!appState.demoRunning || appState.demoPaused) return;

  switchTab("roadmap");
  setSector("energy");
  window.scrollTo({ top: 180, behavior: "smooth" });

  appState.demoTimer = setTimeout(() => {
    if (!appState.demoRunning || appState.demoPaused) return;
    runDemoStep2();
  }, 5000);
}

function runDemoStep2() {
  if (!appState.demoRunning || appState.demoPaused) return;

  updateDemoStatus("Step 2: Checking Statutory CIPZ Incorporation (CR2, CR5, CR6, CR16)", 2);
  switchTab("checklist");
  jumpToChecklistStage(2);

  // Auto-check CIPZ items
  ["st2-cr2-clearance", "st2-memo-articles", "st2-cr5-filing", "st2-cr6-filing", "st2-cr16-filing"].forEach(id => {
    appState.checkedItems[id] = true;
  });

  // Simulate vaulting Form CR6
  appState.vaultFiles["st2-cr6-filing"] = {
    fileName: "CR6_Directors_Vanguard.pdf",
    fileSize: "142 KB",
    dateVaulted: new Date().toLocaleDateString('en-GB')
  };

  saveStoredState();
  renderChecklist();
  updateReadinessCalculations();

  appState.demoTimer = setTimeout(() => {
    if (!appState.demoRunning || appState.demoPaused) return;
    runDemoStep3();
  }, 6000);
}

function runDemoStep3() {
  if (!appState.demoRunning || appState.demoPaused) return;

  updateDemoStatus("Step 3: Inspecting Zimbabwe Legal Starter Kit (Form CR6 & Table A)", 3);
  switchTab("templates");
  window.scrollTo({ top: 120, behavior: "smooth" });

  appState.demoTimer = setTimeout(() => {
    if (!appState.demoRunning || appState.demoPaused) return;
    runDemoStep4();
  }, 5000);
}

function runDemoStep4() {
  if (!appState.demoRunning || appState.demoPaused) return;

  updateDemoStatus("Step 4: Founder Academy: Plain-English 30% ZIMRA Withholding Rule", 4);
  switchTab("academy");
  
  // Unfold Q2 (Withholding tax)
  const q2Item = document.getElementById("academy-ac-2");
  if (q2Item) {
    q2Item.classList.add("is-open");
    const body = q2Item.querySelector(".academy-body");
    if (body) body.style.display = "block";
    q2Item.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  appState.demoTimer = setTimeout(() => {
    if (!appState.demoRunning || appState.demoPaused) return;
    runDemoStep5();
  }, 6000);
}

function runDemoStep5() {
  if (!appState.demoRunning || appState.demoPaused) return;

  updateDemoStatus("Step 5: Official Readiness Report: 100% Fully Compliant Trade-Ready Entity!", 5);
  
  // Complete all items for 100% showcase!
  getAllActiveItems().forEach(it => {
    appState.checkedItems[it.id] = true;
  });

  saveStoredState();
  switchTab("report");
  updateReadinessCalculations();
  renderRoadmap();
  window.scrollTo({ top: 80, behavior: "smooth" });

  showToast("🎉 100% Compliance Achieved: Entity Trade Ready!", "success");

  appState.demoTimer = setTimeout(() => {
    stopDemo();
  }, 8000);
}

function togglePauseDemo() {
  appState.demoPaused = !appState.demoPaused;
  const btn = document.getElementById("btnPauseDemo");
  if (btn) btn.textContent = appState.demoPaused ? "▶️ Resume" : "⏸️ Pause";
  if (!appState.demoPaused) {
    showToast("Resuming Executive Demo...", "info");
    // Resume next step
    runDemoStep5();
  }
}

function fastForwardDemo() {
  if (appState.demoTimer) clearTimeout(appState.demoTimer);
  runDemoStep5();
}

function stopDemo() {
  appState.demoRunning = false;
  appState.demoPaused = false;
  if (appState.demoTimer) clearTimeout(appState.demoTimer);

  const bar = document.getElementById("demoControllerBar");
  if (bar) bar.style.display = "none";
}

function updateDemoStatus(text, step) {
  const statusEl = document.getElementById("demoStatusText");
  if (statusEl) statusEl.textContent = text;

  // Dots
  for (let i = 1; i <= 5; i++) {
    const dot = document.getElementById(`dot${i}`);
    if (dot) {
      dot.className = `demo-dot ${i === step ? 'active' : (i < step ? 'completed' : '')}`;
    }
  }
}

// =====================================================================
// 14. TAB SWITCHER & EVENT LISTENERS
// =====================================================================
function switchTab(tabId) {
  appState.activeTab = tabId;

  // Tabs buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });

  // Tab sections
  const sectionMap = {
    roadmap: "sectionRoadmap",
    checklist: "sectionChecklist",
    templates: "sectionTemplates",
    academy: "sectionAcademy",
    report: "sectionReport"
  };

  document.querySelectorAll(".tab-section").forEach(sec => {
    sec.classList.remove("active");
  });

  const activeSec = document.getElementById(sectionMap[tabId]);
  if (activeSec) {
    activeSec.classList.add("active");
  }

  // Refresh dynamic contents
  if (tabId === "report") {
    updateReadinessCalculations();
  } else if (tabId === "roadmap") {
    renderRoadmap();
  }
}

function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Stage Filter Pills
  document.querySelectorAll(".sfilter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".sfilter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      appState.activeStageFilter = pill.dataset.stage;
      renderChecklist();
    });
  });

  // Search Input
  const searchInput = document.getElementById("checklistSearchInput");
  const clearBtn = document.getElementById("btnClearSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value;
      if (clearBtn) clearBtn.style.display = e.target.value ? "block" : "none";
      renderChecklist();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      appState.searchQuery = "";
      clearBtn.style.display = "none";
      renderChecklist();
    });
  }

  // Report Actions
  const btnPrint = document.getElementById("btnPrintReport");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  const btnCopyReport = document.getElementById("btnCopyReportSummary");
  if (btnCopyReport) {
    btnCopyReport.addEventListener("click", () => {
      const summaryText = generateReportSummaryText();
      copyToClipboard(summaryText);
      showToast("Compliance Summary copied to clipboard!", "success");
    });
  }

  const btnReset = document.getElementById("btnResetAllData");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Reset all statutory checklist and vaulted documents? This cannot be undone.")) {
        appState.checkedItems = {};
        appState.vaultFiles = {};
        saveStoredState();
        renderRoadmap();
        renderChecklist();
        updateReadinessCalculations();
        showToast("All progress reset to clean state.", "info");
      }
    });
  }

  setupDemo();
}

function generateReportSummaryText() {
  const allItems = getAllActiveItems();
  const completed = allItems.filter(it => appState.checkedItems[it.id]).length;
  const total = allItems.length;
  const pct = Math.round((completed / total) * 100);
  const sec = SECTORS.find(s => s.id === appState.activeSectorId) || SECTORS[0];

  return `REPUBLIC OF ZIMBABWE - ENTREPRENEUR LAUNCHPAD READINESS REPORT
Generated: ${new Date().toLocaleDateString('en-GB')}
Compliance Score: ${pct}% (${completed}/${total} Milestones Cleared)
Active Sector: ${sec.name} (${sec.regulator})
Vaulted Documents: ${Object.keys(appState.vaultFiles).length}

STATUTORY GROUNDING:
- Companies & Other Business Entities Act [Chapter 24:31]
- S.I. 46 of 2020 (Forms CR2, CR5, CR6, CR16)
- Income Tax Act [Chapter 23:06] Section 80 (ITF 263 Clearance)
- Shop Licences Act [Chapter 14:17] (Form SL2 Municipal Licence)
- Cyber and Data Protection Act [Chapter 12:07] & S.I. 155 of 2024`;
}

// =====================================================================
// 15. STATUTORY DRAWER ACCORDION
// =====================================================================
function setupDrawer() {
  const btn = document.getElementById("drawerToggleBtn");
  const content = document.getElementById("drawerContent");
  if (!btn || !content) return;

  btn.addEventListener("click", () => {
    const isOpen = content.style.display !== "none";
    content.style.display = isOpen ? "none" : "block";
    btn.classList.toggle("is-open", !isOpen);
    btn.setAttribute("aria-expanded", !isOpen);
  });
}

// =====================================================================
// 16. TOAST NOTIFICATIONS HELPER
// =====================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut 0.25s ease forwards";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, 3500);
}

// Escape HTML helper
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", initApp);
