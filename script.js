// ========================================
// Nordic Floor Robot - Enhanced Animations
// Inspired by Sunday.ai
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initParallax();
    initCounterAnimation();
    initMobileMenu();
    initFormHandling();
    initHoverEffects();
    initCursorFollower();
});

// ========================================
// Navbar with hide/show on scroll
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Hide/show navbar on scroll direction
                if (currentScroll > lastScroll && currentScroll > 400) {
                    navbar.classList.add('nav-hidden');
                } else {
                    navbar.classList.remove('nav-hidden');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                document.body.classList.remove('menu-open');
            }
        });
    });
}

// ========================================
// Scroll Reveal Animations
// ========================================
function initScrollReveal() {
    // Add reveal classes to elements
    const revealElements = document.querySelectorAll(`
        .section-label,
        .section-title,
        .benchmark-content p,
        .benchmark-item,
        .testprogram-content > *,
        .robot-hero-text > *,
        .feature-card-mini,
        .about-intro > *,
        .value-item,
        .contact-info > *,
        .contact-form-wrapper,
        .timeline-item,
        .testprogram-benefits li,
        .founder-card
    `);
    
    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index % 5 * 0.1}s`;
    });
    
    // Intersection Observer for reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Stagger children if container
                const children = entry.target.querySelectorAll('.reveal:not(.revealed)');
                children.forEach((child, i) => {
                    setTimeout(() => {
                        child.classList.add('revealed');
                    }, i * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections and reveal elements
    document.querySelectorAll('section, .reveal').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// Parallax Effects
// ========================================
function initParallax() {
    const parallaxElements = [
        { selector: '.hero-background img', speed: 0.3 },
        { selector: '.testprogram-year', speed: -0.05 }
    ];
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(({ selector, speed }) => {
                    const el = document.querySelector(selector);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        const inView = rect.top < window.innerHeight && rect.bottom > 0;
                        
                        if (inView) {
                            const yPos = scrolled * speed;
                            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                        }
                    }
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ========================================
// Counter Animation for Stats
// ========================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number, .benchmark-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                if (!isNaN(number) && !target.classList.contains('counted')) {
                    target.classList.add('counted');
                    animateCounter(target, 0, number, 1500, suffix);
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration, suffix) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ========================================
// Hover Effects & Micro-interactions
// ========================================
function initHoverEffects() {
    // Magnetic effect on buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
    
    // Tilt effect on cards
    const cards = document.querySelectorAll('.feature-card-mini, .value-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
        });
    });
}

// ========================================
// Custom Cursor (subtle)
// ========================================
function initCursorFollower() {
    // Only on desktop
    if (window.innerWidth < 1024) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Scale on hover interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .feature-card-mini, .value-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuBtn || !navLinks) return;
    
    menuBtn.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            document.body.classList.remove('menu-open');
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
}

// ========================================
// Form Handling
// ========================================
function initFormHandling() {
    const forms = document.querySelectorAll('.contact-form, .application-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Add loading state
            submitBtn.innerHTML = '<span class="btn-spinner"></span> Sender...';
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success state
            submitBtn.innerHTML = '✓ Sendt!';
            submitBtn.classList.add('btn-success');
            
            showNotification('Tak for din henvendelse. Vi kontakter dig snart.', 'success');
            
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-success');
            }, 2500);
        });
    });
}

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('notification-visible');
    });
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('notification-visible');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('notification-visible');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ========================================
// Smooth Section Transitions
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Reveal hero content with delay
    const heroElements = document.querySelectorAll('.hero-content > *, .hero-logo');
    heroElements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('hero-revealed');
        }, 300 + i * 150);
    });
});
