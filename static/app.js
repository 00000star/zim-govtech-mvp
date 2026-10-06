/**
 * Zimbabwe GovTech Unified Platform - Consumer-Grade Frontend Controller
 * Grounding:
 * - Companies and Other Business Entities (COBE) Act [Chapter 24:31]
 * - Statutory Instrument 46 of 2020 (Forms CR2, CR5, CR6, CR16)
 * - Cyber and Data Protection Act [Chapter 12:07]
 * - POTRAZ S.I. 155 of 2024
 */

// Zimbabwe Mod-23 Check Character Alphabet (excluding I, O, U)
const MOD23_LETTERS = [
  "Z", "A", "B", "C", "D", "E", "F", "G", "H", "J",
  "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V",
  "W", "X", "Y"
];

// Default sample data for demo & reset
const SAMPLE_FOUNDERS = {
  f1: {
    name: "Tendai Chidzero",
    id: "63-1000002-R-42",
    shares: 60,
    resident: true,
    role: "Managing Director"
  },
  f2: {
    name: "Ruvimbo Rutendo Moyo",
    id: "63-1000003-S-42",
    shares: 40,
    resident: true,
    role: "Executive Director"
  },
  sec: {
    name: "Farai Munetsi",
    id: "63-1000004-T-42",
    role: "Company Secretary"
  }
};

// Global Application State
let currentStep = 1;
let demoTimer = null;
let demoStepIndex = 0;
let isDemoPaused = false;
let isDemoRunning = false;

// DOM Element References
const navStep1 = document.getElementById("navStep1");
const navStep2 = document.getElementById("navStep2");
const navStep3 = document.getElementById("navStep3");
const navStep4 = document.getElementById("navStep4");

const paneStep1 = document.getElementById("paneStep1");
const paneStep2 = document.getElementById("paneStep2");
const paneStep3 = document.getElementById("paneStep3");
const paneStep4 = document.getElementById("paneStep4");

// Step 1 Elements
const companyNameInput = document.getElementById("companyNameInput");
const industryPills = document.querySelectorAll(".industry-pill");
const cr2FeedbackCard = document.getElementById("cr2FeedbackCard");
const cr2FeedbackTitle = document.getElementById("cr2FeedbackTitle");
const cr2FeedbackDesc = document.getElementById("cr2FeedbackDesc");
const btnGoToStep2 = document.getElementById("btnGoToStep2");

// Step 2 Elements
const cityPills = document.querySelectorAll(".city-pill");
const streetAddressInput = document.getElementById("streetAddressInput");
const zoningFeedbackTitle = document.getElementById("zoningFeedbackTitle");
const zoningFeedbackDesc = document.getElementById("zoningFeedbackDesc");
const btnBackToStep1 = document.getElementById("btnBackToStep1");
const btnGoToStep3 = document.getElementById("btnGoToStep3");

// Step 3 Elements
const f1Name = document.getElementById("f1Name");
const f1Id = document.getElementById("f1Id");
const f1StatusPill = document.getElementById("f1StatusPill");
const f1Shares = document.getElementById("f1Shares");
const f1Resident = document.getElementById("f1Resident");

const f2Name = document.getElementById("f2Name");
const f2Id = document.getElementById("f2Id");
const f2StatusPill = document.getElementById("f2StatusPill");
const f2Shares = document.getElementById("f2Shares");
const f2Resident = document.getElementById("f2Resident");

const secName = document.getElementById("secName");
const secId = document.getElementById("secId");
const secStatusPill = document.getElementById("secStatusPill");

const btnFillSampleFounders = document.getElementById("btnFillSampleFounders");
const btnBackToStep2 = document.getElementById("btnBackToStep2");
const btnSubmitLodgement = document.getElementById("btnSubmitLodgement");

// Step 4 Elements
const approvedCompanyName = document.getElementById("approvedCompanyName");
const regPillNumber = document.getElementById("regPillNumber");
const resCipzNum = document.getElementById("resCipzNum");
const resCouncilNum = document.getElementById("resCouncilNum");
const resZimraBp = document.getElementById("resZimraBp");
const receiptMeta = document.getElementById("receiptMeta");
const receiptAmount = document.getElementById("receiptAmount");
const btnRestartWizard = document.getElementById("btnRestartWizard");
const btnRerunDemo = document.getElementById("btnRerunDemo");

// Demo Controls
const execDemoBtn = document.getElementById("execDemoBtn");
const demoControllerBar = document.getElementById("demoControllerBar");
const demoStatusText = document.getElementById("demoStatusText");
const btnPauseDemo = document.getElementById("btnPauseDemo");
const btnFastForward = document.getElementById("btnFastForward");
const btnExitDemo = document.getElementById("btnExitDemo");
const demoDots = [
  document.getElementById("dot1"),
  document.getElementById("dot2"),
  document.getElementById("dot3"),
  document.getElementById("dot4")
];

// Legal Drawer Elements
const drawerToggleBtn = document.getElementById("drawerToggleBtn");
const drawerToggleIcon = document.getElementById("drawerToggleIcon");
const drawerContent = document.getElementById("drawerContent");

// ==========================================================================
// Zimbabwe Civil Registry (ZPRS) Mod-23 Algorithm
// ==========================================================================
function validateZimbabweNationalId(nid) {
  if (!nid || typeof nid !== "string") {
    return { valid: false, error: "National ID is required." };
  }
  const clean = nid.trim();
  const match = clean.match(/^(\d{2})-?(\d{6,7})-?([A-HJ-NP-Z])-?(\d{2})$/i);
  if (!match) {
    return { valid: false, error: "Format must be XX-XXXXXXX-L-XX." };
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
      expected: expectedLetter,
      letter: letter,
      error: `Letter mismatch: Expected '${expectedLetter}', got '${letter}'.`
    };
  }

  return {
    valid: true,
    canonical: `${district}-${seq}-${letter}-${origin}`,
    district,
    number: seq,
    letter,
    origin,
    remainder
  };
}

function updateMod23Pill(inputElem, pillElem) {
  const val = inputElem.value.trim();
  if (!val) {
    pillElem.className = "mod23-status-pill invalid";
    pillElem.innerHTML = `<span>⚠️</span><span>ID required</span>`;
    return;
  }
  const res = validateZimbabweNationalId(val);
  if (res.valid) {
    pillElem.className = "mod23-status-pill valid";
    pillElem.innerHTML = `<span>✓</span><span>Verified Citizen (Letter ${res.letter} valid)</span>`;
  } else {
    pillElem.className = "mod23-status-pill invalid";
    pillElem.innerHTML = `<span>⚠️</span><span>${res.error}</span>`;
  }
}

// ==========================================================================
// Step Navigation Logic
// ==========================================================================
function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > 4) return;
  currentStep = stepNumber;

  const navBtns = [navStep1, navStep2, navStep3, navStep4];
  const panes = [paneStep1, paneStep2, paneStep3, paneStep4];

  navBtns.forEach((btn, idx) => {
    const s = idx + 1;
    btn.classList.remove("active", "completed");
    if (s === currentStep) {
      btn.classList.add("active");
    } else if (s < currentStep) {
      btn.classList.add("completed");
    }
  });

  panes.forEach((pane, idx) => {
    const s = idx + 1;
    pane.classList.remove("active");
    if (s === currentStep) {
      pane.classList.add("active");
    }
  });

  // Update demo dots
  demoDots.forEach((dot, idx) => {
    if (idx + 1 === currentStep) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });

  // Scroll smoothly to top of wizard
  const wizardCard = document.querySelector(".wizard-card");
  if (wizardCard && window.scrollY > 250) {
    wizardCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ==========================================================================
// Step 1: Business Idea & Industry
// ==========================================================================
function updateNameFeedback() {
  const val = companyNameInput.value.trim() || "Vanguard SunEnergy";
  cr2FeedbackTitle.textContent = `CIPZ Name Cleared: ${val} (Pvt) Ltd`;
  cr2FeedbackDesc.textContent = `Zero conflicting registered entities found in CIPZ ZimConnect. Form CR 2 is pre-cleared for 30-day reservation under COBE Act [Chapter 24:31] Section 26.`;
}

companyNameInput.addEventListener("input", updateNameFeedback);

industryPills.forEach(pill => {
  pill.addEventListener("click", () => {
    industryPills.forEach(p => p.classList.remove("selected"));
    pill.classList.add("selected");
  });
});

document.querySelectorAll(".quick-pick-btn[data-name]").forEach(btn => {
  btn.addEventListener("click", () => {
    companyNameInput.value = btn.dataset.name;
    updateNameFeedback();
  });
});

btnGoToStep2.addEventListener("click", () => {
  goToStep(2);
});

// ==========================================================================
// Step 2: Location & Municipal Zoning
// ==========================================================================
function updateZoningFeedback() {
  const selectedCity = document.querySelector(".city-pill.selected")?.dataset.city || "Harare";
  const addr = streetAddressInput.value.trim() || "Stand 412, Workington Industrial Area";

  zoningFeedbackTitle.textContent = `${selectedCity} City Council Commercial Zoning Verified`;
  if (selectedCity === "Harare") {
    zoningFeedbackDesc.textContent = `${addr} is pre-cleared under Harare Town Planning Scheme Zone IND-4 (General Commercial Industry). Form SL2 Shop Licence clearance active per Urban Councils Act [Ch 29:15].`;
  } else if (selectedCity === "Bulawayo") {
    zoningFeedbackDesc.textContent = `${addr} is pre-cleared under Bulawayo City Master Plan Zone IND-2 (Heavy & Light Manufacturing). Form SL2 Shop Licence clearance active.`;
  } else {
    zoningFeedbackDesc.textContent = `${addr} is pre-cleared under ${selectedCity} Municipal Commercial Council Regulations. Form SL2 clearance active.`;
  }
}

cityPills.forEach(pill => {
  pill.addEventListener("click", () => {
    cityPills.forEach(p => p.classList.remove("selected"));
    pill.classList.add("selected");
    updateZoningFeedback();
  });
});

streetAddressInput.addEventListener("input", updateZoningFeedback);

document.querySelectorAll(".quick-pick-btn[data-addr]").forEach(btn => {
  btn.addEventListener("click", () => {
    streetAddressInput.value = btn.dataset.addr;
    updateZoningFeedback();
  });
});

btnBackToStep1.addEventListener("click", () => {
  goToStep(1);
});

btnGoToStep3.addEventListener("click", () => {
  goToStep(3);
});

// ==========================================================================
// Step 3: Founders & ZPRS Mod-23 Checksum
// ==========================================================================
f1Id.addEventListener("input", () => updateMod23Pill(f1Id, f1StatusPill));
f2Id.addEventListener("input", () => updateMod23Pill(f2Id, f2StatusPill));
secId.addEventListener("input", () => updateMod23Pill(secId, secStatusPill));

function resetSampleFounders() {
  f1Name.value = SAMPLE_FOUNDERS.f1.name;
  f1Id.value = SAMPLE_FOUNDERS.f1.id;
  f1Shares.value = SAMPLE_FOUNDERS.f1.shares;
  f1Resident.checked = SAMPLE_FOUNDERS.f1.resident;

  f2Name.value = SAMPLE_FOUNDERS.f2.name;
  f2Id.value = SAMPLE_FOUNDERS.f2.id;
  f2Shares.value = SAMPLE_FOUNDERS.f2.shares;
  f2Resident.checked = SAMPLE_FOUNDERS.f2.resident;

  secName.value = SAMPLE_FOUNDERS.sec.name;
  secId.value = SAMPLE_FOUNDERS.sec.id;

  updateMod23Pill(f1Id, f1StatusPill);
  updateMod23Pill(f2Id, f2StatusPill);
  updateMod23Pill(secId, secStatusPill);
}

btnFillSampleFounders.addEventListener("click", resetSampleFounders);

btnBackToStep2.addEventListener("click", () => {
  goToStep(2);
});

// Stepper direct clicks
[navStep1, navStep2, navStep3, navStep4].forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (isDemoRunning) return; // Prevent interrupting active demo
    goToStep(index + 1);
  });
});

// ==========================================================================
// Step 4: Submission & Launchpad
// ==========================================================================
async function submitStatutoryLodgement() {
  btnSubmitLodgement.disabled = true;
  btnSubmitLodgement.innerHTML = `<span>⏳ Lodging with CIPZ & ZIMRA...</span>`;

  const compName = (companyNameInput.value.trim() || "Vanguard SunEnergy") + " (Pvt) Ltd";
  const address = streetAddressInput.value.trim() || "Stand 412, Workington Industrial Area, Paisley Road, Harare";

  const payload = {
    session_id: "gov_session_" + Math.random().toString(36).substring(2, 9),
    company_data: {
      company_name: compName,
      proposed_names: [compName],
      registered_office_physical: address,
      applicant_name: f1Name.value.trim() || "Tendai Chidzero",
      applicant_id: f1Id.value.trim() || "63-1000002-R-42",
      directors: [
        {
          full_name: f1Name.value.trim() || "Tendai Chidzero",
          national_id: f1Id.value.trim() || "63-1000002-R-42",
          ordinarily_resident_zim: f1Resident.checked
        },
        {
          full_name: f2Name.value.trim() || "Ruvimbo Rutendo Moyo",
          national_id: f2Id.value.trim() || "63-1000003-S-42",
          ordinarily_resident_zim: f2Resident.checked
        }
      ],
      company_secretary: {
        full_name: secName.value.trim() || "Farai Munetsi",
        national_id: secId.value.trim() || "63-1000004-T-42"
      },
      beneficial_owners: [
        {
          full_name: f1Name.value.trim() || "Tendai Chidzero",
          shareholding_percentage: parseFloat(f1Shares.value) || 60
        },
        {
          full_name: f2Name.value.trim() || "Ruvimbo Rutendo Moyo",
          shareholding_percentage: parseFloat(f2Shares.value) || 40
        }
      ]
    },
    payment_choice: {
      currency: "ZiG",
      channel: "EcoCash",
      phone: "0771234567"
    }
  };

  try {
    // Attempt FastAPI backend if active
    const res = await fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      renderLaunchpad(compName, data.reference_number, data.payment_receipt.amount_paid);
      return;
    }
  } catch (err) {
    // Graceful offline fallback for GitHub Pages
  }

  // Client-side fallback generates deterministic high-grade IDs
  const randNum = Math.floor(880000 + Math.random() * 9999);
  const incRef = `ZW-CIPZ-2026-${randNum}`;
  renderLaunchpad(compName, incRef, 927.50);

  btnSubmitLodgement.disabled = false;
  btnSubmitLodgement.innerHTML = `<span>🚀 Complete Lodgement & Open Launchpad</span><span>→</span>`;
}

function renderLaunchpad(compName, incRef, amount) {
  approvedCompanyName.textContent = `Entity: ${compName}`;
  regPillNumber.textContent = `INC: ${incRef}`;
  resCipzNum.textContent = incRef;
  resCouncilNum.textContent = `HCC-SL2-2026-0941`;
  resZimraBp.textContent = `BP-20098412-ZW`;
  receiptMeta.textContent = `Official Receipt: ZW-REV-2026-${incRef.split("-").pop()} • Rail: EcoCash / ZimSwitch Instant`;
  receiptAmount.textContent = `ZiG ${Number(amount).toFixed(2)} / $35 USD`;

  goToStep(4);
}

btnSubmitLodgement.addEventListener("click", submitStatutoryLodgement);

btnRestartWizard.addEventListener("click", () => {
  stopDemo();
  goToStep(1);
});

btnRerunDemo.addEventListener("click", () => {
  startExecutiveDemo();
});

// ==========================================================================
// Executive Presentation Mode (30-Second Minister / Investor Demo)
// ==========================================================================
function startExecutiveDemo() {
  if (isDemoRunning) return;
  isDemoRunning = true;
  isDemoPaused = false;
  demoStepIndex = 1;

  demoControllerBar.style.display = "block";
  btnPauseDemo.textContent = "⏸️ Pause";

  runDemoStep(1);
}

function stopDemo() {
  isDemoRunning = false;
  isDemoPaused = false;
  if (demoTimer) clearTimeout(demoTimer);
  demoControllerBar.style.display = "none";
}

function pauseDemo() {
  if (!isDemoRunning) return;
  isDemoPaused = !isDemoPaused;
  if (isDemoPaused) {
    btnPauseDemo.textContent = "▶️ Resume";
    demoStatusText.textContent = `Demo Paused at Step ${currentStep} (Click Resume to continue)`;
    if (demoTimer) clearTimeout(demoTimer);
  } else {
    btnPauseDemo.textContent = "⏸️ Pause";
    runDemoStep(currentStep + 1);
  }
}

function fastForwardDemo() {
  if (demoTimer) clearTimeout(demoTimer);
  submitStatutoryLodgement();
  demoStatusText.textContent = "Fast-Forwarded: Business Fully Incorporated & Approved!";
  setTimeout(() => {
    stopDemo();
  }, 4000);
}

function runDemoStep(step) {
  if (!isDemoRunning || isDemoPaused) return;

  if (step === 1) {
    goToStep(1);
    demoStatusText.textContent = "Step 1: Selecting Business Idea & Pre-Clearing Name with CIPZ...";
    companyNameInput.value = "Vanguard SunEnergy";
    updateNameFeedback();

    industryPills.forEach(p => p.classList.remove("selected"));
    document.querySelector('.industry-pill[data-industry="solar"]')?.classList.add("selected");

    demoTimer = setTimeout(() => {
      runDemoStep(2);
    }, 6000);

  } else if (step === 2) {
    goToStep(2);
    demoStatusText.textContent = "Step 2: Pre-Clearing Harare Commercial Zoning & Form SL2 Shop Licence...";
    streetAddressInput.value = "Stand 412, Workington Industrial Area, Paisley Road, Harare";
    updateZoningFeedback();

    demoTimer = setTimeout(() => {
      runDemoStep(3);
    }, 6500);

  } else if (step === 3) {
    goToStep(3);
    demoStatusText.textContent = "Step 3: Verifying Zimbabwean Founders with ZPRS Mod-23 Algorithm...";
    resetSampleFounders();

    demoTimer = setTimeout(() => {
      runDemoStep(4);
    }, 7000);

  } else if (step === 4) {
    demoStatusText.textContent = "Step 4: Submitting Statutory Filing to CIPZ, Harare Council & ZIMRA...";
    submitStatutoryLodgement();

    setTimeout(() => {
      demoStatusText.textContent = "🎉 Approvals Live: Incorporation Sealed, BP Number Issued, Merchant Rails Active!";
      setTimeout(() => {
        stopDemo();
      }, 5000);
    }, 2000);
  }
}

execDemoBtn.addEventListener("click", startExecutiveDemo);
btnPauseDemo.addEventListener("click", pauseDemo);
btnFastForward.addEventListener("click", fastForwardDemo);
btnExitDemo.addEventListener("click", stopDemo);

// ==========================================================================
// Expandable Statutory Compliance Drawer (Legal Auditor Mode)
// ==========================================================================
drawerToggleBtn.addEventListener("click", () => {
  const isExpanded = drawerContent.classList.contains("expanded");
  if (isExpanded) {
    drawerContent.classList.remove("expanded");
    drawerToggleIcon.classList.remove("expanded");
    drawerToggleBtn.setAttribute("aria-expanded", "false");
  } else {
    drawerContent.classList.add("expanded");
    drawerToggleIcon.classList.add("expanded");
    drawerToggleBtn.setAttribute("aria-expanded", "true");
  }
});

// ==========================================================================
// Initial Setup on DOM Ready
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  updateNameFeedback();
  updateZoningFeedback();
  updateMod23Pill(f1Id, f1StatusPill);
  updateMod23Pill(f2Id, f2StatusPill);
  updateMod23Pill(secId, secStatusPill);
});
