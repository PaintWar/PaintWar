import { Camera } from "./camera.js";
import { drawArena } from "./arena.js";
import { InputHandler } from "./inputHandler.js";

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 2000;
const GRID_SIZE = 50;

let canvas, context;
let app;
let camera, input;

export default function startGame() {
    var menuItems = document.getElementsByClassName('menu');
    for (const item of menuItems) {
        item.style.display = 'none';
    }

    var gameItems = document.getElementsByClassName('game');
    for (const item of gameItems) {
        item.style.display = '';
    }

    enterFullScreen();
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xffffff
    });
    document.getElementById('canvas-container').appendChild(app.view);
    const world = new PIXI.Container();
    app.stage.addChild(world);
    app.world = world;
    const overlayCanvas = document.getElementById("grid-canvas");
    overlayCanvas.width = CANVAS_WIDTH;
    overlayCanvas.height = CANVAS_HEIGHT;
    overlayCanvas.style.position = "absolute";
    overlayCanvas.style.top = "0";
    overlayCanvas.style.left = "0";
    overlayCanvas.style.opacity = "0";

    camera = new Camera(window.innerWidth, window.innerHeight);
    input = new InputHandler(overlayCanvas);
    window.addEventListener("resize", resizeCamera);
    drawArena(app.world, GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT);

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

    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            document.getElementById('grid-canvas').requestPointerLock();
        }
    }, { once: true });
}

// Function ran when window is resized
function resizeCamera() {
    if (!camera) 
        return;

    camera.width = window.innerWidth;
    camera.height = window.innerHeight;
    app.renderer.resize(camera.width, camera.height);
}

function gameLoop() {
    camera.move(input.mouseX, input.mouseY, CANVAS_WIDTH, CANVAS_HEIGHT);
    render()
    requestAnimationFrame(gameLoop);
}

function render() {
    app.world.x = -camera.x;
    app.world.y = -camera.y;
    drawMouseIndicator();
}

function drawMouseIndicator() {
    if (document.pointerLockElement === document.getElementById("grid-canvas")) {
        const circle = new PIXI.Graphics();
        circle.beginFill(0xff0000);
        circle.drawCircle(input.mouseX, input.mouseY, 5);
        circle.endFill();

        // remove old indicator if any
        if (app.mouseIndicator) app.stage.removeChild(app.mouseIndicator);
        app.stage.addChild(circle);
        app.mouseIndicator = circle;
    }
}


window.startGame = startGame;
