// ===== DASHBOARD JS =====

// ---- Sidebar Navigation ----
function initSidebar() {
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const page = item.dataset.page;
      document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(`page-${page}`);
      if (section) section.classList.add('active');
      // Update topbar title
      const topbarTitle = document.getElementById('topbar-title');
      if (topbarTitle) topbarTitle.textContent = item.querySelector('.nav-label')?.textContent || 'Dashboard';
      // Close mobile sidebar
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('dash-overlay')?.classList.remove('active');
    });
  });
  // Mobile hamburger
  const mobileHam = document.getElementById('mobile-ham');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('dash-overlay');
  if (mobileHam && sidebar) {
    mobileHam.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('active');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

// ---- Charts ----
function renderCharts() {
  const chartContainers = document.querySelectorAll('.chart-bars');
  chartContainers.forEach(container => {
    const bars = container.querySelectorAll('.chart-bar');
    bars.forEach(bar => {
      const h = bar.dataset.height;
      if (h) setTimeout(() => { bar.style.height = h; }, 200 + Math.random() * 300);
    });
  });
}

// ---- Booking Actions ----
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-booking-action]');
  if (!btn) return;
  const action = btn.dataset.bookingAction;
  const card = btn.closest('.booking-card, tr');
  if (action === 'accept') {
    showToast('Booking accepted! Customer notified.', 'success');
    const badge = card?.querySelector('.status-badge');
    if (badge) { badge.textContent = 'Accepted'; badge.className = 'status-badge status-active'; }
  }
  if (action === 'reject') {
    showToast('Booking rejected. Customer notified.', 'error');
    const badge = card?.querySelector('.status-badge');
    if (badge) { badge.textContent = 'Rejected'; badge.className = 'status-badge status-rejected'; }
  }
  if (action === 'complete') {
    showToast('Service marked as completed! Payment released.', 'success');
    const badge = card?.querySelector('.status-badge');
    if (badge) { badge.textContent = 'Completed'; badge.className = 'status-badge status-completed'; }
  }
  if (action === 'cancel') {
    if (confirm('Cancel this booking?')) {
      showToast('Booking cancelled. Refund initiated.', 'warning');
      card?.remove();
    }
  }
  if (action === 'track') openModal('tracking-modal');
  if (action === 'review') openModal('review-modal');
  if (action === 'verify') {
    showToast('Provider verified and approved!', 'success');
    const badge = card?.querySelector('.status-badge');
    if (badge) { badge.textContent = 'Verified'; badge.className = 'status-badge status-active'; }
  }
  if (action === 'suspend') {
    if (confirm('Suspend this user?')) {
      showToast('User account suspended.', 'warning');
      const badge = card?.querySelector('.status-badge');
      if (badge) { badge.textContent = 'Suspended'; badge.className = 'status-badge status-rejected'; }
    }
  }
});

// ---- Review Submit ----
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const stars = reviewForm.querySelector('.star-rating')?.dataset.value || 5;
    showToast(`Review submitted! ${stars} stars ⭐`, 'success');
    closeModal('review-modal');
  });
}

// ---- Profile Form ----
const profileForm = document.getElementById('profile-form');
if (profileForm) {
  profileForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Profile updated successfully!', 'success');
  });
}

// ---- Availability Toggle ----
const availabilityToggle = document.getElementById('availability-toggle');
if (availabilityToggle) {
  availabilityToggle.addEventListener('change', () => {
    showToast(availabilityToggle.checked ? '🟢 You are now Available' : '🔴 You are now Unavailable', availabilityToggle.checked ? 'success' : 'warning');
  });
}

// ---- Admin: Approve/Reject SP ----
const approvalForms = document.querySelectorAll('.approval-form');
approvalForms.forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const action = e.submitter?.dataset.action;
    if (action === 'approve') showToast('Service provider approved!', 'success');
    if (action === 'reject') showToast('Service provider rejected. Email sent.', 'error');
    form.closest('tr, .provider-row')?.remove();
  });
});

// ---- Admin Report Export ----
const exportBtns = document.querySelectorAll('[data-export]');
exportBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('Generating report... Download will start shortly.', 'info');
    setTimeout(() => showToast('Report exported successfully!', 'success'), 2000);
  });
});

// ---- Dispute Resolution ----
document.querySelectorAll('[data-dispute]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.dispute;
    if (action === 'refund') { showToast('Refund processed for customer.', 'success'); btn.closest('tr')?.remove(); }
    if (action === 'dismiss') { showToast('Dispute dismissed.', 'warning'); btn.closest('tr')?.remove(); }
  });
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  renderCharts();
});

// ---- Toast (reuse from main.js if available) ----
if (typeof showToast === 'undefined') {
  window.showToast = function(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) { container = document.createElement('div'); container.id = 'toast-container'; container.className = 'toast-container'; document.body.appendChild(container); }
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]||'✅'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(100%)'; setTimeout(()=>toast.remove(),400); }, 3200);
  };
}
if (typeof openModal === 'undefined') {
  window.openModal = function(id) { const m=document.getElementById(id); if(m){m.classList.add('active');document.body.style.overflow='hidden';} };
  window.closeModal = function(id) { const m=document.getElementById(id); if(m){m.classList.remove('active');document.body.style.overflow='';} };
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
  if (e.target.classList.contains('modal-close')) { const modal = e.target.closest('.modal-overlay'); if(modal) closeModal(modal.id); }
});
