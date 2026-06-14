/* ── Theme toggle ── */
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  html.setAttribute('data-theme', isLight ? 'dark' : 'light');
  document.getElementById('themeLabel').textContent = isLight ? 'Light' : 'Dark';
  try { localStorage.setItem('gl-theme', isLight ? 'dark' : 'light'); } catch(e) {}
}

/* Restore saved preference on load */
(function () {
  try {
    const saved = localStorage.getItem('gl-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      const lbl = document.getElementById('themeLabel');
      if (lbl) lbl.textContent = saved === 'light' ? 'Dark' : 'Light';
    }
  } catch(e) {}
})();

/* ── Mobile menu ── */
function toggleMenu() {
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  const isOpen = ham.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  ham.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* Close mobile nav on backdrop click */
document.getElementById('mobileNav').addEventListener('click', function (e) {
  if (e.target === this) toggleMenu();
});

/* ── Password show/hide ── */
function togglePwd() {
  const input = document.getElementById('password');
  const icon  = document.getElementById('eye-icon');
  const btn   = document.querySelector('.eye-btn');
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  icon.innerHTML = show
    ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
       <line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
       <circle cx="12" cy="12" r="3"/>`;
}

/* ── Validation helpers ── */
function setFieldState(id, state) {
  const wrap = document.getElementById(id + 'Wrap');
  wrap.classList.remove('error', 'success');
  if (state) wrap.classList.add(state);
}

function showFieldError(id, msg) {
  setFieldState(id, 'error');
  document.getElementById(id + 'ErrorText').textContent = msg;
  document.getElementById(id + 'Error').classList.add('show');
}

function clearFieldError(id) {
  setFieldState(id, null);
  document.getElementById(id + 'Error').classList.remove('show');
}

function validateEmail(submit = true) {
  const val = document.getElementById('email').value.trim();
  if (!val) {
    if (submit) showFieldError('email', 'Email is required.');
    return false;
  }
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  if (!valid) { showFieldError('email', 'Enter a valid email address.'); return false; }
  setFieldState('email', 'success');
  return true;
}

function validatePassword(submit = true) {
  const val = document.getElementById('password').value;
  if (!val) {
    if (submit) showFieldError('password', 'Password is required.');
    return false;
  }
  if (val.length < 6) {
    showFieldError('password', 'Password must be at least 6 characters.');
    return false;
  }
  setFieldState('password', 'success');
  return true;
}

/* ── Toast ── */
let toastTimer;
function showToast(type, msg) {
  const toast = document.getElementById('toast');
  const icon  = document.getElementById('toastIcon');
  const text  = document.getElementById('toastMsg');
  toast.className = 'toast show ' + type;
  text.textContent = msg;
  icon.innerHTML = type === 'error'
    ? `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`
    : `<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── Sign in ── */
async function handleSignIn(){
  const emailOk = validateEmail(true);
  const pwOk    = validatePassword(true);
  if (!emailOk || !pwOk) return;

  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
  btn.disabled = true;
}
  try {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
      remember: document.getElementById('remember').checked
    })
  });

  const data = await response.json();

  if (!response.ok) {
    // Server returned an error e.g. wrong password, user not found
    showToast('error', data.message || 'Invalid email or password.');
  } else {
    // Success — save token and redirect
    localStorage.setItem('token', data.token);
    showToast('success', 'Signed in successfully. Redirecting…');
    setTimeout(() => window.location.href = '/dashboard', 1000);
  }

} catch (err) {
  // Network error — no internet, server down, etc.
  showToast('error', 'Connection failed. Please try again.');
} finally {
  // Always re-enable the button whether it succeeded or failed
  btn.classList.remove('loading');
  btn.disabled = false;
}

/* ── GitHub OAuth ── */
function handleGitHub() {
  showToast('success', 'Redirecting to GitHub…');
  /* window.location.href = '/auth/github'; */
}

/* ── Forgot password ── */
function showForgot(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!email) {
    showToast('error', 'Enter your email first, then click Forgot password.');
    document.getElementById('email').focus();
    return;
  }
  showToast('success', `Password reset link sent to ${email}`);
}

/* ── Enter key submits form ── */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && document.activeElement.closest('.form-card')) {
    handleSignIn();
  }
});
