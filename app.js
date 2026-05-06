/**
 * ============================================================
 *  LUCBAN EMPANADA — app.js
 *  Lucbanin Bites Co.
 *  All interactivity, auth, admin, notifications, animations
 * ============================================================
 *
 *  QUICK-EDIT GUIDE (search the labels below):
 *  [CONFIG]      — admin password, email service keys
 *  [EDIT_TEXT]   — default about text, order note text
 *  [SOCIAL]      — default social media URLs
 *  [EMAILJS]     — EmailJS service/template IDs for notifications
 * ============================================================
 */

'use strict';

/* ============================================================
   [CONFIG] — CHANGE THESE TO YOUR OWN VALUES
   ============================================================ */
const CONFIG = {
  // Admin secret password — change this before deploying!
  ADMIN_PASSWORD: 'LucbanBites2025!',

  // EmailJS configuration — sign up free at https://emailjs.com
  // Replace these with your actual EmailJS IDs:
  EMAILJS_SERVICE_ID:  'YOUR_EMAILJS_SERVICE_ID',
  EMAILJS_TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',
  EMAILJS_PUBLIC_KEY:  'YOUR_EMAILJS_PUBLIC_KEY',

  // How many ms the toast notification stays visible
  TOAST_DURATION: 3500,
};



/* ============================================================
   [EDIT_TEXT] — DEFAULT CONTENT YOU CAN CHANGE
   ============================================================ */
const DEFAULT_ABOUT_TEXT =
  'Nestled in the heart of Quezon province, Lucban is a town celebrated for its rich ' +
  'cultural heritage and iconic flavors. The Lucban Empanada — crispy, golden, and stuffed ' +
  'with savory goodness — has been a beloved tradition for generations. At Lucbanin Bites Co., ' +
  'we bring that treasured hometown taste to wherever you are. Each empanada is handcrafted ' +
  'using time-honored recipes, fresh local ingredients, and the same passion that has made ' +
  "Lucban's food legendary.";

const DEFAULT_ORDER_NOTE =
  '📝 To place an order, message us on Facebook or Instagram, or send us an email. ' +
  'We will confirm your order and arrange delivery or pick-up!';


/* ============================================================
   STORAGE HELPERS  (localStorage wrappers)
   ============================================================ */
const Store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  },
};


/* ============================================================
   DOM HELPERS
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showMsg(el, msg, type = 'success') {
  if (!el) return;
  el.textContent = msg;
  el.className = `form-msg ${type}`;
}

function clearMsg(el) {
  if (!el) return;
  el.textContent = '';
  el.className = 'form-msg';
}


/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
const Toast = (() => {
  let timer = null;
  const el = $('#toast');

  function show(msg, duration = CONFIG.TOAST_DURATION) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), duration);
  }

  return { show };
})();


/* ============================================================
   PARTICLES BACKGROUND
   ============================================================ */
(function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const colors  = ['#E8473F', '#F5C518', '#3D8C3D', '#8B5E3C'];
  const count   = window.innerWidth < 600 ? 12 : 22;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size   = Math.random() * 18 + 6;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 12;
    const dur    = Math.random() * 14 + 10;
    const color  = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      background:${color};
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    container.appendChild(p);
  }
})();


/* ============================================================
   NAVBAR — scroll shadow + hamburger + active link
   ============================================================ */
(function initNavbar() {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  const links     = $$('.nav-link');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
  });

  // Close menu on link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = $$('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ============================================================
   SCROLL REVEAL — .reveal elements animate in on scroll
   ============================================================ */
(function initScrollReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => io.observe(el));
})();


/* ============================================================
   HERO ANIMATE-IN — staggered on page load
   ============================================================ */
(function initHeroAnims() {
  const items = $$('.animate-in');
  // Small delay so CSS transition is registered
  setTimeout(() => {
    items.forEach(el => el.classList.add('visible'));
  }, 80);
})();


/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
(function initGallery() {
  const lightbox  = $('#lightbox');
  const lbImg     = $('#lightboxImg');
  const lbClose   = $('#lightboxClose');
  const items     = $$('.gallery-item');

  function open(src) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src || item.querySelector('img')?.src;
      if (src) open(src);
    });
    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const src = item.dataset.src || item.querySelector('img')?.src;
        if (src) open(src);
      }
    });
  });

  lbClose?.addEventListener('click', close);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


/* ============================================================
   AVAILABILITY SYSTEM
   ============================================================ */
const Availability = (() => {
  /*
   * State stored in localStorage so admin changes persist
   * across page reloads (no backend needed for demo).
   * Replace with fetch() calls to your own API if you have one.
   */
  function getState() {
    return Store.get('avail_state', {
      available: false,
      message:   'Availability will be updated soon. Stay tuned!',
    });
  }

  function setState(data) {
    Store.set('avail_state', data);
    render(data);
  }

  function render(state) {
    const dot      = $('#availDot');
    const text     = $('#availText');
    const banner   = $('#availBanner');
    const bannerTxt = $('#bannerText');
    const bannerIco = $('#bannerIcon');
    const orderBox  = $('#orderStatusBox');
    const orderTxt  = $('#orderStatusText');

    if (state.available) {
      dot?.classList.add('available');
      dot?.classList.remove('unavailable');
      if (text)      text.textContent   = state.message || '✅ Available now — order today!';
      if (banner)    banner.className   = 'avail-banner';
      if (bannerIco) bannerIco.textContent = '✅';
      if (bannerTxt) bannerTxt.textContent = state.message || 'Empanada is AVAILABLE — order yours now!';
      if (orderBox)  orderBox.className = 'order-status-box available';
      if (orderTxt)  orderTxt.textContent = state.message || 'Empanadas are available for order!';
    } else {
      dot?.classList.remove('available');
      dot?.classList.add('unavailable');
      if (text)      text.textContent   = state.message || '❌ Not available right now.';
      if (banner)    banner.className   = 'avail-banner unavailable';
      if (bannerIco) bannerIco.textContent = '❌';
      if (bannerTxt) bannerTxt.textContent = state.message || 'Empanada is currently NOT available. Follow us for updates!';
      if (orderBox)  orderBox.className = 'order-status-box unavailable';
      if (orderTxt)  orderTxt.textContent = state.message || 'Sorry, empanadas are not available right now. Check back soon!';
    }
  }

  function init() {
    render(getState());
  }

  return { init, getState, setState };
})();


/* ============================================================
   USER AUTH SYSTEM (localStorage-based, demo-grade)
   ============================================================ *
 *
 *  For production: replace with real backend / Firebase Auth.
 *  Passwords are NOT hashed here — this is a front-end demo.
 *
 * ============================================================ */
const Auth = (() => {
  const USERS_KEY   = 'lb_users';
  const SESSION_KEY = 'lb_session';

  function getUsers()       { return Store.get(USERS_KEY, []); }
  function saveUsers(users) { Store.set(USERS_KEY, users); }
  function getSession()     { return Store.get(SESSION_KEY, null); }

  function setSession(user) {
    Store.set(SESSION_KEY, { name: user.name, email: user.email, notify: user.notify });
  }

  function clearSession() { Store.remove(SESSION_KEY); }

  function isLoggedIn()    { return !!getSession(); }

  function signup({ name, email, password, notify }) {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, msg: 'An account with this email already exists.' };
    }
    const user = { name, email: email.toLowerCase(), password, notify: !!notify };
    users.push(user);
    saveUsers(users);
    setSession(user);
    return { ok: true, user };
  }

  function login({ email, password }) {
    const users = getUsers();
    const user  = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, msg: 'Incorrect email or password.' };
    setSession(user);
    return { ok: true, user };
  }

  function logout() { clearSession(); }

  function getSubscribers() {
    return getUsers().filter(u => u.notify);
  }

  return { signup, login, logout, isLoggedIn, getSession, getSubscribers };
})();


/* ============================================================
   AUTH MODAL (Login / Sign Up)
   ============================================================ */
(function initAuthModal() {
  const modal     = $('#authModal');
  const openBtn   = $('#openLoginBtn');
  const closeBtn  = $('#closeAuthModal');
  const tabLogin  = $('#tabLogin');
  const tabSignup = $('#tabSignup');
  const formLogin = $('#formLogin');
  const formSignup= $('#formSignup');
  const goSignup  = $('#goSignup');
  const goLogin   = $('#goLogin');
  const loginBtn  = $('#loginBtn');
  const signupBtn = $('#signupBtn');
  const loginMsg  = $('#loginMsg');
  const signupMsg = $('#signupMsg');

  // Also triggered from "notify" button in contact section
  const notifyBtn = $('#notifySignupBtn');

  function openModal(tab = 'login') {
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchTab(tab);
  }

  function closeModal() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
    clearMsg(loginMsg);
    clearMsg(signupMsg);
  }

  function switchTab(tab) {
    const isLogin = tab === 'login';
    tabLogin?.classList.toggle('active', isLogin);
    tabSignup?.classList.toggle('active', !isLogin);
    formLogin?.classList.toggle('hidden', !isLogin);
    formSignup?.classList.toggle('hidden', isLogin);
  }

  openBtn?.addEventListener('click',  () => openModal('login'));
  notifyBtn?.addEventListener('click', () => openModal('signup'));
  closeBtn?.addEventListener('click',  closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  tabLogin?.addEventListener('click',  () => switchTab('login'));
  tabSignup?.addEventListener('click', () => switchTab('signup'));
  goSignup?.addEventListener('click',  () => switchTab('signup'));
  goLogin?.addEventListener('click',   () => switchTab('login'));

  /* ---------- LOGIN ---------- */
  loginBtn?.addEventListener('click', () => {
    const email    = $('#loginEmail')?.value.trim();
    const password = $('#loginPassword')?.value;
    clearMsg(loginMsg);

    if (!email || !password) { showMsg(loginMsg, 'Please fill in all fields.', 'error'); return; }

    const result = Auth.login({ email, password });
    if (!result.ok) { showMsg(loginMsg, result.msg, 'error'); return; }

    showMsg(loginMsg, `Welcome back, ${result.user.name}! 🎉`, 'success');
    setTimeout(() => { closeModal(); updateUserBar(); }, 1200);
  });

  /* ---------- SIGN UP ---------- */
  signupBtn?.addEventListener('click', () => {
    const name     = $('#signupName')?.value.trim();
    const email    = $('#signupEmail')?.value.trim();
    const password = $('#signupPassword')?.value;
    const notify   = $('#notifyMe')?.checked;
    clearMsg(signupMsg);

    if (!name || !email || !password) { showMsg(signupMsg, 'Please fill in all fields.', 'error'); return; }
    if (password.length < 6)          { showMsg(signupMsg, 'Password must be at least 6 characters.', 'error'); return; }
    if (!/\S+@\S+\.\S+/.test(email))  { showMsg(signupMsg, 'Please enter a valid email address.', 'error'); return; }

    const result = Auth.signup({ name, email, password, notify });
    if (!result.ok) { showMsg(signupMsg, result.msg, 'error'); return; }

    showMsg(signupMsg, `Account created! Welcome, ${name}! 🎊`, 'success');

    // Request browser push permission if user wants notifications
    if (notify) requestPushPermission();

    setTimeout(() => { closeModal(); updateUserBar(); }, 1400);
  });
})();


/* ============================================================
   USER BAR (logged-in indicator, bottom-right)
   ============================================================ */
function updateUserBar() {
  const bar         = $('#userBar');
  const barName     = $('#userBarName');
  const logoutBtn   = $('#userLogoutBtn');
  const loginNavBtn = $('#openLoginBtn');

  if (Auth.isLoggedIn()) {
    const session = Auth.getSession();
    bar?.classList.remove('hidden');
    if (barName) barName.textContent = `Hi, ${session.name}! 👋`;
    if (loginNavBtn) loginNavBtn.textContent = session.name;
  } else {
    bar?.classList.add('hidden');
    if (loginNavBtn) loginNavBtn.textContent = 'Login / Sign Up';
  }

  logoutBtn?.addEventListener('click', () => {
    Auth.logout();
    updateUserBar();
    Toast.show('You have been logged out. See you soon! 👋');
  });
}


/* ============================================================
   ADMIN PANEL
   ============================================================ */
(function initAdmin() {
  const modal         = $('#adminModal');
  const closeBtn      = $('#closeAdminModal');
  const loginSection  = $('#adminLoginSection');
  const controls      = $('#adminControls');
  const pwInput       = $('#adminPassword');
  const loginBtn      = $('#adminLoginBtn');
  const adminMsg      = $('#adminMsg');

  // Secret access: triple-click the footer copyright text
  const footerCopy = $('.footer-copy');
  let clickCount = 0, clickTimer = null;

  footerCopy?.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 600);
    if (clickCount >= 3) {
      clickCount = 0;
      openAdminModal();
    }
  });

  // Also: keyboard shortcut Ctrl+Shift+A (for dev convenience — remove in production if desired)
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      openAdminModal();
    }
  });

  function openAdminModal() {
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    // If already authed this session, show controls
    if (Store.get('lb_admin_authed')) {
      showControls();
    } else {
      loginSection?.classList.remove('hidden');
      controls?.classList.add('hidden');
    }
  }

  function closeAdminModal() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
    clearMsg(adminMsg);
    if (pwInput) pwInput.value = '';
  }

  closeBtn?.addEventListener('click', closeAdminModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeAdminModal(); });

  loginBtn?.addEventListener('click', () => {
    const pw = pwInput?.value;
    clearMsg(adminMsg);
    if (pw === CONFIG.ADMIN_PASSWORD) {
      Store.set('lb_admin_authed', true);
      showControls();
    } else {
      showMsg(adminMsg, 'Incorrect password. Access denied.', 'error');
      if (pwInput) { pwInput.value = ''; pwInput.focus(); }
    }
  });

  pwInput?.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn?.click(); });

  function showControls() {
    loginSection?.classList.add('hidden');
    controls?.classList.remove('hidden');
    loadAdminData();
  }

  /* ---- Availability Toggle ---- */
  const availToggle  = $('#availToggle');
  const availMsg     = $('#availMessage');
  const saveAvailBtn = $('#saveAvailBtn');
  const availSaveMsg = $('#availSaveMsg');

  function loadAdminData() {
    // Load availability state
    const state = Availability.getState();
    if (availToggle) availToggle.checked = state.available;
    if (availMsg)    availMsg.value      = state.message;

    // Load social links
    const social = Store.get('lb_social', DEFAULT_SOCIAL);
    const adminFb = $('#adminFb'); if (adminFb) adminFb.value = social.facebook  || '';
    const adminIg = $('#adminIg'); if (adminIg) adminIg.value = social.instagram || '';
    const adminTt = $('#adminTt'); if (adminTt) adminTt.value = social.tiktok    || '';
    const adminEm = $('#adminEmail'); if (adminEm) adminEm.value = social.email  || '';

    // Load about text
    const aboutTA = $('#adminAboutText');
    if (aboutTA) aboutTA.value = Store.get('lb_about_text', DEFAULT_ABOUT_TEXT);

    // Load subscribers list
    renderSubscribersList();
  }

  saveAvailBtn?.addEventListener('click', () => {
    const newState = {
      available: availToggle?.checked ?? false,
      message:   availMsg?.value.trim() || (availToggle?.checked ? 'Available now!' : 'Not available right now.'),
    };
    Availability.setState(newState);
    clearMsg(availSaveMsg);
    showMsg(availSaveMsg, '✅ Availability updated!', 'success');

    // Notify subscribers via EmailJS (if configured)
    notifySubscribers({
      title:   newState.available ? '🟢 Empanada is Available!' : '🔴 Empanada Update',
      message: newState.message,
    });

    setTimeout(() => clearMsg(availSaveMsg), 3000);
  });

  /* ---- Send Custom Update ---- */
  const sendUpdateBtn = $('#sendUpdateBtn');
  const updateMsg     = $('#updateMsg');

  sendUpdateBtn?.addEventListener('click', () => {
    const title = $('#updateTitle')?.value.trim();
    const msg   = $('#updateMessage')?.value.trim();
    clearMsg(updateMsg);
    if (!title || !msg) { showMsg(updateMsg, 'Please fill in both fields.', 'error'); return; }

    notifySubscribers({ title, message: msg });
    showMsg(updateMsg, '📨 Update sent to subscribers!', 'success');

    const titleEl = $('#updateTitle'); if (titleEl) titleEl.value = '';
    const msgEl   = $('#updateMessage'); if (msgEl) msgEl.value = '';
    setTimeout(() => clearMsg(updateMsg), 3000);
  });

  /* ---- Social Links ---- */
  const saveSocialBtn = $('#saveSocialBtn');
  const socialSaveMsg = $('#socialSaveMsg');

  saveSocialBtn?.addEventListener('click', () => {
    const social = {
      facebook:  $('#adminFb')?.value.trim()    || DEFAULT_SOCIAL.facebook,
      instagram: $('#adminIg')?.value.trim()    || DEFAULT_SOCIAL.instagram,
      tiktok:    $('#adminTt')?.value.trim()    || DEFAULT_SOCIAL.tiktok,
      email:     $('#adminEmail')?.value.trim() || DEFAULT_SOCIAL.email,
    };
    Store.set('lb_social', social);
    applySocialLinks(social);
    showMsg(socialSaveMsg, '✅ Social links updated!', 'success');
    setTimeout(() => clearMsg(socialSaveMsg), 3000);
  });

  /* ---- About Text ---- */
  const saveAboutBtn = $('#saveAboutBtn');
  const aboutSaveMsg = $('#aboutSaveMsg');

  saveAboutBtn?.addEventListener('click', () => {
    const text = $('#adminAboutText')?.value.trim();
    if (!text) { showMsg(aboutSaveMsg, 'About text cannot be empty.', 'error'); return; }
    Store.set('lb_about_text', text);
    applyAboutText(text);
    showMsg(aboutSaveMsg, '✅ About text updated!', 'success');
    setTimeout(() => clearMsg(aboutSaveMsg), 3000);
  });

  /* ---- Admin Logout ---- */
  $('#adminLogoutBtn')?.addEventListener('click', () => {
    Store.remove('lb_admin_authed');
    closeAdminModal();
    Toast.show('Admin session ended.');
  });

  /* ---- Subscribers List ---- */
  function renderSubscribersList() {
    const list     = $('#subscribersList');
    const noSub    = $('#noSubscribers');
    const subs     = Auth.getSubscribers();

    if (!list) return;
    list.innerHTML = '';

    if (subs.length === 0) {
      noSub?.classList.remove('hidden');
    } else {
      noSub?.classList.add('hidden');
      subs.forEach(s => {
        const div = document.createElement('div');
        div.className = 'subscriber-item';
        div.innerHTML = `<i class="fas fa-user-circle" style="color:var(--brown)"></i>
          <strong>${escapeHtml(s.name)}</strong>
          <span>${escapeHtml(s.email)}</span>`;
        list.appendChild(div);
      });
    }
  }
})();


/* ============================================================
   SOCIAL LINKS — apply from storage on load
   ============================================================ */
function applySocialLinks(social) {
  const fbLink = $('#fbLink');
  const igLink = $('#igLink');
  const ttLink = $('#ttLink');
  const emLink = $('#emailLink');

  if (fbLink) fbLink.href = social.facebook  || '#';
  if (igLink) igLink.href = social.instagram || '#';
  if (ttLink) ttLink.href = social.tiktok    || '#';
  if (emLink) emLink.href = social.email ? `mailto:${social.email}` : '#';

  // Update small labels too
  const igSmall = igLink?.querySelector('small');
  const fbSmall = fbLink?.querySelector('small');
  const ttSmall = ttLink?.querySelector('small');
  const emSmall = emLink?.querySelector('small');

  if (igSmall && social.instagram) igSmall.textContent = '@' + social.instagram.replace(/.*instagram\.com\/?@?/, '').replace(/\/$/, '') || social.instagram;
  if (fbSmall && social.facebook)  fbSmall.textContent = 'Lucbanin Bites Co.';
  if (ttSmall && social.tiktok)    ttSmall.textContent = '@' + social.tiktok.replace(/.*tiktok\.com\/?@?/, '').replace(/\/$/, '') || social.tiktok;
  if (emSmall && social.email)     emSmall.textContent = social.email;
}


/* ============================================================
   ABOUT TEXT — apply from storage on load
   ============================================================ */
function applyAboutText(text) {
  // The about section has three <p> tags; replace the first two with saved text
  const aboutPs = $$('#about .about-text p');
  if (aboutPs.length > 0) {
    aboutPs[0].textContent = text;
  }
}


/* ============================================================
   ORDER NOTE — apply custom order note
   ============================================================ */
function applyOrderNote() {
  const orderNoteEl = $('#orderNote');
  if (orderNoteEl) {
    orderNoteEl.textContent = Store.get('lb_order_note', DEFAULT_ORDER_NOTE);
  }
}


/* ============================================================
   PUSH NOTIFICATION PERMISSION
   ============================================================ */
function requestPushPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        Toast.show('🔔 Push notifications enabled!');
      }
    });
  }
}

function sendBrowserPush(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon:  'images/logo.png',
      badge: 'images/logo.png',
    });
  } catch {}
}


/* ============================================================
   [EMAILJS] EMAIL NOTIFICATIONS TO SUBSCRIBERS
   ============================================================
   Sign up at https://emailjs.com (free tier available).
   1. Create an Email Service (Gmail works great).
   2. Create a Template with variables: {{to_name}}, {{to_email}},
      {{update_title}}, {{update_message}}, {{business_name}}.
   3. Fill in CONFIG.EMAILJS_* values at the top of this file.
   ============================================================ */
function notifySubscribers({ title, message }) {
  const subscribers = Auth.getSubscribers();

  // Browser push for current user if they have permission
  sendBrowserPush(title, message);

  // EmailJS batch send
  if (
    CONFIG.EMAILJS_SERVICE_ID  === 'YOUR_EMAILJS_SERVICE_ID' ||
    CONFIG.EMAILJS_TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID'
  ) {
    // EmailJS not configured yet — log to console for demo
    console.info('[Lucban Empanada] EmailJS not configured. Would notify:', subscribers.length, 'subscribers.');
    console.info('[Lucban Empanada] Title:', title, '| Message:', message);
    return;
  }

  if (typeof emailjs === 'undefined') {
    console.warn('[Lucban Empanada] EmailJS SDK not loaded. Add the script to index.html:');
    console.warn('<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>');
    return;
  }

  emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);

  subscribers.forEach(sub => {
    emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
      to_name:        sub.name,
      to_email:       sub.email,
      update_title:   title,
      update_message: message,
      business_name:  'Lucbanin Bites Co.',
    }).catch(err => console.warn('[Lucban Empanada] EmailJS error:', err));
  });
}


/* ============================================================
   SMOOTH SCROLL for internal anchor links
   (native scroll-behavior:smooth handles most, but this
    offsets for the fixed navbar height)
   ============================================================ */
(function initSmoothScroll() {
  const NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   PRODUCT CARD HOVER TILT (desktop only)
   ============================================================ */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // Skip on touch

  $$('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ============================================================
   SOCIAL CARD ENTRANCE ANIMATION
   ============================================================ */
(function initSocialAnims() {
  const cards = $$('.social-card');
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    card.classList.add('reveal');
    io.observe(card);
  });
})();


/* ============================================================
   GALLERY ENTRANCE ANIMATION
   ============================================================ */
(function initGalleryAnims() {
  const items = $$('.gallery-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => {
    item.classList.add('reveal');
    io.observe(item);
  });
})();


/* ============================================================
   PRODUCT CARDS ENTRANCE ANIMATION
   ============================================================ */
(function initProductAnims() {
  const cards = $$('.product-card');
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 100);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.classList.add('reveal');
    io.observe(card);
  });
})();


/* ============================================================
   ABOUT BADGES ANIMATION
   ============================================================ */
(function initBadgeAnims() {
  const badges = $$('.badge-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        badges.forEach((b, i) => setTimeout(() => b.classList.add('revealed'), i * 80));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const badgeParent = $('.about-badges');
  if (badgeParent) {
    badges.forEach(b => b.classList.add('reveal'));
    io.observe(badgeParent);
  }
})();


/* ============================================================
   STEP CARDS (How to Order) ANIMATION
   ============================================================ */
(function initStepAnims() {
  const steps = $$('.step-card');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach((s, i) => setTimeout(() => s.classList.add('revealed'), i * 100));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const stepsEl = $('.steps');
  if (stepsEl) {
    steps.forEach(s => s.classList.add('reveal'));
    io.observe(stepsEl);
  }
})();


/* ============================================================
   FLOATING EMPANADA EMOJI (fun easter egg on long scroll)
   ============================================================ */
(function initScrollEasterEgg() {
  let triggered = false;
  window.addEventListener('scroll', () => {
    if (triggered) return;
    const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrollPct > 0.6) {
      triggered = true;
      Toast.show('🥟 ¡Handa na ang empanada! Ano tara? 🌶️', 4500);
    }
  }, { passive: true });
})();


/* ============================================================
   UTILITY: HTML ESCAPE
   ============================================================ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


/* ============================================================
   BOOT — run everything on DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Restore availability display
  Availability.init();

  // Restore user session
  updateUserBar();

  // Restore social links
  applySocialLinks(Store.get('lb_social', DEFAULT_SOCIAL));

  // Restore about text
  applyAboutText(Store.get('lb_about_text', DEFAULT_ABOUT_TEXT));

  // Restore order note
  applyOrderNote();

  // Request push permission if returning subscriber
  if (Auth.isLoggedIn() && Auth.getSession()?.notify) {
    requestPushPermission();
  }

  console.log('%c🥟 Lucbanin Bites Co. — website loaded! Ano tara? 🌶️',
    'color:#3D8C3D; font-size:16px; font-weight:bold;');
  console.log('%cAdmin access: Triple-click the footer copyright text, or press Ctrl+Shift+A',
    'color:#8B5E3C; font-size:12px;');
});

