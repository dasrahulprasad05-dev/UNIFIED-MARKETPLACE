// ===== UNIFIED SERVICE MARKETPLACE - MAIN JS =====

// ---- Toast Notifications ----
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 400); }, 3200);
}

// ---- Modal System ----
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
  if (e.target.classList.contains('modal-close')) { const modal = e.target.closest('.modal-overlay'); if (modal) closeModal(modal.id); }
});

// ---- Navbar Scroll ----
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.style.background = window.scrollY > 50 ? 'rgba(10,37,64,0.98)' : 'rgba(10,37,64,0.95)';
});

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

// ---- Fade-up Animations ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ---- Auth Tabs ----
document.querySelectorAll('.modal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const parent = tab.closest('.modal-tabs');
    parent.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    if (target) {
      const container = tab.closest('.modal');
      container.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      const targetEl = container.querySelector(`#${target}`);
      if (targetEl) targetEl.classList.remove('hidden');
    }
  });
});

// ---- Filter Chips ----
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const group = chip.parentElement;
    group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ---- Star Rating ----
document.querySelectorAll('.star-rating').forEach(ratingEl => {
  const stars = ratingEl.querySelectorAll('.star');
  stars.forEach((star, idx) => {
    star.addEventListener('click', () => {
      stars.forEach((s, i) => { s.style.color = i <= idx ? '#F5A623' : '#ddd'; });
      ratingEl.dataset.value = idx + 1;
    });
    star.addEventListener('mouseenter', () => stars.forEach((s, i) => { s.style.color = i <= idx ? '#F5A623' : '#ddd'; }));
  });
  ratingEl.addEventListener('mouseleave', () => {
    const val = parseInt(ratingEl.dataset.value) || 0;
    stars.forEach((s, i) => { s.style.color = i < val ? '#F5A623' : '#ddd'; });
  });
});

// ---- Search Form ----
const searchForm = document.getElementById('search-form');
if (searchForm) {
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = searchForm.querySelector('input').value.trim();
    if (q) { showToast(`Searching for "${q}"...`, 'info'); setTimeout(() => { window.location.href = 'customer.html'; }, 800); }
    else showToast('Please enter a service or location', 'warning');
  });
}

// ---- CTA Buttons ----
document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    if (action === 'login') openModal('auth-modal');
    if (action === 'signup') { openModal('auth-modal'); document.querySelector('[data-tab="register"]')?.click(); }
    if (action === 'book') openModal('booking-modal');
    if (action === 'customer') window.location.href = 'customer.html';
    if (action === 'provider') window.location.href = 'provider.html';
    if (action === 'admin') window.location.href = 'admin.html';
  });
});

// ---- Auth Form Submit ----
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm.querySelector('[name="email"]').value;
    const pass = loginForm.querySelector('[name="password"]').value;
    if (!email || !pass) { showToast('Please fill in all fields', 'warning'); return; }
    showToast('Logging you in...', 'info');
    setTimeout(() => {
      closeModal('auth-modal');
      showToast('Welcome back! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'customer.html', 1000);
    }, 1200);
  });
}
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = registerForm.querySelector('[name="name"]').value;
    if (!name) { showToast('Please fill in all fields', 'warning'); return; }
    showToast('Creating your account...', 'info');
    setTimeout(() => {
      closeModal('auth-modal');
      showToast('Account created! Welcome to ServeHub!', 'success');
      setTimeout(() => window.location.href = 'customer.html', 1000);
    }, 1200);
  });
}

// ---- Booking Modal ----
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Booking submitted! Waiting for provider confirmation...', 'success');
    closeModal('booking-modal');
  });
}

// ---- Counter Animation ----
function animateCounter(el, target, duration = 2000) {
  let start = 0; const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
    else el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = true;
      animateCounter(e.target, parseInt(e.target.dataset.count));
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ---- Testimonial Slider ----
const testimonials = document.querySelectorAll('.testimonial-item');
let currentTestimonial = 0;
function showTestimonial(idx) {
  testimonials.forEach((t, i) => { t.style.display = i === idx ? 'block' : 'none'; });
}
if (testimonials.length > 0) {
  showTestimonial(0);
  setInterval(() => { currentTestimonial = (currentTestimonial + 1) % testimonials.length; showTestimonial(currentTestimonial); }, 5000);
}
