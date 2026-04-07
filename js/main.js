/* =========================================================================
   ARTIGAMI - ADVANCED JS ANIMATIONS & WOW EFFECTS
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Geometric Cursor ---
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorOutline);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Nokta anında takip eder
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Çember yumuşak takip eder (Spring/Lerp effect)
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect for images and interactive elements
    const interactiveElements = document.querySelectorAll('a, img');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hovered');
            if(el.tagName === 'IMG') {
                cursorDot.classList.add('view-mode');
            }
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovered');
            cursorDot.classList.remove('view-mode');
        });
    });


    // --- 2. Scroll Reveal Animations (Intersection Observer) ---
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    // Add reveal classes to specific elements
    const titles = document.querySelectorAll('h1, h2, p, .spatial-image');
    titles.forEach(el => {
        el.classList.add('reveal-element');
        revealObserver.observe(el);
    });


    // --- 3. Parallax Image Smooth Scroll Effect ---
    const parallaxImages = document.querySelectorAll('.spatial-image img');
    
    window.addEventListener('scroll', () => {
        parallaxImages.forEach(img => {
            // Y ekseninde kaydırmaya bağlı hafif hareket (parallax)
            const speed = 0.1;
            const yPos = (window.scrollY - img.parentElement.offsetTop) * speed;
            img.style.transform = `scale(1.1) translateY(${yPos}px)`;
        });

        // 4. Navbar mix-blend inversion check (Optional based on scroll)
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > window.innerHeight - 50) {
            navbar.style.mixBlendMode = "normal";
            navbar.style.background = "rgba(248, 247, 243, 0.9)";
            navbar.style.color = "#111";
            navbar.style.backdropFilter = "blur(10px)";
        } else {
            navbar.style.mixBlendMode = "difference";
            navbar.style.background = "transparent";
            navbar.style.color = "#fff";
            navbar.style.backdropFilter = "none";
        }
    });

});
