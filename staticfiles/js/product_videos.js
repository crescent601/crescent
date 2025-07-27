// product_videos.js

console.log('product_videos.js loaded and script started!');

// onYouTubeIframeAPIReady को DOMContentLoaded से बाहर ले जाया गया है
// यह YouTube API द्वारा ग्लोबल स्कोप में कॉल किया जाता है।
window.onYouTubeIframeAPIReady = function() {
    console.log('onYouTubeIframeAPIReady fired!'); // यह अब कंसोल में दिखना चाहिए

    const videoPlayers = document.querySelectorAll('.video-player');
    let ytPlayers = {}; 

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

// DOMContentLoaded लिसनर को बाकी लॉजिक के लिए रखें
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded fired!');

    const videoLinks = document.querySelectorAll('.video-link');
    const videoPlayers = document.querySelectorAll('.video-player');

    // Initial setup to show the first video and hide others
    if (videoLinks.length > 0) {
        videoLinks[0].classList.add('active');
        // वीडियो प्लेयर को अब onYouTubeIframeAPIReady में इनिशियलाइज़ किया जाएगा, 
        // लेकिन इसकी visibility DOMContentLoaded पर सेट की जा सकती है।
        // videoPlayers[0].classList.remove('hidden'); // इसे यहाँ से हटा दिया गया है
    }

    videoLinks.forEach(link => {
        link.addEventListener('click', function() {
            const videoIdToShow = this.getAttribute('data-video-id');

            // सभी वीडियो प्लेयर्स को छिपाएं
            videoPlayers.forEach(player => player.classList.add('hidden'));

            // क्लिक किए गए वीडियो प्लेयर को दिखाएं
            const playerToShow = document.getElementById(`video-${videoIdToShow}`);
            if (playerToShow) {
                playerToShow.classList.remove('hidden');
                playerToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // अन्य YouTube प्लेयर्स को रोकें यदि वे चल रहे हों
                // सुनिश्चित करें कि ytPlayers ऑब्जेक्ट onYouTubeIframeAPIReady के बाद उपलब्ध हो
                if (window.ytPlayers) { // ग्लोबल स्कोप में ytPlayers तक पहुंचने के लिए
                    for (const id in window.ytPlayers) {
                        if (id !== videoIdToShow && window.ytPlayers[id] && typeof window.ytPlayers[id].pauseVideo === 'function') {
                            window.ytPlayers[id].pauseVideo();
                        }
                    }
                }
            }

            // एक्टिव लिंक अपडेट करें
            videoLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // वीडियो बदलते समय क्विज़ फ़ॉर्म/परिणामों को छिपाएं
            document.querySelectorAll('.quiz-form').forEach(form => form.classList.add('hidden'));
            document.querySelectorAll('.quiz-result').forEach(result => result.classList.add('hidden'));
        });
    });
});