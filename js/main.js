// Ano dinâmico no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Alternância de tema claro/escuro (estado inicial já definido inline no <head>)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// Header com fundo ao rolar
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
});

// Menu mobile
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navScrim = document.getElementById('nav-scrim');
const mainContent = document.getElementById('main-content');
const siteFooter = document.getElementById('site-footer');

function setMenuOpen(isOpen) {
    navLinks.classList.toggle('open', isOpen);
    navToggle.classList.toggle('open', isOpen);
    navScrim.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mainContent.toggleAttribute('inert', isOpen);
    siteFooter.toggleAttribute('inert', isOpen);
}

navToggle.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('open'));
});

navScrim.addEventListener('click', () => setMenuOpen(false));

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
});

// Destaca o link de navegação da seção visível
const sections = document.querySelectorAll('main section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinkEls.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// Revela seções ao rolar
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.section').forEach(section => revealObserver.observe(section));

// Rotaciona o cargo exibido no hero
const roles = [
    'Desenvolvedor Back-end',
    'Dev C# / .NET 8',
    'Dev PHP & Laravel',
    'DevOps & Cloudflare'
];

const roleEl = document.getElementById('role-text');
let roleIndex = 0;

if (roleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleEl.style.opacity = 0;
        setTimeout(() => {
            roleEl.textContent = roles[roleIndex];
            roleEl.style.opacity = 1;
        }, 300);
    }, 3200);
    roleEl.style.transition = 'opacity 0.3s ease';
}
