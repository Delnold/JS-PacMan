import { depthSearch } from './utils.js';

export default class Ghost {
    constructor(position, color, strategy, tileSize) {
        this.x = position.x;
        this.y = position.y;
        this.color = color;
        this.strategy = strategy;
        this.tileSize = tileSize;
        this.lastMoveTime = 0;
    }

    // Оновлює позицію привида відповідно до обраної стратегії
    update(maze, pacman, deltaTime) {
        this.lastMoveTime += deltaTime;

        if (this.lastMoveTime >= 250) { // Виконує рух кожні 250 мілісекунд
            this.lastMoveTime = 0;
            let path = [];

            if (this.strategy === 'chase') {
                // Стратегія "переслідування" – привид рухається прямо до позиції Pacman
                path = depthSearch(maze, this.x, this.y, pacman.x, pacman.y);
            } else if (this.strategy === 'ambush') {
                // Стратегія "засідка" – привид намагається випередити Pacman на кілька кроків вперед
                let targetX = pacman.x;
                let targetY = pacman.y;
                if (pacman.direction === 'left') targetX -= 4;
                else if (pacman.direction === 'up') targetY -= 4;
                else if (pacman.direction === 'right') targetX += 4;
                else if (pacman.direction === 'down') targetY += 4;

                // Враховує кордони лабіринту, щоб привид не виходив за межі
                targetX = Math.max(0, Math.min(maze.cols - 1, targetX));
                targetY = Math.max(0, Math.min(maze.rows - 1, targetY));

                path = depthSearch(maze, this.x, this.y, targetX, targetY);
            } else if (this.strategy === 'random') {
                // Стратегія "випадковість" – рух у випадковому напрямку
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
                return; // Повертаємося, оскільки випадковий рух вже виконано
            }

            // Виконує рух привида, якщо знайдено шлях
            if (path.length > 1) {
                this.x = path[1][0];
                this.y = path[1][1];
            }
        }
    }

    // Малює привида на полотні
    draw(ctx) {
        let centerX = this.x * this.tileSize + this.tileSize / 2;
        let centerY = this.y * this.tileSize + this.tileSize / 2;
        let radius = this.tileSize / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();

        // Голова привида
        ctx.arc(centerX, centerY, radius, Math.PI, 0, false);

        // Тіло привида
        let baseY = centerY + radius;
        ctx.lineTo(centerX + radius, baseY);

        // Ноги привида (хвилястий низ)
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

        // Очі привида
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
