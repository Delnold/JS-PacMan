export function depthSearch(maze, startX, startY, endX, endY) {
    let openSet = [];
    let closedSet = [];
    let startNode = {
        x: startX,
        y: startY,
        g: 0,
        h: heuristic(startX, startY, endX, endY),
        f: 0,
        parent: null
    };
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);

    // Головний цикл пошуку шляху
    while (openSet.length > 0) {
        // Знаходить вузол з найменшим значенням f
        let current = openSet.reduce((prev, curr) =>
            prev.f < curr.f ? prev : curr
        );

        // Якщо досягнута кінцева точка, будує та повертає шлях
        if (current.x === endX && current.y === endY) {
            let path = [];
            let temp = current;
            while (temp) {
                path.push([temp.x, temp.y]);
                temp = temp.parent;
            }
            return path.reverse();
        }

        // Видаляє поточний вузол з відкритого списку і додає його до закритого
        openSet = openSet.filter(node => node !== current);
        closedSet.push(current);

        // Отримує всіх сусідів поточного вузла
        let neighbors = getNeighbors(maze, current.x, current.y);
        neighbors.forEach(neighbor => {
            if (closedSet.some(n => n.x === neighbor.x && n.y === neighbor.y))
                return;

            // Обчислює оцінку g для сусіда
            let tentativeG = current.g;
            let existingNode = openSet.find(
                n => n.x === neighbor.x && n.y === neighbor.y
            );

            // Якщо сусіда немає у відкритому списку або він має менше значення g
            if (!existingNode || tentativeG < existingNode.g) {
                let h = heuristic(neighbor.x, neighbor.y, endX, endY);
                let f = tentativeG + h;
                if (!existingNode) {
                    // Додає сусіда до відкритого списку
                    openSet.push({
                        x: neighbor.x,
                        y: neighbor.y,
                        g: tentativeG,
                        h: h,
                        f: f,
                        parent: current
                    });
                } else {
                    // Оновлює дані існуючого вузла
                    existingNode.g = tentativeG;
                    existingNode.h = h;
                    existingNode.f = f;
                    existingNode.parent = current;
                }
            }
        });
    }

    // Повертає порожній шлях, якщо кінцева точка недосяжна
    return [];
}

// Евристична функція Манхеттенської відстані для оцінки відстані до цілі
function heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Отримує всіх сусідів для заданої позиції, перевіряючи наявність стін
function getNeighbors(maze, x, y) {
    const neighbors = [];
    const directions = [
        [0, -1],  // Верх
        [1, 0],   // Право
        [0, 1],   // Низ
        [-1, 0]   // Ліво
    ];
    for (let dir of directions) {
        const nx = x + dir[0];
        const ny = y + dir[1];
        if (!maze.isWall(nx, ny)) {
            neighbors.push({x: nx, y: ny});
        }
    }
    return neighbors;
}

// Визначає випадковий розмір клітинки, щоб він був непарним
export function getRandomOddTileSize(level, canvasSize) {
    let tileSize = 120 - level * 10; // Зменшує розмір клітинки з підвищенням рівня
    while (Math.abs(canvasSize / tileSize) % 2 === 0) {
        tileSize += 1; // Робить розмір клітинки непарним
    }

    return tileSize;
}

// Конфігурація з початковим розміром клітинки
export const config = {
    tileSize: 40
}
