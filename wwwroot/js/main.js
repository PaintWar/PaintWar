import { Game } from './Game.js';

let game;

export default function startGame() {

    document.getElementById('menu-container').style.display = 'none';
    
    const gameItems = document.getElementsByClassName('game');
    for (const item of gameItems) {
        item.style.display = '';
    }
    enterFullScreen();
    
    game = new Game();
    game.initialize();

    game.run();
}

function enterFullScreen() {
    const element = document.documentElement;
    const gridCanvas = document.getElementById("grid-canvas");
    gridCanvas.style.display = 'block';
    
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();

    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            gridCanvas.requestPointerLock();
        }
    }, { once: true });
}

window.addEventListener("resize", () => {
    if (game) {
        game.resize();
    }
});

window.startGame = startGame;