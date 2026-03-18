/* ===================================
   FICHA JUGADOR - JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Tabs
    const statsTabs = document.querySelectorAll('.stats-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (statsTabs.length > 0) {
        statsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                statsTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                tabContents.forEach(content => content.classList.remove('active'));
                
                const selectedContent = document.getElementById(tabId);
                if (selectedContent) {
                    selectedContent.classList.add('active');
                }
            });
        });
    }
    
    // Performance Bars Animation
    const performanceBars = document.querySelectorAll('.performance-fill');
    
    if (performanceBars.length > 0) {
        const animatePerformanceBars = () => {
            performanceBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        };
        
        const overviewTab = document.getElementById('overview');
        if (overviewTab) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animatePerformanceBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(overviewTab);
        }
    }
});
