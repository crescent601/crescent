// product_videos.js

console.log('product_videos.js is running!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded event fired in product_videos.js!');
    alert('Hello from product_videos.js!'); // A visual alert to confirm execution
});

// If you still have window.onYouTubeIframeAPIReady, keep a minimal version for testing
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube Iframe API is ready!');
};