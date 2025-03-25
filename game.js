const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = { x: 180, y: 350, width: 40, height: 40, color: '#f7a8b8' };
let isShieldActive = false;
let shieldEndTime = 0;

const obstacles = [];
let obstacleSpeed = 4;
let spawnInterval = 1200;

let gameOver = false;
let score = 0;
const scoreSound = document.getElementById('scoreSound');
const collisionSound = document.getElementById('collisionSound');
const powerUpSound = document.getElementById('powerUpSound');
const playerName = prompt('Enter your name:') || 'Player';

const POWER_UP_TYPES = {
  SHIELD: { color: '#00ff00', duration: 5000 },
  SLOW_MOTION: { color: '#ffff00', duration: 3000 },
};

function drawPlayer() {
  ctx.beginPath();
  ctx.roundRect(player.x, player.y, player.width, player.height, 10);
  ctx.fillStyle = player.color;
  ctx.shadowBlur = 10;
  ctx.shadowColor = player.color;
  ctx.fill();
  ctx.closePath();

  if (isShieldActive) {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }
}

function createObstacle() {
  const x = Math.random() * (canvas.width - 40);
  const isPowerUp = Math.random() < 0.2;

  if (isPowerUp) {
    const powerUpType = Math.random() < 0.5 ? 'SHIELD' : 'SLOW_MOTION';
    obstacles.push({
      x,
      y: 0,
      width: 40,
      height: 40,
      color: POWER_UP_TYPES[powerUpType].color,
      type: powerUpType,
    });
  } else {
    obstacles.push({ x, y: 0, width: 40, height: 40, color: '#ef4444', type: 'obstacle' });
  }
}

function drawObstacles() {
  obstacles.forEach((obstacle, index) => {
    ctx.beginPath();
    ctx.roundRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 10);
    ctx.fillStyle = obstacle.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = obstacle.color;
    ctx.fill();
    ctx.closePath();

    obstacle.y += obstacleSpeed;

    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
    }
  });
}

function checkCollision() {
  obstacles.forEach((obstacle, index) => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      if (obstacle.type === 'obstacle' && !isShieldActive) {
        gameOver = true;
        collisionSound.play();
      } else if (obstacle.type === 'SHIELD') {
        activatePowerUp('SHIELD');
        obstacles.splice(index, 1);
        powerUpSound.play();
      } else if (obstacle.type === 'SLOW_MOTION') {
        activatePowerUp('SLOW_MOTION');
        obstacles.splice(index, 1);
        powerUpSound.play();
      }
    }
  });
}

function activatePowerUp(type) {
  if (type === 'SHIELD') {
    isShieldActive = true;
    shieldEndTime = Date.now() + POWER_UP_TYPES.SHIELD.duration;
  } else if (type === 'SLOW_MOTION') {
    obstacleSpeed /= 2;
    setTimeout(() => {
      obstacleSpeed *= 2;
    }, POWER_UP_TYPES.SLOW_MOTION.duration);
  }
}

function updateScore() {
  score++;
  if (score % 100 === 0) {
    obstacleSpeed += 0.5;
    spawnInterval = Math.max(500, spawnInterval - 100);
  }
  if (score === 2000) {
    showSecretMessage();
  }
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function showSecretMessage() {
  const message = document.createElement('div');
  message.textContent = '🎉 Rarely do players unlock this score! 🎉';
  message.style.position = 'absolute';
  message.style.top = '50%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.backgroundColor = 'rgba(248, 247, 247, 0.8)';
  message.style.color = '#f7a8b8';
  message.style.padding = '10px 20px';
  message.style.borderRadius = '10px';
  message.style.fontFamily = 'Press Start 2P';
  message.style.fontSize = '14px';
  message.style.zIndex = '1000';
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

function gameLoop() {
  if (gameOver) {
    showGameOverScreen();
    return;
  }

  if (isShieldActive && Date.now() > shieldEndTime) {
    isShieldActive = false;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scoreSound.play();
  drawPlayer();
  drawObstacles();
  checkCollision();
  drawScore();
  updateScore();
  requestAnimationFrame(gameLoop);
}

function showGameOverScreen() {
  const gameOverScreen = document.createElement('div');
  gameOverScreen.innerHTML = `
    <h1>Game Over</h1>
    <p>Your Score: ${score}</p>
    <button id="playAgainBtn">Play Again</button>
    <button id="homeBtn">Return to My site</button>
  `;
  gameOverScreen.style.position = 'absolute';
  gameOverScreen.style.top = '50%';
  gameOverScreen.style.left = '50%';
  gameOverScreen.style.transform = 'translate(-50%, -50%)';
  gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  gameOverScreen.style.color = 'white';
  gameOverScreen.style.padding = '20px';
  gameOverScreen.style.borderRadius = '10px';
  gameOverScreen.style.textAlign = 'center';
  gameOverScreen.style.zIndex = '1000';
  document.body.appendChild(gameOverScreen);

  document.getElementById('playAgainBtn').addEventListener('click', () => {
    gameOverScreen.remove();
    location.reload();
  });

  document.getElementById('homeBtn').addEventListener('click', () => {
    gameOverScreen.remove();
    window.location.href = 'index.html';
  });

  updateLeaderboard(score);
}

async function updateLeaderboard(score) {
  try {
    const response = await fetch('https://leaderboard-api-1326ad866d0e.herokuapp.com/api/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: playerName, score: score }),
    });
    if (!response.ok) {
      console.error('Failed to update leaderboard');
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

async function showLeaderboard() {
  try {
    const response = await fetch('https://leaderboard-api-1326ad866d0e.herokuapp.com/api/leaderboard');
    if (!response.ok) {
      console.error('Failed to fetch leaderboard');
      return;
    }
    const leaderboard = await response.json();
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';

    leaderboard.forEach((entry) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${entry.name}: ${entry.score}`;
      leaderboardList.appendChild(listItem);
    });

    document.getElementById('leaderboard').style.display = 'block';
  } catch (error) {
    console.error('Network error:', error);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' && player.x > 0) player.x -= 10;
  if (e.code === 'ArrowRight' && player.x < canvas.width - player.width) player.x += 10;
});

document.getElementById('leftBtn').addEventListener('click', () => {
  if (player.x > 0) player.x -= 10;
});

document.getElementById('rightBtn').addEventListener('click', () => {
  if (player.x < canvas.width - player.width) player.x += 10;
});

function adjustDifficulty() {
  if (score < 50) {
    obstacleSpeed = 2;
    spawnInterval = 1500;
  } else if (score < 100) {
    obstacleSpeed = 4;
    spawnInterval = 1200;
  } else {
    obstacleSpeed = 6;
    spawnInterval = 800;
  }
}

showLeaderboard();
setInterval(createObstacle, spawnInterval);
gameLoop();