// Remove ESM style import to avoid native browser loading errors
// import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggler
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.mobile-nav-overlay');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('hidden');
            const isHidden = nav.classList.contains('hidden');
            const iconSpan = toggle.querySelector('.material-symbols-outlined');
            if (iconSpan) {
                iconSpan.textContent = isHidden ? 'menu' : 'close';
            } else {
                toggle.textContent = isHidden ? '☰' : '✕';
            }
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu overlay if open
                if (nav && !nav.classList.contains('hidden')) {
                    nav.classList.add('hidden');
                    const iconSpan = toggle ? toggle.querySelector('.material-symbols-outlined') : null;
                    if (iconSpan) {
                        iconSpan.textContent = 'menu';
                    } else if (toggle) {
                        toggle.textContent = '☰';
                    }
                }
            }
        });
    });

    // Payment Logic (Simulation)
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = e.target.dataset.plan;
            const price = e.target.dataset.price;

            // Simulating redirection to a Payment Gateway (like Stripe Checkout)
            const confirmBuy = confirm(`Estás a punto de ser redirigido a la pasarela de pago para el Plan ${plan.toUpperCase()} (${price}€). \n\nEsto es una simulación. En producción, esto te llevaría a Stripe/PayPal.`);

            if (confirmBuy) {
                // In a real app, this would be: window.location.href = 'https://buy.stripe.com/...'
                alert("¡Redirigiendo a Stripe Secure Checkout...");
            }
        });
    });
});