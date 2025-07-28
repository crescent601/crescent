// product_videos.js

console.log('product_videos.js loaded and script started!');

let players = {}; // To store YouTube player objects

// YouTube IFrame API Ready Callback
function onYouTubeIframeAPIReady() {
    console.log('onYouTubeIframeAPIReady fired!');
    // जब API तैयार हो जाए और DOM भी तैयार हो, तो प्लेयर्स को इनिशियलाइज़ करें
    initializePlayers(); 
}

// प्लेयर इनिशियलाइज़ेशन फंक्शन
function initializePlayers() {
    console.log('Initializing YouTube players...');
    
    // सभी वीडियो प्लेयर्स के कंटेनरों को ढूंढें
    document.querySelectorAll('.youtube-player-container').forEach(container => {
        const playerId = container.id; // 'youtube-player-X'
        // video-player div से data-youtube-id निकालें
        const videoPlayerDiv = container.closest('.video-player');
        if (!videoPlayerDiv) {
            console.error(`Could not find parent .video-player for ${playerId}`);
            return;
        }
        const youtubeVideoId = videoPlayerDiv.dataset.youtubeId; // 'get_youtube_video_id' से आया हुआ ID

        if (youtubeVideoId && playerId && !players[playerId]) { // केवल तभी इनिशियलाइज़ करें जब player पहले से न बना हो
            console.log(`Creating YouTube Player for ID: ${playerId}, Video ID: ${youtubeVideoId}`);
            
            players[playerId] = new YT.Player(playerId, {
                videoId: youtubeVideoId,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                },
                playerVars: {
                    'autoplay': 0, 
                    'rel': 0,      
                    'modestbranding': 1,
                    'origin': window.location.origin // यह postMessage चेतावनी को कम करने में मदद कर सकता है
                }
            });
        }
    });
}


// YouTube Player Ready Event
function onPlayerReady(event) {
    const playerIframe = event.target.getIframe();
    const playerId = playerIframe.id;
    const videoId = playerIframe.dataset.videoId || playerIframe.src.match(/embed\/([a-zA-Z0-9_-]{11})/)?.[1]; // Fallback for videoId
    console.log(`Youtubeer for ${playerId} is ready. Video ID: ${videoId}`);

    // इस वीडियो से संबंधित क्विज़ बटन ढूंढें
    const quizBtn = document.getElementById(`take-quiz-btn-${videoId}`); 
    const quizForm = document.getElementById(`quiz-form-${videoId}`);
    const quizResult = document.getElementById(`quiz-result-${videoId}`);


    // वीडियो लिंक पर क्लिक इवेंट के लिए
    playerIframe.closest('.video-player').dataset.actualPlayer = event.target; // Store player object for later use

    // 90% वीडियो देखने पर क्विज़ बटन दिखाएं
    // यह फ़ंक्शन हर 1 सेकंड में चलता रहेगा जब वीडियो चल रहा हो
    setInterval(() => {
        if (event.target.getPlayerState() === YT.PlayerState.PLAYING) {
            const currentTime = event.target.getCurrentTime();
            const duration = event.target.getDuration();
            const percentWatched = (currentTime / duration) * 100;

            if (quizBtn && percentWatched >= 90) {
                // केवल तभी दिखाएं जब क्विज़ पहले से सबमिट न किया गया हो
                if (!quizResult || quizResult.style.display === 'none') { // Assume quizResult is hidden if not taken
                    quizBtn.style.display = 'block'; 
                }
            }
        }
    }, 1000); 
}

// YouTube Player State Change Event
function onPlayerStateChange(event) {
    const playerIframe = event.target.getIframe();
    const videoId = playerIframe.id.split('-')[2]; // 'youtube-player-X' से X निकालें
    
    if (event.data === YT.PlayerState.ENDED) {
        console.log(`Video ${videoId} ended.`);
        // यदि वीडियो समाप्त हो जाता है, तो क्विज़ बटन दिखाएं (यदि अभी तक नहीं दिखाया गया है)
        const quizBtn = document.getElementById(`take-quiz-btn-${videoId}`);
        const quizResult = document.getElementById(`quiz-result-${videoId}`);
        if (quizBtn && (!quizResult || quizResult.style.display === 'none')) {
            quizBtn.style.display = 'block';
        }
    }
}

// ============== Video Switching Logic ==============
document.addEventListener('DOMContentLoaded', () => {
    const videoLinks = document.querySelectorAll('.video-link');
    const videoPlayers = document.querySelectorAll('.video-player');

    videoLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetVideoId = this.dataset.videoId;
            const isLocked = this.dataset.isLocked === 'true';

            if (isLocked) {
                alert('This video is locked. Please complete the previous quizzes to unlock it.');
                return; // लॉक किए गए वीडियो पर क्लिक करने पर कुछ न करें
            }

            // सभी वीडियो प्लेयर्स को छिपाएं
            videoPlayers.forEach(player => {
                player.classList.add('hidden');
                // यदि कोई वीडियो चल रहा है, तो उसे रोकें
                const playerInstance = players[`Youtubeer-${player.dataset.videoId}`];
                if (playerInstance && typeof playerInstance.pauseVideo === 'function') {
                    playerInstance.pauseVideo();
                }
            });

            // सभी वीडियो लिंक्स से 'active' क्लास हटा दें
            videoLinks.forEach(l => l.classList.remove('active'));

            // वर्तमान वीडियो प्लेयर दिखाएं
            const targetPlayer = document.getElementById(`video-${targetVideoId}`);
            if (targetPlayer) {
                targetPlayer.classList.remove('hidden');
                // संबंधित वीडियो लिंक को 'active' बनाएं
                this.classList.add('active');
                
                // वीडियो को प्ले करना शुरू करें (वैकल्पिक)
                const playerInstance = players[`Youtubeer-${targetVideoId}`];
                if (playerInstance && typeof playerInstance.playVideo === 'function') {
                    // सुनिश्चित करें कि प्लेयर तैयार है
                    if (playerInstance.getPlayerState() === YT.PlayerState.UNSTARTED || 
                        playerInstance.getPlayerState() === YT.PlayerState.ENDED) {
                        playerInstance.playVideo();
                    }
                }
            }
        });
    });

    // ============== Quiz Button Logic ==============
    document.querySelectorAll('.take-quiz-btn').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.dataset.videoId;
            const quizForm = document.getElementById(`quiz-form-${videoId}`);
            if (quizForm) {
                quizForm.style.display = 'block'; // Show the quiz form
                this.style.display = 'none'; // Hide the quiz button
            }
        });
    });

    // ============== Initial Load: Show first video and hide quiz/result if applicable ==============
    const firstVideoId = document.querySelector('.video-link[data-video-id]').dataset.videoId;
    if (firstVideoId) {
        const firstQuizForm = document.getElementById(`quiz-form-${firstVideoId}`);
        const firstQuizResult = document.getElementById(`quiz-result-${firstVideoId}`);
        const firstTakeQuizBtn = document.getElementById(`take-quiz-btn-${firstVideoId}`);

        if (firstQuizForm && !firstQuizForm.classList.contains('hidden')) {
            firstQuizForm.style.display = 'none'; // Initially hide quiz forms
        }
        if (firstQuizResult && !firstQuizResult.classList.contains('hidden')) {
             firstQuizResult.style.display = 'none'; // Initially hide quiz results
        }
        if (firstTakeQuizBtn) {
            firstTakeQuizBtn.style.display = 'none'; // Initially hide take quiz button
        }
    }

    // `result_map` से क्विज़ परिणाम को दिखाने या छिपाने का लॉजिक
    // यह सुनिश्चित करने के लिए कि पृष्ठ लोड होने पर सही परिणाम दिखाए जाएं
    const resultMapsJson = JSON.parse(document.getElementById('result-map-data')?.textContent || '{}');
    for (const videoId in resultMapsJson) {
        const result = resultMapsJson[videoId];
        const quizForm = document.getElementById(`quiz-form-${videoId}`);
        const takeQuizBtn = document.getElementById(`take-quiz-btn-${videoId}`);
        const quizResult = document.getElementById(`quiz-result-${videoId}`);

        if (result && result.completed) {
            if (quizForm) quizForm.style.display = 'none';
            if (takeQuizBtn) takeQuizBtn.style.display = 'none';
            if (quizResult) quizResult.style.display = 'block'; // Show the result
        }
    }
});