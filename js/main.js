/* =========================================================================
   ARTIGAMI - ADVANCED JS & GSAP LOGIC (Awwwards Level)
   ========================================================================= */

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.5, // Even smoother
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Text Splitter (No external plugins needed)
    const splitText = () => {
        // Split by lines
        document.querySelectorAll('[data-split="lines"]').forEach(el => {
            const html = el.innerHTML;
            if(html.includes('<br>')) {
                const lines = html.split('<br>');
                el.innerHTML = lines.map(line => `<span class="line-mask"><span>${line}</span></span>`).join('');
            } else {
                el.innerHTML = `<span class="line-mask"><span>${html}</span></span>`;
            }
        });

        // Split by characters (For massive hero titles)
        document.querySelectorAll('[data-split="chars"]').forEach(el => {
            const html = el.innerHTML;
            const lines = html.split('<br>');
            const newHtml = lines.map(line => {
                const chars = line.split('').map(char => {
                    return char === ' ' ? '&nbsp;' : `<span class="char-mask"><span>${char}</span></span>`;
                }).join('');
                return `<div class="line-mask" style="overflow:visible">${chars}</div>`; 
            }).join('');
            el.innerHTML = newHtml;
        });
    };
    splitText();

    // 3. Magnetic Buttons / Links
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const position = el.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: "power3.out" });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });

    // 4. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        gsap.to(cursorDot, { x: mouse.x, y: mouse.y, duration: 0.15, ease: "power2.out" });
        gsap.to(cursorOutline, { x: mouse.x, y: mouse.y, duration: 0.8, ease: "power3.out" });
    });

    const interactiveElements = document.querySelectorAll('a, button, .magnetic');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    // 5. Infinite Marquee
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        gsap.to(marqueeContent, {
            xPercent: -33.33, // Because we duplicated the content 3 times
            ease: "none",
            duration: 15,
            repeat: -1
        });
    }

    // 6. Preloader & Initial Reveal Timeline
    const tl = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
        }
    });

    // Counter Animation
    const counterObj = { val: 0 };
    tl.to(counterObj, {
        val: 100,
        duration: 2.5,
        ease: "power4.inOut",
        onUpdate: () => {
            document.querySelector('.preloader-counter').innerText = Math.round(counterObj.val);
        }
    })
    // Title flashes briefly
    .to('.preloader-title', { opacity: 0.15, duration: 0.5, ease: "power2.out" }, "-=0.8")
    // Hide counter
    .to('.preloader-counter', { y: -50, opacity: 0, duration: 0.5, ease: "power3.in" }, "-=0.2")
    // Slide up preloader BG
    .to('.preloader-bg', { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "+=0.2")
    // Fade out preloader content entirely
    .to('.preloader-content', { opacity: 0, duration: 0.5 }, "-=1")
    // Hero Image Scale & Overlay fade
    .fromTo('.hero-image-wrapper', { scale: 1.4 }, { scale: 1, duration: 2.5, ease: "expo.out" }, "-=1")
    .to('.hero-image-overlay', { opacity: 0, duration: 2, ease: "power2.inOut" }, "-=2.5")
    // Reveal Hero Title Characters
    .to('.hero-title .char-mask span', { y: "0%", duration: 1.2, stagger: 0.03, ease: "expo.out" }, "-=1.5")
    // Reveal Hero Subtitle Lines
    .to('.hero-subtitle .line-mask span', { y: "0%", duration: 1.2, ease: "expo.out" }, "-=1")
    // Navbar Drop
    .fromTo('.navbar', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=1.5");

    // 7. Scroll Animations

    // Vision Statement
    gsap.fromTo('.vision-quote-mark',
        { scale: 0.5, opacity: 0, y: 150 },
        { scrollTrigger: { trigger: '.vision-section', start: "top 75%" }, scale: 1, opacity: 1, y: 0, duration: 2.5, ease: "expo.out" }
    );
    gsap.to('.vision-statement .line-mask span', {
        scrollTrigger: { trigger: '.vision-section', start: "top 65%" },
        y: "0%", duration: 1.5, stagger: 0.1, ease: "expo.out"
    });
    gsap.to('.vision-signature .line-mask span', {
        scrollTrigger: { trigger: '.vision-section', start: "top 50%" },
        y: "0%", duration: 1.5, ease: "expo.out", delay: 0.5
    });

    // Spatial Art - Clip Path Reveals & Parallax
    const spatialGrids = document.querySelectorAll('.spatial-grid');
    spatialGrids.forEach(grid => {
        const imgContainer = grid.querySelector('.spatial-image-container');
        const img = grid.querySelector('.spatial-image');
        const titleSpans = grid.querySelectorAll('.spatial-title .line-mask span');
        const descSpans = grid.querySelectorAll('.spatial-desc .line-mask span');
        const label = grid.querySelector('.section-label');

        const gridTl = gsap.timeline({
            scrollTrigger: { trigger: grid, start: "top 65%" }
        });

        // Clip-path unfold reveal for images
        gridTl.to(imgContainer, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.8, ease: "expo.inOut" })
              .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.inOut" }, "-=1.8")
              .fromTo(label, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, "-=1.2")
              .to(titleSpans, { y: "0%", duration: 1.5, stagger: 0.1, ease: "expo.out" }, "-=1")
              .to(descSpans, { y: "0%", duration: 1.2, stagger: 0.05, ease: "expo.out" }, "-=1.2");

        // Subtle Parallax on scroll
        gsap.to(img, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: { trigger: imgContainer, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    // Footer Reveal
    const footerTl = gsap.timeline({
        scrollTrigger: { trigger: '.footer', start: "top 60%" }
    });

    footerTl.to('.footer-heading .line-mask span', { y: "0%", duration: 1.5, stagger: 0.1, ease: "expo.out" })
            .to('.footer-email', { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=1")
            .fromTo('.social-list a', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=1")
            .to('.footer-massive', { y: "0%", opacity: 1, duration: 2.5, ease: "expo.out" }, "-=1.5");

});