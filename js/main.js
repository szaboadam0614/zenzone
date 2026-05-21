/* Zen Zone — minimal JS */

const nav = document.getElementById('nav');
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');

// ── Scrolled background class
let scrollDir = 'down';
let lastY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  scrollDir = y > lastY ? 'down' : 'up';
  lastY = y;
  nav.classList.toggle('scrolled', y > 40);
}, { passive: true });

// ── Nav logó: csak akkor jelenik meg ha a hero teljesen eltűnt
const heroEl = document.querySelector('.hero');

const heroLogoObserver = new IntersectionObserver(([entry]) => {
  // isIntersecting=true → hero bármely pixele látható → logo rejtve
  // isIntersecting=false → hero teljesen off-screen → logo látható
  nav.classList.toggle('nav--hero', entry.isIntersecting);
}, { threshold: 0 });

if (heroEl) {
  heroLogoObserver.observe(heroEl);
  // Kezdeti állapot: szinkronban a valós pozícióval
  const r = heroEl.getBoundingClientRect();
  nav.classList.toggle('nav--hero', r.bottom > 0 && r.top < window.innerHeight);
}

// ── Nav hide/show via IntersectionObserver (works correctly with snap scroll)
const allSections = document.querySelectorAll('.hero, .section');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const menuOpen = burger?.classList.contains('open');
    if (menuOpen) return;

    const isHero = entry.target.classList.contains('hero');
    if (isHero || scrollDir === 'up') {
      nav.classList.remove('hidden');
    } else {
      nav.classList.add('hidden');
    }
  });
}, { threshold: 0.2 });

allSections.forEach(s => navObserver.observe(s));

// ── Mobile menu
const mobileLinks = mobileNav?.querySelectorAll('a') ?? [];

burger?.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) nav.classList.remove('hidden');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

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
