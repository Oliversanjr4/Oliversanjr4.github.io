document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-links');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = nav.classList.contains('active') ? '✕' : '☰';
            toggle.textContent = icon;
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
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    toggle.textContent = '☰';
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
