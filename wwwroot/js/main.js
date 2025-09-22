import { Game } from './Game.js';
import { GameNetwork } from './GameNetwork.js';

let game;

export default function startGame(connection, matchId) {
    var menuContainer = document.getElementById('menu-container');
    menuContainer.style.display = 'none';

    var gameContainer = document.getElementById('game-container');
    gameContainer.style.display = '';

    enterFullScreen();

    game = new Game();
    //game.initialize();
    game.setNetwork(new GameNetwork(connection, matchId, game));
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
    document.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        if (document.pointerLockElement !== gridCanvas) {
            gridCanvas.requestPointerLock();
        }
    });
}

window.addEventListener("resize", () => {
    if (game) {
        game.resize();
    }
});

window.startGame = startGame;