// product_videos.js

console.log('product_videos.js loaded and script started!'); // For debugging

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded fired!'); // For debugging

    const videoLinks = document.querySelectorAll('.video-link');
    const videoPlayers = document.querySelectorAll('.video-player');

    let ytPlayers = {}; // To store YouTube player objects by videoId

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
            if (this.classList.contains('locked')) {
                alert('Please complete the previous video and pass the quiz to unlock this one.');
                return;
            }

            const videoId = this.getAttribute('data-video-id');

            videoPlayers.forEach(player => {
                player.classList.add('hidden');
                const playerVideoId = player.getAttribute('data-video-id');
                if (ytPlayers[playerVideoId] && typeof ytPlayers[playerVideoId].stopVideo === 'function') {
                    ytPlayers[playerVideoId].stopVideo();
                }

                const form = document.getElementById('quiz-form-' + playerVideoId);
                const result = document.getElementById('quiz-result-' + playerVideoId);
                if (form) form.classList.add('hidden');
                if (result) result.classList.add('hidden');
            });

            const selectedPlayer = document.getElementById('video-' + videoId);
            selectedPlayer.classList.remove('hidden');

            videoLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (ytPlayers[videoId] && typeof ytPlayers[videoId].playVideo === 'function') {
                ytPlayers[videoId].playVideo();
            }
        });
    });

    // This function is called by the YouTube IFrame Player API when it's ready.
    window.onYouTubeIframeAPIReady = function() {
        console.log('onYouTubeIframeAPIReady fired!'); // For debugging

        videoPlayers.forEach(player => {
            const videoId = player.getAttribute('data-video-id');
            const iframe = player.querySelector('iframe'); // This will now be null because HTML has div

            if (player) { // Check if the player div exists
                // Get the YouTube video ID from the data-original-src attribute
                // because the original iframe.src might be gone if it's already replaced
                // Or, if you're not using data-original-src, you need to get the ID from your backend logic.
                // For now, let's assume get_embed_url provides a clean path.
                // We'll use the ID from the URL that Django provides for the initial setup.

                // Since we're replacing the iframe with a div, we need the original video ID.
                // The safest way is to ensure your `video` object has a `youtube_id` field,
                // or re-extract it from `video.get_embed_url()` during rendering if possible.
                // For simplicity, let's assume we can get it from the `data-video-id` and
                // construct the player with the videoId.

                // You might need to fetch the YouTube video ID from a different source
                // if it's not directly in an iframe's src anymore.
                // For now, let's assume product_training.videos.all provides a `youtube_video_id` or similar.
                // If `video.get_embed_url` returns "https://www.youtube.com/embed/YOUR_VIDEO_ID<VIDEO_ID>?...", then:
                const originalEmbedUrl = player.querySelector('div[id^="youtube-player-"]').getAttribute('data-original-src'); // This might not exist anymore

                // The most reliable way to get YouTube Video ID:
                // Make sure your Django `video` object has a field like `youtube_id` or `youtube_url`
                // and pass it as a data attribute on your #video-{{ video.id }} div.
                // For example: <div id="video-{{ video.id }}" data-youtube-id="{{ video.youtube_id }}" ...>

                // If you don't have data-youtube-id, we can extract from the _expected_ URL format
                // coming from `video.get_embed_url()`. Let's use the iframe's original source if it was still there.
                // However, since we removed the iframe, this approach needs re-thinking.

                // Let's assume your Django model has a direct youtube_id field
                // And you add it as a data attribute in HTML:
                // <div id="video-{{ video.id }}" data-video-id="{{ video.id }}" data-youtube-id="{{ video.youtube_id }}">

                // If that's not the case, we'll need to pass `video.get_embed_url` to JS
                // or find another way to get the youtube_video_id for each video.
                // For now, I'm providing a placeholder that *assumes* the YouTube ID.
                // You MUST replace this 'YOUR_YOUTUBE_VIDEO_ID' with the actual ID.
                // This might require a small change in your Django view or HTML to pass the actual YouTube ID.

                // --- REVISED APPROACH FOR YOUTUBE_VIDEO_ID EXTRACTION ---
                // Since the iframe is gone, we cannot extract videoId from iframe.src.
                // The best way is to pass the YouTube Video ID from Django to a data attribute.
                // For example, in product.html, modify:
                // <div id="video-{{ video.id }}" class="video-player ..." data-video-id="{{ video.id }}" data-youtube-id="{{ video.youtube_id }}">
                // Then, in JS:
                // const youtubeVideoId = player.getAttribute('data-youtube-id');
                // If you can't add data-youtube-id to HTML, then you will need to re-think how you get youtube_video_id in JS.

                // TEMPORARY FIX: Try to get from the initial iframe src, if available from DOM
                // This is less reliable once iframe is replaced.
                // A better solution requires Django to pass the youtube_id directly.
                // For now, I'll use a placeholder for `youtubeVideoId`.
                // YOU NEED TO ENSURE `youtubeVideoId` IS CORRECTLY POPULATED FOR EACH VIDEO.

                // **MOST RELIABLE WAY**: Pass youtube_id from Django to a data attribute on the player div
                // In product.html: <div id="video-{{ video.id }}" ... data-youtube-id="{{ video.youtube_id }}">
                // Then in JS:
                const youtubeVideoId = player.getAttribute('data-youtube-id');

                if (!youtubeVideoId) {
                    console.error('Error: YouTube Video ID not found for video-player ' + videoId + '. Cannot initialize YouTube Player.');
                    // Fallback: Try to extract from the embed URL stored somewhere if it's there
                    // For example, if you stored the embed URL in a data attribute as `data-embed-url`
                    // const embedUrl = player.getAttribute('data-embed-url');
                    // if (embedUrl) {
                    //     const url = new URL(embedUrl);
                    //     youtubeVideoId = url.pathname.split('/').pop().split('?')[0];
                    // }
                    return; // Cannot proceed without a valid YouTube ID
                }

                const playerContainerId = 'youtube-player-' + videoId;

                ytPlayers[videoId] = new YT.Player(playerContainerId, {
                    height: '340',
                    width: '800',
                    videoId: youtubeVideoId, // Correctly pass the YouTube video ID
                    playerVars: {
                        'enablejsapi': 1,
                        'origin': '{{ request.scheme }}://{{ request.get_host }}'
                    },
                    events: {
                        'onReady': function(event) {
                            console.log('YouTube player for video ' + videoId + ' is ready.'); // For debugging
                        },
                        'onStateChange': function(event) {
                            console.log('Video ' + videoId + ' state changed to: ' + event.data); // For debugging
                            if (event.data === YT.PlayerState.ENDED) {
                                const quizForm = document.getElementById('quiz-form-' + videoId);
                                const currentActiveLink = document.querySelector('.video-link.active');

                                // Make sure the quiz only shows for the currently active video
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
            }
        });
    };
});