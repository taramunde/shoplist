/* ===================================
   CD VILLAFERREIRA - JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const closeMobileNav = document.getElementById('closeMobileNav');
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    
    // Menú móvil - Abrir
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.add('active');
            mainNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
       // Toggle Clasificación Completa
const toggleStandings = document.getElementById('toggleStandings');
const hiddenRows = document.querySelectorAll('.hidden-row');

if (toggleStandings && hiddenRows.length > 0) {
    toggleStandings.addEventListener('click', function(e) {
        e.preventDefault();
        
        const isExpanded = this.classList.contains('expanded');
        
        if (isExpanded) {
            // Contraer
            hiddenRows.forEach(row => {
                row.classList.remove('show');
            });
            this.classList.remove('expanded');
            this.innerHTML = 'Ver clasificación completa <i class="fas fa-arrow-down"></i>';
        } else {
            // Expandir
            hiddenRows.forEach((row, index) => {
                setTimeout(() => {
                    row.classList.add('show');
                }, index * 50);
            });
            this.classList.add('expanded');
            this.innerHTML = 'Ver menos <i class="fas fa-arrow-up"></i>';
        }
    });
}
    }
    
    // Menú móvil - Cerrar
    if (closeMobileNav && mainNav && mobileMenuBtn) {
        closeMobileNav.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Submenús en móvil
    const navItemsWithSubmenu = document.querySelectorAll('.nav-item.has-submenu');
    
    navItemsWithSubmenu.forEach(item => {
        const link = item.querySelector('a');
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                item.classList.toggle('open');
            }
        });
    });
    
    // Cerrar menú al hacer clic en enlace simple
    const simpleNavLinks = document.querySelectorAll('.nav-item:not(.has-submenu) a');
    
    simpleNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024 && mainNav && mobileMenuBtn) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Cerrar menú al hacer clic en submenú
    const submenuLinks = document.querySelectorAll('.submenu a');
    
    submenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024 && mainNav && mobileMenuBtn) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Search Overlay
    if (searchBtn && searchOverlay && closeSearch) {
        searchBtn.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const input = searchOverlay.querySelector('input');
                if (input) input.focus();
            }, 300);
        });
        
        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Filtros Plantilla
    const tabBtns = document.querySelectorAll('.tab-btn');
    const playerCards = document.querySelectorAll('.player-card');
    
    if (tabBtns.length > 0 && playerCards.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const position = this.dataset.position;
                
                playerCards.forEach(card => {
                    if (position === 'all' || card.dataset.position === position) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }
    
    // Cookie Banner
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');
    const rejectCookies = document.getElementById('rejectCookies');
    
    if (cookieBanner && acceptCookies && rejectCookies) {
        if (!localStorage.getItem('cookieChoice')) {
            setTimeout(() => {
                cookieBanner.classList.add('active');
            }, 1500);
        }
        
        acceptCookies.addEventListener('click', function() {
            localStorage.setItem('cookieChoice', 'accepted');
            cookieBanner.classList.remove('active');
        });
        
        rejectCookies.addEventListener('click', function() {
            localStorage.setItem('cookieChoice', 'rejected');
            cookieBanner.classList.remove('active');
        });
    }
    
    // Animaciones al scroll
    const animateElements = document.querySelectorAll('.news-card, .player-card, .match-item');
    
    if (animateElements.length > 0) {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animateObserver.observe(el);
        });
    }
    
    // Botón volver arriba
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Volver arriba');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #1a365d;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    backToTop.addEventListener('mouseenter', function() {
        this.style.background = '#c9a227';
        this.style.transform = 'translateY(-5px)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        this.style.background = '#1a365d';
        this.style.transform = 'translateY(0)';
    });
});
