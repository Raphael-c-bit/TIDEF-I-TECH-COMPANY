// Mobile Menu Functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mainNav = document.getElementById('main-nav');
const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

// Toggle mobile menu
mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('open');
    const icon = mobileMenuButton.querySelector('i');
    if (mobileMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = ''; // Restore scrolling
    }
});

// Close mobile menu when clicking a link
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = ''; // Restore scrolling
    });
});

// Sticky nav effect on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#mobile-menu') && 
        !e.target.closest('#mobile-menu-button') && 
        mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = ''; // Restore scrolling
    }
});

// Handle Escape key to close mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = ''; // Restore scrolling
    }
});

// Scroll animation implementation
const scrollElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right');

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
};

const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop > (window.innerHeight || document.documentElement.clientHeight)
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scroll-animate-visible');
};

const hideScrollElement = (element) => {
    element.classList.remove('scroll-animate-visible');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.2)) {
            displayScrollElement(el);
        } else if (elementOutofView(el)) {
            hideScrollElement(el);
        }
    });
    
    // Also trigger footer animations
    animateFooterOnScroll();
};

window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// Initialize scroll animation on page load
window.addEventListener('load', () => {
    handleScrollAnimation();
    // Initial check for footer animations
    animateFooterOnScroll();
});

// Copy link functionality
const copyLinkBtn = document.getElementById('copy-link');
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = window.location.href;
        
        // Use Clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(() => {
                showCopyFeedback(this);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopy(url, this);
            });
        } else {
            fallbackCopy(url, this);
        }
    });
}

function fallbackCopy(text, button) {
    // Create a temporary textarea for copying
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(button);
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        alert('Failed to copy link. Please copy manually from your address bar.');
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback(button) {
    const originalHtml = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.setAttribute('aria-label', 'Link copied!');
    
    setTimeout(() => {
        button.innerHTML = originalHtml;
        button.setAttribute('aria-label', 'Copy link');
    }, 2000);
}

// ======================
// Footer Animation Only
// ======================
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

function animateFooterOnScroll() {
    const revealElements = document.querySelectorAll('footer .reveal-up');
    revealElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('animate');
        }
    });
}

// Form validation for newsletter
const newsletterForm = document.querySelector('section.bg-darkBlue form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && !emailInput.value.trim()) {
            e.preventDefault();
            emailInput.focus();
            emailInput.style.borderColor = '#f15a24';
            setTimeout(() => {
                emailInput.style.borderColor = '';
            }, 2000);
        }
    });
}

// Comment form validation
const commentForm = document.querySelector('.mt-8 form, .mt-12 form');
if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
        const nameInput = this.querySelector('#name');
        const emailInput = this.querySelector('#email');
        const commentInput = this.querySelector('#comment');
        let isValid = true;
        
        if (nameInput && !nameInput.value.trim()) {
            isValid = false;
            highlightInvalid(nameInput);
        }
        
        if (emailInput && (!emailInput.value.trim() || !isValidEmail(emailInput.value))) {
            isValid = false;
            highlightInvalid(emailInput);
        }
        
        if (commentInput && !commentInput.value.trim()) {
            isValid = false;
            highlightInvalid(commentInput);
        }
        
        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields correctly.');
        }
    });
}

function highlightInvalid(input) {
    input.style.borderColor = '#f15a24';
    setTimeout(() => {
        input.style.borderColor = '';
    }, 3000);
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Search functionality
const searchButton = document.querySelector('nav button[aria-label="Search"], nav button:has(i.fa-search)');
const searchInput = document.querySelector('nav input[type="text"], .sidebar-widget input[type="text"]');

if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
        if (searchInput.value.trim()) {
            performSearch(searchInput.value);
        } else {
            searchInput.focus();
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        }
    });
}

function performSearch(query) {
    // Implement search functionality here
    console.log('Searching for:', query);
    alert(`Search functionality would search for: ${query}`);
    // In a real implementation, you would:
    // 1. Redirect to a search results page
    // 2. Or filter content on the current page
    // 3. Or make an AJAX request to a search endpoint
}

// Lazy loading images
document.addEventListener('DOMContentLoaded', function() {
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Handle window resize for better mobile experience
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile menu on landscape/portrait change if it's open
            if (window.innerWidth >= 768 && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = ''; // Restore scrolling
            }
        }, 250);
    });
    
    // Initialize tooltips for share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const label = this.getAttribute('aria-label');
            if (label) {
                // You could add a tooltip here if needed
            }
        });
    });
});

// Touch device detection and improvements
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
    
    // Improve touch interactions
    const buttons = document.querySelectorAll('button, .nav-link, .share-btn, .tags span');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Prevent zoom on double-tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add loading state to forms
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function() {
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
            
            // Re-enable after 5 seconds (in case of error)
            setTimeout(() => {
                submitButton.disabled = false;
                const originalText = submitButton.dataset.originalText || 'SUBMIT';
                submitButton.innerHTML = originalText;
            }, 5000);
        }
    });
});