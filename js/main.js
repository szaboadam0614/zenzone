/* Zen Zone — minimal JS */

const nav = document.getElementById('nav');

// ── Scroll: nav hide/show + scrolled class
let lastY = window.scrollY;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const goingDown = y > lastY;

  nav.classList.toggle('scrolled', y > 40);

  if (y < 40) {
    // Tetején mindig látható
    nav.classList.remove('hidden');
  } else if (goingDown) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }

  lastY = y;
}, { passive: true });

// ── Nav logó: csak akkor jelenik meg ha a hero teljesen eltűnt
const heroEl = document.querySelector('.hero');

const heroLogoObserver = new IntersectionObserver(([entry]) => {
  nav.classList.toggle('nav--hero', entry.isIntersecting);
}, { threshold: 0 });

if (heroEl) {
  heroLogoObserver.observe(heroEl);
  const r = heroEl.getBoundingClientRect();
  nav.classList.toggle('nav--hero', r.bottom > 0 && r.top < window.innerHeight);
}

// ── Language switcher
const langToggle = document.getElementById('langToggle');

function setLang(lang) {
  const html = document.documentElement;
  html.classList.remove('lang-hu', 'lang-en');
  html.classList.add('lang-' + lang);
  html.setAttribute('lang', lang);
  localStorage.setItem('zz-lang', lang);
}

const savedLang = localStorage.getItem('zz-lang') || 'hu';
setLang(savedLang);

langToggle?.addEventListener('click', () => {
  const current = document.documentElement.classList.contains('lang-en') ? 'en' : 'hu';
  setLang(current === 'en' ? 'hu' : 'en');
});

// ── Scroll reveal
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
