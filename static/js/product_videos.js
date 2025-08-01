console.log("product_videos.js loaded and script started!");

let players = {}; // To store YouTube player instances

// This function is called automatically by the YouTube Iframe API when it's ready
function onYouTubeIframeAPIReady() {
    console.log("onYouTubeIframeAPIReady fired! Starting player initialization.");
    initializePlayers();
}

// Function to initialize YouTube players
function initializePlayers() {
    const unlockedVideoIdsJsonElement = document.getElementById('unlocked-video-ids-data');
    const unlockedVideoIds = unlockedVideoIdsJsonElement ? JSON.parse(unlockedVideoIdsJsonElement.textContent) : [];
    console.log("JavaScript - Unlocked Video IDs for Player Init:", unlockedVideoIds);

    document.querySelectorAll('.video-player-container').forEach(container => {
        const youtubeVideoId = container.dataset.youtubeId;
        const playerId = container.id; // e.g., "youtube-player-123"
        const videoId = parseInt(playerId.replace('youtube-player-', '')); // Extract numeric video ID

        // IMPORTANT: Only initialize player if the video ID is in the unlocked list
        if (unlockedVideoIds.includes(videoId)) {
            console.log(`Initializing player for unlocked video: ${videoId}`);
            players[playerId] = new YT.Player(playerId, {
                videoId: youtubeVideoId,
                playerVars: {
                    'autoplay': 0, // Do not autoplay
                    'rel': 0,      // Do not show related videos
                    'controls': 1, // Show player controls
                    'enablejsapi': 1, // Enable JavaScript API
                    'origin': window.location.origin // Crucial for security and API calls
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        } else {
            console.log(`Video ${videoId} is locked. Not initializing player.`);
            // These styles should already be applied by the DOMContentLoaded block
            // but ensure they are here too for robustness if race conditions occur.
            container.style.filter = 'grayscale(100%)';
            container.style.pointerEvents = 'none';
        }
    });
}

function onPlayerReady(event) {
    const playerId = event.target.getIframe().id;
    console.log(`Player ready for: ${playerId}`);
    // Optional: If you want to automatically play the first video, add logic here.
}

function onPlayerStateChange(event) {
    // Add logic here if needed for video playback events
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded fired! Attaching quiz button listeners and setting initial states.");

    const resultMapsJsonElement = document.getElementById('result-map-data');
    const resultMapsJson = resultMapsJsonElement ? JSON.parse(resultMapsJsonElement.textContent) : {};
    console.log("JavaScript - Result Map Data:", resultMapsJson);

    const unlockedVideoIdsJsonElement = document.getElementById('unlocked-video-ids-data');
    const unlockedVideoIds = unlockedVideoIdsJsonElement ? JSON.parse(unlockedVideoIdsJsonElement.textContent) : [];
    console.log("JavaScript - Unlocked Video IDs for DOM Update:", unlockedVideoIds);


    document.querySelectorAll('.take-quiz-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const videoId = e.target.dataset.videoId;
            const quizForm = document.getElementById(`quiz-form-${videoId}`);
            if (quizForm) {
                quizForm.style.display = 'block';
                e.target.style.display = 'none';
            }
        });
    });

    document.querySelectorAll('.video-card').forEach(card => {
        const cardId = card.id;
        const videoId = parseInt(cardId.replace('video-card-', ''));
        
        // --- IMPORTANT FIX: Corrected the typo here ---
        const playerContainer = document.getElementById(`Youtubeer-${videoId}`); 
        const takeQuizBtn = card.querySelector('.take-quiz-btn');
        const quizForm = document.getElementById(`quiz-form-${videoId}`);
        
        if (!unlockedVideoIds.includes(videoId)) {
            card.classList.add('locked'); // For general card styling (e.g., opacity)
            if (playerContainer) {
                playerContainer.style.filter = 'grayscale(100%)';
                playerContainer.style.pointerEvents = 'none'; // Disable interactions on the player
            }
            // Ensure any HTML-rendered overlay is visible if the video is locked
            const lockedOverlay = playerContainer ? playerContainer.querySelector('.locked-overlay') : null;
            if (lockedOverlay) {
                lockedOverlay.style.display = 'flex'; // Make sure it's visible if it exists
            }

            if (takeQuizBtn) takeQuizBtn.style.display = 'none';
            if (quizForm) quizForm.style.display = 'none';
        } else {
            // Video is unlocked
            card.classList.remove('locked'); // Remove general card locked styling
            if (playerContainer) {
                playerContainer.style.filter = ''; // Remove grayscale
                playerContainer.style.pointerEvents = ''; // Enable interactions
            }
            // Hide the overlay if the video is unlocked
            const lockedOverlay = playerContainer ? playerContainer.querySelector('.locked-overlay') : null;
            if (lockedOverlay) {
                lockedOverlay.style.display = 'none'; 
            }

            const quizResult = resultMapsJson[videoId];
            if (quizResult && quizResult.completed && quizResult.passed) {
                if (takeQuizBtn) takeQuizBtn.style.display = 'none';
                if (quizForm) quizForm.style.display = 'none';
            } else if (quizResult && quizResult.completed && !quizResult.passed) {
                if (takeQuizBtn) takeQuizBtn.style.display = 'block';
                if (quizForm) quizForm.style.display = 'none';
            } else {
                if (takeQuizBtn) takeQuizBtn.style.display = 'block';
                if (quizForm) quizForm.style.display = 'none';
            }
        }
    });

    // Removed the YouTube Iframe API script loading from here,
    // as it's typically loaded once in base.html or the product_videos.html head/extra_js block.
    // If it's not being loaded elsewhere, you might need to re-add it carefully.
});

window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global JS Error caught:", message, source, lineno, colno, error);
};