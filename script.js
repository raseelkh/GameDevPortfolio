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

// Smooth Scroll to Projects
document.querySelector('.cta-button').addEventListener('click', function(e) {
    e.preventDefault();
    const projectsSection = document.getElementById('projects');
    
    projectsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    // Add click animation
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Video Popup
function showVideoPopup() {
    const popup = document.getElementById('videoPopup');
    const video = document.getElementById('projectVideo');
    
    popup.style.display = 'block';
    // Force reflow
    void popup.offsetWidth;
    popup.classList.add('active');
    video.play();
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

// Setup event listeners for video popup
// Video Popup
function showVideoPopup() {
    const popup = document.getElementById('videoPopup');
    const video = document.getElementById('projectVideo');
    
    popup.style.display = 'block';
    // Force reflow
    void popup.offsetWidth;
    popup.classList.add('active');
    video.play();
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

// Setup event listeners for video popup
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('videoPopup');
    const closeBtn = document.querySelector('.close-popup');
    const video = document.getElementById('projectVideo');
    
    function closeVideoPopup() {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
            video.pause();
            video.currentTime = 0;
        }, 300);
        document.body.style.overflow = 'auto';
    }

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
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoPopup();
        }
    });
});