// Ano dinâmico no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Header com fundo ao rolar
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
});

// Menu mobile
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Destaca o link de navegação da seção visível
const sections = document.querySelectorAll('main section[id], header#topo');
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
    'Dev PHP & Laravel',
    'Estudante de ADS',
    'Dev C# / .NET'
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
