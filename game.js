const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = { x: 180, y: 350, width: 40, height: 40, color: '#f7a8b8' };
const obstacles = [];
let gameOver = false;
let score = 0;
const scoreSound = document.getElementById('scoreSound');
const collisionSound = document.getElementById('collisionSound');

function drawPlayer() {
  ctx.beginPath();
  ctx.roundRect(player.x, player.y, player.width, player.height, 10);
  ctx.fillStyle = player.color;
  ctx.shadowBlur = 10;
  ctx.shadowColor = player.color;
  ctx.fill();
  ctx.closePath();
}

function createObstacle() {
  const x = Math.random() * (canvas.width - 40);
  obstacles.push({ x, y: 0, width: 40, height: 40, color: '#ef4444' });
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.beginPath();
    ctx.roundRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 10);
    ctx.fillStyle = obstacle.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = obstacle.color;
    ctx.fill();
    ctx.closePath();
    obstacle.y += 4;
  });
}

function checkCollision() {
  obstacles.forEach(obstacle => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver = true;
      collisionSound.play();
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function updateScore() {
  score++;
}

function gameLoop() {
  if (gameOver) {
    
    setTimeout(() => {
      window.location.href = 'index.html';  
    }, 1000); 

    return;
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

// Keyboard controls (for desktops)
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

setInterval(createObstacle, 1200);
gameLoop();
