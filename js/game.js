import Pacman from './pacman.js';
import Ghost from './ghost.js';
import Maze from './maze.js';
import {config, getRandomOddTileSize} from './utils.js';

export default class Game {
    constructor(canvas, restartButton) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.restartButton = restartButton;
        this.tileSize = config.tileSize;
        this.updateDimensions();

        this.level = 0;
        this.score = 0;
        this.gameOver = false;

        this.highScores = JSON.parse(localStorage.getItem('highScores')) || [];

        this.lastTime = 0;
        this.keys = {};

        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
    }

    // Оновлює розміри гри відповідно до розмірів полотна
    updateDimensions() {
        this.numRows = Math.floor(this.canvas.height / this.tileSize);
        if (this.numRows % 2 === 0) this.numRows += 1;
        this.numCols = Math.floor(this.canvas.width / this.tileSize);
        if (this.numCols % 2 === 0) this.numCols += 1;
    }

    // Починає гру: ініціалізує гру, додає слухачі подій та запускає ігровий цикл
    start() {
        this.initializeGame();
        this.addEventListeners();
        this.gameLoop(performance.now());
    }

    // Ініціалізує нову гру, налаштовує об'єкти лабіринту, Pacman та привидів
    initializeGame() {
        this.updateDimensions();
        this.maze = new Maze(this.numRows, this.numCols, this.tileSize);
        this.score = 0;
        this.gameOver = false;

        this.pacman = new Pacman(this.maze.findFreePosition(), this.tileSize);

        this.ghosts = [
            new Ghost(this.maze.findFreePosition(), 'red', 'chase', this.tileSize),
            new Ghost(this.maze.findFreePosition(), 'pink', 'ambush', this.tileSize),
            new Ghost(this.maze.findFreePosition(), 'orange', 'random', this.tileSize)
        ];

        this.restartButton.style.display = 'none';
        this.lastTime = performance.now();
    }

    // Додає слухачі подій для клавіш і кнопки перезапуску
    addEventListeners() {
        if (!this.listenersAdded) {
            document.addEventListener('keydown', this.handleKeydown);
            this.restartButton.addEventListener('click', this.handleRestart);
            this.listenersAdded = true;
        }
    }

    // Видаляє слухачі подій для клавіш і кнопки перезапуску
    removeEventListeners() {
        document.removeEventListener('keydown', this.handleKeydown);
        this.restartButton.removeEventListener('click', this.handleRestart);
        this.listenersAdded = false;
    }

    // Обробляє події натискання клавіш для керування напрямком Pacman
    handleKeydown(e) {
        this.keys[e.key] = true;
        this.pacman.changeDirection(e.key);
    }

    // Обробляє перезапуск гри, зберігає прогрес та запускає новий рівень
    handleRestart() {
        if (this.maze.isAllDotsCollected()) {
            this.level += 1;
            this.tileSize = getRandomOddTileSize(this.level)
        }
        this.removeEventListeners();
        this.start();
    }

    // Основний ігровий цикл: оновлює стан гри та малює її на екрані
    gameLoop(currentTime) {
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        deltaTime = Math.min(deltaTime, 100);

        this.update(deltaTime);
        this.draw();

        if (!this.gameOver) {
            requestAnimationFrame(this.gameLoop);
        } else {
            this.updateHighScores();
            this.drawGameOver();
            this.restartButton.style.display = 'block';
        }
    }

    // Оновлює стан всіх об'єктів у грі, зокрема Pacman та привидів
    update(deltaTime) {
        this.pacman.update(this.maze, deltaTime);

        this.ghosts.forEach(ghost => {
            ghost.update(this.maze, this.pacman, deltaTime);
        });

        this.checkCollisions();
        this.updateScore();

        if (this.maze.isAllDotsCollected()) {
            this.gameOver = true;
        }
    }

    // Перевіряє наявність зіткнень між Pacman і привидами
    checkCollisions() {
        this.ghosts.forEach(ghost => {
            if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
                this.gameOver = true;
            }
        });
    }

    // Оновлює рахунок гравця, якщо Pacman з'їдає крапку
    updateScore() {
        if (this.maze.collectDot(this.pacman.x, this.pacman.y)) {
            this.score += 10;
        }
    }

    // Малює всі об'єкти гри на полотні
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.maze.draw(this.ctx, this.tileSize);
        this.pacman.draw(this.ctx);
        this.ghosts.forEach(ghost => {
            ghost.draw(this.ctx);
        });
        this.drawScore();
    }

    // Малює рахунок гравця на екрані
    drawScore() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Score: ' + this.score, 10, this.canvas.height - 10);
    }

    // Малює екран "Кінець гри" або "Ви перемогли" та показує високі результати
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'red';
        this.ctx.font = '50px Arial';
        if (this.maze.isAllDotsCollected()) {
            this.ctx.fillText('You Win!', this.canvas.width / 2 - 100, this.canvas.height / 2 - 60);
        } else {
            this.ctx.fillText('Game Over', this.canvas.width / 2 - 130, this.canvas.height / 2 - 60);
        }

        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('Score: ' + this.score, this.canvas.width / 2 - 50, this.canvas.height / 2 - 20);

        this.ctx.font = '24px Arial';
        this.ctx.fillText('High Scores:', this.canvas.width / 2 - 70, this.canvas.height / 2 + 20);

        this.highScores.slice(0, 5).forEach((highScore, index) => {
            this.ctx.fillText(
                `${index + 1}. ${highScore}`,
                this.canvas.width / 2 - 50,
                this.canvas.height / 2 + 50 + index * 30
            );
        });
    }

    // Оновлює високі результати і зберігає їх у локальне сховище
    updateHighScores() {
        this.highScores.push(this.score);
        this.highScores.sort((a, b) => b - a);
        this.highScores = this.highScores.slice(0, 5);
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
    }
}
