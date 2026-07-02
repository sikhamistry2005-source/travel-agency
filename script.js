/* ================================================================
   SEVEN RAYS TRAVEL — V3 SCRIPT
   OpenAI AI · Live Currency · Translation Fix · Pricing Breakdown
   ================================================================ */
'use strict';

// Inject gallery_show_more translations if window.SR_TRANSLATIONS is available
if (window.SR_TRANSLATIONS) {
  const showMoreTranslations = {
    en: 'Show More Images 📸',
    hi: 'और तस्वीरें दिखाएं 📸',
    bn: 'আরো ছবি দেখান 📸',
    ta: 'மேலும் படங்களைக் காட்டு 📸',
    te: 'మరిన్ని చిత్రాలను చూపించు 📸',
    es: 'Mostrar más imágenes 📸',
    fr: 'Afficher plus d\'images 📸',
    de: 'Mehr Bilder anzeigen 📸',
    ar: 'عرض المزيد من الصور 📸',
    zh: '显示更多图片 📸'
  };
  Object.keys(showMoreTranslations).forEach(lang => {
    if (window.SR_TRANSLATIONS[lang]) {
      window.SR_TRANSLATIONS[lang].gallery_show_more = showMoreTranslations[lang];
    }
  });
}


/* ================================================================
   ADMIN PORTAL CONFIG & STATE
   ================================================================ */
const defaultAdminConfig = {
  cashModeEnabled: false,
  packagePrices: {
    explore_portblair: 12000,
    escapade_andaman: 18000,
    offbeat_andaman: 19500,
    paradise_pair: 38000,
    island_bliss: 25000,
    island_treasures: 24000,
    tidal_romance: 48000,
    andaman_odyssey: 32000,
    romantic_retreats: 56000,
    andaman_aura: 35000,
    seasoul_sojourn: 42000,
    ethereal_isles: 46000
  },
  packageDisabled: {
    explore_portblair: false,
    escapade_andaman: false,
    offbeat_andaman: false,
    paradise_pair: false,
    island_bliss: false,
    island_treasures: false,
    tidal_romance: false,
    andaman_odyssey: false,
    romantic_retreats: false,
    andaman_aura: false,
    seasoul_sojourn: false,
    ethereal_isles: false
  },
  baseRate: 5000,
  accomRates: {
    homestay: 1750,
    budget: 4000,
    premium: 9000,
    luxury: 20000,
    villa: 45000
  },
  actRates: {
    scuba: 3500,
    snorkel: 1500,
    island: 2500,
    dinner: 4000,
    watersports: 2000,
    seawalk: 2800,
    kayak: 1800,
    glassbottom: 1200,
    trek: 2200
  },
  transRates: {
    flight: 12000,
    ferry: 3000,
    cab: 5000
  }
};

let adminConfig = { ...defaultAdminConfig };

function loadAdminConfig() {
  try {
    const saved = localStorage.getItem('sr_admin_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      adminConfig = {
        ...defaultAdminConfig,
        ...parsed,
        packagePrices: { ...defaultAdminConfig.packagePrices, ...(parsed.packagePrices || {}) },
        packageDisabled: { ...defaultAdminConfig.packageDisabled, ...(parsed.packageDisabled || {}) },
        accomRates: { ...defaultAdminConfig.accomRates, ...(parsed.accomRates || {}) },
        actRates: { ...defaultAdminConfig.actRates, ...(parsed.actRates || {}) },
        transRates: { ...defaultAdminConfig.transRates, ...(parsed.transRates || {}) }
      };
    }
  } catch (e) {
    console.error("Failed to load admin config:", e);
  }
}

function saveAdminConfigToStorage() {
  try {
    localStorage.setItem('sr_admin_config', JSON.stringify(adminConfig));
  } catch (e) {
    console.error("Failed to save admin config:", e);
  }
}

loadAdminConfig();


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

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) {
      el.placeholder = dict[key];
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
  explore_portblair: {
    title: 'EXPLORE PORTBLAIR', duration: '3 Days / 2 Nights · Andaman',
    image: 'images/pkg_explore_portblair.png',
    pdf: 'images/PACKAGES/EXPLORE PORTBLAIR(3 DAYS).pdf',
    highlights: ['Corbyn\'s Cove beach visit','Historic Cellular Jail visit','Cellular Jail Light & Sound show','Ross Island heritage tour','North Bay Island coral reef','Local shopping tour included'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail visit & Light Show',
      'Day 2: Ross Island exploration → North Bay Island water activities → Local shopping',
      'Day 3: Drop to Airport for departure'
    ],
    price: 12000, unit: 'per person',
  },
  escapade_andaman: {
    title: 'ESCAPADE ANDAMAN', duration: '4 Days / 3 Nights · Andaman',
    image: 'images/pkg_escapade_andaman.png',
    pdf: 'images/PACKAGES/ESCAPADE ANDAMAN(4 DAYS).pdf',
    highlights: ['Cellular Jail light & sound show','Havelock Island cruise trip','Radhanagar Beach sunset','Kalapathar Beach sightseeing','Local shopping tour','Corbyn\'s Cove beach visit'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail visit & Light Show',
      'Day 2: Port Blair → Havelock Island by cruise → Radhanagar Beach sunset',
      'Day 3: Kalapathar Beach → Return to Port Blair → Local shopping',
      'Day 4: Drop to Airport for departure'
    ],
    price: 18000, unit: 'per person',
  },
  offbeat_andaman: {
    title: 'OFFBEAT ANDAMAN', duration: '4 Days / 3 Nights · Andaman',
    image: 'images/pkg_offbeat_andaman.png',
    pdf: 'images/PACKAGES/OFFBEAT ANDAMAN(4 DAYS).pdf',
    highlights: ['Jolly Buoy Island coral reef','Wandoor Beach marine park','Chidiyatapu Beach sunset','Munda Pahar scenic trek','Cellular Jail tour & show','Local shopping tour'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail tour & Light Show',
      'Day 2: Wandoor Beach → Jolly Buoy Island day trip',
      'Day 3: Chidiyatapu Beach → Munda Pahar scenic trek → Local shopping',
      'Day 4: Drop to Airport for departure'
    ],
    price: 19500, unit: 'per person',
  },
  paradise_pair: {
    title: 'PARADISE PAIR HONEYMOON', duration: '4 Days / 3 Nights · Andaman',
    image: 'images/pkg_paradise_pair.png',
    pdf: 'images/PACKAGES/PARADISE PAIR HONEYMOON(4 DAYS).pdf',
    highlights: ['Complimentary Candle Night dinner','Havelock Island romantic cruise','Radhanagar Beach sunset walk','Kalapathar Beach visit','Chidiyatapu Beach sunset','Cellular Jail visit & light show'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail & Light Show',
      'Day 2: Port Blair → Havelock Island → Radhanagar Beach → Complimentary Candle Night dinner',
      'Day 3: Kalapathar Beach → Return to Port Blair → Chidiyatapu Beach sunset',
      'Day 4: Drop to Airport for departure'
    ],
    price: 38000, unit: 'per couple',
  },
  island_bliss: {
    title: 'ISLAND BLISS', duration: '5 Days / 4 Nights · Andaman',
    image: 'images/pkg_island_bliss.png',
    pdf: 'images/PACKAGES/ISLAND BLISS(5 DAYS).pdf',
    highlights: ['Havelock & Neil Island cruise','Radhanagar Beach sunset','Bharatpur & Laxmanpur beaches','Natural Rock Formation Neil','Chidiyatapu Beach visit','Cellular Jail visit & light show'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail & Light Show',
      'Day 2: Port Blair → Havelock Island → Radhanagar Beach sunset',
      'Day 3: Kalapathar Beach → Neil Island cruise → Bharatpur & Laxmanpur beaches & Natural Rock Formation',
      'Day 4: Return to Port Blair → Chidiyatapu Beach → Local shopping',
      'Day 5: Drop to Airport for departure'
    ],
    price: 25000, unit: 'per person',
  },
  island_treasures: {
    title: 'ISLAND TREASURES', duration: '5 Days / 4 Nights · Andaman',
    image: 'images/pkg_island_treasures.png',
    pdf: 'images/PACKAGES/ISLAND TREASURES(5 DAYS).pdf',
    highlights: ['Baratang Island roadtrip','Limestone Cave exploration','Tropical forest road safari','Wandoor Beach & Collinpur Beach','Ross Island & North Bay Island','Kurmadera Beach visit'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail visit & Light Show',
      'Day 2: North Bay Island → Ross Island exploration',
      'Day 3: Wandoor Beach → Collinpur Beach → Kurmadera Beach',
      'Day 4: Roadtrip to Baratang (tropical forest) → Limestone Cave → Return Port Blair → Local shopping',
      'Day 5: Drop to Airport for departure'
    ],
    price: 24000, unit: 'per person',
  },
  tidal_romance: {
    title: 'TIDAL ROMANCE HONEYMOON', duration: '5 Days / 4 Nights · Andaman',
    image: 'images/pkg_tidal_romance.png',
    pdf: 'images/PACKAGES/TIDAL ROMANCE HONEYMOON(5 DAYS).pdf',
    highlights: ['Complimentary Scuba Diving','Complimentary Candle Night dinner','Elephanta Beach coral reef','Radhanagar & Kalapathar beaches','Chidiyatapu Beach sunset','Cellular Jail tour & show'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail & Light Show',
      'Day 2: Port Blair → Havelock Island → Radhanagar Beach sunset',
      'Day 3: Havelock Island → Complimentary Scuba Diving & Elephanta Beach → Kalapathar Beach → Candle Night dinner',
      'Day 4: Return back to Port Blair → Chidiyatapu Beach sunset',
      'Day 5: Drop to Airport for departure'
    ],
    price: 48000, unit: 'per couple',
  },
  andaman_odyssey: {
    title: 'ANDAMAN ODYSSEY', duration: '6 Days / 5 Nights · Andaman',
    image: 'images/pkg_andaman_odyssey.png',
    pdf: 'images/PACKAGES/ANDAMAN ODYSSEY(6 DAYS).pdf',
    highlights: ['Havelock & Neil Island cruise','Radhanagar Beach sunset','Elephanta Beach water sports','Bharatpur & Laxmanpur beaches','Natural Rock Formation Neil','Chidiyatapu Beach & shopping'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail & Light Show',
      'Day 2: Port Blair → Havelock Island → Radhanagar Beach sunset',
      'Day 3: Havelock Island → Elephanta Beach & Kalapathar Beach',
      'Day 4: Neil Island cruise → Bharatpur Beach → Laxmanpur Beach & Natural Rock Formation → Return Port Blair',
      'Day 5: Chidiyatapu Beach → Local shopping tour',
      'Day 6: Drop to Airport for departure'
    ],
    price: 29000, unit: 'per person',
  },
  romantic_retreats: {
    title: 'ROMANTIC RETREATS HONEYMOON', duration: '6 Days / 5 Nights · Andaman',
    image: 'images/pkg_romantic_retreats.png',
    pdf: 'images/PACKAGES/ROMANTIC RETREATS HONEYMOON(6 DAYS).pdf',
    highlights: ['Complimentary Scuba Diving','Complimentary Candle Night dinner','Havelock & Neil Island cruise','Radhanagar & Kalapathar beaches','Laxmanpur Beach sunset','Chidiyatapu Beach sunset & shopping'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail & Light Show',
      'Day 2: Port Blair → Havelock Island → Radhanagar Beach sunset → Kalapathar Beach',
      'Day 3: Havelock Island → Complimentary Scuba Diving & Elephanta Beach → Candle Night dinner',
      'Day 4: Neil Island cruise → Bharatpur Beach → Laxmanpur Beach sunset & Natural Rock Formation',
      'Day 5: Return to Port Blair → Chidiyatapu Beach → Local shopping',
      'Day 6: Drop to Airport for departure'
    ],
    price: 58000, unit: 'per couple',
  },
  andaman_aura: {
    title: 'ANDAMAN AURA', duration: '7 Days / 6 Nights · Andaman',
    image: 'images/pkg_andaman_aura.png',
    pdf: 'images/PACKAGES/ANDAMAN AURA(7 DAYS).pdf',
    highlights: ['Baratang Island roadtrip','Limestone Cave exploration','Havelock & Neil Island cruise','Radhanagar Beach sunset','Elephanta Beach water sports','Bharatpur & Laxmanpur beaches','Natural Rock Formation Neil'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail & Light Show',
      'Day 2: Port Blair → Havelock Island → Radhanagar Beach sunset',
      'Day 3: Havelock Island → Elephanta Beach & Kalapathar Beach',
      'Day 4: Neil Island cruise → Bharatpur Beach → Laxmanpur Beach & Natural Rock Formation',
      'Day 5: Return to Port Blair → Local shopping tour',
      'Day 6: Tropical Roadtrip to Baratang → Limestone Cave → Return to Port Blair',
      'Day 7: Drop to Airport for departure'
    ],
    price: 34000, unit: 'per person',
  },
  seasoul_sojourn: {
    title: 'SEASOUL SOJOURN', duration: '8 Days / 7 Nights · Andaman',
    image: 'images/pkg_seasoul_sojourn.png',
    pdf: 'images/PACKAGES/SEASOUL SOJOURN(8 DAYS).pdf',
    highlights: ['Baratang Island roadtrip','Limestone Cave exploration','Ross Island & North Bay tour','Havelock & Neil Island cruise','Radhanagar Beach sunset','Elephanta Beach water sports','Bharatpur & Laxmanpur beaches','Natural Rock Formation Neil'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail & Light Show',
      'Day 2: Port Blair → Havelock Island → Radhanagar Beach sunset',
      'Day 3: Havelock Island → Elephanta Beach & Kalapathar Beach',
      'Day 4: Neil Island cruise → Bharatpur Beach → Laxmanpur Beach & Natural Rock Formation',
      'Day 5: Return to Port Blair → Local resort stay',
      'Day 6: Ross Island exploration → North Bay Island tour → Local shopping',
      'Day 7: Tropical Roadtrip to Baratang → Limestone Cave → Return to Port Blair',
      'Day 8: Drop to Airport for departure'
    ],
    price: 39000, unit: 'per person',
  },
  ethereal_isles: {
    title: 'ETHEREAL ISLES', duration: '9 Days / 8 Nights · Andaman',
    image: 'images/pkg_ethereal_isles.png',
    pdf: 'images/PACKAGES/ETHEREAL ISLES(9 DAYS).pdf',
    highlights: ['Middle & North Andaman tour','Rangat & Diglipur roadtrip','Ross & Smith Island beach','Dhaninallah & Morichedera beaches','Havelock & Neil Island cruise','Radhanagar Beach sunset','Limestone Cave Baratang'],
    itinerary: [
      'Day 1: Arrival → Corbyn\'s Cove beach → Cellular Jail & Light Show',
      'Day 2: Depart to Middle Andaman (Rangat) → Dhaninallah beach → Stay Rangat',
      'Day 3: Visit Morichedera beach → Diglipur → Kalipur beach → Stay Diglipur',
      'Day 4: Visit Ross & Smith twin beach → Stay Diglipur',
      'Day 5: Return to Port Blair → Chidiyatapu beach',
      'Day 6: Depart towards Havelock → Radhanagar beach sunset',
      'Day 7: Kalapathar Beach → Neil Island cruise → Bharatpur & Laxmanpur beaches & Natural Rock Formation',
      'Day 8: Return to Port Blair → Local shopping tour',
      'Day 9: Drop to Airport for departure'
    ],
    price: 46000, unit: 'per person',
  },
};

window.openPackageModal = function(key) {
  const pkg = packageData[key];
  if (!pkg) return;
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img" style="background-image:url('${pkg.image}')"></div>
    <div class="modal-body">
      <h3>${pkg.title}</h3>
      <p class="modal-duration">📅 ${pkg.duration}</p>
      <div class="modal-section-title">What's Included</div>
      <ul class="modal-highlights">${pkg.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>
      <div class="modal-section-title">Itinerary</div>
      <ul class="modal-highlights">${pkg.itinerary.map(i=>`<li>${i}</li>`).join('')}</ul>
      ${adminConfig.cashModeEnabled ? `
      <div class="modal-price-info" style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 0.9rem; color: var(--text-3); display: block; margin-bottom: 2px;">Starting from</span>
        <div style="font-size: 1.8rem; font-weight: 700; color: var(--yellow); line-height: 1.2;">
          ${formatCurrency(adminConfig.packagePrices[key] || pkg.price)}
          <span style="font-size: 0.9rem; font-weight: 400; color: var(--text-3);">/ ${pkg.unit}</span>
        </div>
      </div>
      ` : ''}
      <div class="modal-price-row" style="justify-content: center; gap: 15px; flex-wrap: wrap;">
        <a href="https://wa.me/918073740495?text=Hi!%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.title)}%20package." class="btn btn-primary" style="display: flex; align-items: center; gap: 8px;" target="_blank">
          <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          <span data-i18n="btn_enquire_whatsapp">Enquire on WhatsApp</span>
        </a>
        <a href="#builder" class="btn btn-outline-dark" onclick="closePackageModal()" data-i18n="btn_customize_trip">Customize Trip</a>
      </div>
      ${pkg.pdf ? `
      <div style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
        <a href="${pkg.pdf}" class="btn btn-outline-dark btn-full" style="display: flex; align-items: center; justify-content: center; gap: 8px;" download target="_blank">
          <span>📄</span> Download Detailed PDF Itinerary
        </a>
      </div>
      ` : ''}
    </div>`;
  document.getElementById('packageModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closePackageModal = function(e) {
  if (e && e.target !== document.getElementById('packageModal')) return;
  document.getElementById('packageModal').classList.remove('open');
  document.body.style.overflow = '';
};

window.openLegalModal = function(type) {
  const dict = (window.SR_TRANSLATIONS || {})[currentLang] || (window.SR_TRANSLATIONS || {})['en'];
  const title = dict[type + '_title'] || (type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions');
  const body = dict[type + '_body'] || '';
  
  document.getElementById('legalModalContent').innerHTML = `
    <h2 style="font-family: var(--font-serif); font-size: 2rem; font-weight: 700; margin-bottom: 20px; color: var(--text-1); border-bottom: 2px solid var(--yellow); padding-bottom: 10px;">${title}</h2>
    <div style="font-size: 0.95rem; color: var(--text-2);">
      ${body}
    </div>
  `;
  document.getElementById('legalModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeLegalModal = function(e) {
  if (e && e.target !== document.getElementById('legalModal')) return;
  document.getElementById('legalModal').classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    window.closePackageModal();
    window.closeLegalModal();
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
const ACCOM_PRICE_INR = { homestay: 1750, budget: 4000, premium: 9000, luxury: 20000, villa: 45000 };
const GUIDE_PER_DAY = 3500;
const CONCIERGE_PER_DAY = 8000;
const BASE_PER_NIGHT = { andaman: 5000 };

function computeBreakdown() {
  const nights = Math.max(1, state.nights);
  const adults = Math.max(1, state.adults);
  const children = state.children;

  // Stay
  const accomRate = adminConfig.accomRates[state.accommodation] || 0;
  const baseRate = adminConfig.baseRate || 0;
  const stayTotal = (accomRate + baseRate) * nights;

  // Activities
  let actTotal = 0;
  state.activities.forEach(act => {
    const actRate = adminConfig.actRates[act.value] || 0;
    actTotal += actRate * adults + actRate * 0.5 * children;
  });

  // Transport
  let transTotal = 0;
  if (state.transport) {
    const transRate = adminConfig.transRates[state.transport] || 0;
    if (state.transport === 'cab') transTotal = transRate;
    else transTotal = transRate * (adults + children);
  }

  // Add-ons
  let aoTotal = 0;
  // All add-ons are price on request (charges extra) and contribute 0 to the base price estimate.

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
  const dict = (window.SR_TRANSLATIONS || {})[currentLang] || (window.SR_TRANSLATIONS || {})['en'];

  function setVal(id, val, isAddon = false) {
    const el = document.getElementById(id);
    if (!el) return;
    if (val > 0 || (isAddon && state.addons.length > 0)) {
      if (adminConfig.cashModeEnabled) {
        if (isAddon) {
          el.textContent = dict.ao_extra_charge || 'Charges extra';
        } else {
          el.textContent = formatCurrency(val);
        }
      } else {
        if (isAddon) {
          el.textContent = dict.ao_extra_charge || 'Charges extra';
        } else {
          el.textContent = dict.price_on_request || 'Enquire Now';
        }
      }
      el.classList.add('has-value');
    } else {
      el.textContent = '—';
      el.classList.remove('has-value');
    }
  }

  setVal('cbStayVal', stayTotal);
  setVal('cbActVal', actTotal);
  setVal('cbTransVal', transTotal);
  setVal('cbAoVal', aoTotal, true);
}

function updateSummaryItems(breakdown) {
  const el = document.getElementById('summaryItems');
  if (!el) return;

  const ACCOM_LABELS = { homestay: 'Homestay / Hostel', budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
  const TRANS_LABELS = { flight: '✈️ Flights', ferry: '⛴️ Ferry', cab: '🚗 Private Cab' };

  const items = [];
  items.push({ l: '📍 Destination', v: 'Andaman' });
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

const WA_NUMBER = '918073740495'; // Admin WhatsApp number

/* Labels for human-readable output */
const WA_ACCOM_LABELS  = { homestay: 'Homestay / Hostel', budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
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

Hi! I'm interested in planning a trip to Andaman.
Could you please help me with options and pricing?

📩 Looking forward to hearing from you! 🙏`;
    return encodeURIComponent(basic);
  }

  /* ── STRUCTURED message with only the fields the user filled ── */
  const lines = [];

  lines.push('🌍 *New Trip Inquiry — Seven Rays*');
  lines.push('');

  // Destination
  lines.push(`📍 *Destination:* Andaman`);

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
    if (adminConfig.cashModeEnabled) {
      lines.push(`💵 *Estimated Total:* ${formatCurrency(bd.total)}`);
    } else {
      lines.push(`💵 *Estimated Total:* Price on Request`);
    }
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
    const general = '🌍 *Hello Seven Rays!*\n\nI\'d like to learn more about your Andaman travel packages.\nCould you please share the details? 🙏';
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

/* — Offline AI Planner Utilities — */
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

window.sendAIMessage = async function() {
  const text = aiInput.value.trim();
  if (!text) return;
  appendMsg(text, 'user');
  aiInput.value = '';
  const typingBubble = appendMsg('', 'bot', true);

  try {
    // Simulate smart thinking delay
    await new Promise(r => setTimeout(r, 1200));
    const responseText = generateSmartFallback(text);

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
    typingBubble.textContent = '❌ Unable to generate plan right now. Please try again.';
    showToast('AI request failed. Please try again.', 'error');
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
  const ACCOM = { homestay: 'Homestay / Hostel', budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
  const chips = [];
  chips.push(`📍 Andaman`);
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
    await new Promise(r => setTimeout(r, 1200));
    const planHTML = renderBuiltinAutoPlan();

    resultEl.innerHTML = planHTML;
    resultEl.style.display = 'block';
    if (infoEl) infoEl.style.display = 'none';

  } catch(err) {
    resultEl.innerHTML = `<div style="padding:20px;text-align:center">
      <div style="font-size:2rem;margin-bottom:12px">❌</div>
      <p style="color:var(--text-2);margin-bottom:16px">Unable to generate plan. Please check your inputs.</p>
      <button class="btn btn-primary btn-sm" onclick="generateAutoPlan()">Try Again</button>
    </div>`;
    resultEl.style.display = 'block';
    showToast('Plan generation failed. Try again.', 'error');
  }

  btn.classList.remove('btn-loading');
  btn.textContent = '⚡ Regenerate Plan';
  btn.disabled = false;
};

function buildAutoPrompt() {
  const ACCOM = { homestay: 'Homestay / Hostel', budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
  const dest = 'Andaman';
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
        <p style="font-size:0.82rem;color:var(--text-3)">Andaman · ${state.nights} Nights · GPT-4 Powered</p>
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
      <p style="font-size:0.82rem;color:var(--text-1)">💡 <strong>Pro tip by Seven Rays:</strong> Book ferries to Havelock 48hrs in advance during peak season (Oct–Mar) for a hassle-free island hopping experience.</p>
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
  
  // Destination matching
  const isGoa = /goa/.test(lower);
  if (isGoa) {
    return `🌴 Seven Rays currently focuses exclusively on crafting premium, luxury travel experiences in the Andaman Islands.\n\nWe would be delighted to plan an unforgettable Andaman escape for you! Let me know if you would like a romantic, family, or adventure-focused Andaman itinerary.`;
  }

  // Parse days
  let days = 5; // default
  const wordNumbers = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14
  };
  const matches = lower.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|\d+)\s*day/);
  if (matches) {
    const val = matches[1];
    days = parseInt(val) || wordNumbers[val] || 5;
  } else {
    // Fallback search for a simple number
    const numMatch = lower.match(/\b(\d+)\b/);
    if (numMatch) {
      const val = parseInt(numMatch[1]);
      if (val >= 1 && val <= 14) days = val;
    }
  }
  days = Math.max(1, Math.min(14, days));
  const nights = Math.max(1, days - 1);

  // Type of trip
  const isHoneymoon = /honeymoon|romantic|couple|anniversary/.test(lower);
  const isFamily = /family|kids|children|child/.test(lower);
  const isAdventure = /adventure|scuba|diving|trek|extreme/.test(lower);
  const isLuxury = /luxury|villa|premium|high.end|exclusive/.test(lower);

  let accom = 'premium';
  let acts = ['island', 'snorkel'];
  let addons = ['guide'];
  let title = '🌴 Classic Andaman Getaway';

  if (isHoneymoon) {
    accom = 'luxury';
    acts = ['snorkel', 'dinner', 'island'];
    addons = ['honeymoon', 'beachdinner', 'spa', 'photo'];
    title = '💕 Romantic Andaman Honeymoon';
  } else if (isFamily) {
    accom = 'premium';
    acts = ['glassbottom', 'snorkel', 'island', 'watersports'];
    addons = ['guide'];
    title = '👨‍👩‍👧‍👦 Premium Family Explorer';
  } else if (isAdventure) {
    accom = 'budget';
    acts = ['scuba', 'snorkel', 'seawalk', 'watersports', 'kayak', 'trek'];
    addons = ['underwater', 'biolum', 'guide'];
    title = '⚡ Active Andaman Adventure';
  } else if (isLuxury) {
    accom = 'villa';
    acts = ['scuba', 'snorkel', 'island', 'dinner'];
    addons = ['yacht', 'drone', 'spa', 'photo', 'concierge', 'underwater'];
    title = '👑 Ultimate Luxury Escape';
  }

  // Daily descriptions library
  const dailyPlans = [
    { t: 'Arrival & Discovery', c: 'Airport pickup → Port Blair hotel check-in. Explore Corbyn\'s Cove Beach for sunset. Evening: Attend the historic Cellular Jail Light & Sound Show.' },
    { t: 'North Bay & Ross Island', c: 'Day excursion to North Bay Island (snorkeling and glass-bottom boat rides above vibrant reefs) and Ross Island (explore British-era ruins and meet free-roaming deer).' },
    { t: 'Ferry to Havelock Island', c: 'Board the morning ferry to Havelock Island. Check-in at your beachfront resort. Spend a relaxing afternoon at Radhanagar Beach, famous for its powder-white sand and stunning sunset views.' },
    { t: 'Elephant Beach Adventure', c: 'Take a speed boat ride to Elephant Beach. Indulge in exciting water activities like sea walking, snorkeling, or jet skiing. Enjoy the pristine turquoise waters.' },
    { t: 'Kalapathar Beach Palms', c: 'Watch the sunrise at Kalapathar Beach with its unique black rocks and turquoise waters. Take a light jungle walk or relax under the palm trees.' },
    { t: 'Neil Island Serenity', c: 'Ferry to Neil Island. Visit Bharatpur Beach for coral viewing and Laxmanpur Beach for a serene walk. Catch the spectacular sunset by the sea.' },
    { t: 'Neil Island Rock Formations', c: 'Visit the famous natural rock formation (Howrah Bridge) during low tide. Experience the rustic and peaceful atmosphere of the island.' },
    { t: 'Mount Harriet Forest Trek', c: 'Day trip to Mount Harriet National Park, the highest point in South Andaman. Enjoy scenic forest trails and beautiful bird watching spots.' },
    { t: 'Baratang Island Caves', c: 'Early morning drive to Baratang Island. Pass through tribal reserve forests, take a speed boat through dense mangroves, and explore the ancient limestone caves.' },
    { t: 'Chidiyatapu Sunset Point', c: 'Visit Chidiyatapu (Bird Island) for spectacular coastal views, walks through the biological park, and a legendary sunset over the ocean.' },
    { t: 'Jolly Buoy Coral Reefs', c: 'Excursion to Jolly Buoy Island in the Mahatma Gandhi Marine National Park. Witness some of the best coral reefs and underwater marine life in India.' },
    { t: 'Viper Island Historic Cruise', c: 'Harbour cruise around Port Blair, stopping to explore Viper Island ruins and the historical remnants of the colonial era.' },
    { t: 'Coastal Kayaking', c: 'Enjoy a peaceful guided kayak journey through the serene mangrove creeks in the morning, followed by a relaxing spa session in Havelock.' },
    { t: 'Departure transfer', c: 'Collect beautiful local shell crafts at Aberdeen Market. Head to the airport for your flight home with sweet memories of Andaman!' }
  ];

  // Build custom itinerary for exact days count
  const itineraryDays = [];
  for (let i = 1; i <= days; i++) {
    let dayData;
    if (i === 1) {
      dayData = dailyPlans[0];
    } else if (i === days) {
      dayData = dailyPlans[dailyPlans.length - 1];
    } else {
      // Pick intermediate days
      const idx = (i - 1) % (dailyPlans.length - 2) + 1;
      dayData = dailyPlans[idx];
    }
    itineraryDays.push({ d: i, t: dayData.t, c: dayData.c });
  }

  // Calculate customized budget estimate
  const baseRate = isLuxury ? 35000 : isHoneymoon ? 25000 : isFamily ? 20000 : 15000;
  const totalMin = baseRate * nights;
  const totalMax = Math.round(totalMin * 1.5);
  const budgetStr = `₹${totalMin.toLocaleString('en-IN')}–₹${totalMax.toLocaleString('en-IN')}`;

  const planJson = {
    destination: "andaman",
    nights: nights,
    accommodation: accom,
    activities: acts,
    addons: addons
  };

  let response = `<PLAN_JSON>${JSON.stringify(planJson)}</PLAN_JSON>\n\n${title} (${days} Days / ${nights} Nights)\n\n`;
  itineraryDays.forEach(day => {
    response += `Day ${day.d}: ${day.t}\n${day.c}\n\n`;
  });
  response += `Estimated Budget: ${budgetStr} for the package.\n\n💡 Tip: All transfers, entry tickets, and ferries are pre-booked for a hassle-free premium experience with Seven Rays.`;

  return response;
}

/* Built-in auto plan (no API key) */
function renderBuiltinAutoPlan() {
  const dest = 'Andaman';
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

  const rawDays = andamanDays;
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

// Gallery Pagination & Limits
let activeGalleryFilter = 'all';
let currentGalleryLimit = window.innerWidth <= 768 ? 8 : 12;

function updateGalleryVisibility() {
  const items = document.querySelectorAll('.gal-item');
  let matchingCount = 0;
  items.forEach(item => {
    const matchesCategory = activeGalleryFilter === 'all' || item.dataset.cat === activeGalleryFilter;
    if (matchesCategory) {
      item.classList.remove('hidden'); // clear filter-hidden
      if (matchingCount < currentGalleryLimit) {
        item.classList.remove('hidden-limit');
        matchingCount++;
      } else {
        item.classList.add('hidden-limit');
      }
    } else {
      item.classList.add('hidden');
      item.classList.remove('hidden-limit');
    }
  });

  // Update Show More button visibility
  const showMoreBtn = document.getElementById('galleryShowMoreBtn');
  if (showMoreBtn) {
    const totalMatching = [...items].filter(item => activeGalleryFilter === 'all' || item.dataset.cat === activeGalleryFilter).length;
    if (totalMatching > currentGalleryLimit) {
      showMoreBtn.style.display = 'inline-flex';
    } else {
      showMoreBtn.style.display = 'none';
    }
  }
}

// Bind Show More button click
const showMoreBtn = document.getElementById('galleryShowMoreBtn');
if (showMoreBtn) {
  showMoreBtn.addEventListener('click', () => {
    currentGalleryLimit += 12; // Show 12 more items
    updateGalleryVisibility();
  });
}

document.querySelectorAll('.gal-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gal-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeGalleryFilter = btn.dataset.filter;
    // Reset limit on category switch
    currentGalleryLimit = window.innerWidth <= 768 ? 8 : 12;
    updateGalleryVisibility();

    // Fade-in animation for active elements
    document.querySelectorAll('.gal-item:not(.hidden):not(.hidden-limit)').forEach(item => {
      item.style.opacity = '0'; item.style.transform = 'scale(0.95)';
      requestAnimationFrame(() => setTimeout(() => {
        item.style.transition = 'all 0.4s ease';
        item.style.opacity = '1'; item.style.transform = 'scale(1)';
      }, 20));
    });
  });
});

function buildLb() {
  lbImages = [];
  document.querySelectorAll('.gal-item:not(.hidden) .gal-img').forEach(el => {
    lbImages.push({
      src: el.dataset.full || '',
      caption: el.dataset.caption || '',
    });
  });
}


// Dynamic click handlers attached during gallery init

function openLb(idx) {
  buildLb();
  if (!lbImages.length) return;
  lbIdx = Math.max(0, Math.min(idx, lbImages.length - 1));
  if (lbImg) lbImg.src = lbImages[lbIdx].src;
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
  window.open(`https://wa.me/918073740495?text=${msg}`, '_blank');
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

let scrollTimeout = null;
let builderVisible = false;

window.addEventListener('scroll', () => {
  const past = window.scrollY > 350;
  if (waFloat) waFloat.style.opacity = past ? '1' : '0';

  if (mobileFAB) {
    if (past && !builderVisible) {
      mobileFAB.classList.remove('hidden');
      fabCurrentlyVisible = true;
      updateWAPosition();

      // Clear any existing scroll timeout
      if (scrollTimeout) clearTimeout(scrollTimeout);

      // Fade out after 3 seconds of scroll inactivity
      scrollTimeout = setTimeout(() => {
        mobileFAB.classList.add('hidden');
        fabCurrentlyVisible = false;
        updateWAPosition();
      }, 3000);
    } else {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      mobileFAB.classList.add('hidden');
      fabCurrentlyVisible = false;
      updateWAPosition();
    }
  }
}, { passive: true });

window.addEventListener('resize', updateWAPosition, { passive: true });

// Hide FAB when builder is visible
const builderSec = document.getElementById('builder');
if (builderSec && mobileFAB) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      builderVisible = entry.isIntersecting;
      if (builderVisible) {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        mobileFAB.classList.add('hidden');
        fabCurrentlyVisible = false;
        updateWAPosition();
      }
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
const GALLERY_IMAGES = [
  "WhatsApp Image 2026-06-25 at 19.50.17.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.18.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.19.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.20.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.22.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.23.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.25.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.26.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.27.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.37.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.45.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.46.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.47.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.49 (1).jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.49.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.50.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.51.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.52.jpeg",
  "WhatsApp Image 2026-06-25 at 19.50.54.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.10.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.12 (1).jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.12.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.14.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.15.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.17.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.18.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.19.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.22.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.24.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.25.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.27 (1).jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.27.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.30 (1).jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.30.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.32.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.34.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.35.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.36.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.38.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.39.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.42.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.43.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.46.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.47.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.50.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.51.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.52.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.53.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.54.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.55.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.58.jpeg",
  "WhatsApp Image 2026-06-25 at 19.51.59.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.01.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.02.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.03.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.04.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.05.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.07.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.09.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.10.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.12.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.13.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.15.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.34.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.37.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.39.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.44.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.45.jpeg",
  "WhatsApp Image 2026-06-25 at 19.52.46.jpeg"
];

function initDynamicPackages() {
  const grid = document.querySelector('.packages-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const badges = {
    explore_portblair: { text: 'Best Value', class: 'badge--green' },
    escapade_andaman: { text: 'Popular', class: 'badge--blue' },
    offbeat_andaman: { text: 'Adventure', class: 'badge--blue' },
    paradise_pair: { text: 'Honeymoon', class: 'badge--rose' },
    island_bliss: { text: 'Trending', class: 'badge--teal' },
    island_treasures: { text: 'Explorer', class: 'badge--gold' },
    tidal_romance: { text: 'Honeymoon', class: 'badge--rose' },
    andaman_odyssey: { text: 'Classic', class: 'badge--teal' },
    romantic_retreats: { text: 'Honeymoon Deluxe', class: 'badge--rose' },
    andaman_aura: { text: 'Premium', class: 'badge--gold' },
    seasoul_sojourn: { text: 'Grand Tour', class: 'badge--gold' },
    ethereal_isles: { text: 'Ultimate Luxury', class: 'badge--gold' }
  };

  Object.entries(packageData).forEach(([key, pkg], index) => {
    const card = document.createElement('div');
    card.className = 'pkg-card';
    card.setAttribute('data-animate', '');
    card.setAttribute('data-delay', (index % 3) * 100);

    const badgeInfo = badges[key] || { text: 'Andaman', class: 'badge--teal' };

    card.innerHTML = `
      <div class="pkg-img" style="background-image:url('${pkg.image}')">
        <span class="pkg-badge ${badgeInfo.class}">${badgeInfo.text}</span>
      </div>
      <div class="pkg-body">
        <div class="pkg-meta">
          <span class="pkg-duration">⏱ ${pkg.duration.split(' · ')[0]}</span>
          <span class="pkg-dest">📍 Andaman</span>
        </div>
        <h3 class="pkg-title">${pkg.title}</h3>
        <ul class="pkg-highlights">
          ${pkg.highlights.slice(0, 4).map(h => `<li>${h}</li>`).join('')}
        </ul>
        <div class="pkg-footer">
          <div class="pkg-price">
            <span class="price-from" data-i18n="price_from">Starting from</span>
            <span class="price-value" data-price-inr="${pkg.price}">${formatCurrency(pkg.price)}<small>/${pkg.unit === 'per couple' ? 'couple' : 'person'}</small></span>
          </div>
          <button class="btn btn-pkg" data-i18n="btn_view_details" onclick="openPackageModal('${key}')">View Details</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initDynamicGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const categories = ['beaches', 'activities', 'resorts'];
  const captions = {
    beaches: [
      'Radhanagar Beach Serenity', 'Pristine Neil Shoreline', 'Havelock Turquoise Waters', 
      'Chidiyatapu Coastal Sunset', 'Corbyn\'s Cove Afternoon', 'Ross & Smith Sandbar',
      'Quiet Cove View', 'Golden Hour Shore', 'Kalapathar Beach Palms'
    ],
    activities: [
      'Scuba Diving Adventure', 'Coral Reef Snorkeling', 'Jet Ski Excursion', 
      'Sea Walking Experience', 'Mangrove Kayaking Journey', 'Trek to Munda Pahar',
      'Baratang Cave Trek', 'Speedboat Excursion', 'Glass-Bottom Boat Sightseeing'
    ],
    resorts: [
      'Beachside Luxury Resort', 'Premium Island Cottage', 'Ocean View Suite', 
      'Infinity Pool at Dusk', 'Tropical Resort Pathway', 'Eco-friendly Cottage Stay',
      'Resort Garden View', 'Cozy Beach Hut Stay', 'Charming Island Villa'
    ]
  };

  GALLERY_IMAGES.forEach((filename, i) => {
    const cat = categories[i % categories.length];
    const captionList = captions[cat];
    const caption = captionList[i % captionList.length];
    
    const div = document.createElement('div');
    div.className = 'gal-item';
    div.setAttribute('data-cat', cat);
    
    // URL-encode the filename to handle spaces and parentheses safely in CSS url()
    const encodedFilename = encodeURIComponent(filename).replace(/\(/g, '%28').replace(/\)/g, '%29');
    
    div.innerHTML = `
      <div class="gal-img-wrap">
        <div class="gal-img" style="background-image:url('images/GALLERY/${encodedFilename}')" data-full="images/GALLERY/${encodedFilename}" data-caption="${caption.replace(/"/g, '&quot;')}"></div>
        <div class="gal-overlay">
          <span class="gal-expand">⊕</span>
        </div>
      </div>
    `;
    div.addEventListener('click', () => {
      buildLb();
      const visible = [...document.querySelectorAll('.gal-item:not(.hidden)')];
      lbIdx = visible.indexOf(div);
      openLb(lbIdx);
    });
    grid.appendChild(div);
  });
  
  // Apply gallery limits and initial pagination visibility
  updateGalleryVisibility();
}

window.scrollPackages = function(direction) {
  const grid = document.querySelector('.packages-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.pkg-card');
  if (cards.length === 0) return;

  const scrollLeft = grid.scrollLeft;
  const gridCenter = scrollLeft + grid.offsetWidth / 2;
  
  let closestIndex = 0;
  if (scrollLeft <= 15) {
    closestIndex = 0;
  } else if (scrollLeft >= grid.scrollWidth - grid.offsetWidth - 15) {
    closestIndex = cards.length - 1;
  } else {
    let closestDist = Infinity;
    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(gridCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = idx;
      }
    });
  }

  let targetIndex = closestIndex + direction;
  targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));
  
  const targetCard = cards[targetIndex];
  grid.scrollTo({
    left: targetCard.offsetLeft - (grid.offsetWidth - targetCard.offsetWidth) / 2,
    behavior: 'smooth'
  });
};

window.initPackagesSlider = function() {
  const grid = document.querySelector('.packages-grid');
  const dotsContainer = document.getElementById('sliderDots');
  if (!grid || !dotsContainer) return;

  const cards = Array.from(grid.querySelectorAll('.pkg-card')).filter(card => card.style.display !== 'none');
  dotsContainer.innerHTML = '';
  
  cards.forEach((card, idx) => {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      grid.scrollTo({
        left: card.offsetLeft - (grid.offsetWidth - card.offsetWidth) / 2,
        behavior: 'smooth'
      });
    });
    dotsContainer.appendChild(dot);
  });

  function updateActive() {
    const scrollLeft = grid.scrollLeft;
    const gridCenter = scrollLeft + grid.offsetWidth / 2;
    
    let closestIndex = 0;
    if (scrollLeft <= 15) {
      closestIndex = 0;
    } else if (scrollLeft >= grid.scrollWidth - grid.offsetWidth - 15) {
      closestIndex = cards.length - 1;
    } else {
      let closestDist = Infinity;
      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(gridCenter - cardCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = idx;
        }
      });
    }

    cards.forEach((card, idx) => {
      card.classList.toggle('active-card', idx === closestIndex);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === closestIndex);
    });
  }

  // Trigger immediately and after layout rendering completes
  updateActive();
  setTimeout(updateActive, 100);
  setTimeout(updateActive, 500);

  grid.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive, { passive: true });
};

document.addEventListener('DOMContentLoaded', () => {
  initDynamicGallery();
  if (window.applyAdminConfigToUI) window.applyAdminConfigToUI();
  if (window.initPackagesSlider) window.initPackagesSlider();
  initSectionImages();
  showStep(1);
  setNights(5);
  setBudget(75000);
  recalcPrice();
  if (nightsSlider) nightsSlider.style.backgroundSize = '28.5% 100%';

  fetchExchangeRates();

  if ('IntersectionObserver' in window) {
    const galImgs = document.querySelectorAll('.gal-img[style*="background-image"]');
    galImgs.forEach(el => {
      const styleAttr = el.getAttribute('style') || '';
      const match = styleAttr.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
      if (match) {
        el.setAttribute('data-bg', match[1]);
        el.style.backgroundImage = 'none';
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
    }, { rootMargin: '200px 0px' });

    document.querySelectorAll('.gal-img[data-bg]').forEach(el => lazyObserver.observe(el));
  }
});


/* ================================================================
   ADMIN PORTAL UI CONTROLS & DYNAMIC RENDERING
   ================================================================ */
window.applyAdminConfigToUI = function() {
  const grid = document.querySelector('.packages-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.pkg-card');
  cards.forEach(card => {
    const pkgId = card.getAttribute('data-pkg-id');
    if (!pkgId) return;

    // Visibility control
    const isHidden = adminConfig.packageDisabled[pkgId] === true;
    card.style.display = isHidden ? 'none' : '';

    // Pricing text control
    let priceRow = card.querySelector('.pkg-price-row');
    if (adminConfig.cashModeEnabled) {
      if (!priceRow) {
        priceRow = document.createElement('div');
        priceRow.className = 'pkg-price-row';
        priceRow.style.cssText = 'margin-bottom: 12px; display: flex; align-items: baseline; gap: 4px; justify-content: center;';
        const bodyEl = card.querySelector('.pkg-body');
        const footerEl = card.querySelector('.pkg-footer');
        if (bodyEl && footerEl) {
          bodyEl.insertBefore(priceRow, footerEl);
        }
      }
      const priceVal = adminConfig.packagePrices[pkgId] || (packageData[pkgId] ? packageData[pkgId].price : 0);
      const unit = packageData[pkgId] ? packageData[pkgId].unit : 'per person';
      priceRow.innerHTML = `
        <span class="pkg-price-amount" style="font-size: 1.4rem; font-weight: 700; color: var(--yellow);">${formatCurrency(priceVal)}</span>
        <span class="pkg-price-unit" style="font-size: 0.8rem; color: var(--text-3);">/ ${unit}</span>
      `;
      priceRow.style.display = 'flex';
    } else {
      if (priceRow) priceRow.style.display = 'none';
    }
  });

  // Rebuild/refresh slider dots and layout center focus calculations
  if (window.initPackagesSlider) {
    window.initPackagesSlider();
  }
};

/* Modals openers and closers */
window.openAdminLoginModal = function() {
  // If already logged in this session, skip login form and open dashboard directly
  if (sessionStorage.getItem('sr_admin_auth') === 'true') {
    window.openAdminDashboardModal();
    return;
  }
  document.getElementById('adminEmail').value = '';
  document.getElementById('adminPassword').value = '';
  document.getElementById('adminLoginError').style.display = 'none';
  document.getElementById('adminLoginModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeAdminLoginModal = function(e) {
  if (e && e.target !== document.getElementById('adminLoginModal') && e.target !== document.querySelector('#adminLoginModal .modal-close')) return;
  document.getElementById('adminLoginModal').classList.remove('open');
  document.body.style.overflow = '';
};

window.handleAdminLogin = function() {
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('adminLoginError');

  // Credentials Check: Password must be 7Rays@1234
  if (password === '7Rays@1234' && email.toLowerCase() === 'sevenraystravelagency@gmail.com') {
    sessionStorage.setItem('sr_admin_auth', 'true');
    document.getElementById('adminLoginModal').classList.remove('open');
    errorEl.style.display = 'none';
    window.openAdminDashboardModal();
  } else {
    errorEl.style.display = 'block';
  }
};

window.openAdminDashboardModal = function() {
  if (sessionStorage.getItem('sr_admin_auth') !== 'true') {
    window.openAdminLoginModal();
    return;
  }

  // Load and bind global toggles
  const cashCheckbox = document.getElementById('adminCashModeCheckbox');
  const tabPackages = document.getElementById('tabBtn-packages');
  const tabBuilder = document.getElementById('tabBtn-builder');

  function updateTabsVisibility() {
    const isEnabled = cashCheckbox.checked;
    if (tabPackages && tabBuilder) {
      tabPackages.style.display = isEnabled ? 'block' : 'none';
      tabBuilder.style.display = isEnabled ? 'block' : 'none';
      if (!isEnabled) {
        const currentActiveTab = document.querySelector('.admin-tab.active');
        if (currentActiveTab && (currentActiveTab.id === 'tabBtn-packages' || currentActiveTab.id === 'tabBtn-builder')) {
          window.switchAdminTab('global');
        }
      }
    }
  }

  cashCheckbox.checked = adminConfig.cashModeEnabled;
  updateTabsVisibility();
  cashCheckbox.onchange = updateTabsVisibility;

  document.getElementById('rate-base').value = adminConfig.baseRate;

  // Render Accommodations list
  const accomContainer = document.getElementById('adminAccomRatesContainer');
  accomContainer.innerHTML = '';
  const accomKeys = { homestay: 'Homestay / Hostel', budget: 'Budget Hotel', premium: 'Premium Hotel', luxury: 'Luxury Resort', villa: 'Private Villa' };
  Object.keys(accomKeys).forEach(key => {
    const rate = adminConfig.accomRates[key] || 0;
    accomContainer.innerHTML += `
      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 600; margin-bottom: 6px; color: var(--text-2);">${accomKeys[key]}</label>
        <input type="number" id="rate-accom-${key}" class="ep-input" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-color); padding: 10px; background: var(--bg-2); color: var(--text-1);" value="${rate}" />
      </div>
    `;
  });

  // Render Activities list
  const actContainer = document.getElementById('adminActRatesContainer');
  actContainer.innerHTML = '';
  const actKeys = {
    scuba: 'Scuba Diving', snorkel: 'Snorkeling', island: 'Island Hopping',
    dinner: 'Candlelight Dinner', watersports: 'Water Sports', seawalk: 'Sea Walk',
    kayak: 'Kayaking', glassbottom: 'Glass Bottom', trek: 'Rainforest Trek'
  };
  Object.keys(actKeys).forEach(key => {
    const rate = adminConfig.actRates[key] || 0;
    actContainer.innerHTML += `
      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 600; margin-bottom: 6px; color: var(--text-2);">${actKeys[key]}</label>
        <input type="number" id="rate-act-${key}" class="ep-input" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-color); padding: 10px; background: var(--bg-2); color: var(--text-1);" value="${rate}" />
      </div>
    `;
  });

  // Render Transport list
  const transContainer = document.getElementById('adminTransRatesContainer');
  transContainer.innerHTML = '';
  const transKeys = { flight: 'Flights (Round-trip)', ferry: 'Scenic Ferry Transfer', cab: 'Private Dedicated Cab' };
  Object.keys(transKeys).forEach(key => {
    const rate = adminConfig.transRates[key] || 0;
    transContainer.innerHTML += `
      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 600; margin-bottom: 6px; color: var(--text-2);">${transKeys[key]}</label>
        <input type="number" id="rate-trans-${key}" class="ep-input" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-color); padding: 10px; background: var(--bg-2); color: var(--text-1);" value="${rate}" />
      </div>
    `;
  });

  // Populate Package Lists
  const listContainer = document.getElementById('adminPackagesListContainer');
  listContainer.innerHTML = '';
  Object.keys(packageData).forEach(key => {
    const title = packageData[key].title;
    const price = adminConfig.packagePrices[key] || packageData[key].price;
    const isDisabled = adminConfig.packageDisabled[key] === true;

    listContainer.innerHTML += `
      <div class="admin-pkg-row">
        <div class="admin-pkg-info">
          <strong style="font-size: 0.9rem; display: block; color: var(--text-1);">${title}</strong>
          <span style="font-size: 0.78rem; color: var(--text-3);">${packageData[key].duration}</span>
        </div>
        <div class="admin-pkg-controls">
          <div class="admin-input-group">
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-2);">Price (₹):</span>
            <input type="number" id="pkg-price-${key}" class="ep-input" style="width: 100px; border-radius: 8px; border: 1px solid var(--border-color); padding: 6px; background: var(--bg-2); color: var(--text-1);" value="${price}" />
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-2);">Visible:</span>
            <label class="switch-container" style="position: relative; display: inline-block; width: 44px; height: 24px;">
              <input type="checkbox" id="pkg-vis-${key}" style="opacity: 0; width: 0; height: 0;" ${!isDisabled ? 'checked' : ''} />
              <span class="switch-slider" style="position: absolute; cursor: pointer; inset: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
            </label>
          </div>
        </div>
      </div>
    `;
  });

  // Render tab defaults
  window.switchAdminTab('global');

  document.getElementById('adminDashboardModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeAdminDashboardModal = function(e) {
  if (e && e.target !== document.getElementById('adminDashboardModal') && e.target !== document.querySelector('#adminDashboardModal .modal-close')) return;
  document.getElementById('adminDashboardModal').classList.remove('open');
  document.body.style.overflow = '';
};

window.handleAdminLogout = function() {
  sessionStorage.removeItem('sr_admin_auth');
  document.getElementById('adminDashboardModal').classList.remove('open');
  window.openAdminLoginModal();
};

window.switchAdminTab = function(tabName) {
  // Remove active state
  document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');

  // Add active state
  document.getElementById(`tabBtn-${tabName}`).classList.add('active');
  document.getElementById(`tabContent-${tabName}`).style.display = 'block';
};

window.saveAdminSettings = function() {
  // 1. Read Global Toggles
  adminConfig.cashModeEnabled = document.getElementById('adminCashModeCheckbox').checked;
  adminConfig.baseRate = parseInt(document.getElementById('rate-base').value) || 0;

  // 2. Read Accom Rates
  const accomKeys = ['homestay', 'budget', 'premium', 'luxury', 'villa'];
  accomKeys.forEach(key => {
    const inputVal = parseInt(document.getElementById(`rate-accom-${key}`).value);
    adminConfig.accomRates[key] = isNaN(inputVal) ? 0 : inputVal;
  });

  // 3. Read Act Rates
  const actKeys = ['scuba', 'snorkel', 'island', 'dinner', 'watersports', 'seawalk', 'kayak', 'glassbottom', 'trek'];
  actKeys.forEach(key => {
    const inputVal = parseInt(document.getElementById(`rate-act-${key}`).value);
    adminConfig.actRates[key] = isNaN(inputVal) ? 0 : inputVal;
  });

  // 4. Read Trans Rates
  const transKeys = ['flight', 'ferry', 'cab'];
  transKeys.forEach(key => {
    const inputVal = parseInt(document.getElementById(`rate-trans-${key}`).value);
    adminConfig.transRates[key] = isNaN(inputVal) ? 0 : inputVal;
  });

  // 5. Read Packages Pricing and Visibility
  Object.keys(packageData).forEach(key => {
    const priceVal = parseInt(document.getElementById(`pkg-price-${key}`).value);
    adminConfig.packagePrices[key] = isNaN(priceVal) ? 0 : priceVal;

    const isVisible = document.getElementById(`pkg-vis-${key}`).checked;
    adminConfig.packageDisabled[key] = !isVisible;
  });

  // 6. Save Config and Redraw
  saveAdminConfigToStorage();
  window.applyAdminConfigToUI();
  recalcPrice();

  document.getElementById('adminDashboardModal').classList.remove('open');
  document.body.style.overflow = '';

  // Show Success Toast
  if (window.showToast) {
    window.showToast("Settings saved successfully! 💾", "success");
  } else {
    alert("Settings saved successfully!");
  }
};
