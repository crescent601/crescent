// static/js/base.js

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM Content Loaded. Starting JS execution."); // New log

    if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
        console.error("GSAP or SplitText not loaded! Please check your script tags in base.html.");
        return; 
    }
    console.log("GSAP and SplitText are loaded."); // New log

    const slides = document.querySelectorAll('.slide');
    const customSlider = document.querySelector('.custom-slider');

    console.log("Found slides:", slides.length); // New log
    console.log("Found customSlider:", customSlider); // New log

    if (!slides.length || !customSlider) {
        console.warn("Slider elements not found on this page. Skipping slider animations.");
        return;
    }
    console.log("Slider elements found. Proceeding with animations."); // New log

    let currentSlide = 0;
    const totalSlides = slides.length;

    // ... rest of your code ...

    // --- Auto-play slider with a 4 seconds interval ---
    setInterval(() => {
        console.log("Slider auto-changing..."); // Already there, but confirm it runs
        window.moveSlide(1); 
    }, 4000); 

}); // End of DOMContentLoaded event listener