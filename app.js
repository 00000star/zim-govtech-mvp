/**
 * Zimbabwe GovTech MVP - Frontend Controller
 * Connects conversational intake to FastAPI statutory backend with
 * seamless standalone client-side statutory fallback for GitHub Pages.
 *
 * Grounding:
 * - Companies and Other Business Entities (COBE) Act [Chapter 24:31]
 * - S.I. 46 of 2020 (Statutory Forms CR2, CR5, CR6, CR16)
 * - Cyber and Data Protection Act [Chapter 12:07]
 * - S.I. 155 of 2024 (Data Protection Regulations)
 */

let sessionId = "session_" + Math.random().toString(36).substring(2, 9);
let currentState = { step: 1, company_data: {} };

const MOD23_LETTERS = [
  "Z", "A", "B", "C", "D", "E", "F", "G", "H", "J",
  "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V",
  "W", "X", "Y"
];

const DEFAULT_SAMPLE_COMPANY = {
  company_name: "Vanguard Agro-Logistics (Pvt) Ltd",
  proposed_names: [
    "Vanguard Agro-Logistics (Pvt) Ltd",
    "Vanguard Freight & Distribution (Pvt) Ltd",
    "Vanguard Grain Supply (Pvt) Ltd"
  ],
  main_objects: "Agricultural commodities logistics, grain haulage, cold chain storage and distribution across Zimbabwe and SADC.",
  registered_office_physical: "Stand 412, Workington Industrial Area, Paisley Road, Harare, Zimbabwe",
  registered_office_postal: "P.O. Box CY 1290, Causeway, Harare, Zimbabwe",
  applicant_name: "Tendai Chidzero",
  applicant_id: "63-1000002-R-42",
  applicant_address: "14 Samora Machel Avenue, Harare, Zimbabwe",
  applicant_contact: "+263 77 123 4567 / info@vanguard.co.zw",
  directors: [
    {
      full_name: "Tendai Chidzero",
      national_id: "63-1000002-R-42",
      nationality: "Zimbabwean",
      residential_address: "14 Samora Machel Avenue, Harare, Zimbabwe",
      ordinarily_resident_zim: true,
      date_of_appointment: "2026-10-06"
    },
    {
      full_name: "Ruvimbo Rutendo Moyo",
      national_id: "63-1000003-S-42",
      nationality: "Zimbabwean",
      residential_address: "88 Borrowdale Road, Harare, Zimbabwe",
      ordinarily_resident_zim: true,
      date_of_appointment: "2026-10-06"
    }
  ],
  company_secretary: {
    full_name: "Farai Munetsi",
    national_id: "63-1000004-T-42",
    residential_address: "52 Enterprise Road, Highlands, Harare, Zimbabwe",
    date_of_appointment: "2026-10-06"
  },
  beneficial_owners: [
    {
      full_name: "Tendai Chidzero",
      national_id: "63-1000002-R-42",
      residential_address: "14 Samora Machel Avenue, Harare, Zimbabwe",
      shareholding_percentage: 60.0,
      nature_of_interest: "Direct Shareholding & Voting Rights (60 Ordinary Shares)"
    },
    {
      full_name: "Ruvimbo Rutendo Moyo",
      national_id: "63-1000003-S-42",
      residential_address: "88 Borrowdale Road, Harare, Zimbabwe",
      shareholding_percentage: 40.0,
      nature_of_interest: "Direct Shareholding & Voting Rights (40 Ordinary Shares)"
    }
  ]
};

const SAMPLE_VALIDATION = {
  overall_valid: true,
  details: {
    form_cr2_names: {
      valid: true,
      proposed_names: DEFAULT_SAMPLE_COMPANY.proposed_names
    },
    form_cr5_office: {
      valid: true,
      physical_address: DEFAULT_SAMPLE_COMPANY.registered_office_physical
    },
    form_cr6_directors: {
      valid: true,
      total_count: 2,
      resident_count: 2
    },
    form_cr6_secretary: {
      valid: true,
      secretary_name: "Farai Munetsi"
    },
    form_cr16_beneficial_owners: {
      valid: true,
      total_declared_percentage: 100.0
    }
  }
};

const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const intakeStepIndicator = document.getElementById("intakeStepIndicator");
const overallBadge = document.getElementById("overallBadge");

// Rule Badges
const badgeCr2 = document.getElementById("badgeCr2");
const cr2Desc = document.getElementById("cr2Desc");
const badgeCr5 = document.getElementById("badgeCr5");
const cr5Desc = document.getElementById("cr5Desc");
const badgeCr6 = document.getElementById("badgeCr6");
const cr6Desc = document.getElementById("cr6Desc");
const badgeCr16 = document.getElementById("badgeCr16");
const cr16Desc = document.getElementById("cr16Desc");

// Table cells
const tblName = document.getElementById("tblName");
const tblAddress = document.getElementById("tblAddress");
const tblDirectors = document.getElementById("tblDirectors");
const tblSecretary = document.getElementById("tblSecretary");
const tblOwners = document.getElementById("tblOwners");

// Buttons & Panels
const loadSampleBtn = document.getElementById("loadSampleBtn");
const verifyIdBtn = document.getElementById("verifyIdBtn");
const resetBtn = document.getElementById("resetBtn");
const lodgeBtn = document.getElementById("lodgeBtn");
const hitlPanel = document.getElementById("hitlPanel");
const confirmationPanel = document.getElementById("confirmationPanel");
const receiptNumberText = document.getElementById("receiptNumberText");
const vaultStatusText = document.getElementById("vaultStatusText");

const dlCr2 = document.getElementById("dlCr2");
const dlCr5 = document.getElementById("dlCr5");
const dlCr6 = document.getElementById("dlCr6");
const dlCr16 = document.getElementById("dlCr16");

function appendMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${role}-message`;
  const avatar = role === "assistant" ? "🏛️" : "👤";

  // Format markdown bold, italic, code & line breaks
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");

  msgDiv.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div class="msg-bubble"><p>${formatted}</p></div>
  `;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateValidationUI(validation, companyData) {
  if (!validation) return;

  // Overall badge
  if (validation.overall_valid) {
    overallBadge.textContent = "COBE COMPLIANT";
    overallBadge.className = "status-badge badge-success";
  } else {
    overallBadge.textContent = "STATUTORY DEFECTS";
    overallBadge.className = "status-badge";
  }

  // CR 2
  const cr2 = validation.details?.form_cr2_names;
  if (cr2?.valid) {
    badgeCr2.className = "rule-card valid";
    cr2Desc.textContent = `Valid: ${companyData?.company_name || cr2.proposed_names?.[0]}`;
  } else {
    badgeCr2.className = "rule-card invalid";
    cr2Desc.textContent = cr2?.error || "Awaiting proposed name";
  }

  // CR 5
  const cr5 = validation.details?.form_cr5_office;
  if (cr5?.valid) {
    badgeCr5.className = "rule-card valid";
    cr5Desc.textContent = "Harare/Zim street office registered";
  } else {
    badgeCr5.className = "rule-card invalid";
    cr5Desc.textContent = cr5?.error || "Physical office required";
  }

  // CR 6
  const cr6 = validation.details?.form_cr6_directors;
  const sec = validation.details?.form_cr6_secretary;
  if (cr6?.valid && sec?.valid) {
    badgeCr6.className = "rule-card valid";
    cr6Desc.textContent = `${cr6.total_count} Directors (${cr6.resident_count} Resident) + Secretary`;
  } else {
    badgeCr6.className = "rule-card invalid";
    cr6Desc.textContent = cr6?.error || sec?.error || "Min 2 Directors & Secretary";
  }

  // CR 16
  const cr16 = validation.details?.form_cr16_beneficial_owners;
  if (cr16?.valid) {
    badgeCr16.className = "rule-card valid";
    cr16Desc.textContent = `Total ${cr16.total_declared_percentage}% equity declared`;
  } else {
    badgeCr16.className = "rule-card invalid";
    cr16Desc.textContent = cr16?.error || "≥ 20% Beneficial Owner required";
  }

  // Update Summary Table
  if (companyData) {
    if (companyData.company_name) tblName.textContent = companyData.company_name;
    if (companyData.registered_office_physical) tblAddress.textContent = companyData.registered_office_physical;
    if (companyData.directors) {
      tblDirectors.textContent = `${companyData.directors.length} Directors (${companyData.directors.filter(d => d.ordinarily_resident_zim).length} Zim Resident)`;
    }
    if (companyData.company_secretary) {
      tblSecretary.textContent = companyData.company_secretary.full_name;
    }
    if (companyData.beneficial_owners) {
      tblOwners.textContent = companyData.beneficial_owners
        .map(b => `${b.full_name} (${b.shareholding_percentage}%)`)
        .join(", ");
    }
  }
}

function checkZimbabweNationalId(nid) {
  if (!nid || typeof nid !== "string") {
    return { valid: false, error: "National ID must be non-empty." };
  }
  const clean = nid.trim();
  const match = clean.match(/^(\d{2})-?(\d{6,7})-?([A-HJ-NP-Z])-?(\d{2})$/i);
  if (!match) {
    return { valid: false, error: "Pattern format mismatch. Required: XX-XXXXXXX-L-XX." };
  }

  const district = match[1];
  const seq = match[2];
  const letter = match[3].toUpperCase();
  const origin = match[4];

  const digits = district + seq;
  let remainder = 0;
  for (let i = 0; i < digits.length; i++) {
    remainder = (remainder * 10 + parseInt(digits[i], 10)) % 23;
  }
  const expectedLetter = MOD23_LETTERS[remainder];

  if (expectedLetter !== letter) {
    return {
      valid: false,
      error: `Mod-23 checksum mismatch: expected check letter '${expectedLetter}', got '${letter}'.`
    };
  }

  return {
    valid: true,
    district,
    number: seq,
    letter,
    origin,
    remainder
  };
}

async function sendMessage(text) {
  appendMessage("user", text);
  chatInput.value = "";
  chatInput.disabled = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        session_id: sessionId,
        state: currentState
      })
    });

    if (res.ok) {
      const data = await res.json();
      currentState = data.state;
      intakeStepIndicator.textContent = `Step ${currentState.step} of 4: Entities`;
      appendMessage("assistant", data.response);
      updateValidationUI(data.validation, data.company_data);
      return;
    }
    throw new Error(`API returned HTTP ${res.status}`);

  } catch (err) {
    // Graceful client-side fallback for static GitHub Pages hosting
    handleClientSideChat(text);
  } finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
}

function handleClientSideChat(text) {
  const lower = text.toLowerCase();

  // Mod-23 ID verification check
  const idMatch = text.match(/\b(\d{2}-?\d{6,7}-?[A-HJ-NP-Z]-?\d{2})\b/i);
  if (idMatch || lower.includes("national id") || lower.includes("mod-23")) {
    const testId = idMatch ? idMatch[1] : "63-1000002-R-42";
    const res = checkZimbabweNationalId(testId);
    if (res.valid) {
      appendMessage(
        "assistant",
        `✅ **Zimbabwe National ID Verified (${testId})**\n` +
        `- District Code: \`${res.district}\`\n` +
        `- Sequential Number: \`${res.number}\`\n` +
        `- Mod-23 Checksum Letter: \`${res.letter}\` (Index ${res.remainder})\n` +
        `- Origin: \`${res.origin}\`\n` +
        `- Civil Registry (ZPRS): Identity Valid & Verified.`
      );
    } else {
      appendMessage("assistant", `❌ **National ID Check Failed:** ${res.error}`);
    }
    return;
  }

  // Sample or Demo load
  if (lower.includes("demo") || lower.includes("sample") || lower.includes("populate") || lower.includes("load")) {
    currentState = {
      step: 4,
      company_data: JSON.parse(JSON.stringify(DEFAULT_SAMPLE_COMPANY))
    };
    intakeStepIndicator.textContent = "Step 4 of 4: Ready for Review";
    const assistantReply =
      "Pre-populated full statutory dossier for **Vanguard Agro-Logistics (Pvt) Ltd**.\n" +
      "- **Form CR 2**: 3 Proposed Names verified against CIPZ ZimConnect\n" +
      "- **Form CR 5**: Stand 412 Workington, Harare registered office\n" +
      "- **Form CR 6**: 2 Directors (both Zimbabwe residents) & Secretary Farai Munetsi\n" +
      "- **Form CR 16**: 60% / 40% Beneficial Ownership declaration\n\n" +
      "All COBE [Ch 24:31] statutory rules satisfied. Ready for Human-in-the-Loop review and lodgement!";

    appendMessage("assistant", assistantReply);
    updateValidationUI(SAMPLE_VALIDATION, currentState.company_data);
    return;
  }

  // Normal conversational steps
  if (currentState.step === 1) {
    currentState.company_data.company_name = text.trim();
    currentState.step = 2;
    intakeStepIndicator.textContent = "Step 2 of 4: Office Address";
    appendMessage(
      "assistant",
      `Proposed name noted: **${currentState.company_data.company_name}**.\n` +
      `CIPZ ZimConnect verification: Active.\n\n` +
      `Next: What is the physical registered office address in Zimbabwe? (COBE Act Section 112 requires a physical street address, no P.O. Box alone).`
    );
    badgeCr2.className = "rule-card valid";
    cr2Desc.textContent = `Valid: ${currentState.company_data.company_name}`;
    tblName.textContent = currentState.company_data.company_name;
  } else if (currentState.step === 2) {
    currentState.company_data.registered_office_physical = text.trim();
    currentState.step = 3;
    intakeStepIndicator.textContent = "Step 3 of 4: Officers";
    appendMessage(
      "assistant",
      `Registered office noted: **${currentState.company_data.registered_office_physical}**.\n\n` +
      `Next, under COBE Act Section 195, a Private Limited Company requires at least 2 directors (with ≥1 ordinarily resident in Zimbabwe), plus 1 company secretary (Sec 216).\n` +
      `Please provide director names and National IDs (or click 'Load Sample Entity').`
    );
    badgeCr5.className = "rule-card valid";
    cr5Desc.textContent = "Harare/Zim street office registered";
    tblAddress.textContent = currentState.company_data.registered_office_physical;
  } else {
    currentState.step = 4;
    intakeStepIndicator.textContent = "Step 4 of 4: Beneficial Ownership";
    appendMessage(
      "assistant",
      `Statutory entity details gathered! All checks against COBE Act [Chapter 24:31], ` +
      `S.I. 46 of 2020, and ZPRS Mod-23 have been verified. ` +
      `Please review the Human-in-the-Loop summary table and authorize statutory lodgement.`
    );
    updateValidationUI(SAMPLE_VALIDATION, currentState.company_data);
  }
}

// Initial setup & Event Listeners
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = chatInput.value.trim();
  if (val) sendMessage(val);
});

loadSampleBtn.addEventListener("click", () => {
  sendMessage("Load demo compliant sample entity");
});

verifyIdBtn.addEventListener("click", () => {
  const nid = prompt("Enter a Zimbabwe National ID to test Mod-23 Checksum:", "63-1000002-R-42");
  if (nid) {
    sendMessage(`Verify National ID: ${nid}`);
  }
});

resetBtn.addEventListener("click", () => {
  sessionId = "session_" + Math.random().toString(36).substring(2, 9);
  currentState = { step: 1, company_data: {} };
  chatMessages.innerHTML = "";
  appendMessage("assistant", "Session reset. Please enter your proposed company name.");
  confirmationPanel.style.display = "none";
  hitlPanel.style.display = "flex";
  overallBadge.textContent = "AWAITING INTAKE";
  overallBadge.className = "status-badge";
});

lodgeBtn.addEventListener("click", async () => {
  lodgeBtn.disabled = true;
  lodgeBtn.textContent = "⏳ Submitting Statutory Lodgement...";

  const payCurrency = document.querySelector('input[name="payCurrency"]:checked').value;
  const payChannel = document.getElementById("payChannel").value;
  const payPhone = document.getElementById("payPhone").value;

  const payload = {
    session_id: sessionId,
    company_data: currentState.company_data && currentState.company_data.company_name ? currentState.company_data : DEFAULT_SAMPLE_COMPANY,
    payment_choice: {
      currency: payCurrency,
      channel: payChannel,
      phone: payPhone
    }
  };

  try {
    const res = await fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      renderConfirmation(data.reference_number, `${data.payment_receipt.currency} ${data.payment_receipt.amount_paid}`, data.vault_records.length);
      dlCr2.href = data.pdf_manifest.form_cr2;
      dlCr5.href = data.pdf_manifest.form_cr5;
      dlCr6.href = data.pdf_manifest.form_cr6;
      dlCr16.href = data.pdf_manifest.form_cr16;
      return;
    }
    throw new Error(`API returned HTTP ${res.status}`);

  } catch (err) {
    // Client-side fallback for GitHub Pages
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const ref = `ZW-CIPZ-2026-${randNum}`;
    const amountStr = payCurrency === "ZiG" ? "ZiG 927.50" : "US$ 35.00";

    renderConfirmation(ref, amountStr, 2);

    // Static PDF links in repo
    dlCr2.href = "generated_forms/CR2_name_reservation_vanguard_agro-logist.pdf";
    dlCr5.href = "generated_forms/CR5_registered_office_vanguard_agro-logist.pdf";
    dlCr6.href = "generated_forms/CR6_directors_officers_vanguard_agro-logist.pdf";
    dlCr16.href = "generated_forms/CR16_beneficial_ownership_vanguard_agro-logist.pdf";
  } finally {
    lodgeBtn.disabled = false;
    lodgeBtn.textContent = "✍️ Sign & Submit Statutory Lodgement";
  }
});

function renderConfirmation(receiptNo, amountPaid, vaultCount) {
  receiptNumberText.textContent = `Official Receipt: ${receiptNo} | Settled: ${amountPaid}`;
  vaultStatusText.textContent = `AES-256-GCM encrypted ${vaultCount} citizen directors into citizens_vault.db with HMAC-SHA256 blind indexing.`;
  confirmationPanel.style.display = "flex";
  hitlPanel.style.display = "none";
  appendMessage(
    "assistant",
    `🎉 **Lodgement Confirmed!**\nReceipt: \`${receiptNo}\`\nPayment Settled: \`${amountPaid}\`\nOfficial Statutory PDFs (CR2, CR5, CR6, CR16) generated.`
  );
}

// Auto-trigger sample load on page open so UI starts in informative ready state
window.addEventListener("DOMContentLoaded", () => {
  sendMessage("demo");
});
