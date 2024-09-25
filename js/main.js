import Game from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const restartButton = document.getElementById('restartButton');

    const game = new Game(canvas, restartButton);
    game.start();
});
