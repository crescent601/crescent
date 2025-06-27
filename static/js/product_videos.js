document.addEventListener('DOMContentLoaded', function () {
    const videoLinks = document.querySelectorAll('.video-link');
    const videoPlayers = document.querySelectorAll('.video-player');

    // Initially show the first video and mark its link as active
    if (videoLinks.length > 0) {
        videoLinks[0].classList.add('active');
        // Ensure the first video player is visible if not already
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
                // Reset iframe src to stop playback
                const iframe = player.querySelector('iframe');
                if (iframe && iframe.src) {
                    // Store original src
                    const originalSrc = iframe.getAttribute('data-original-src') || iframe.src;
                    iframe.setAttribute('data-original-src', originalSrc); // Store original src
                    iframe.src = ''; // Clear src to stop video
                    iframe.src = originalSrc; // Re-set src to reload when shown again
                }
            });

            // ✅ Show selected video
            document.getElementById('video-' + videoId).classList.remove('hidden');

            // ✅ Update sidebar active state
            videoLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // ✅ Hide quiz form/result for the newly selected video if it's not the one whose quiz just ended
            // This logic might need refinement based on your exact quiz display flow
            const currentQuizForm = document.getElementById('quiz-form-' + videoId);
            const currentQuizResult = document.getElementById('quiz-result-' + videoId); // Assuming you'll add quiz-result-{{ video.id }} ID

            // If quizForm exists and is not hidden by default, you might need to manage its visibility here.
            // For now, let's assume it starts hidden and is shown on video end.
            // You might need to add a class 'quiz-hidden' initially to your quiz forms in HTML.
            // For simplicity, let's just make sure it's hidden if not the current video's quiz.
            videoPlayers.forEach(player => {
                const playerVideoId = player.getAttribute('data-video-id');
                const form = document.getElementById('quiz-form-' + playerVideoId);
                const result = document.getElementById('quiz-result-' + playerVideoId);
                if (form) form.classList.add('hidden'); // Hide all forms
                if (result) result.classList.add('hidden'); // Hide all results
            });


            // The quiz form should only show IF the video has ended and it's unlocked.
            // This logic is better handled by checking if the video is complete via your Django backend,
            // or by letting the 'ended' event trigger it.
            // For an LMS, it's usually better to let the backend (via `result_map` and `unlocked_video_ids`)
            // control whether the quiz is even rendered as visible initially.
            // So, no changes here for showing/hiding quiz on click, let the `ended` event handle it.
        });
    });

    // ✅ When video ends, show quiz
    videoPlayers.forEach(player => {
        const videoId = player.getAttribute('data-video-id');
        const iframe = player.querySelector('iframe'); // Get the iframe
        const quizForm = document.getElementById('quiz-form-' + videoId);

        // YouTube's IFrame Player API is needed for 'ended' event
        // Direct 'ended' event on iframe is not reliable for YouTube.
        // You need to use YouTube's IFrame Player API for this.
        // For a simpler approach, we'll keep the quiz hidden and assume it's revealed
        // based on backend data (e.g., if `result_map` doesn't exist for the video).

        // This part `videoTag.addEventListener('ended', function () { ... });`
        // WILL NOT WORK reliably for YouTube iframes without the YouTube IFrame Player API.
        // If you want to trigger the quiz ONLY on video completion, you'll need to:
        // 1. Load the YouTube IFrame Player API script in your base.html or product_videos.html
        // 2. Create `YT.Player` objects for each video.
        // 3. Listen for the `onStateChange` event (state 0 means ended).

        // For now, I'll remove the `ended` listener, and you'll need to decide how to reveal the quiz.
        // The most common LMS approach is:
        // - Quiz is hidden by default.
        // - User watches video.
        // - Once backend marks video as "watched" (e.g., if you track progress separately), quiz is shown.
        // - Or, simply, the quiz is shown if `video.id in unlocked_video_ids` AND `video.id not in result_map`.
        // Let's refine your HTML for this:
    });
});