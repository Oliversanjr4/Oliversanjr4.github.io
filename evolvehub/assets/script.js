// DOM helpers
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

// Year
const year = qs('#year');
if(year) year.textContent = new Date().getFullYear();

// Mobile nav
const hamburger = qs('#hamburger');
const mainNav = qs('#mainNav');
hamburger && hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('show');
});

// Modal
const signupModal = qs('#signupModal');
const openSignup = qs('#openSignup');
const closeModal = qs('#closeModal');
const cancelSignup = qs('#cancelSignup');
const heroGetStarted = qs('#heroGetStarted');

function showModal(){
  if(!signupModal) return;
  signupModal.setAttribute('aria-hidden','false');
}
function hideModal(){
  if(!signupModal) return;
  signupModal.setAttribute('aria-hidden','true');
}

openSignup && openSignup.addEventListener('click', showModal);
heroGetStarted && heroGetStarted.addEventListener('click', showModal);
closeModal && closeModal.addEventListener('click', hideModal);
cancelSignup && cancelSignup.addEventListener('click', hideModal);
signupModal && signupModal.addEventListener('click', e => {
  if(e.target === signupModal) hideModal();
});

// Form handling (simulado)
const signupForm = qs('#signupForm');
if(signupForm) signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(signupForm);
  const email = fd.get('email') || '';
  alert(`Cuenta creada (simulada) para: ${email}\nRevisa tu correo para confirmar.`);
  hideModal();
  signupForm.reset();
});

const contactForm = qs('#contactForm');
if(contactForm) contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(contactForm);
  const email = fd.get('email') || '';
  alert(`Solicitud recibida (simulada). Gracias, ${email}`);
  contactForm.reset();
});

qs('#clearForm') && qs('#clearForm').addEventListener('click', () => qs('#contactForm').reset());

// Small accessibility: close modal with ESC
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') hideModal();
});
