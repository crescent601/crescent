// product_videos.js

console.log('product_videos.js loaded and script started!');

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded fired!');

    const videoLinks = document.querySelectorAll('.video-link');
    const videoPlayers = document.querySelectorAll('.video-player');

    let ytPlayers = {}; 

    // ... (remaining setup for active link, etc.) ...

    // This function is called by the YouTube IFrame Player API when it's ready.
    window.onYouTubeIframeAPIReady = function() {
        console.log('onYouTubeIframeAPIReady fired!'); 

        videoPlayers.forEach(player => {
            const videoId = player.getAttribute('data-video-id');
            const youtubeVideoId = player.getAttribute('data-youtube-id'); 

            if (!youtubeVideoId) {
                console.error('Error: YouTube Video ID not found for video-player ' + videoId + '. Cannot initialize YouTube Player.');
                return; 
            }

            const playerContainerId = 'youtube-player-' + videoId;

            ytPlayers[videoId] = new YT.Player(playerContainerId, {
                height: '340',
                width: '800',
                videoId: youtubeVideoId, 
                playerVars: {
                    'enablejsapi': 1,
                    'origin': window.location.origin 
                },
                events: {
                    'onReady': function(event) {
                        console.log('YouTube player for video ' + videoId + ' is ready.'); 
                    },
                    'onStateChange': function(event) {
                        console.log('Video ' + videoId + ' state changed to: ' + event.data);
                        if (event.data === YT.PlayerState.ENDED) {
                            const quizForm = document.getElementById('quiz-form-' + videoId);
                            const currentActiveLink = document.querySelector('.video-link.active');

                            if (currentActiveLink && currentActiveLink.getAttribute('data-video-id') == videoId) {
                                console.log('Video ' + videoId + ' ended. Attempting to show quiz form.');
                                if (quizForm) {
                                    quizForm.classList.remove('hidden');
                                    quizForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                } else {
                                    console.log('Quiz form for video ' + videoId + ' not found.');
                                }
                            }
                        }
                    }
                }
            });
        });
    };
});