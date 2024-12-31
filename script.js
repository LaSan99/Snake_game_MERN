const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameContainer = document.getElementById("gameContainer");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreDisplay = document.getElementById("finalScore");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const pauseButton = document.getElementById("pauseButton");

const gridSize = 20;
let snake = [];
let food = {};
let direction = "right";
let gameSpeed = 150;
let gameInterval;
let score = 0;
let isGameRunning = false;
let isPaused = false;

function initGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  direction = "right";
  score = 0;
  scoreDisplay.textContent = "Score: 0";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

function drawSnake() {
  ctx.fillStyle = "#00ff00";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

function drawFood() {
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y -= 1;
      break;
    case "down":
      head.y += 1;
      break;
    case "left":
      head.x -= 1;
      break;
    case "right":
      head.x += 1;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= canvas.width / gridSize ||
    head.y < 0 ||
    head.y >= canvas.height / gridSize
  ) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function gameLoop() {
  if (isPaused) return;
  if (checkCollision()) {
    clearInterval(gameInterval);
    isGameRunning = false;
    gameOverScreen.style.display = "block";
    gameContainer.style.display = "none";
    finalScoreDisplay.textContent = score;
    return;
  }
  update();
  draw();
}

document.addEventListener("keydown", (e) => {
  if (!isGameRunning) return;
  switch (e.key) {
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
  }
});

function startGame() {
  initGame();
  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  gameContainer.style.display = "flex";
  isGameRunning = true;
  isPaused = false;
  pauseButton.textContent = "Pause";
  gameInterval = setInterval(gameLoop, gameSpeed);
}

function togglePause() {
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "Resume" : "Pause";
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
