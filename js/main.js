/* =========================================================================
   ARTIGAMI - GSAP & LENIS ADVANCED ANIMATIONS
   ========================================================================= */

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor (GSAP powered for smoothness)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Immediate follow for dot
        gsap.to(cursorDot, { x: mouse.x, y: mouse.y, duration: 0.1, ease: "power2.out" });
        // Lagging follow for outline
        gsap.to(cursorOutline, { x: mouse.x, y: mouse.y, duration: 0.6, ease: "power3.out" });
    });

    // Hover states for links and images
    const interactiveElements = document.querySelectorAll('a, button, img');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    // 3. Prepare Text for Line Animation (Wrap lines in spans)
    // A simple text splitter for block elements
    const splitText = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const html = el.innerHTML;
            // Basic split by <br> or just wrap the whole content if no <br>
            if(html.includes('<br>')) {
                const lines = html.split('<br>');
                el.innerHTML = lines.map(line => `<span class="line-mask"><span>${line}</span></span>`).join('');
            } else {
                el.innerHTML = `<span class="line-mask"><span>${html}</span></span>`;
            }
        });
    };

    // Apply split text to specific classes
    splitText('.hero-title');
    splitText('.hero-subtitle');
    splitText('.spatial-title');
    splitText('.footer-heading');

    // 4. Entry Animation (Hero Section)
    const tl = gsap.timeline({ defaults: { ease: "power4.out" }});
    
    // Scale down hero image wrapper
    tl.fromTo('.hero-image-wrapper', 
        { scale: 1.2 },
        { scale: 1, duration: 2.5 }
    )
    // Reveal Hero Title
    .to('.hero-title .line-mask span', 
        { y: "0%", duration: 1.5, stagger: 0.15 }, 
        "-=2"
    )
    // Reveal Hero Subtitle
    .to('.hero-subtitle .line-mask span', 
        { y: "0%", duration: 1.5 }, 
        "-=1.6"
    )
    // Reveal Navbar
    .fromTo('.navbar', 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5 }, 
        "-=1.5"
    );

    // 5. Scroll Animations (ScrollTrigger)

    // A. Vision Section Reveal
    gsap.fromTo('.vision-statement', 
        { y: 50, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.vision-section',
                start: "top 75%",
            },
            y: 0, opacity: 1, duration: 1.5, ease: "power3.out"
        }
    );

    gsap.fromTo('.vision-quote-mark',
        { scale: 0.8, opacity: 0, y: 100 },
        {
            scrollTrigger: {
                trigger: '.vision-section',
                start: "top 80%",
            },
            scale: 1, opacity: 1, y: 0, duration: 2, ease: "power4.out"
        }
    );

    // B. Spatial Art Grid (Titles & Labels)
    const spatialGrids = document.querySelectorAll('.spatial-grid');
    spatialGrids.forEach(grid => {
        const label = grid.querySelector('.section-label');
        const titleSpans = grid.querySelectorAll('.spatial-title .line-mask span');
        const desc = grid.querySelector('.spatial-desc');
        
        const gridTl = gsap.timeline({
            scrollTrigger: {
                trigger: grid,
                start: "top 75%",
            }
        });

        gridTl.fromTo(label, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" })
              .to(titleSpans, { y: "0%", duration: 1.2, stagger: 0.1, ease: "power4.out" }, "-=0.8")
              .fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }, "-=1");
    });

    // C. Image Parallax (Moving the image inside its container)
    const parallaxImages = document.querySelectorAll('.spatial-image');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            yPercent: 30, // Moves the image down within its overflow:hidden parent
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom", // Start when top of container hits bottom of viewport
                end: "bottom top",   // End when bottom of container hits top of viewport
                scrub: true          // Link to scroll progress
            }
        });
    });

    // D. Footer Reveal
    const footerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer',
            start: "top 70%",
        }
    });

    footerTl.to('.footer-heading .line-mask span', { y: "0%", duration: 1.5, stagger: 0.1, ease: "power4.out" })
            .fromTo('.footer-email', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=1")
            .fromTo('.social-list li', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.8")
            .fromTo('.footer-massive', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 2, ease: "power4.out" }, "-=1");

});
