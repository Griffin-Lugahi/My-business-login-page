# Griffin Lugahi — Sign In Page

A clean, dark-themed sign-in page built with vanilla HTML, CSS, and JavaScript.

---

## Project Structure

```
griffin-lugahi/
├── index.html    # Markup & layout
├── style.css     # All styles, animations, light/dark theme
└── script.js     # Form validation, auth logic, interactions
```

---

## Features

- **Form validation** — real-time email format and password length checks with field-level error messages
- **Loading state** — button disables and shows a spinner while signing in
- **Light / dark mode** — toggle in the topbar, preference saved to `localStorage`
- **Autofill fix** — browser autofill always renders with white text on a dark background
- **GitHub OAuth** — ready-made button, just uncomment the redirect line
- **Forgot password** — smart flow that requires an email to be entered first
- **Enter key support** — submits the form from anywhere inside the card
- **Mobile responsive** — hamburger menu, stacked layout, fluid typography

---

## Getting Started

No build step required. Just open `index.html` in your browser.

```bash
# Clone or download the project, then simply open:
open index.html
```

Or serve it locally with any static server:

```bash
npx serve .
# or
python3 -m http.server 3000
```

---

## Connecting a Real Backend

In `script.js`, find `handleSignIn()` and replace the placeholder `setTimeout` with a real fetch call:

```javascript
async function handleSignIn() {
  const emailOk = validateEmail(true);
  const pwOk    = validatePassword(true);
  if (!emailOk || !pwOk) return;

  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  try {
    const response = await fetch('https://yourapi.com/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:    document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        remember: document.getElementById('remember').checked
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showToast('error', data.message || 'Invalid email or password.');
    } else {
      localStorage.setItem('token', data.token);
      showToast('success', 'Signed in successfully. Redirecting…');
      setTimeout(() => window.location.href = '/dashboard', 1000);
    }

  } catch (err) {
    showToast('error', 'Connection failed. Please try again.');
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}
```

For GitHub OAuth, uncomment this line in `handleGitHub()`:

```javascript
window.location.href = '/auth/github';
```

---

## Customisation

| What             | Where in `style.css`         |
|------------------|------------------------------|
| Brand colours    | `:root` CSS variables        |
| Gold accent      | `--gold` variable            |
| Font             | Google Fonts import + `--font` usage |
| Card width       | `.right-panel` → `width`     |
| Light mode theme | `[data-theme="light"]` block |

---

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) + [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) via Google Fonts
- No frameworks, no dependencies, no build tools

---

## Contact

**Griffin Lugahi**  
glugahi@gmail.com · +254 114 593 974  
[LinkedIn](https://linkedin.com/in/griffinlugahi) · [GitHub](https://github.com/Griffin-Lugahi) · [griffinlugahi.dev](https://griffinlugahi.dev)
