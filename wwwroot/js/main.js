import { Camera } from "./camera.js";
import { drawArena } from "./arena.js";
import { InputHandler } from "./inputHandler.js";
import { Painting } from "./painting.js";

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 2000;
const GRID_SIZE = 50;

let canvas, context;
let camera, input, painting;

function startGame() {
    document.getElementById('start-btn').style.display = 'none';
    enterFullScreen();

    canvas = document.getElementById('grid-canvas');
    context = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    camera = new Camera(window.innerWidth, window.innerHeight);
    input = new InputHandler(canvas);
    painting = new Painting(canvas, camera, CANVAS_WIDTH, CANVAS_HEIGHT);

    window.addEventListener("resize", resizeCamera);
    canvas.addEventListener('mousedown', e => painting.startPainting(e));
    canvas.addEventListener('mousemove', e => painting.paint(e));
    canvas.addEventListener('mouseup', () => painting.stopPainting());
    canvas.addEventListener('mouseleave', () => painting.stopPainting());

    gameLoop();
}

function enterFullScreen() {
    const element = document.documentElement;
    document.getElementById('grid-canvas').style.display = 'block';
    if(element.requestFullscreen)
        element.requestFullscreen();
    else if(element.mozRequestFullScreen)
        element.mozRequestFullScreen();
    else if(element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
    else if(element.msRequestFullscreen)
        element.msRequestFullscreen();
}

function resizeCamera() {
    if (!camera) return;
    camera.width = window.innerWidth;
    camera.height = window.innerHeight;
}

function gameLoop() {
    camera.move(input.mouseX, input.mouseY, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawArena(context, camera, GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT);
    painting.draw(context, camera);

    requestAnimationFrame(gameLoop);
}

window.startGame = startGame;
