import {config} from "./utils.js";

export default class Maze {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.tileSize = config.tileSize;

        this.generateMaze();
        this.createOffscreenCanvas();
    }

    // Створює офлайн-полотно (offscreen canvas) для зберігання статичних частин лабіринту
    createOffscreenCanvas() {
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.cols * this.tileSize;
        this.offscreenCanvas.height = this.rows * this.tileSize;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.drawStaticMaze();
    }

    // Малює статичні частини лабіринту, такі як стіни, на офлайн-полотні
    drawStaticMaze() {
        // Малює стіни на офлайн-полотні
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 1) {
                    this.offscreenCtx.fillStyle = '#0033cc';
                    this.offscreenCtx.fillRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                    // Малює контур стін
                    this.offscreenCtx.strokeStyle = '#000099';
                    this.offscreenCtx.strokeRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }
    }

    // Генерує структуру лабіринту з проходами і стінами
    generateMaze() {
        // Ініціалізує сітку лабіринту стінами та проходами
        for (let y = 0; y < this.rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                if (
                    x === 0 ||
                    x === this.rows - 1 ||
                    y === 0 ||
                    y === this.cols - 1
                ) {
                    this.grid[y][x] = 1; // Граничні клітинки — це стіни
                } else if (x % 2 === 1 && y % 2 === 1) {
                    this.grid[y][x] = 0; // Проходи в непарних індексах
                } else {
                    this.grid[y][x] = 1; // Стіни
                }
            }
        }

        // Створює прості проходи у вигляді сітки
        for (let y = 1; y < this.rows - 1; y += 2) {
            for (let x = 1; x < this.cols - 1; x += 2) {
                // Створює прохід направо
                if (x < this.cols - 2) {
                    this.grid[y][x + 1] = 0;
                }
                // Створює прохід вниз
                if (y < this.rows - 2) {
                    this.grid[y + 1][x] = 0;
                }
            }
        }

        // Додає точки (крапки) у проходи
        for (let y = 1; y < this.rows - 1; y++) {
            for (let x = 1; x < this.cols - 1; x++) {
                if (this.grid[y][x] === 0) {
                    this.grid[y][x] = 2; // Проходи з точками
                }
            }
        }
    }

    // Перевіряє, чи є клітинка стіною
    isWall(x, y) {
        return this.grid[y] && this.grid[y][x] === 1;
    }

    // Збирає точку, якщо Pacman знаходиться на ній
    collectDot(x, y) {
        if (this.grid[y] && this.grid[y][x] === 2) {
            this.grid[y][x] = 0; // Видаляє точку
            return true;
        }
        return false;
    }

    // Перевіряє, чи зібрані всі точки у лабіринті
    isAllDotsCollected() {
        for (let y = 1; y < this.rows - 1; y++) {
            for (let x = 1; x < this.cols - 1; x++) {
                if (this.grid[y][x] === 2) {
                    return false; // Є ще точки для збору
                }
            }
        }
        return true; // Всі точки зібрані
    }

    // Знаходить вільну позицію для Pacman або привида
    findFreePosition() {
        let x, y;
        do {
            x = Math.floor(Math.random() * ((this.cols - 2) / 2)) * 2 + 1;
            y = Math.floor(Math.random() * ((this.rows - 2) / 2)) * 2 + 1;
        } while (this.grid[y][x] !== 2); // Перевіряє, щоб вибрана позиція містила точку
        return { x, y };
    }

    // Малює лабіринт на основному полотні
    draw(ctx, tileSize) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 1) {
                    // Малює стіну
                    ctx.fillStyle = '#0033cc';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                    // Опціональний контур для стіни
                    ctx.strokeStyle = '#000099';
                    ctx.strokeRect(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize
                    );
                } else {
                    // Малює прохід
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                    // Малює точку (якщо є)
                    if (this.grid[y][x] === 2) {
                        ctx.fillStyle = 'white';
                        ctx.beginPath();
                        ctx.arc(
                            x * tileSize + tileSize / 2,
                            y * tileSize + tileSize / 2,
                            tileSize / 8,
                            0,
                            Math.PI * 2
                        );
                        ctx.fill();
                    }
                }
            }
        }
    }
}
