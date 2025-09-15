import { Camera } from "./camera.js";
import { drawArena } from "./arena.js";
import { InputHandler } from "./inputHandler.js";

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 2000;
const GRID_SIZE = 50;

let canvas, context;
let camera, input;

function startGame() {
    document.getElementById('start-btn').style.display = 'none';
    enterFullScreen();

    canvas = document.getElementById('grid-canvas');
    context = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    camera = new Camera(window.innerWidth, window.innerHeight);
    input = new InputHandler();
    window.addEventListener("resize", resizeCamera);

    gameLoop();
}

// Sets full screen depending on the browser
function enterFullScreen() {
    const element = document.documentElement;
    document.getElementById('grid-canvas').style.display = 'block';
    if(element.requestFullscreen)
        element.requestFullscreen();
    else if(element.mozRequestFullScreen)
        element.mozRequestFullScreen();
    else if(element.webkitRequestFullscreen)
        element.webkitRequestfullscreen();
    else if(element.msRequestFullscreen)
        element.msRequestFullscreen();
}

// Function ran when window is resized
function resizeCamera() {
    if (!camera) 
        return;

    camera.width = window.innerWidth;
    camera.height = window.innerHeight;
}

function gameLoop() {
    camera.move(input.mouseX, input.mouseY, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawArena(context, camera, GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT);

    requestAnimationFrame(gameLoop);
}

window.startGame = startGame;
