// product_videos.js

console.log('product_videos.js loaded and script started!');

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded fired!');

    const videoLinks = document.querySelectorAll('.video-link');
    const videoPlayers = document.querySelectorAll('.video-player');

    let ytPlayers = {}; 

    // Initial setup to show the first video and hide others
    if (videoLinks.length > 0) {
        videoLinks[0].classList.add('active');
        videoPlayers[0].classList.remove('hidden');
    }

    videoLinks.forEach(link => {
        link.addEventListener('click', function() {
            const videoIdToShow = this.getAttribute('data-video-id');

            // Hide all video players
            videoPlayers.forEach(player => player.classList.add('hidden'));

            // Show the clicked video player
            const playerToShow = document.getElementById(`video-${videoIdToShow}`);
            if (playerToShow) {
                playerToShow.classList.remove('hidden');
                // Scroll to the video player
                playerToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Pause all other YouTube players if they are playing
                for (const id in ytPlayers) {
                    if (id !== videoIdToShow && ytPlayers[id] && typeof ytPlayers[id].pauseVideo === 'function') {
                        ytPlayers[id].pauseVideo();
                    }
                }
            }

            // Update active link
            videoLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Hide quiz forms/results when switching videos
            document.querySelectorAll('.quiz-form').forEach(form => form.classList.add('hidden'));
            document.querySelectorAll('.quiz-result').forEach(result => result.classList.add('hidden'));
        });
    });


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
            console.log('Extracted YouTube Video ID for video-' + videoId + ': ' + youtubeVideoId); 

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