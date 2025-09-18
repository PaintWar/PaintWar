import { Camera } from './Camera.js';
import { InputHandler } from './InputHandler.js';
import { Renderer } from './Renderer.js';
export class Game {
    constructor() {
        this.canvasWidth = 2000;
        this.canvasHeight = 2000;
        this.camera = null;
        this.input = null;
        this.renderer = null;
        this.running = false;
    }

    initialize() {
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.renderer = new Renderer(this.canvasWidth, this.canvasHeight);
        this.input = new InputHandler(this.renderer.overlayCanvas);
    }

    run() {
        this.running = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.running)
            return;
        this.update();

        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.camera.move(this.input.mouseX, this.input.mouseY, this.canvasWidth, this.canvasHeight);
    }

    render() {
        this.renderer.render(this.camera);
        this.renderer.drawMouseIndicator(this.input.mouseX, this.input.mouseY);
    }

    resize() {
        if (!this.camera) return;

        this.camera.width = window.innerWidth;
        this.camera.height = window.innerHeight;
        this.renderer.resize(this.camera.width, this.camera.height);
    }


}