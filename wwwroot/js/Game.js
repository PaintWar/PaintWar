import { Camera } from './Camera.js';
import { InputHandler } from './InputHandler.js';
import { Renderer } from './Renderer.js';
import { Cell } from './Cell.js';
export class Game {
    constructor(canvasWidth = 2000, canvasHeight = 2000, cellSize = 8) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cellSize = cellSize;

        this.camera = null;
        this.input = null;
        this.renderer = null;
        this.running = false;

        this.rows = Math.ceil(canvasHeight / cellSize);
        this.cols = Math.ceil(canvasWidth / cellSize);

        this.cellGrid = Array.from({ length: this.rows }, (_, row) =>
            Array.from({ length: this.cols }, (_, col) => new Cell(col, row, cellSize)));
        this.playerColors = {
            1: 0xff0000,
            2: 0x0000ff
        };
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
        // Send paint request to the server here
        if (this.input.leftMouseDown) {
            this.paintCell(this.input.mouseX, this.input.mouseY, 1);
        }
    }

    paintCell(x, y, playerId) {
        x += this.camera.x;
        y += this.camera.y;
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        if (!this.cellGrid[row] || !this.cellGrid[row][col])
            return;

        const cell = this.cellGrid[row][col];
        if (cell.owner === playerId)
            return;

        cell.paint(playerId, this.playerColors[playerId]);

        this.renderer.drawCell(cell);
    }

    render() {
        this.renderer.render(this.camera);
        this.renderer.drawMouseIndicator(this.input.mouseX, this.input.mouseY);
    }

    resize() {
        if (!this.camera)
            return;

        this.camera.width = window.innerWidth;
        this.camera.height = window.innerHeight;
        this.renderer.resize(this.camera.width, this.camera.height);
    }


}