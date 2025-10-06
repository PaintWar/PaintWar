import { Game } from './Game.js';
import { GameNetwork } from './GameNetwork.js';

let game;

export default function startGame(id, player) {
    // Hide lobby
    var lobbyContainer = document.getElementById('lobby-container');
    lobbyContainer.style.display = 'none';

    // Un-hide game
    var gameContainer = document.getElementById('game-container');
    gameContainer.style.display = '';

    enterFullScreen();

    game = new Game();

    var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub?game=" + id).withAutomaticReconnect().build();
    connection.start().then(async () => {
        game.setNetwork(new GameNetwork(connection, id, game, player));
    }).catch((err) => {
        return console.error(err.toString());
    });
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