    // --- Theme & RTL Logic ---
    const html = document.documentElement;
    
    window.toggleTheme = () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcons(isDark);
    };

    window.toggleRTL = () => {
        const isRTL = html.dir === 'rtl';
        const newDir = isRTL ? 'ltr' : 'rtl';
        html.dir = newDir;
        localStorage.setItem('dir', newDir);
        window.dispatchEvent(new Event('resize'));
    };

    const updateThemeIcons = (isDark) => {
        document.querySelectorAll('#theme-toggle [data-lucide]').forEach(icon => {
            const newIcon = isDark ? 'sun' : 'moon';
            icon.setAttribute('data-lucide', newIcon);
        });
        if (window.lucide) lucide.createIcons();
    };

    // Initialize states instantly (Theme check is also in Head)
    if (localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
        updateThemeIcons(true);
    }
    if (localStorage.getItem('dir') === 'rtl') {
        html.dir = 'rtl';
    }

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Behavior ---
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (!nav) return; // Guard for utility pages without nav
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    const toggleMobileMenu = (isOpen) => {
        if (!mobileMenu) return;
        if (isOpen) {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            document.body.style.overflow = '';
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', () => toggleMobileMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMobileMenu(false));

    // --- Mobile Dropdowns (Accordions) ---
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            const isHidden = content.classList.contains('hidden');
            
            // Toggle current
            if (isHidden) {
                content.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                if (icon) icon.style.transform = '';
            }
        });
    });

    // --- Scroll Reveal Animations ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Staggered delay logic
                const index = entry.target.getAttribute('data-reveal-index') || 0;
                entry.target.style.transitionDelay = `${index * 0.15}s`;
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                if (entry.target.classList.contains('reveal-text')) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-text').forEach((el, i) => {
        if (!el.hasAttribute('data-reveal-index')) {
            el.setAttribute('data-reveal-index', i % 4); // Reset staggered index every 4 elements
        }
        revealObserver.observe(el);
    });



    // --- Star Rating Animation ---
    const starContainers = document.querySelectorAll('.star-rating');
    const starObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stars = entry.target.querySelectorAll('i');
                stars.forEach((star, i) => {
                    star.style.transition = `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`;
                    star.style.transform = 'scale(1)';
                    star.style.opacity = '1';
                });
            }
        });
    }, { threshold: 0.5 });

    starContainers.forEach(container => {
        container.querySelectorAll('i').forEach(s => {
            s.style.transform = 'scale(0)';
            s.style.opacity = '0';
        });
        starObserver.observe(container);
    });

    // --- Stats Counter Animation ---
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.innerText;
                const countTo = parseFloat(text.replace(/[^0-9.]/g, ''));
                if (isNaN(countTo)) return;

                let countNum = 0;
                const duration = 2000;
                const step = (countTo / duration) * 10;
                
                const timer = setInterval(() => {
                    countNum += step;
                    if (countNum >= countTo) {
                        target.innerText = target.dataset.original;
                        clearInterval(timer);
                    } else {
                        // Preserve suffixes like K+, %, etc
                        const suffix = text.replace(/[0-9.]/g, '');
                        target.innerText = Math.floor(countNum) + suffix;
                    }
                }, 10);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-counter, .font-artistic.text-[#B35C44]').forEach(stat => {
        if (!isNaN(parseFloat(stat.innerText))) {
            stat.dataset.original = stat.innerText;
            statsObserver.observe(stat);
        }
    });

    // --- Compact Accordion (FAQ) ---
    const accordionTriggers = document.querySelectorAll('.faq-trigger, button.w-full.px-6.py-5');
    accordionTriggers.forEach(trigger => {
        const content = trigger.nextElementSibling;
        if (!content) return;

        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.overflow = 'hidden';
        content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        trigger.addEventListener('click', () => {
            const isOpen = content.style.maxHeight !== '0px';
            const icon = trigger.querySelector('[data-lucide]');
            
            // Close others 
            accordionTriggers.forEach(other => {
                const otherContent = other.nextElementSibling;
                if (otherContent && otherContent !== content) {
                    otherContent.style.maxHeight = '0px';
                    otherContent.style.opacity = '0';
                    const otherIcon = other.querySelector('[data-lucide]');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                if (icon) icon.style.transform = 'rotate(45deg)';
            } else {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // (RTL functionality moved to global toggleRTL)

    // Initialize Lucide
    lucide.createIcons();
});
