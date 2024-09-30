export default class Pacman {
    constructor(position, tileSize) {
        this.x = position.x;
        this.y = position.y;
        this.tileSize = tileSize;
        this.direction = 'right';
        this.lastMoveTime = 0;
    }

    // Змінює напрямок руху Pacman відповідно до натиснутої клавіші
    changeDirection(key) {
        switch (key) {
            case 'ArrowLeft':
                this.direction = 'left';
                break;
            case 'ArrowUp':
                this.direction = 'up';
                break;
            case 'ArrowRight':
                this.direction = 'right';
                break;
            case 'ArrowDown':
                this.direction = 'down';
                break;
            default:
                break;
        }
    }

    // Оновлює позицію Pacman залежно від напрямку руху та перевірки стін лабіринту
    update(maze, deltaTime) {
        this.lastMoveTime += deltaTime;
        let moveInterval = 150; // Інтервал руху Pacman (150 мілісекунд)

        if (this.lastMoveTime >= moveInterval) {
            this.lastMoveTime -= moveInterval;

            let nextX = this.x;
            let nextY = this.y;

            // Визначає наступну позицію залежно від поточного напрямку
            if (this.direction === 'left') nextX--;
            else if (this.direction === 'up') nextY--;
            else if (this.direction === 'right') nextX++;
            else if (this.direction === 'down') nextY++;

            // Перевіряє, чи є наступна позиція стіною; якщо ні, то змінює позицію
            if (!maze.isWall(nextX, nextY)) {
                this.x = nextX;
                this.y = nextY;
            }
        }
    }

    // Малює Pacman на полотні відповідно до поточної позиції та напрямку
    draw(ctx) {
        let centerX = this.x * this.tileSize + this.tileSize / 2;
        let centerY = this.y * this.tileSize + this.tileSize / 2;
        let radius = this.tileSize / 2;

        ctx.fillStyle = 'yellow';
        ctx.beginPath();

        let startAngle, endAngle;

        // Визначає кут відкритого рота Pacman залежно від його напрямку
        if (this.direction === 'right') {
            startAngle = 0.25 * Math.PI;
            endAngle = 1.75 * Math.PI;
        } else if (this.direction === 'left') {
            startAngle = 1.25 * Math.PI;
            endAngle = 0.75 * Math.PI;
        } else if (this.direction === 'up') {
            startAngle = 1.75 * Math.PI;
            endAngle = 1.25 * Math.PI;
        } else if (this.direction === 'down') {
            startAngle = 0.75 * Math.PI;
            endAngle = 0.25 * Math.PI;
        } else {
            // Випадок, коли напрямок не визначений (має бути повний круг)
            startAngle = 0;
            endAngle = 2 * Math.PI;
        }

        // Малює Pacman з відкритим ротом у визначеному напрямку
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fill();
    }
}
