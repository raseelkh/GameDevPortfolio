// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        loadingProgress.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 20);
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    themeToggle.textContent = document.body.dataset.theme === 'light' ? '🌙' : '☀️';
});

// Skill Bars Animation
const skillFills = document.querySelectorAll('.skill-fill');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.dataset.width;
            entry.target.style.width = `${width}%`;
        }
    });
}, observerOptions);

skillFills.forEach(fill => observer.observe(fill));

// Achievement System
const achievements = [
    'Portfolio Viewed! +50XP',
    'Skill Section Reached! +100XP',
    'Project Explored! +75XP'
];

function showAchievement(text) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.textContent = text;
    document.querySelector('.achievements').appendChild(achievement);
    
    setTimeout(() => {
        achievement.classList.add('show');
    }, 100);

    setTimeout(() => {
        achievement.classList.remove('show');
        setTimeout(() => {
            achievement.remove();
        }, 300);
    }, 3000);
}

// Trigger achievements on scroll
let achievementIndex = 0;
window.addEventListener('scroll', () => {
    if (achievementIndex < achievements.length && Math.random() < 0.1) {
        showAchievement(achievements[achievementIndex]);
        achievementIndex++;
    }
});

// Pixel Animation
const pixelAnimation = document.querySelector('.pixel-animation');
function createPixel() {
    const pixel = document.createElement('div');
    pixel.style.position = 'absolute';
    pixel.style.width = '4px';
    pixel.style.height = '4px';
    pixel.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    pixel.style.left = `${Math.random() * 100}%`;
    pixel.style.top = '-4px';
    pixel.style.opacity = '0.8';
    pixelAnimation.appendChild(pixel);

    const animation = pixel.animate([
        { transform: 'translateY(0)', opacity: 0.8 },
        { transform: `translateY(${window.innerHeight}px)`, opacity: 0 }
    ], {
        duration: 2000 + Math.random() * 3000,
        easing: 'linear'
    });

    animation.onfinish = () => {
        pixel.remove();
    };
}

setInterval(createPixel, 100);

// Project Cards Interaction
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.transform = `
            scale(1.05)
            rotateX(${(y - rect.height / 2) / 20}deg)
            rotateY(${(x - rect.width / 2) / 20}deg)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) rotateX(0) rotateY(0)';
    });
});



// Function to show video popup
function showVideoPopup(videoSrc) {
    const popup = document.getElementById('videoPopup');
    const youtubeVideo = document.getElementById('youtubeVideo');
    const projectVideo = document.getElementById('projectVideo');
    const videoSource = document.getElementById('videoSource');

    // Clear previous sources
    youtubeVideo.src = "";
    projectVideo.style.display = "none";
    youtubeVideo.style.display = "none";

    // Check if the video source is a YouTube link
    if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
        // Extract the video ID from the URL
        const videoId = videoSrc.split('v=')[1]?.split('&')[0] || videoSrc.split('/').pop();
        youtubeVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // Set source for YouTube
        youtubeVideo.style.display = "block"; // Show the YouTube iframe
    } else {
        // Handle regular video URL (e.g., Google Drive)
        const fileId = videoSrc.split('/d/')[1]?.split('/')[0];
        const driveEmbedLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        videoSource.src = driveEmbedLink; // Set source for Google Drive video
        projectVideo.style.display = "block"; // Show the video element
        projectVideo.load(); // Load the new video
    }

    popup.style.display = 'block';
    // Force reflow
    void popup.offsetWidth;
    popup.classList.add('active');

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        const videoSrc = card.dataset.video; // Get video source from data attribute
        const redirectUrl = card.dataset.redirect; // Get redirect URL from data attribute

        // Check if video source exists
        if (videoSrc) {
            showVideoPopup(videoSrc); // Open the popup with the video
        } else if (redirectUrl) {
            window.location.href = redirectUrl; // Redirect to the specified URL
        }
    });
});


function closeVideoPopup() {
    const popup = document.getElementById('videoPopup');
    const youtubeVideo = document.getElementById('youtubeVideo');
    const projectVideo = document.getElementById('projectVideo');

    popup.classList.remove('active');
    setTimeout(() => {
        popup.style.display = 'none';
        youtubeVideo.src = ""; 
        projectVideo.pause(); 
        projectVideo.currentTime = 0; 
    }, 300);
    document.body.style.overflow = 'auto';
}

// Setup event listeners for closing the video popup
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('videoPopup');
    const closeBtn = document.querySelector('.close-popup');

    // Close button click
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeVideoPopup();
    });
    
    // Click outside to close 
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closeVideoPopup();
        }
    });
// Timeline Animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.5 });

timelineItems.forEach(item => timelineObserver.observe(item));
const timelineImages = document.querySelectorAll('.timeline-image');

timelineImages.forEach(image => {
    image.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.05)';
    });
    image.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
    });
});
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoPopup();
        }
    });
});