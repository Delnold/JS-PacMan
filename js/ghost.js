import { astar } from './utils.js';

export default class Ghost {
    constructor(position, color, strategy, tileSize) {
        this.x = position.x;
        this.y = position.y;
        this.color = color;
        this.strategy = strategy;
        this.tileSize = tileSize;
        this.lastMoveTime = 0;
    }

    update(maze, pacman, deltaTime) {
        this.lastMoveTime += deltaTime;

        if (this.lastMoveTime >= 250) {
            this.lastMoveTime = 0;
            let path = [];

            if (this.strategy === 'chase') {
                path = astar(maze, this.x, this.y, pacman.x, pacman.y);
            } else if (this.strategy === 'ambush') {
                let targetX = pacman.x;
                let targetY = pacman.y;
                if (pacman.direction === 'left') targetX -= 4;
                else if (pacman.direction === 'up') targetY -= 4;
                else if (pacman.direction === 'right') targetX += 4;
                else if (pacman.direction === 'down') targetY += 4;

                targetX = Math.max(0, Math.min(maze.cols - 1, targetX));
                targetY = Math.max(0, Math.min(maze.rows - 1, targetY));

                path = astar(maze, this.x, this.y, targetX, targetY);
            } else if (this.strategy === 'random') {
                let directions = ['left', 'up', 'right', 'down'];
                let dir = directions[Math.floor(Math.random() * directions.length)];
                let nextX = this.x;
                let nextY = this.y;
                if (dir === 'left') nextX--;
                else if (dir === 'up') nextY--;
                else if (dir === 'right') nextX++;
                else if (dir === 'down') nextY++;
                if (!maze.isWall(nextX, nextY)) {
                    this.x = nextX;
                    this.y = nextY;
                }
                return;
            }

            if (path.length > 1) {
                this.x = path[1][0];
                this.y = path[1][1];
            }
        }
    }

    draw(ctx) {
        let centerX = this.x * this.tileSize + this.tileSize / 2;
        let centerY = this.y * this.tileSize + this.tileSize / 2;
        let radius = this.tileSize / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();

        // Ghost head
        ctx.arc(centerX, centerY, radius, Math.PI, 0, false);

        // Ghost body
        let baseY = centerY + radius;
        ctx.lineTo(centerX + radius, baseY);

        let footCount = 3;
        let footWidth = (radius * 2) / (footCount * 2);
        for (let i = 0; i < footCount * 2; i++) {
            let x = centerX + radius - footWidth * i;
            let y = baseY + (i % 2 === 0 ? 0 : footWidth / 2);
            ctx.lineTo(x, y);
        }

        ctx.lineTo(centerX - radius, baseY);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 5, 0, 2 * Math.PI);
        ctx.arc(centerX + radius / 3, centerY - radius / 3, radius / 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 10, 0, 2 * Math.PI);
        ctx.arc(centerX + radius / 3, centerY - radius / 3, radius / 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}
