/* Zen Zone — minimal JS */

const nav = document.getElementById('nav');
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');

// ── Scrolled background class (plain scroll event, reliable)
let scrollDir = 'down';
let lastY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  scrollDir = y > lastY ? 'down' : 'up';
  lastY = y;
  nav.classList.toggle('scrolled', y > 40);
}, { passive: true });

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
