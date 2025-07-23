// home.js

document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        const quizBtn = document.getElementById(`quiz-btn-${video.dataset.id}`);
        quizBtn.style.display = 'none'; // initially hidden

        video.addEventListener('timeupdate', () => {
            const percentWatched = (video.currentTime / video.duration) * 100;

            if (percentWatched >= 90) {
                quizBtn.style.display = 'block';
            }
        });
    });
});


// Video Show/Hide
function showVideo(id) {
    const video = document.getElementById(`video-${id}`);
    if (video.style.display === 'none') {
        video.style.display = 'block';
    } else {
        video.style.display = 'none';
    }
}

// Filtering Product Trainings
function filterVideos(category) {
    const allVideos = document.querySelectorAll('.training-card');
    allVideos.forEach(video => {
        if (category === 'all') {
            video.style.display = 'block';
        } else {
            if (video.classList.contains(category)) {
                video.style.display = 'block';
            } else {
                video.style.display = 'none';
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        const quizButton = video.closest('.card').querySelector('.take-quiz-btn');

        video.addEventListener('timeupdate', function () {
            const watchedPercent = (video.currentTime / video.duration) * 100;

            if (watchedPercent >= 90 && quizButton) {
                quizButton.style.display = 'inline-block';
            }
        });
    });
});

