// ===========================
// Hero Carousel
// ===========================
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

function showNextSlide() {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');

    // Move to next slide
    currentSlide = (currentSlide + 1) % totalSlides;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
}

// Change slide every 3 seconds
setInterval(showNextSlide, 3000);

// ===========================
// Navbar Scroll Effect
// ===========================
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// ===========================
// Intersection Observer for Scroll Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    observer.observe(el);
});

// ===========================
// Stagger Animation for Grid Items
// ===========================
const industryCards = document.querySelectorAll('.industry-card');
industryCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

const processItems = document.querySelectorAll('.process-item');
processItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

// ===========================
// Contact Form Submission
// ===========================
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success
            formMessage.innerHTML = '<div class="alert alert-success">Thank you for your message! We\'ll get back to you within 24 hours.</div>';
            formMessage.style.display = 'block';
            form.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        } else {
            // Error from server
            formMessage.innerHTML = '<div class="alert alert-danger">Oops! There was a problem sending your message. Please try again or email us directly at contactus@blaseek.com.</div>';
            formMessage.style.display = 'block';
        }
    } catch (error) {
        // Network error
        formMessage.innerHTML = '<div class="alert alert-danger">Network error. Please check your connection and try again.</div>';
        formMessage.style.display = 'block';
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});
