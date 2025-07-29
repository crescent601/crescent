// static/js/main.js

document.addEventListener('DOMContentLoaded', (event) => {
    // Check if GSAP is loaded before proceeding
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded! Please check your script tag in base.html.");
        return; // Stop execution if GSAP is not available
    }

    const slides = document.querySelectorAll('.slide');
    const customSlider = document.querySelector('.custom-slider');

    if (!slides.length || !customSlider) {
        console.warn("Slider elements not found. Skipping slider animations.");
        return; // Exit if elements are not present
    }

    let currentSlide = 0;
    const totalSlides = slides.length;

    // --- Animation 1: Entire Slider Container Entrance ---
    // This will animate the whole .custom-slider div when the page loads.
    gsap.from(customSlider, {
        opacity: 0,
        y: -50, // Starts 50px above its final position
        duration: 1.2, // Animation takes 1.2 seconds
        ease: "power3.out", // Smooth easing effect
        delay: 0.3 // Starts animating 0.3 seconds after page load
    });

    // --- Animation 2: Initial Caption Entrance on First Load ---
    // Animates the caption of the first active slide when the page loads.
    const initialCaption = slides[currentSlide].querySelector('.caption');
    if (initialCaption) {
        gsap.fromTo(initialCaption,
            { opacity: 0, y: 30 }, // Starts invisible and 30px down
            { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 1 } // Fades in, slides up
        );
    }

    // --- Slider Navigation Logic with Caption Animation ---
    window.moveSlide = function(direction) {
        // Hide the caption of the current slide before changing
        const oldCaption = slides[currentSlide].querySelector('.caption');
        if (oldCaption) {
            gsap.to(oldCaption, {
                opacity: 0,
                y: -30, // Move up and fade out
                duration: 0.4,
                ease: "power1.in"
            });
        }

        // Update active slide
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');

        // Animate the caption of the new active slide
        const newCaption = slides[currentSlide].querySelector('.caption');
        if (newCaption) {
            gsap.fromTo(newCaption,
                { opacity: 0, y: 30 }, // Starts invisible and 30px down
                { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.5 } // Fades in, slides up with a delay
            );
        }
    };

    // Optional: Auto-play slider with a transition
    // Uncomment the block below if you want the slider to auto-advance
    // setInterval(() => {
    //     window.moveSlide(1); // Move to the next slide
    // }, 6000); // Change slide every 6 seconds (adjust as needed)
});