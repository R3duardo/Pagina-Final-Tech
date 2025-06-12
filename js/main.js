document.addEventListener('DOMContentLoaded', function() {
    // ===== FUNCIONALIDADES MODERNAS AÑADIDAS =====
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Añadir clase 'scrolled' cuando se hace scroll
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Ocultar/mostrar header al hacer scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Intersection Observer para animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animar elementos hijos con delay
                const children = entry.target.querySelectorAll('.benefit-card, .service-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones (sin product-grid)
    const animateElements = document.querySelectorAll('.benefits-grid, .services-grid, .testimonials');
    animateElements.forEach(el => observer.observe(el));
    
    // Parallax effect removido por problemas de UX
    
    // Smooth counter animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }
    
    // Aplicar contador a elementos con data-counter
    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.counter);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // Scroll throttling para mejor rendimiento
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    function updateScroll() {
        handleScroll();
        setActiveLink();
        ticking = false;
    }
    
    window.addEventListener('scroll', requestTick);
    
    // ===== FUNCIONALIDADES ORIGINALES MEJORADAS =====
    
    // Menú móvil mejorado
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.getElementById('navbar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Implementar el menú desplegable en móvil
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (window.innerWidth <= 992) {
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
    }
    
    // Cerrar el menú cuando se hace clic fuera
    document.addEventListener('click', function(e) {
        if (navbar.classList.contains('active') && !navbar.contains(e.target) && !menuToggle.contains(e.target)) {
            navbar.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Funcionalidad para FAQs (Acordeón) mejorada
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const icon = otherItem.querySelector('.faq-question i');
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            });
            
            item.classList.toggle('active');
            
            const icon = item.querySelector('.faq-question i');
            if (icon) {
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });
    
    // Testimonial slider mejorado
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
            testimonial.style.opacity = i === index ? '1' : '0';
            testimonial.style.transform = i === index ? 'translateX(0)' : 'translateX(20px)';
        });
    }
    
    if (testimonials.length > 0) {
        showTestimonial(0);
        
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
    
    // Navegación suave mejorada
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const offsetTop = targetElement.offsetTop - headerHeight - 32;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    if (navbar.classList.contains('active')) {
                        navbar.classList.remove('active');
                        const icon = menuToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // Destacar el enlace activo en la navegación mejorado
    function setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('#navbar ul li a');
        const headerHeight = document.querySelector('header').offsetHeight;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ===== FUNCIONALIDADES DE MODAL MEJORADAS =====
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            modal.offsetHeight;
            
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        }
    }
    
    function closeModal(modal) {
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.position = '';
            modal.style.top = '';
            modal.style.left = '';
            modal.style.right = '';
            modal.style.bottom = '';
            modal.style.alignItems = '';
            modal.style.justifyContent = '';
            document.body.style.overflow = '';
        }, 400);
    }
    
    // Event listeners para botones "Ver detalles"
    const productButtons = document.querySelectorAll('[data-modal]');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(modal);
            });
        }
        
        const closeModalBtn = modal.querySelector('.modal-close-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(modal);
            });
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(modal);
            }
        });
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Función para obtener parámetros de la URL
    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    // Verificar si hay un parámetro de modal en la URL al cargar la página
    function checkForModalParameter() {
        const modalParam = getURLParameter('modal');
        if (modalParam) {
            setTimeout(() => {
                const modal = document.getElementById(modalParam);
                if (modal) {
                    openModal(modalParam);
                    const url = new URL(window.location);
                    url.searchParams.delete('modal');
                    window.history.replaceState({}, document.title, url.pathname + url.hash);
                }
            }, 500);
        }
    }
    
    // Ejecutar la verificación al cargar la página
    checkForModalParameter();
    
    // Función para manejar el scroll cuando se llega desde otra página con anchor
    function handleExternalAnchorNavigation() {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const offsetTop = targetElement.offsetTop - headerHeight - 32;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }
    
    handleExternalAnchorNavigation();
    
    window.addEventListener('hashchange', handleExternalAnchorNavigation);
}); 