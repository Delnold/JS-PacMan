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

    createOffscreenCanvas() {
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.cols * this.tileSize;
        this.offscreenCanvas.height = this.rows * this.tileSize;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.drawStaticMaze();
    }

    drawStaticMaze() {
        // Walls on the off-screen canvas
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
                    // Border for walls
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

    generateMaze() {
        // Initialize grid with walls and passages
        for (let y = 0; y < this.rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                if (
                    x === 0 ||
                    x === this.rows - 1 ||
                    y === 0 ||
                    y === this.cols - 1

                ) {
                    this.grid[y][x] = 1; // Border cells are walls
                } else if (x % 2 === 1 && y % 2 === 1) {
                    this.grid[y][x] = 0; // Passages at odd indices
                } else {
                    this.grid[y][x] = 1; // Walls
                }
            }
        }

        // Connect the passages to form a simple grid
        for (let y = 1; y < this.rows - 1; y += 2) {
            for (let x = 1; x < this.cols - 1; x += 2) {
                // Open a passage to the right
                if (x < this.cols - 2) {
                    this.grid[y][x + 1] = 0;
                }
                // Open a passage downward
                if (y < this.rows - 2) {
                    this.grid[y + 1][x] = 0;
                }
            }
        }

        // Dots
        for (let y = 1; y < this.rows - 1; y++) {
            for (let x = 1; x < this.cols - 1; x++) {
                if (this.grid[y][x] === 0) {
                    this.grid[y][x] = 2; // Passage with a dot
                }
            }
        }
    }

    isWall(x, y) {
        return this.grid[y] && this.grid[y][x] === 1;
    }

    collectDot(x, y) {
        if (this.grid[y] && this.grid[y][x] === 2) {
            this.grid[y][x] = 0; // Remove the dot
            return true;
        }
        return false;
    }

    isAllDotsCollected() {
        for (let y = 1; y < this.rows - 1; y++) {
            for (let x = 1; x < this.cols - 1; x++) {
                if (this.grid[y][x] === 2) {
                    return false;
                }
            }
        }
        return true;
    }

    findFreePosition() {
        let x, y;
        do {
            x = Math.floor(Math.random() * ((this.cols - 2) / 2)) * 2 + 1;
            y = Math.floor(Math.random() * ((this.rows - 2) / 2)) * 2 + 1;
        } while (this.grid[y][x] !== 2);
        return { x, y };
    }

    draw(ctx, tileSize) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 1) {
                    // Draw wall
                    ctx.fillStyle = '#0033cc';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                    // Optional border
                    ctx.strokeStyle = '#000099';
                    ctx.strokeRect(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize
                    );
                } else {
                    // Draw passage
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                    // Draw dots
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
