// Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    lerp: 0.12
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

// Navbar Scroll Effect (Throttled for performance)
const navbar = document.querySelector('nav');
let navbarTicking = false;
window.addEventListener('scroll', () => {
    if (!navbarTicking) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            navbarTicking = false;
        });
        navbarTicking = true;
    }
});

// Modal System
const modalTriggers = document.querySelectorAll('[data-modal-target]');
const modalCloses = document.querySelectorAll('[data-close]');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modal = document.querySelector(trigger.dataset.modalTarget);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Lazy Loading Images
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imgObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.0
            });
        }
    });
});

// Parallax Effect on Hero Video (Throttled for performance)
const heroVideo = document.querySelector('#hero video');
if (heroVideo) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                heroVideo.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Parallax Effect on List Images
const listImages = document.querySelectorAll('.list-card img');
listImages.forEach(img => {
    gsap.to(img, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: img.closest('.list-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});

// Card Tilt Effect
const tiltCards = document.querySelectorAll('.card-tilt');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
    });
});

// Enhanced Section Transitions with Crossfade
gsap.utils.toArray('section').forEach((section, index) => {
    if (index > 0) {
        gsap.from(section, {
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
                toggleActions: 'play none none reverse'
            }
        });
    }
});

// Stagger Animation for Cards
const reviewCards = document.querySelectorAll('.review-card');
gsap.from(reviewCards, {
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#reviews',
        start: 'top 70%'
    }
});

const newsCards = document.querySelectorAll('.news-card');
gsap.from(newsCards, {
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#news',
        start: 'top 70%'
    }
});

const profileCards = document.querySelectorAll('.profile-card');
gsap.from(profileCards, {
    opacity: 0,
    scale: 0.8,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    scrollTrigger: {
        trigger: '#profiles',
        start: 'top 70%'
    }
});
