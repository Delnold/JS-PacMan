const canvasSize = 600;

export function astar(maze, startX, startY, endX, endY) {
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

    while (openSet.length > 0) {
        let current = openSet.reduce((prev, curr) =>
            prev.f < curr.f ? prev : curr
        );

        if (current.x === endX && current.y === endY) {
            let path = [];
            let temp = current;
            while (temp) {
                path.push([temp.x, temp.y]);
                temp = temp.parent;
            }
            return path.reverse();
        }

        openSet = openSet.filter(node => node !== current);
        closedSet.push(current);

        let neighbors = getNeighbors(maze, current.x, current.y);
        neighbors.forEach(neighbor => {
            if (closedSet.some(n => n.x === neighbor.x && n.y === neighbor.y))
                return;

            let tentativeG = current.g + 1;
            let existingNode = openSet.find(
                n => n.x === neighbor.x && n.y === neighbor.y
            );

            if (!existingNode || tentativeG < existingNode.g) {
                let h = heuristic(neighbor.x, neighbor.y, endX, endY);
                let f = tentativeG + h;
                if (!existingNode) {
                    openSet.push({
                        x: neighbor.x,
                        y: neighbor.y,
                        g: tentativeG,
                        h: h,
                        f: f,
                        parent: current
                    });
                } else {
                    existingNode.g = tentativeG;
                    existingNode.h = h;
                    existingNode.f = f;
                    existingNode.parent = current;
                }
            }
        });
    }
    return [];
}

function heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function getNeighbors(maze, x, y) {
    const neighbors = [];
    const directions = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0]
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

export function getRandomOddTileSize(level, canvasSize) {
    let randomNumber = Math.random() * 10;
    let tileSize = (level + randomNumber) * 10;
    while (Math.floor(canvasSize / tileSize) % 2 === 0) {
        // Keep increasing tileSize by 1 until the quotient is odd
        tileSize += 1;
    }

    return tileSize;
}

export const config = {
    tileSize: 40
};