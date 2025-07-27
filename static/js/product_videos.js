document.addEventListener('DOMContentLoaded', function () {
    const videoLinks = document.querySelectorAll('.video-link');
    const videoPlayers = document.querySelectorAll('.video-player');

    // YouTube Players Array
    let ytPlayers = {}; // To store YouTube player objects by videoId

    // Initially show the first video and mark its link as active
    if (videoLinks.length > 0) {
        videoLinks[0].classList.add('active');
        const firstVideoId = videoLinks[0].getAttribute('data-video-id');
        const firstPlayer = document.getElementById('video-' + firstVideoId);
        if (firstPlayer) {
            firstPlayer.classList.remove('hidden');
        }
    }

    videoLinks.forEach(link => {
        link.addEventListener('click', function () {
            // ✅ Check if locked
            if (this.classList.contains('locked')) {
                alert('Please complete the previous video and pass the quiz to unlock this one.');
                return; // ⛔ Prevent playing
            }

            const videoId = this.getAttribute('data-video-id');

            // 🔁 Hide all videos and effectively "stop" them
            videoPlayers.forEach(player => {
                player.classList.add('hidden');
                const playerVideoId = player.getAttribute('data-video-id');
                // Stop YouTube player if it exists
                if (ytPlayers[playerVideoId] && typeof ytPlayers[playerVideoId].stopVideo === 'function') {
                    ytPlayers[playerVideoId].stopVideo();
                }

                // Hide quiz form/result for the hidden video
                const form = document.getElementById('quiz-form-' + playerVideoId);
                const result = document.getElementById('quiz-result-' + playerVideoId);
                if (form) form.classList.add('hidden');
                if (result) result.classList.add('hidden');
            });

            // ✅ Show selected video
            const selectedPlayer = document.getElementById('video-' + videoId);
            selectedPlayer.classList.remove('hidden');

            // ✅ Update sidebar active state
            videoLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Play the selected video if its player object exists
            // This might re-initialize the video or play if paused.
            if (ytPlayers[videoId] && typeof ytPlayers[videoId].playVideo === 'function') {
                ytPlayers[videoId].playVideo();
            }
        });
    });

    // --- Critical Change Here ---
    // This function is called by the YouTube IFrame Player API when it's ready.
    window.onYouTubeIframeAPIReady = function() {
        videoPlayers.forEach(player => {
            const videoId = player.getAttribute('data-video-id');
            const iframe = player.querySelector('iframe'); // Get the iframe element

            if (iframe) {
                // Get the YouTube video ID from the iframe's src.
                // Your current iframe.src format is: "...youtube.com/embed/<VIDEO_ID>?enablejsapi=1&origin=..."
                // So, we need to extract the video ID from the path.
                const videoUrl = new URL(iframe.src);
                const youtubeVideoId = videoUrl.pathname.split('/').pop().split('?')[0];

                // Create a div element that will become the YouTube player.
                // This is the standard way to initialize YT.Player.
                const playerContainerId = 'youtube-player-' + videoId; // Unique ID for the player container
                const playerContainer = document.createElement('div');
                playerContainer.id = playerContainerId;
                
                // Replace the iframe with this new div container.
                // We're essentially letting the YT.Player API create and manage the iframe itself.
                iframe.parentNode.replaceChild(playerContainer, iframe);

                ytPlayers[videoId] = new YT.Player(playerContainerId, { // Pass the ID of the new div
                    height: '340',
                    width: '800',
                    videoId: youtubeVideoId, // Pass the extracted YouTube video ID
                    playerVars: {
                        'enablejsapi': 1,
                        'origin': '{{ request.scheme }}://{{ request.get_host }}'
                    },
                    events: {
                        'onReady': function(event) {
                            // If the first video, ensure it plays if it's the active one
                            const currentActiveLink = document.querySelector('.video-link.active');
                            if (currentActiveLink && currentActiveLink.getAttribute('data-video-id') == videoId) {
                                // event.target.playVideo(); // Optional: Autoplay first video
                            }
                        },
                        'onStateChange': function(event) {
                            // State 0 means video has ended
                            if (event.data === YT.PlayerState.ENDED) {
                                const quizForm = document.getElementById('quiz-form-' + videoId);
                                const currentActiveLink = document.querySelector('.video-link.active');
                                if (currentActiveLink && currentActiveLink.getAttribute('data-video-id') == videoId) {
                                    console.log('Video ' + videoId + ' ended. Attempting to show quiz form.');
                                    if (quizForm) {
                                        quizForm.classList.remove('hidden'); // Show the quiz form
                                        quizForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    } else {
                                        console.log('Quiz form for video ' + videoId + ' not found.');
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    };
});