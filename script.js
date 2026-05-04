/* ================================================================
   SEVEN RAYS TRAVEL — V3 SCRIPT
   OpenAI AI · Live Currency · Translation Fix · Pricing Breakdown
   ================================================================ */
'use strict';

/* ================================================================
   THEME
   ================================================================ */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const curr = document.documentElement.getAttribute('data-theme');
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('sr-theme', next); } catch(e) {}
});

/* ================================================================
   NAVBAR
   ================================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

/* ================================================================
   HERO SLIDESHOW
   ================================================================ */
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hdot');
let currentHeroSlide = 0;
let heroInterval = null;

function goToHeroSlide(idx) {
  heroSlides[currentHeroSlide].classList.remove('active');
  heroDots[currentHeroSlide].classList.remove('active');
  currentHeroSlide = (idx + heroSlides.length) % heroSlides.length;
  heroSlides[currentHeroSlide].classList.add('active');
  heroDots[currentHeroSlide].classList.add('active');
}

function startHeroSlideshow() {
  clearInterval(heroInterval);
  heroInterval = setInterval(() => goToHeroSlide(currentHeroSlide + 1), 5500);
}

heroDots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToHeroSlide(parseInt(dot.dataset.idx));
    startHeroSlideshow();
  });
});

startHeroSlideshow();

/* Hero Parallax */
window.addEventListener('scroll', () => {
  const slidesEl = document.getElementById('heroSlides');
  if (slidesEl && window.scrollY < window.innerHeight) {
    slidesEl.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  }
}, { passive: true });

/* ================================================================
   SCROLL ANIMATIONS
   ================================================================ */
const scrollObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animate-in');
      scrollObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => scrollObs.observe(el));

/* ================================================================
   TOAST NOTIFICATION SYSTEM
   ================================================================ */
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', info: '💡', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '💬'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ================================================================
   LANGUAGE — INSTANT i18n SYSTEM (V10)
   Zero external deps. Translates DOM immediately via data-i18n attrs.
   ================================================================ */
let currentLang = 'en';
let _i18nOriginals = null; // cache of original English strings

const langBtn = document.getElementById('langBtn');
const langPicker = document.getElementById('langPicker');

langBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  langPicker.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!langPicker.contains(e.target)) langPicker.classList.remove('open');
});

document.querySelectorAll('.lang-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const lang = opt.dataset.lang;
    if (lang === currentLang) { langPicker.classList.remove('open'); return; }
    currentLang = lang;
    document.querySelectorAll('.lang-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    langPicker.classList.remove('open');
    applyLanguage(lang);
  });
});

// Cache all original English innerHTML values on first call
function cacheOriginals() {
  if (_i18nOriginals) return;
  _i18nOriginals = {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    _i18nOriginals[el.dataset.i18n + '__' + Array.from(document.querySelectorAll('[data-i18n]')).indexOf(el)] = el.innerHTML;
  });
  // Use a simpler key: index-based
  _i18nOriginals = {};
  document.querySelectorAll('[data-i18n]').forEach((el, idx) => {
    _i18nOriginals[idx] = { key: el.dataset.i18n, original: el.innerHTML };
  });
}

// Apply translations from SR_TRANSLATIONS dictionary to all [data-i18n] elements
function applyTranslations(lang) {
  const dict = (window.SR_TRANSLATIONS || {})[lang] || (window.SR_TRANSLATIONS || {})['en'];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });
}

// Spinner on globe icon while translating
function setLangLoading(on) {
  if (langBtn) langBtn.classList.toggle('lang-loading', on);
}

function applyLanguage(lang) {
  // RTL support
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);

  // Persist
  try { localStorage.setItem('sr-lang', lang); } catch(e) {}

  // Instant swap — no network, no delay
  setLangLoading(true);
  cacheOriginals();
  applyTranslations(lang);
  setLangLoading(false);

  showToast('Language updated ✓', 'success', 2000);
}

// On page load — protect prices and restore saved language
(function detectLangOnLoad() {
  // Protect numbers/currency from any future translation system
  document.querySelectorAll('.pkg-price, .sum-price-val, .mpb-price, .ao-price, .budget-tier, .room-price, .dest-opt-tag, .dest-tag, [data-price]').forEach(el => {
    el.classList.add('notranslate');
  });

  // Cache originals immediately so we have them for restore
  cacheOriginals();

  let savedLang = 'en';
  try { savedLang = localStorage.getItem('sr-lang') || 'en'; } catch(e) {}

  if (savedLang !== 'en') {
    currentLang = savedLang;
    document.querySelectorAll('.lang-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === savedLang);
    });
    // Apply instantly — translations.js already loaded synchronously
    applyTranslations(savedLang);
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
  }

  // Restore saved currency
  let savedCurrency = 'INR';
  try { savedCurrency = localStorage.getItem('sr-currency') || 'INR'; } catch(e) {}
  if (savedCurrency !== 'INR') {
    const sel = document.getElementById('currencySelect');
    if (sel) sel.value = savedCurrency;
    // Defer until exchange rates are loaded
    setTimeout(() => window.changeCurrency(savedCurrency), 500);
  }
})();


/* ================================================================
   CURRENCY CONVERSION SYSTEM
   ================================================================ */
let exchangeRates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044 };
let currentCurrency = 'INR';

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
const CURRENCY_LOCALES = { INR: 'en-IN', USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB', AED: 'ar-AE' };

async function fetchExchangeRates() {
  try {
    const cached = localStorage.getItem('sr-rates');
    const cachedTime = parseInt(localStorage.getItem('sr-rates-time') || '0');
    if (cached && (Date.now() - cachedTime < 3600000)) {
      exchangeRates = { ...exchangeRates, ...JSON.parse(cached) };
      return;
    }
  } catch(e) {}

  try {
    const resp = await fetch('https://open.er-api.com/v6/latest/INR', { signal: AbortSignal.timeout(5000) });
    const data = await resp.json();
    if (data.result === 'success' && data.rates) {
      exchangeRates = { INR: 1, ...data.rates };
      try {
        localStorage.setItem('sr-rates', JSON.stringify(data.rates));
        localStorage.setItem('sr-rates-time', Date.now().toString());
      } catch(e) {}
    }
  } catch(e) {
    // Silently use fallback rates — no error shown to user
    console.warn('Currency API unavailable. Using fallback rates.');
  }
}

function convertFromINR(inrAmount) {
  if (!inrAmount || currentCurrency === 'INR') return inrAmount;
  return inrAmount * (exchangeRates[currentCurrency] || 1);
}

function formatCurrency(inrAmount) {
  if (!inrAmount || inrAmount === 0) return CURRENCY_SYMBOLS[currentCurrency] + '0';
  const converted = convertFromINR(inrAmount);
  const sym = CURRENCY_SYMBOLS[currentCurrency] || '₹';
  try {
    if (currentCurrency === 'INR') {
      return '₹' + Math.round(converted).toLocaleString('en-IN');
    }
    return sym + Math.round(converted).toLocaleString('en-US');
  } catch(e) {
    return sym + Math.round(converted);
  }
}

window.changeCurrency = function(newCurrency) {
  currentCurrency = newCurrency;
  try { localStorage.setItem('sr-currency', newCurrency); } catch(e) {}

  // 1. Update all static package card prices (data-price-inr)
  document.querySelectorAll('[data-price-inr]').forEach(el => {
    const baseINR = parseInt(el.dataset.priceInr, 10);
    if (!baseINR) return;
    const unit = el.querySelector('small');
    const unitHTML = unit ? unit.outerHTML : '';
    // Strip the small tag text before setting new innerHTML
    el.innerHTML = formatCurrency(baseINR) + unitHTML;
  });

  // 2. Update builder price chips (accommodation, activities, transport, addons)
  updateBuilderPriceChips();

  // 3. Update builder breakdown sidebar
  recalcPrice();

  showToast(`Prices now shown in ${newCurrency}`, 'info', 2000);
};

/* Update all visible price chip labels in the builder to current currency */
function updateBuilderPriceChips() {
  // Accommodation price ranges (these are descriptive text — skip conversion, purely INR-labelled)
  // Activity chips: .chip-price elements correspond to their input's data-price
  document.querySelectorAll('.activity-chip input[data-price]').forEach(inp => {
    const priceEl = inp.closest('.activity-chip')?.querySelector('.chip-price');
    if (!priceEl) return;
    const baseINR = parseInt(inp.dataset.price, 10);
    priceEl.textContent = '+' + formatCurrency(baseINR);
  });

  // Transport cards: .trans-price
  document.querySelectorAll('.transport-card input[data-price]').forEach(inp => {
    const priceEl = inp.closest('.transport-card')?.querySelector('.trans-price');
    if (!priceEl) return;
    const baseINR = parseInt(inp.dataset.price, 10);
    const label = inp.dataset.label || '';
    const perPerson = label.includes('light') ? '/person' : '/person';
    priceEl.textContent = '+' + formatCurrency(baseINR) + perPerson;
  });

  // Addon chips: .ao-price
  document.querySelectorAll('.addon-chip input[data-price]').forEach(inp => {
    const priceEl = inp.closest('.addon-chip')?.querySelector('.ao-price');
    if (!priceEl) return;
    const baseINR = parseInt(inp.dataset.price, 10);
    priceEl.textContent = formatCurrency(baseINR);
  });
}

/* ================================================================
   PACKAGE MODALS
   ================================================================ */
const packageData = {
  honeymoon: {
    title: 'Honeymoon Escape', duration: '5 Days / 4 Nights · Andaman',
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1000&q=85',
    highlights: ['Radhanagar Beach sunset walk','Candlelight dinner on the shore','Couple\'s spa session','Snorkeling at Elephant Beach','Cellular Jail light & sound show','Ross Island heritage boat tour','Premium couple accommodation','All transfers included'],
    itinerary: ['Day 1: Arrival → Cellular Jail → Light Show','Day 2: Port Blair → Havelock ferry → Beach','Day 3: Elephant Beach snorkeling → Spa','Day 4: Radhanagar Beach sunrise','Day 5: Return Port Blair → Departure'],
    price: 45000, unit: 'per couple',
  },
  luxury: {
    title: 'Luxury Island Retreat', duration: '7 Days / 6 Nights · Andaman + Goa',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85',
    highlights: ['Private villa with ocean view','PADI scuba diving','Private speedboat island hop','7-course beachside dinner','North Goa nightlife experience','Private guide all excursions','5-star luxury resort in Goa','Sunset catamaran cruise'],
    itinerary: ['Day 1-3: Andaman (Port Blair + Havelock + Neil)','Day 4: Fly Andaman → Goa (Business class)','Day 5-6: Goa — beaches, curated dining','Day 7: Luxury spa → Departure'],
    price: 120000, unit: 'per couple',
  },
  adventure: {
    title: 'Adventure Explorer', duration: '6 Days / 5 Nights · Andaman',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1000&q=85',
    highlights: ['PADI Open Water scuba certification','Sea walk at North Bay Island','Snorkeling at 3 reef locations','Island hopping × 3','Jet skiing, parasailing, banana boat','Andaman rainforest trek','Bioluminescent beach night walk','Glass-bottom boat ride'],
    itinerary: ['Day 1: Arrival → North Bay snorkeling','Day 2: Scuba intro training','Day 3: Havelock → Open water dive','Day 4: Neil Island + Jolly Buoy','Day 5: Water sports + Biolum. beach','Day 6: Departure'],
    price: 35000, unit: 'per person',
  },
  budget: {
    title: 'Budget Smart Trip', duration: '4 Days / 3 Nights · Goa',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85',
    highlights: ['North Goa: Baga, Calangute, Anjuna','South Goa: Benaulim, Colva, Palolem','Old Goa heritage + spice plantation','Goa dinner cruise','Budget hotel + breakfast','All AC transfers','Flea market tour','Dudhsagar waterfall day trip'],
    itinerary: ['Day 1: Arrival → North Goa beaches','Day 2: Old Goa + spice plantation','Day 3: South Goa + Palolem sunset','Day 4: Dudhsagar → Departure'],
    price: 15000, unit: 'per person',
  },
  family: {
    title: 'Family Vacation Package', duration: '6 Days / 5 Nights · Andaman',
    image: 'https://images.unsplash.com/photo-1559628233-100c798642d9?auto=format&fit=crop&w=1000&q=85',
    highlights: ['Glass-bottom boat ride at North Bay','Cellular Jail historical tour + light show','Havelock family beach day','Snorkeling for kids','Andaman Water Sports Park','Ross & Viper Island tour','4-star resort with pool','All transfers + guide'],
    itinerary: ['Day 1: Arrival → Corbyn\'s Cove → Marine Museum','Day 2: North Bay + Cellular Jail show','Day 3: Havelock ferry → Radhanagar','Day 4: Elephant Beach + water sports','Day 5: Ross & Viper + shopping','Day 6: Breakfast → Departure'],
    price: 65000, unit: 'per family (2A+2C)',
  },
};

window.openPackageModal = function(key) {
  const pkg = packageData[key];
  if (!pkg) return;
  const priceDisplay = formatCurrency(pkg.price);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img" style="background-image:url('${pkg.image}')"></div>
    <div class="modal-body">
      <h3>${pkg.title}</h3>
      <p class="modal-duration">📅 ${pkg.duration}</p>
      <div class="modal-section-title">What's Included</div>
      <ul class="modal-highlights">${pkg.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>
      <div class="modal-section-title">Itinerary</div>
      <ul class="modal-highlights">${pkg.itinerary.map(i=>`<li>${i}</li>`).join('')}</ul>
      <div class="modal-price-row">
        <div>
          <div class="modal-price-note">Starting from</div>
          <div class="modal-price-val">${priceDisplay} <small>${pkg.unit}</small></div>
        </div>
        <a href="#builder" class="btn btn-primary" onclick="closePackageModal()">Customize This Trip</a>
      </div>
    </div>`;
  document.getElementById('packageModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closePackageModal = function(e) {
  if (e && e.target !== document.getElementById('packageModal')) return;
  document.getElementById('packageModal').classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    window.closePackageModal();
    closeLightbox();
    closeExitPopup();
    closeAIPlanner();
  }
});

/* ================================================================
   BUILDER V3 — STATE OBJECT
   ================================================================ */
let currentStep = 1;
const TOTAL_STEPS = 8;

const state = {
  destination: null,
  nights: 5,
  checkIn: null, checkOut: null,
  adults: 2, children: 0, infants: 0,
  budget: 75000,
  accommodation: null, accommodationPrice: 0,
  activities: [],  // [{value, label, price}]
  transport: null, transportLabel: null, transportPrice: 0,
  addons: [],      // [{value, label, price}]
  customRequest: '',
};

/* Step nav */
function updateProgress() {
  const pct = (currentStep / TOTAL_STEPS) * 100;
  const fill = document.getElementById('progressFill');
  if (fill) fill.style.width = pct + '%';

  document.querySelectorAll('.prog-step').forEach((step, i) => {
    const num = i + 1;
    const circle = step.querySelector('.step-circle');
    step.classList.remove('active', 'completed');
    if (num === currentStep) { step.classList.add('active'); circle.textContent = num; }
    else if (num < currentStep) { step.classList.add('completed'); circle.textContent = '✓'; }
    else { circle.textContent = num; }
  });

  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.style.display = currentStep === 1 ? 'none' : '';
  if (next) next.textContent = currentStep === TOTAL_STEPS ? 'Get My Plan 🚀' : 'Next Step →';
}

function showStep(n) {
  document.querySelectorAll('.builder-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`step-${n}`);
  if (el) el.classList.add('active');
  updateProgress();
}

window.nextStep = function() {
  if (currentStep < TOTAL_STEPS) { currentStep++; showStep(currentStep); recalcPrice(); }
  else { getMyPlan(); }
};
window.prevStep = function() {
  if (currentStep > 1) { currentStep--; showStep(currentStep); }
};

/* STEP 1 — Destination */
document.querySelectorAll('input[name="destination"]').forEach(inp => {
  inp.addEventListener('change', () => { state.destination = inp.value; recalcPrice(); });
});

/* STEP 2 — Duration */
const nightsSlider = document.getElementById('nightsSlider');
const nightsManual = document.getElementById('nightsManual');
const nightsValDisplay = document.getElementById('nightsValDisplay');

function setNights(n) {
  n = Math.max(1, Math.min(60, parseInt(n) || 1));
  state.nights = n;
  if (nightsValDisplay) nightsValDisplay.textContent = n;
  const pct = ((Math.min(n, 15) - 1) / 14) * 100;
  if (nightsSlider) {
    nightsSlider.style.backgroundSize = `${Math.min(pct, 100)}% 100%`;
    if (parseInt(nightsSlider.value) !== Math.min(n, 15)) nightsSlider.value = Math.min(n, 15);
  }
  if (nightsManual && parseInt(nightsManual.value) !== n) nightsManual.value = n;
  recalcPrice();
}

if (nightsSlider) nightsSlider.addEventListener('input', () => {
  const pct = ((nightsSlider.value - 1) / 14) * 100;
  nightsSlider.style.backgroundSize = `${pct}% 100%`;
  setNights(nightsSlider.value);
});
if (nightsManual) {
  nightsManual.addEventListener('input', () => setNights(nightsManual.value));
  nightsManual.addEventListener('change', () => setNights(nightsManual.value));
}

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setNights(btn.dataset.nights);
  });
});

/* Dates */
const checkInEl = document.getElementById('checkIn');
const checkOutEl = document.getElementById('checkOut');
const today = new Date().toISOString().split('T')[0];
if (checkInEl) checkInEl.min = today;
if (checkOutEl) checkOutEl.min = today;

if (checkInEl) checkInEl.addEventListener('change', () => {
  if (checkOutEl) checkOutEl.min = checkInEl.value;
  state.checkIn = checkInEl.value;
  if (checkOutEl && checkOutEl.value) {
    const diff = Math.round((new Date(checkOutEl.value) - new Date(checkInEl.value)) / 86400000);
    if (diff > 0) setNights(diff);
  }
});
if (checkOutEl) checkOutEl.addEventListener('change', () => {
  state.checkOut = checkOutEl.value;
  if (checkInEl && checkInEl.value) {
    const diff = Math.round((new Date(checkOutEl.value) - new Date(checkInEl.value)) / 86400000);
    if (diff > 0) setNights(diff);
  }
});

/* STEP 3 — Travelers */
function setupCounter(incId, decId, inputId, stateKey, min = 0) {
  const inc = document.getElementById(incId);
  const dec = document.getElementById(decId);
  const inp = document.getElementById(inputId);
  if (!inc || !dec || !inp) return;
  inc.addEventListener('click', () => {
    const val = (parseInt(inp.value) || 0) + 1;
    const max = stateKey === 'adults' ? 20 : stateKey === 'infants' ? 5 : 10;
    if (val <= max) { inp.value = val; state[stateKey] = val; recalcPrice(); }
  });
  dec.addEventListener('click', () => {
    const val = (parseInt(inp.value) || 0) - 1;
    if (val >= min) { inp.value = val; state[stateKey] = val; recalcPrice(); }
  });
  inp.addEventListener('change', () => {
    state[stateKey] = Math.max(min, parseInt(inp.value) || min);
    inp.value = state[stateKey]; recalcPrice();
  });
}

setupCounter('adultInc', 'adultDec', 'adultCount', 'adults', 1);
setupCounter('childInc', 'childDec', 'childCount', 'children', 0);
setupCounter('infantInc', 'infantDec', 'infantCount', 'infants', 0);

/* STEP 4 — Budget */
const budgetSlider = document.getElementById('budgetSlider');
const budgetManual = document.getElementById('budgetManual');
const budgetValDisplay = document.getElementById('budgetValDisplay');

function setBudget(val) {
  val = Math.max(10000, parseInt(val) || 10000);
  state.budget = val;
  if (budgetValDisplay) budgetValDisplay.textContent = formatCurrency(val);
  if (budgetSlider) {
    budgetSlider.value = Math.min(val, 500000);
    const pct = ((Math.min(val, 500000) - 10000) / (500000 - 10000)) * 100;
    budgetSlider.style.backgroundSize = `${pct}% 100%`;
  }
  if (budgetManual && parseInt(budgetManual.value) !== val) budgetManual.value = val;
  updateBudgetRec(val);
  recalcPrice();
}

function updateBudgetRec(val) {
  const el = document.getElementById('budgetRecText');
  if (!el) return;
  let rec = '';
  if (val < 30000) rec = 'Budget trip with <strong>basic accommodation</strong> and cab transport.';
  else if (val < 75000) rec = 'Standard trip with <strong>Premium Hotel</strong> and selected activities.';
  else if (val < 150000) rec = 'Premium experience with <strong>Luxury Resort</strong> and most activities.';
  else rec = 'Luxury escape with <strong>Private Villa</strong>, yacht, drone & all add-ons!';
  el.innerHTML = `💡 Based on your budget: ${rec}`;

  document.querySelectorAll('.budget-tier-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.budget) === findClosestTier(val));
  });
}

function findClosestTier(val) {
  return [30000, 75000, 150000, 500000].reduce((p, c) => Math.abs(c - val) < Math.abs(p - val) ? c : p);
}

if (budgetSlider) budgetSlider.addEventListener('input', () => {
  const pct = ((budgetSlider.value - 10000) / (500000 - 10000)) * 100;
  budgetSlider.style.backgroundSize = `${pct}% 100%`;
  setBudget(budgetSlider.value);
});
if (budgetManual) {
  budgetManual.addEventListener('input', () => setBudget(budgetManual.value));
  budgetManual.addEventListener('change', () => setBudget(budgetManual.value));
}

document.querySelectorAll('.budget-tier-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.budget-tier-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setBudget(btn.dataset.budget);
  });
});

/* STEP 5 — Accommodation */
document.querySelectorAll('input[name="accommodation"]').forEach(inp => {
  inp.addEventListener('change', () => {
    state.accommodation = inp.value;
    state.accommodationPrice = parseInt(inp.dataset.price) || 0;
    recalcPrice();
  });
});

/* STEP 6 — Activities */
document.querySelectorAll('#step-6 input[type="checkbox"]').forEach(inp => {
  inp.addEventListener('change', () => {
    const item = { value: inp.value, label: inp.dataset.label, price: parseInt(inp.dataset.price) || 0 };
    if (inp.checked) {
      if (!state.activities.find(a => a.value === inp.value)) state.activities.push(item);
    } else {
      state.activities = state.activities.filter(a => a.value !== inp.value);
    }
    recalcPrice();
  });
});

/* STEP 7 — Transport */
document.querySelectorAll('input[name="transport"]').forEach(inp => {
  inp.addEventListener('change', () => {
    state.transport = inp.value;
    state.transportLabel = inp.dataset.label;
    state.transportPrice = parseInt(inp.dataset.price) || 0;
    recalcPrice();
  });
});

/* STEP 8 — Add-ons & Custom Request */
document.querySelectorAll('#step-8 input[type="checkbox"]').forEach(inp => {
  inp.addEventListener('change', () => {
    const item = { value: inp.value, label: inp.dataset.label, price: parseInt(inp.dataset.price) || 0 };
    if (inp.checked) {
      if (!state.addons.find(a => a.value === inp.value)) state.addons.push(item);
    } else {
      state.addons = state.addons.filter(a => a.value !== inp.value);
    }
    recalcPrice();
  });
});

const customRequestEl = document.getElementById('customRequest');
if (customRequestEl) customRequestEl.addEventListener('input', () => { state.customRequest = customRequestEl.value; });

/* ================================================================
   PRICING ENGINE V3 — ITEMIZED BREAKDOWN
   ================================================================ */
const ACCOM_PRICE_INR = { budget: 4000, premium: 9000, luxury: 20000, villa: 45000 };
const GUIDE_PER_DAY = 3500;
const CONCIERGE_PER_DAY = 8000;
const BASE_PER_NIGHT = { andaman: 5000, goa: 3500 };

function computeBreakdown() {
  const nights = Math.max(1, state.nights);
  const adults = Math.max(1, state.adults);
  const children = state.children;

  // Stay
  const accomRate = ACCOM_PRICE_INR[state.accommodation] || 0;
  const baseRate = BASE_PER_NIGHT[state.destination] || 0;
  const stayTotal = (accomRate + baseRate) * nights;

  // Activities
  let actTotal = 0;
  state.activities.forEach(act => {
    actTotal += act.price * adults + act.price * 0.5 * children;
  });

  // Transport
  let transTotal = 0;
  if (state.transport) {
    if (state.transport === 'cab') transTotal = state.transportPrice;
    else transTotal = state.transportPrice * (adults + children);
  }

  // Add-ons
  let aoTotal = 0;
  state.addons.forEach(ao => {
    if (ao.value === 'guide') aoTotal += GUIDE_PER_DAY * nights;
    else if (ao.value === 'concierge') aoTotal += CONCIERGE_PER_DAY * nights;
    else aoTotal += ao.price;
  });

  const total = stayTotal + actTotal + transTotal + aoTotal;

  return { stayTotal, actTotal, transTotal, aoTotal, total };
}

/* Animate price counter (smooth number transition) */
let displayedPrice = 0;
let priceFrame = null;

function animatePrice(targetINR) {
  if (priceFrame) cancelAnimationFrame(priceFrame);
  const start = displayedPrice;
  const diff = targetINR - start;
  let startT = null;
  const dur = 550;
  function step(ts) {
    if (!startT) startT = ts;
    const p = Math.min((ts - startT) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(start + diff * eased);
    displayedPrice = val;
    const fmt = formatCurrency(val);
    const sp = document.getElementById('summaryPrice');
    const mp = document.getElementById('mobilePriceDisplay');
    if (sp) sp.textContent = fmt;
    if (mp) mp.textContent = fmt;
    if (p < 1) priceFrame = requestAnimationFrame(step);
  }
  priceFrame = requestAnimationFrame(step);
}

function updateBreakdownPanel(breakdown) {
  const { stayTotal, actTotal, transTotal, aoTotal } = breakdown;

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    if (val > 0) {
      el.textContent = formatCurrency(val);
      el.classList.add('has-value');
    } else {
      el.textContent = '—';
      el.classList.remove('has-value');
    }
  }

  setVal('cbStayVal', stayTotal);
  setVal('cbActVal', actTotal);
  setVal('cbTransVal', transTotal);
  setVal('cbAoVal', aoTotal);
}

function updateSummaryItems(breakdown) {
  const el = document.getElementById('summaryItems');
  if (!el) return;

  const ACCOM_LABELS = { budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
  const TRANS_LABELS = { flight: '✈️ Flights', ferry: '⛴️ Ferry', cab: '🚗 Private Cab' };

  const items = [];
  if (state.destination) items.push({ l: '📍 Destination', v: state.destination === 'andaman' ? 'Andaman' : 'Goa' });
  if (state.nights) items.push({ l: '🌙 Duration', v: `${state.nights} night${state.nights > 1 ? 's' : ''}` });
  if (state.adults) {
    let tv = `${state.adults} adult${state.adults !== 1 ? 's' : ''}`;
    if (state.children > 0) tv += ` + ${state.children} child${state.children !== 1 ? 'ren' : ''}`;
    items.push({ l: '👥 Travelers', v: tv });
  }
  if (state.accommodation) items.push({ l: '🛎 Stay', v: ACCOM_LABELS[state.accommodation] || '' });
  if (state.activities.length) items.push({ l: '🎯 Activities', v: `${state.activities.length} selected` });
  if (state.transport) items.push({ l: '🚀 Transport', v: TRANS_LABELS[state.transport] || '' });
  if (state.addons.length) items.push({ l: '✨ Add-ons', v: `${state.addons.length} selected` });

  if (!items.length) {
    el.innerHTML = '<div class="summary-placeholder"><span class="ph-icon">🗺️</span><p>Start selecting to build your trip</p></div>';
  } else {
    el.innerHTML = items.map(i => `<div class="summary-item"><span class="sum-item-label">${i.l}</span><span class="sum-item-val">${i.v}</span></div>`).join('');
  }
}

function recalcPrice() {
  const breakdown = computeBreakdown();
  updateBreakdownPanel(breakdown);
  updateSummaryItems(breakdown);
  animatePrice(breakdown.total);

  // Also update budget display if currency changed
  if (budgetValDisplay && state.budget) budgetValDisplay.textContent = formatCurrency(state.budget);

  updateAIStatePreview();
}

/* ================================================================
   WHATSAPP MESSAGE GENERATOR V12
   Structured, emoji-rich, fully encoded. Handles all edge cases.
   ================================================================ */

const WA_NUMBER = '919531817142'; // Admin WhatsApp number

/* Labels for human-readable output */
const WA_ACCOM_LABELS  = { budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
const WA_TRANS_LABELS  = { flight: 'Flights (round-trip)', ferry: 'Ferry', cab: 'Private Cab' };

/* Build the full structured WhatsApp message from builder state */
function buildWaMessage() {
  const bd   = computeBreakdown();
  const hasAnySelection = state.destination || state.nights || state.accommodation ||
                          state.activities.length || state.transport || state.addons.length;

  /* ── BASIC inquiry if user hasn't filled anything ── */
  if (!hasAnySelection) {
    const basic =
`🌍 *New Trip Inquiry — Seven Rays*

Hi! I'm interested in planning a trip to Andaman or Goa.
Could you please help me with options and pricing?

📩 Looking forward to hearing from you! 🙏`;
    return encodeURIComponent(basic);
  }

  /* ── STRUCTURED message with only the fields the user filled ── */
  const lines = [];

  lines.push('🌍 *New Trip Inquiry — Seven Rays*');
  lines.push('');

  // Destination
  if (state.destination) {
    lines.push(`📍 *Destination:* ${state.destination === 'andaman' ? 'Andaman' : 'Goa'}`);
  }

  // Duration
  if (state.nights) {
    if (state.checkIn && state.checkOut) {
      lines.push(`📅 *Duration:* ${state.nights} nights (${state.checkIn} → ${state.checkOut})`);
    } else {
      lines.push(`📅 *Duration:* ${state.nights} night${state.nights > 1 ? 's' : ''} (${state.nights + 1} days)`);
    }
  }

  // Travelers
  if (state.adults) {
    let tv = `${state.adults} adult${state.adults !== 1 ? 's' : ''}`;
    if (state.children > 0) tv += ` + ${state.children} child${state.children !== 1 ? 'ren' : ''}`;
    lines.push(`👥 *Travelers:* ${tv}`);
  }

  // Budget
  if (state.budget) {
    lines.push(`💰 *Budget:* ${formatCurrency(state.budget)}`);
  }

  lines.push('');

  // Accommodation
  if (state.accommodation) {
    lines.push(`🏨 *Stay:* ${WA_ACCOM_LABELS[state.accommodation]}`);
  }

  // Activities (bullet list)
  if (state.activities.length) {
    lines.push('🎯 *Activities:*');
    state.activities.forEach(a => lines.push(`   • ${a.label}`));
  }

  // Transport
  if (state.transport) {
    lines.push(`🚗 *Transport:* ${WA_TRANS_LABELS[state.transport] || state.transport}`);
  }

  // Add-ons (bullet list)
  if (state.addons.length) {
    lines.push('✨ *Add-ons:*');
    state.addons.forEach(a => lines.push(`   • ${a.label}`));
  }

  // Custom request
  if (state.customRequest && state.customRequest.trim()) {
    lines.push('');
    lines.push(`📝 *Special Request:* ${state.customRequest.trim()}`);
  }

  // Estimated total (only show if non-zero)
  if (bd.total > 0) {
    lines.push('');
    lines.push(`💵 *Estimated Total:* ${formatCurrency(bd.total)}`);
  }

  lines.push('');
  lines.push('📩 Please assist me with this plan! 🙏');

  return encodeURIComponent(lines.join('\n'));
}

/* ── Generic opener used by ALL WhatsApp buttons on site ──
   Pass context = 'builder' to use full trip data.
   Pass context = 'general' for a simple hello message.       */
window.openWhatsApp = function(context) {
  let encoded;
  if (context === 'builder') {
    encoded = buildWaMessage();
  } else {
    // Generic contact message — no builder data needed
    const general = '🌍 *Hello Seven Rays!*\n\nI\'d like to learn more about your Andaman & Goa travel packages.\nCould you please share the details? 🙏';
    encoded = encodeURIComponent(general);
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
};

/* Builder "Get My Plan" button — uses full structured message */
window.getMyPlan = function() {
  window.open(`https://wa.me/${WA_NUMBER}?text=${buildWaMessage()}`, '_blank');
};

/* ================================================================
   AI MODULE V3 — OpenAI + Smart Fallback
   ================================================================ */

/* — API Key Management — */
function getOpenAIKey() {
  try { return localStorage.getItem('sr-openai-key') || ''; } catch(e) { return ''; }
}

function saveOpenAIKey_internal(key) {
  try { localStorage.setItem('sr-openai-key', key.trim()); } catch(e) {}
}

function updateAIStatusLabel() {
  const label = document.getElementById('aiStatusLabel');
  if (!label) return;
  const key = getOpenAIKey();
  if (key && key.startsWith('sk-')) {
    label.textContent = '✅ GPT-4 connected — real AI active';
    label.classList.add('has-key');
  } else {
    label.innerHTML = 'Smart mode — <a href="#" class="ai-key-link" onclick="toggleAIKeySection(event)">Add OpenAI key for GPT-4</a>';
    label.classList.remove('has-key');
  }
}

window.toggleAIKeySection = function(e) {
  if (e) e.preventDefault();
  const section = document.getElementById('aiKeySection');
  if (!section) return;
  const isHidden = section.style.display === 'none' || !section.style.display;
  section.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    const input = document.getElementById('aiApiKeyInput');
    const existing = getOpenAIKey();
    if (input) { input.value = existing || ''; input.focus(); }
  }
};

window.saveAPIKey = function() {
  const input = document.getElementById('aiApiKeyInput');
  if (!input) return;
  const key = input.value.trim();
  if (!key) { showToast('Please enter your API key', 'warning'); return; }
  if (!key.startsWith('sk-')) { showToast('Key should start with sk-... Please check and try again', 'warning'); return; }
  saveOpenAIKey_internal(key);
  document.getElementById('aiKeySection').style.display = 'none';
  updateAIStatusLabel();
  showToast('✅ OpenAI key saved! Real AI is now active.', 'success');
};

window.clearAPIKey = function() {
  try { localStorage.removeItem('sr-openai-key'); } catch(e) {}
  const input = document.getElementById('aiApiKeyInput');
  if (input) input.value = '';
  document.getElementById('aiKeySection').style.display = 'none';
  updateAIStatusLabel();
  showToast('API key cleared. Using Smart mode.', 'info');
};

/* — OpenAI API Call — */
async function callOpenAI(messages) {
  const key = getOpenAIKey();
  if (!key) throw new Error('NO_KEY');

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1800,
      temperature: 0.75,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!resp.ok) {
    const errBody = await resp.json().catch(() => ({}));
    const msg = errBody.error?.message || `HTTP ${resp.status}`;
    throw new Error(msg);
  }

  const data = await resp.json();
  return data.choices[0].message.content;
}

/* — System Prompt — */
const AI_SYSTEM_PROMPT = `You are an expert luxury travel planner for Seven Rays Travel Agency, specializing in Andaman & Goa.

When the user asks for a trip plan, respond with exactly TWO sections:

1. A JSON block wrapped in <PLAN_JSON>...</PLAN_JSON> with this exact schema:
{
  "destination": "andaman" or "goa",
  "nights": <number 3-14>,
  "accommodation": "budget" or "premium" or "luxury" or "villa",
  "activities": [list from: "scuba","snorkel","island","dinner","watersports","nightlife","seawalk","kayak","glassbottom","trek"],
  "addons": [list from: "photo","decor","guide","honeymoon","birthday","proposal","beachdinner","yacht","spa","drone","underwater","bonfire","yoga","vip","concierge","foodtour","cultural","biolum"]
}
Only include activities and addons relevant to the trip type.

For GOA trips:
- Activities: watersports, nightlife, dinner, snorkel
- Key beaches: Baga, Anjuna, Palolem, Calangute
- Add-ons: vip (club), beachdinner, bonfire, foodtour, cultural, spa
- Highlights: North Goa nightlife, South Goa calm, Portuguese heritage, Dudhsagar waterfall

For ANDAMAN trips:
- Activities: scuba, snorkel, island, seawalk, kayak, glassbottom, trek
- Key islands: Havelock, Neil, North Bay, Ross Island
- Add-ons: underwater, drone, biolum, guide, honeymoon, photo
- Highlights: Radhanagar Beach, Cellular Jail, coral reefs, bioluminescent beach

2. After the JSON block, a warm, day-by-day itinerary in plain text (no JSON, no markdown headers).

Always detect destination from user message — look for keywords like "goa", "baga", "anjuna", "palolem" for Goa, and "andaman", "havelock", "neil" for Andaman.
If unclear, ask: "Which destination interests you — Andaman or Goa?"
Be warm, specific, and knowledgeable. Include local tips and hidden gems.
Suggest upgrades when appropriate: "Would you prefer a luxury stay for a more premium experience?"`;

/* — Parse AI Plan JSON — */
function parseAIPlan(text) {
  try {
    const match = text.match(/<PLAN_JSON>([\s\S]*?)<\/PLAN_JSON>/);
    if (!match) return null;
    return JSON.parse(match[1].trim());
  } catch(e) {
    return null;
  }
}

/* — Extract Itinerary Text — */
function extractItinerary(text) {
  return text.replace(/<PLAN_JSON>[\s\S]*?<\/PLAN_JSON>/, '').trim();
}

/* ================================================================
   AI CHAT INTERFACE
   ================================================================ */
const aiOverlay = document.getElementById('aiPanelOverlay');

window.openAIPlanner = function() {
  aiOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateAIStatePreview();
  updateAIStatusLabel();
};

window.closeAIPlanner = function(e) {
  if (e && e.target !== aiOverlay) return;
  aiOverlay.classList.remove('open');
  document.body.style.overflow = '';
};

window.switchAITab = function(tab) {
  document.querySelectorAll('.ai-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.ai-tab-content').forEach(tc => tc.classList.toggle('active', tc.id === `ai-tab-${tab}`));
  if (tab === 'auto') updateAIStatePreview();
};

/* Chat messages */
const aiMessages = document.getElementById('aiMessages');
const aiInput = document.getElementById('aiChatInput');

function appendMsg(text, role, typing = false) {
  const div = document.createElement('div');
  div.className = `ai-msg ai-msg--${role}`;
  const avatar = document.createElement('span');
  avatar.className = 'ai-msg-avatar';
  avatar.textContent = role === 'bot' ? '🤖' : '👤';
  const bubble = document.createElement('div');
  bubble.className = 'ai-msg-bubble' + (typing ? ' typing' : '');
  bubble.textContent = text;
  div.append(avatar, bubble);
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return bubble;
}

let chatHistory = []; // OpenAI message history for context

window.sendAIMessage = async function() {
  const text = aiInput.value.trim();
  if (!text) return;
  appendMsg(text, 'user');
  aiInput.value = '';
  const typingBubble = appendMsg('', 'bot', true);

  try {
    let responseText;
    const hasKey = getOpenAIKey() && getOpenAIKey().startsWith('sk-');

    if (hasKey) {
      chatHistory.push({ role: 'user', content: text });
      // Inject language instruction so AI replies in the user's selected language
      const LANG_NAMES = { en:'English', hi:'Hindi', bn:'Bengali', ta:'Tamil', te:'Telugu', es:'Spanish', fr:'French', de:'German', ar:'Arabic', zh:'Chinese' };
      const langInstruction = (currentLang && currentLang !== 'en')
        ? `\n\nIMPORTANT: The user has selected ${LANG_NAMES[currentLang] || 'English'} as their language. You MUST respond ENTIRELY in ${LANG_NAMES[currentLang] || 'English'}. The PLAN_JSON block must still use English keys, but all descriptive text, itinerary, and messages must be in ${LANG_NAMES[currentLang] || 'English'}.`
        : '';
      const messages = [
        { role: 'system', content: AI_SYSTEM_PROMPT + langInstruction },
        ...chatHistory.slice(-8), // Keep last 8 messages for context
      ];
      responseText = await callOpenAI(messages);
      chatHistory.push({ role: 'assistant', content: responseText });
    } else {
      // Use smart fallback
      await new Promise(r => setTimeout(r, 1800)); // Simulate thinking
      responseText = generateSmartFallback(text);
    }

    // Remove typing indicator
    typingBubble.classList.remove('typing');

    // Parse plan JSON if present
    const plan = parseAIPlan(responseText);
    const itinerary = extractItinerary(responseText);

    typingBubble.classList.add('ai-plan-bubble');
    typingBubble.textContent = itinerary;

    // Add "Apply This Plan" button if we got a plan
    if (plan) {
      const applyBtn = document.createElement('button');
      applyBtn.className = 'ai-apply-btn';
      applyBtn.innerHTML = '🎯 Apply This Plan to Builder';
      applyBtn.addEventListener('click', () => applyAIPlanToBuilder(plan));
      typingBubble.parentNode.appendChild(applyBtn);
    }

  } catch(err) {
    typingBubble.classList.remove('typing');
    if (err.message === 'NO_KEY') {
      typingBubble.textContent = 'Smart mode active. ' + generateSmartFallback(text);
    } else if (err.message.includes('401') || err.message.includes('Incorrect API key')) {
      typingBubble.textContent = '❌ Invalid API key. Please check your key in settings above.';
      showToast('Invalid OpenAI API key. Please verify and re-enter.', 'error');
    } else {
      typingBubble.textContent = '❌ Unable to generate plan right now. Please try again.';
      showToast('AI request failed. Check your connection and try again.', 'error');
      console.error('OpenAI error:', err);
    }
  }

  aiMessages.scrollTop = aiMessages.scrollHeight;
};

aiInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) window.sendAIMessage(); });

/* ================================================================
   AI AUTO PLAN (from builder state)
   ================================================================ */
function updateAIStatePreview() {
  const el = document.getElementById('aiStatePreview');
  if (!el) return;
  const ACCOM = { budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
  const chips = [];
  if (state.destination) chips.push(`📍 ${state.destination === 'andaman' ? 'Andaman' : 'Goa'}`);
  if (state.nights) chips.push(`🌙 ${state.nights} nights`);
  if (state.adults) chips.push(`👥 ${state.adults} adults${state.children ? ` + ${state.children} children` : ''}`);
  if (state.budget) chips.push(`💰 ${formatCurrency(state.budget)}`);
  if (state.accommodation) chips.push(`🛎 ${ACCOM[state.accommodation]}`);
  if (state.activities.length) chips.push(`🎯 ${state.activities.length} activities`);

  el.innerHTML = chips.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:8px">${chips.map(c => `<span style="background:var(--yellow-glow);border:1px solid rgba(212,160,23,0.3);padding:4px 10px;border-radius:50px;font-size:0.78rem;color:var(--text-1)">${c}</span>`).join('')}</div>`
    : '<p class="asp-placeholder">Fill the builder steps, then come back here for a personalized plan.</p>';
}

window.generateAutoPlan = async function() {
  const btn = document.getElementById('generateBtn');
  const resultEl = document.getElementById('aiAutoResult');
  const infoEl = document.querySelector('.ai-auto-info');
  if (!btn || !resultEl) return;

  btn.classList.add('btn-loading');
  btn.textContent = 'Generating your plan…';
  btn.disabled = true;

  try {
    let planHTML;
    const hasKey = getOpenAIKey() && getOpenAIKey().startsWith('sk-');

    if (hasKey) {
      const prompt = buildAutoPrompt();
      // Inject language instruction for Auto Plan too
      const LANG_NAMES = { en:'English', hi:'Hindi', bn:'Bengali', ta:'Tamil', te:'Telugu', es:'Spanish', fr:'French', de:'German', ar:'Arabic', zh:'Chinese' };
      const langInstruction = (currentLang && currentLang !== 'en')
        ? `\n\nIMPORTANT: Respond ENTIRELY in ${LANG_NAMES[currentLang] || 'English'}. PLAN_JSON keys remain in English, but ALL other text must be in ${LANG_NAMES[currentLang] || 'English'}.`
        : '';
      const messages = [
        { role: 'system', content: AI_SYSTEM_PROMPT + langInstruction },
        { role: 'user', content: prompt },
      ];
      const responseText = await callOpenAI(messages);
      const plan = parseAIPlan(responseText);
      const itinerary = extractItinerary(responseText);
      planHTML = renderAutoPlanHTML(itinerary, plan);
    } else {
      await new Promise(r => setTimeout(r, 2000));
      planHTML = renderBuiltinAutoPlan();
    }

    resultEl.innerHTML = planHTML;
    resultEl.style.display = 'block';
    if (infoEl) infoEl.style.display = 'none';

  } catch(err) {
    resultEl.innerHTML = `<div style="padding:20px;text-align:center">
      <div style="font-size:2rem;margin-bottom:12px">❌</div>
      <p style="color:var(--text-2);margin-bottom:16px">Unable to generate plan. ${err.message.includes('401') ? 'Invalid API key.' : 'Please check your connection.'}</p>
      <button class="btn btn-primary btn-sm" onclick="generateAutoPlan()">Try Again</button>
    </div>`;
    resultEl.style.display = 'block';
    showToast(err.message.includes('401') ? 'Invalid API key' : 'Plan generation failed. Try again.', 'error');
  }

  btn.classList.remove('btn-loading');
  btn.textContent = '⚡ Regenerate Plan';
  btn.disabled = false;
};

function buildAutoPrompt() {
  const ACCOM = { budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
  const dest = state.destination === 'goa' ? 'Goa' : state.destination === 'andaman' ? 'Andaman' : 'Andaman or Goa';
  const acts = state.activities.length ? state.activities.map(a => a.label).join(', ') : 'not specified';
  const aos = state.addons.length ? state.addons.map(a => a.label).join(', ') : 'none';
  const stay = ACCOM[state.accommodation] || 'not specified';
  const travelers = `${state.adults} adults${state.children ? ` and ${state.children} children` : ''}`;
  return `Create a personalized trip plan with these selections:
Destination: ${dest}
Nights: ${state.nights}
Travelers: ${travelers}
Budget: ₹${state.budget.toLocaleString('en-IN')}
Accommodation: ${stay}
Activities: ${acts}
Add-ons: ${aos}
${state.customRequest ? `Special request: ${state.customRequest}` : ''}

Generate a detailed day-by-day itinerary.`;
}

function renderAutoPlanHTML(itinerary, plan) {
  const days = itinerary.split(/\n(?=Day \d)/i).map(d => d.trim()).filter(Boolean);
  return `<div style="padding:20px">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;gap:10px;flex-wrap:wrap">
      <div>
        <h3 style="font-family:var(--font-serif);color:var(--text-1);font-size:1.2rem;margin-bottom:6px">✨ Your AI-Generated Plan</h3>
        <p style="font-size:0.82rem;color:var(--text-3)">${state.destination ? (state.destination === 'andaman' ? 'Andaman' : 'Goa') : 'Custom'} · ${state.nights} Nights · GPT-4 Powered</p>
      </div>
      ${plan ? `<button class="btn btn-primary btn-sm" onclick="applyAIPlanToBuilder(${JSON.stringify(plan)})">Apply to Builder</button>` : ''}
    </div>
    ${days.length ? days.map(day => {
      const lines = day.split('\n');
      const title = lines[0];
      const detail = lines.slice(1).join('\n').trim();
      return `<div class="ai-plan-day"><div class="ai-plan-day-title">${title}</div><p>${detail}</p></div>`;
    }).join('') : `<div class="ai-plan-day"><p style="white-space:pre-line">${itinerary}</p></div>`}
    <div style="margin-top:16px;padding:14px;background:var(--yellow-glow);border-radius:12px;border:1px solid rgba(212,160,23,0.3)">
      <p style="font-size:0.82rem;color:var(--text-1)">💡 <strong>Pro tip by Seven Rays:</strong> Book ferries to Havelock 48hrs in advance during peak season (Oct–Mar). For Goa, shoulder season (Feb–Mar) offers best value!</p>
    </div>
    <button class="btn btn-outline-dark btn-full" style="margin-top:16px" onclick="window.getMyPlan()">Send This Plan on WhatsApp 🚀</button>
  </div>`;
}

/* ================================================================
   AI → BUILDER SYNC ("Apply This Plan")
   ================================================================ */
window.applyAIPlanToBuilder = function(plan) {
  if (!plan || typeof plan !== 'object') return;

  // Apply destination
  if (plan.destination) {
    const radio = document.getElementById(`dest-${plan.destination}`);
    if (radio) { radio.checked = true; state.destination = plan.destination; }
  }

  // Apply nights
  if (plan.nights) setNights(plan.nights);

  // Apply accommodation
  if (plan.accommodation) {
    const radio = document.getElementById(`accom-${plan.accommodation}`);
    if (radio) {
      radio.checked = true;
      state.accommodation = plan.accommodation;
      state.accommodationPrice = parseInt(radio.dataset.price) || 0;
    }
  }

  // Apply activities
  if (Array.isArray(plan.activities)) {
    // First uncheck all
    document.querySelectorAll('#step-6 input[type="checkbox"]').forEach(inp => { inp.checked = false; });
    state.activities = [];
    plan.activities.forEach(actVal => {
      const inp = document.getElementById(`act-${actVal}`);
      if (inp) {
        inp.checked = true;
        const item = { value: inp.value, label: inp.dataset.label, price: parseInt(inp.dataset.price) || 0 };
        state.activities.push(item);
      }
    });
  }

  // Apply add-ons
  if (Array.isArray(plan.addons)) {
    document.querySelectorAll('#step-8 input[type="checkbox"]').forEach(inp => { inp.checked = false; });
    state.addons = [];
    plan.addons.forEach(aoVal => {
      const inp = document.getElementById(`ao-${aoVal}`);
      if (inp) {
        inp.checked = true;
        const item = { value: inp.value, label: inp.dataset.label, price: parseInt(inp.dataset.price) || 0 };
        state.addons.push(item);
      }
    });
  }

  recalcPrice();
  closeAIPlanner();

  // Go to step 1
  currentStep = 1;
  showStep(1);

  window.scrollTo({ top: document.getElementById('builder').offsetTop - 80, behavior: 'smooth' });
  showToast('✅ AI plan applied to your trip builder!', 'success', 3500);
};

/* ================================================================
   SMART FALLBACK AI (No API Key)
   ================================================================ */
function generateSmartFallback(input) {
  const lower = input.toLowerCase();
  const isHoneymoon = /honeymoon|romantic|couple|anniversary/.test(lower);
  const isFamily = /family|kids|children|child/.test(lower);
  const isAdventure = /adventure|scuba|diving|trek|extreme/.test(lower);
  const isLuxury = /luxury|villa|premium|high.end|exclusive/.test(lower);
  const isGoa = /goa/.test(lower);
  const isAndaman = /andaman/.test(lower);
  const isParty = /party|nightlife|club|rave|beach party/.test(lower);
  const dest = isGoa ? 'Goa' : isAndaman ? 'Andaman' : 'Andaman (most popular)';

  if (isParty && isGoa) {
    return `🎉 Goa Party Experience!\n\n📍 Destination: Goa\n📅 Recommended: 4–5 nights\n🛎 Stay: Premium Hotel near North Goa\n🎯 Activities: Beach parties, water sports, sunset cruise\n✨ Add-ons: VIP Club Access, Beach Bonfire, DJ Night\n💰 Est. Budget: ₹25,000–₹50,000/person\n\n🌊 Best spots: Baga, Anjuna, Vagator, Tito's Lane. The Sunburn Festival (Dec) is legendary!\n\nShall I create a detailed day plan? Just tell me your travel dates!`;
  }

  // GOA general — catches all Goa queries not already handled above
  if (isGoa) {
    const goaStyle = isLuxury ? 'Luxury' : isAdventure ? 'Adventure' : isHoneymoon ? 'Romantic' : isFamily ? 'Family' : 'Premium';
    const goaAccom = isLuxury ? '"villa"' : isHoneymoon ? '"luxury"' : '"premium"';
    const goaAddons = isHoneymoon
      ? '["honeymoon","beachdinner","spa","photo"]'
      : isLuxury
      ? '["yacht","vip","spa","beachdinner","concierge"]'
      : '["beachdinner","foodtour","bonfire","cultural"]';
    return `<PLAN_JSON>{"destination":"goa","nights":4,"accommodation":${goaAccom},"activities":["watersports","dinner","nightlife","snorkel"],"addons":${goaAddons}}</PLAN_JSON>

🌴 ${goaStyle} Goa Escape!

Day 1: Arrival → Check in near North Goa. Evening stroll at Calangute Beach. Sunset drinks at a cliffside shack. Dinner with live Goan music.

Day 2: Baga Beach watersports (jet ski, banana boat, parasailing). Afternoon: Anjuna flea market or Fort Aguada. Evening: Vibrant nightlife on Tito’s Lane.${isHoneymoon ? '\n🌹 Surprise honeymoon setup waiting in your room!' : ''}

Day 3: South Goa Serenity — Palolem & Benaulim beaches. Scenic boat tour of Palolem lagoon. Guided food tour with vindaloo, xacuti & bebinca. Candlelight beach dinner at sunset.

Day 4: Old Goa heritage — Basilica of Bom Jesus (UNESCO), spice plantation tour with traditional Goan thali. Afternoon beach bonfire. Departure.

Est. Budget: ₹${isLuxury ? '80,000–1,50,000' : isHoneymoon ? '50,000–1,00,000' : '20,000–45,000'}/person

💡 Tip: Feb–Mar is Goa’s golden season — clear skies, warm sea, perfect beach vibes!`;
  }

  if (isHoneymoon) {
    return `<PLAN_JSON>{"destination":"andaman","nights":5,"accommodation":"luxury","activities":["snorkel","dinner","island"],"addons":["honeymoon","beachdinner","spa","photo"]}</PLAN_JSON>

💕 Perfect romantic escape to ${dest}!

Day 1: Arrival in Port Blair. Check into your luxury resort. Sunset stroll at Corbyn's Cove. Honeymoon surprise setup in your room.

Day 2: Ferry to Havelock Island. Afternoon at Radhanagar Beach — Asia's most beautiful beach. Candlelight dinner by the shore with private setup.

Day 3: Elephant Beach snorkeling with crystal-clear water. Couples spa treatment. Evening free for romance.

Day 4: Neil Island day trip. Sunrise at Laxmanpur Beach. Picnic lunch arranged by our team.

Day 5: Return to Port Blair. Professional photoshoot session on the beach. Departure.

Est. Budget: ₹60,000–₹1,20,000/couple

💡 Tip: Carry light, breathable clothing. Book the candlelight dinner in advance — spots fill up!`;
  }

  if (isFamily) {
    return `<PLAN_JSON>{"destination":"andaman","nights":6,"accommodation":"premium","activities":["glassbottom","snorkel","island","watersports"],"addons":["guide"]}</PLAN_JSON>

👨‍👩‍👧‍👦 Perfect Family Adventure in ${dest}!

Day 1: Arrive Port Blair. Marine Museum. Cellular Jail Light & Sound Show — very educational for kids!

Day 2: North Bay Island — glass-bottom boat ride (kids love it!), snorkeling. Ross Island with wild deer.

Day 3: Ferry to Havelock. Radhanagar Beach — shallow and safe for children. Build sandcastles!

Day 4: Elephant Beach water sports — banana boat, sea walk. Even beginners can do sea walk.

Day 5: Neil Island — peaceful, uncrowded. Natural Bridge at low tide.

Day 6: Return. Shopping for shells and pearls. Departure.

Est. Budget: ₹55,000–₹85,000/family (2A+2C)

💡 Tip: Book afternoon ferries to Havelock — kids are usually fresher then!`;
  }

  if (isLuxury) {
    return `<PLAN_JSON>{"destination":"andaman","nights":7,"accommodation":"villa","activities":["scuba","snorkel","island","dinner"],"addons":["yacht","drone","spa","photo","concierge","underwater"]}</PLAN_JSON>

👑 Ultimate Luxury Escape in ${dest}!

Day 1–2: Port Blair → Private Villa check-in. Personalized concierge service. Private yacht sunset cruise.

Day 3: Exclusive island tour by speedboat. Gourmet picnic on a private sandbank.

Day 4: PADI scuba diving at world-class reefs. Underwater photography session.

Day 5: Drone videography on Radhanagar Beach. Private spa treatment.

Day 6: Fine dining experience with Chef's tasting menu.

Day 7: Departure with curated souvenir hamper from Seven Rays.

Est. Budget: ₹1,50,000–₹4,00,000/couple

💎 Every detail is personally managed by our luxury concierge team.`;
  }

  if (isAdventure) {
    return `<PLAN_JSON>{"destination":"andaman","nights":5,"accommodation":"budget","activities":["scuba","snorkel","seawalk","watersports","kayak","trek"],"addons":["underwater","biolum","guide"]}</PLAN_JSON>

⚡ Ultimate Adventure in ${dest}!

Day 1: Arrival + intro snorkeling at North Bay Island. Sea walk experience.

Day 2: PADI scuba diving certification begins. Pool training + theory.

Day 3: Havelock Island. Open water scuba dive + Elephant Beach. Underwater photography.

Day 4: Rainforest kayaking. Neil Island by speedboat. Bioluminescent beach night walk.

Day 5: Water sports extravaganza (jet ski, parasailing, banana boat). Departure.

Est. Budget: ₹35,000–₹65,000/person

🌊 Andaman has some of Asia's best dive sites — visibility up to 30m!`;
  }

  if (isGoa && !isHoneymoon && !isFamily && !isLuxury && !isAdventure && !isParty) {
    return `<PLAN_JSON>{"destination":"goa","nights":4,"accommodation":"premium","activities":["watersports","dinner","nightlife","snorkel"],"addons":["beachdinner","foodtour","bonfire","cultural"]}</PLAN_JSON>

🌴 Your Goa Escape Plan!

Day 1: Arrival → Check in near North Goa. Evening stroll at Calangute Beach. Sunset drinks at a cliffside shack. Dinner with live Goan music.

Day 2: North Goa Highlights — Baga Beach watersports (jet ski, banana boat, parasailing). Afternoon: Anjuna flea market. Evening: Nightlife on Tito's Lane.

Day 3: South Goa Serenity — Palolem & Benaulim beaches. Boat tour of Palolem lagoon. Guided food tour — try vindaloo, xacuti & bebinca. Candlelight beach dinner at sunset.

Day 4: Old Goa heritage — Basilica of Bom Jesus (UNESCO), spice plantation tour with authentic Goan thali. Afternoon beach bonfire. Departure.

Est. Budget: ₹20,000–₹45,000/person

💡 Tip: Shoulder season (Feb–Mar) offers the best weather in Goa — warm, dry, and less crowded!`;
  }

  // Default response
  return `🌏 I'd love to help plan your trip to ${dest}!

To create the perfect itinerary, could you tell me:
• 👥 How many travelers and travelers types? (couple, family, friends)
• 📅 How many nights are you planning?
• 💰 What's your approximate budget?
• 🎭 What experiences interest you most? (adventure, relaxation, culture, nightlife)

Feel free to also use the "Auto Plan" tab — I'll use your builder selections to create a detailed itinerary!`;
}

/* Built-in auto plan (no API key) */
function renderBuiltinAutoPlan() {
  const dest = state.destination === 'goa' ? 'Goa' : 'Andaman';
  const nights = state.nights || 5;
  const adults = state.adults || 2;
  const budget = formatCurrency(state.budget || 75000);
  const hasScuba = state.activities.some(a => a.value === 'scuba');
  const hasHoneymoon = state.addons.some(a => a.value === 'honeymoon');
  const hasYacht = state.addons.some(a => a.value === 'yacht');
  const hasDrone = state.addons.some(a => a.value === 'drone');

  const andamanDays = [
    { d: 1, t: 'Arrival & Discovery', c: `Airport pickup → Port Blair hotel check-in. Explore Corbyn's Cove beach. Evening: Cellular Jail light & sound show (powerful colonial history experience).` },
    { d: 2, t: 'North Bay & Ross Island', c: `Morning: North Bay Island — snorkeling above colorful coral reefs. Glass-bottom boat ride.${hasScuba ? ' Intro scuba dive session!' : ''} Afternoon: Ross Island — colonial ruins, wild deer roam freely.` },
    { d: 3, t: 'Havelock Island', c: `Morning ferry to Havelock. Check-in at luxury beach villa. Afternoon: Radhanagar Beach — voted Asia's most beautiful beach. Sunset is unmissable.${hasHoneymoon ? '\n🌹 Private honeymoon setup waiting in your room!' : ''}` },
    { d: 4, t: 'Elephant Beach Adventure', c: `Morning: Snorkeling & water sports at Elephant Beach.${hasScuba ? ' Certified scuba dive at amazing reef!' : ''} Afternoon: Free time at beach.${hasDrone ? '\n🚁 Drone videography session at golden hour!' : ''} Evening: Candlelight dinner by the shore.` },
    { d: 5, t: 'Neil Island Serenity', c: `Ferry to Neil Island. Visit Natural Bridge (stunning rock formation at low tide). Laxmanpur Beach sunset — one of India's most picturesque. Overnight in Neil.` },
    { d: 6, t: 'Farewell Port Blair', c: `Return ferry. Shopping at Aberdeen Market (pearls, shells, local crafts).${hasYacht ? '\n🛥️ Private yacht sunset cruise as a grand farewell!' : ''} Departure evening.` },
  ];

  const goaDays = [
    { d: 1, t: 'Arrival & North Goa', c: `Airport → hotel. Evening: Calangute & Baga Beach. Sunset cocktails. Dinner at a shack near the sea — try peri-peri prawns!` },
    { d: 2, t: 'Heritage & Spices', c: `Morning: Old Goa churches (Basilica of Bom Jesus — UNESCO World Heritage). Afternoon: Spice plantation with traditional Goan thali lunch. Evening: Anjuna flea market browsing.` },
    { d: 3, t: 'South Goa Calm', c: `Drive to South Goa — Palolem → Colva → Benaulim. Quieter, more pristine beaches. Boat lagoon tour at Palolem.${hasHoneymoon ? '\n🌹 Romantic setup on the beach in the evening.' : ''}` },
    { d: 4, t: 'Adventure & Party', c: `Water sports at Baga: jet ski, parasailing, banana boat.${hasYacht ? '\n🛥️ Private yacht cruise along the coastline!' : ''} Sunset catamaran cruise included. Evening: Goa nightlife experience.` },
    { d: 5, t: 'Dudhsagar & Departure', c: `Half-day: Dudhsagar Waterfall (350m — spectacular). Return by noon. Afternoon: Last beach time, souvenir shopping. Departure.` },
  ];

  const rawDays = dest === 'Andaman' ? andamanDays : goaDays;
  const days = rawDays.slice(0, Math.min(nights + 1, rawDays.length));

  return `<div style="padding:20px">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;gap:10px;flex-wrap:wrap">
      <div>
        <h3 style="font-family:var(--font-serif);color:var(--text-1);font-size:1.2rem;margin-bottom:6px">✨ Your Personalized Plan</h3>
        <p style="font-size:0.82rem;color:var(--text-3)">${dest} · ${nights} Nights · ${adults} Adults · ${budget}</p>
      </div>
    </div>
    ${days.map(d => `<div class="ai-plan-day">
      <div class="ai-plan-day-title">Day ${d.d}: ${d.t}</div>
      <p style="white-space:pre-line">${d.c}</p>
    </div>`).join('')}
    <div style="margin-top:16px;padding:14px;background:var(--yellow-glow);border-radius:12px;border:1px solid rgba(212,160,23,0.3)">
      <p style="font-size:0.82rem;color:var(--text-1)">💡 <strong>💎 Add OpenAI key</strong> in the AI panel for a fully customized GPT-4 itinerary based on your exact preferences!</p>
    </div>
    <button class="btn btn-outline-dark btn-full" style="margin-top:16px" onclick="window.getMyPlan()">Send This Plan on WhatsApp 🚀</button>
  </div>`;
}

/* ================================================================
   TESTIMONIALS CAROUSEL
   ================================================================ */
const testiTrack = document.getElementById('testiTrack');
const testiDotEls = document.querySelectorAll('.testi-dot');
let curSlide = 0;
let testiTimer = null;

function getVisibleCards() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 900) return 2;
  return 3;
}

function goSlide(idx) {
  const cards = document.querySelectorAll('.testi-card');
  const visible = getVisibleCards();
  const max = Math.max(0, cards.length - visible);
  curSlide = Math.max(0, Math.min(idx, max));
  const w = cards[0] ? cards[0].offsetWidth + 24 : 0;
  if (testiTrack) testiTrack.style.transform = `translateX(-${curSlide * w}px)`;
  testiDotEls.forEach((d, i) => d.classList.toggle('active', i === curSlide));
}

function resetTestiTimer() {
  clearInterval(testiTimer);
  testiTimer = setInterval(() => {
    const cards = document.querySelectorAll('.testi-card');
    goSlide(curSlide >= Math.max(0, cards.length - getVisibleCards()) ? 0 : curSlide + 1);
  }, 4500);
}

const testiPrev = document.getElementById('testiPrev');
const testiNext = document.getElementById('testiNext');
if (testiPrev) testiPrev.addEventListener('click', () => { goSlide(curSlide - 1); resetTestiTimer(); });
if (testiNext) testiNext.addEventListener('click', () => { goSlide(curSlide + 1); resetTestiTimer(); });
testiDotEls.forEach((d, i) => d.addEventListener('click', () => { goSlide(i); resetTestiTimer(); }));
window.addEventListener('resize', () => goSlide(curSlide));
resetTestiTimer();

/* ================================================================
   GALLERY FILTER + LIGHTBOX
   ================================================================ */
let lbImages = [];
let lbIdx = 0;
const lbOverlay = document.getElementById('lightboxOverlay');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCaption');

document.querySelectorAll('.gal-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gal-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.gal-item').forEach(item => {
      const show = f === 'all' || item.dataset.cat === f;
      item.classList.toggle('hidden', !show);
      if (show) {
        item.style.opacity = '0'; item.style.transform = 'scale(0.95)';
        requestAnimationFrame(() => setTimeout(() => {
          item.style.transition = 'all 0.4s ease';
          item.style.opacity = '1'; item.style.transform = 'scale(1)';
        }, 20));
      }
    });
  });
});

function buildLb() {
  lbImages = [];
  document.querySelectorAll('.gal-item:not(.hidden) .gal-img').forEach(el => {
    lbImages.push({
      src: el.dataset.full || '',
      caption: el.closest('.gal-item')?.querySelector('.gal-caption')?.textContent || '',
    });
  });
}

document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('click', () => {
    buildLb();
    const visible = [...document.querySelectorAll('.gal-item:not(.hidden)')];
    lbIdx = visible.indexOf(item);
    openLb(lbIdx);
  });
});

function openLb(idx) {
  buildLb();
  if (!lbImages.length) return;
  lbIdx = Math.max(0, Math.min(idx, lbImages.length - 1));
  if (lbImg) lbImg.src = lbImages[lbIdx].src;
  if (lbCap) lbCap.textContent = lbImages[lbIdx].caption;
  if (lbOverlay) lbOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (lbOverlay) lbOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
if (lbPrev) lbPrev.addEventListener('click', () => openLb((lbIdx - 1 + lbImages.length) % lbImages.length));
if (lbNext) lbNext.addEventListener('click', () => openLb((lbIdx + 1) % lbImages.length));
if (lbOverlay) lbOverlay.addEventListener('click', e => { if (e.target === lbOverlay) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lbOverlay?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') openLb((lbIdx - 1 + lbImages.length) % lbImages.length);
  if (e.key === 'ArrowRight') openLb((lbIdx + 1) % lbImages.length);
});

/* ================================================================
   EXIT POPUP
   ================================================================ */
let popupShown = false;
const exitOverlay = document.getElementById('exitPopupOverlay');

function showExitPopup() {
  if (!popupShown && exitOverlay) {
    popupShown = true;
    exitOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeExitPopup() {
  if (exitOverlay) exitOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('mouseleave', e => { if (e.clientY < 15) setTimeout(showExitPopup, 300); });
setTimeout(() => { if (!popupShown) showExitPopup(); }, 55000);
if (exitOverlay) exitOverlay.addEventListener('click', e => { if (e.target === exitOverlay) closeExitPopup(); });

window.closeExitPopup = closeExitPopup;

window.submitPopupLead = function() {
  const name = document.getElementById('popupName')?.value.trim();
  const phone = document.getElementById('popupPhone')?.value.trim();
  if (!name || !phone) { showToast('Please enter your name and phone number', 'warning'); return; }
  const msg = encodeURIComponent(`Hi Seven Rays! 👋\n\nFree consultation request:\n👤 Name: ${name}\n📞 Phone: ${phone}\n\nPlease reach out! 🙏`);
  window.open(`https://wa.me/919800000000?text=${msg}`, '_blank');
  closeExitPopup();
};

/* ================================================================
   MOBILE FAB + WHATSAPP FLOAT
   ================================================================ */
const mobileFAB = document.getElementById('mobileFAB');
const waFloat = document.getElementById('waFloat');

// Track whether mobile FAB is currently visible so WA button can stay above it
let fabCurrentlyVisible = false;

function updateWAPosition() {
  if (!waFloat) return;
  // On desktop (>768px) FAB is hidden — keep WA at default bottom
  if (window.innerWidth > 768) {
    waFloat.classList.remove('fab-visible');
    return;
  }
  // On mobile, if FAB is showing, push WA above it
  if (fabCurrentlyVisible) {
    waFloat.classList.add('fab-visible');
  } else {
    waFloat.classList.remove('fab-visible');
  }
}

window.addEventListener('scroll', () => {
  const past = window.scrollY > 350;
  if (waFloat) waFloat.style.opacity = past ? '1' : '0';
  if (mobileFAB) {
    if (past) {
      mobileFAB.style.display = 'block';
      mobileFAB.classList.remove('hidden');
      fabCurrentlyVisible = true;
    } else {
      mobileFAB.classList.add('hidden');
      fabCurrentlyVisible = false;
    }
  }
  updateWAPosition();
}, { passive: true });

window.addEventListener('resize', updateWAPosition, { passive: true });

// Hide FAB when builder is visible
const builderSec = document.getElementById('builder');
if (builderSec && mobileFAB) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mobileFAB.classList.add('hidden');
        fabCurrentlyVisible = false;
      } else if (window.scrollY > 350) {
        mobileFAB.style.display = 'block';
        mobileFAB.classList.remove('hidden');
        fabCurrentlyVisible = true;
      }
      updateWAPosition();
    });
  }, { threshold: 0.1 }).observe(builderSec);
}

/* ================================================================
   DYNAMIC IMAGE SYSTEM (Section-Bound)
   Ensures premium 4K images match exact section requirements
   ================================================================ */
const SITE_IMAGES = {
  // --- Destinations ---
  'dest-port-blair': {
    primary: 'images/dest_port_blair.png', // Aerial coastline
    fallback: 'https://images.unsplash.com/photo-1590123715937-29a7ddd2e52c?auto=format&fit=crop&w=1600&q=90'
  },
  'dest-havelock': {
    primary: 'images/dest_havelock.png', // Crystal turquoise water
    fallback: 'https://images.unsplash.com/photo-1573492546564-fb0e3b2e0f09?auto=format&fit=crop&w=1600&q=90'
  },
  'dest-neil': {
    primary: 'images/dest_neil.png', // Natural rock / calm sea
    fallback: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=90'
  },
  'dest-north-goa': {
    primary: 'images/dest_north_goa.png', // Vibrant beach/nightlife vibe
    fallback: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=90'
  },
  'dest-south-goa': {
    primary: 'images/dest_south_goa.png', // Serene, empty coastline
    fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=90'
  },

  // --- Packages ---
  'pkg-luxury': {
    primary: 'images/pkg_luxury.png', // Ocean view villa / resort
    fallback: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=90'
  },
  'pkg-adventure': {
    primary: 'images/pkg_adventure.png', // Scuba diving / vibrant marine
    fallback: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1600&q=90'
  },
  'pkg-family': {
    primary: 'images/pkg_family.png', // Family on beach
    fallback: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=90'
  },
  'pkg-honeymoon': {
    primary: 'images/pkg_honeymoon.png', // Romantic sunset beach
    fallback: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1600&q=90'
  },
  'pkg-budget': {
    primary: 'images/pkg_budget.png', // Clean nice room
    fallback: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=90'
  }
};

function initSectionImages() {
  document.querySelectorAll('[data-img]').forEach(el => {
    const key = el.dataset.img;
    if (SITE_IMAGES[key]) {
      const imgObj = SITE_IMAGES[key];
      // Preload primary image to ensure it works
      const tempImg = new Image();
      tempImg.onload = () => { el.style.backgroundImage = `url('${imgObj.primary}')`; };
      tempImg.onerror = () => { el.style.backgroundImage = `url('${imgObj.fallback}')`; };
      tempImg.src = imgObj.primary;
    }
  });
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initSectionImages();
  showStep(1);
  setNights(5);
  setBudget(75000);
  recalcPrice();
  updateAIStatusLabel();
  if (nightsSlider) nightsSlider.style.backgroundSize = '28.5% 100%'; // 5/14 ≈ 28.5%

  // Fetch live exchange rates in background (non-blocking)
  fetchExchangeRates();

  // ── Lazy-load gallery background images ──────────────────────────
  // Gallery images use inline style="background-image:url(...)"
  // Convert them to data-bg for lazy loading ONLY if IntersectionObserver is available
  if ('IntersectionObserver' in window) {
    const galImgs = document.querySelectorAll('.gal-img[style*="background-image"]');
    galImgs.forEach(el => {
      const styleAttr = el.getAttribute('style') || '';
      const match = styleAttr.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
      if (match) {
        el.setAttribute('data-bg', match[1]);
        el.style.backgroundImage = 'none'; // hide until in view
      }
    });

    const lazyObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const src = el.dataset.bg;
          if (src) {
            el.style.backgroundImage = `url('${src}')`;
            delete el.dataset.bg;
          }
          obs.unobserve(el);
        }
      });
    }, { rootMargin: '200px 0px' }); // preload 200px before entering view

    document.querySelectorAll('.gal-img[data-bg]').forEach(el => lazyObserver.observe(el));
  }
});

