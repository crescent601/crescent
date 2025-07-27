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
            if (ytPlayers[videoId] && typeof ytPlayers[videoId].playVideo === 'function') {
                ytPlayers[videoId].playVideo();
            }
        });
    });

    // This function is called by the YouTube IFrame Player API when it's ready.
    window.onYouTubeIframeAPIReady = function() {
        videoPlayers.forEach(player => {
            const videoId = player.getAttribute('data-video-id');
            const iframe = player.querySelector('iframe');
            const quizForm = document.getElementById('quiz-form-' + videoId);

            if (iframe) {
                // Extract video ID from iframe src
                const urlParams = new URLSearchParams(new URL(iframe.src).search);
                const youtubeVideoId = urlParams.get('v');

                ytPlayers[videoId] = new YT.Player(iframe, {
                    events: {
                        'onReady': function(event) {
                            // Optionally, if you want to autoplay when ready, though user interaction is better
                            // event.target.playVideo();
                        },
                        'onStateChange': function(event) {
                            // State 0 means video has ended
                            if (event.data === YT.PlayerState.ENDED) {
                                // Only show quiz if the current video is active
                                if (player.classList.contains('active') || !player.classList.contains('hidden')) {
                                     // Ensure the quiz form exists and is hidden
                                    if (quizForm) {
                                        quizForm.classList.remove('hidden'); // Show the quiz form
                                        // Optional: Scroll to the quiz form
                                        quizForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
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