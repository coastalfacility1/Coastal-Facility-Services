// ============================================================
// Coastal Facility Services — site JS
// ============================================================

// Sticky header behavior
const header = document.querySelector('.header');
let lastY = 0;
function onScroll() {
  const y = window.scrollY;
  if (header) header.classList.toggle('scrolled', y > 24);
  lastY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
  }));
}

// Reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      // Start counters when visible
      if (entry.target.classList.contains('counters')) startCounters();
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-stagger, .counters').forEach(el => io.observe(el));

// Animated counters
let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('.num[data-target]').forEach(numEl => {
    const target = parseFloat(numEl.dataset.target);
    const decimals = numEl.dataset.decimals ? parseInt(numEl.dataset.decimals) : 0;
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = (target * eased).toFixed(decimals);
      numEl.textContent = val;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// Active nav state — based on current page
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
});

// Form submit (demo)
document.querySelectorAll('form[data-quote]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Submitted — we will be in touch'; btn.disabled = true; btn.style.background = 'var(--olive-600)'; }
    form.reset();
    // Show thank-you panel with capabilities PDF
    if (!form.querySelector('.form-thanks')) {
      const thanks = document.createElement('div');
      thanks.className = 'form-thanks';
      thanks.innerHTML = '<h4>Thanks — we will be in touch shortly.</h4>'
        + '<p>Our team will follow up to scope a walkthrough. While you wait, here\'s a one-page overview you can share internally:</p>'
        + '<a href="capabilities-overview.pdf" target="_blank" rel="noopener" class="btn-primary">'
        + '<span aria-hidden="true">↓</span> Download Capabilities Overview (PDF)</a>';
      form.appendChild(thanks);
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

// Year
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
