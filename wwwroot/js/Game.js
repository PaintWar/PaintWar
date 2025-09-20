import { Camera } from './Camera.js';
import { InputHandler } from './InputHandler.js';
import { Renderer } from './Renderer.js';
import { Cell } from './Cell.js';
export class Game {
    constructor(canvasWidth = 2, canvasHeight = 2, cellSize = 8) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cellSize = cellSize;

        this.camera = new Camera(window.innerWidth, window.innerHeight);;
        this.renderer = new Renderer(this.canvasWidth, this.canvasHeight);;
        this.input = new InputHandler(this.renderer.overlayCanvas);
        this.network = null;
        this.running = false;

        this.rows;
        this.cols;
        this.cellGrid = [];
    }

    setNetwork(network) {
        this.network = network;
    }

    loadMap(mapWidth, mapHeight, cells) {
        this.cols = mapWidth;
        this.rows = mapHeight;
        this.canvasWidth = mapWidth * this.cellSize;
        this.canvasHeight = mapHeight * this.cellSize;

        this.renderer.resize(this.canvasWidth, this.canvasHeight);
        this.renderer.createMapLayers(this.canvasWidth, this.canvasHeight);
        this.cellGrid = Array.from({ length: this.rows }, (_, row) =>
            Array.from({ length: this.cols }, (_, col) => new Cell(col, row, this.cellSize))
        );

        for (let row = 0; row < this.rows; row++) {
            for (let col =  0; col < this.cols; col++) {
                if (cells[row][col].ownerId !== null) {
                    this.paintCell(col, row, cells[row][col].ownerId, cells[row][col].color)
                }
            }
        }

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
            const x = this.input.mouseX + this.camera.x;
            const y = this.input.mouseY + this.camera.y;
            const col = Math.floor(x / this.cellSize);
            const row = Math.floor(y / this.cellSize);
            this.network.paintCell(row, col);
        }
    }

    paintCell(row, col, playerId, color) {
        if (!this.cellGrid[row] || !this.cellGrid[row][col])
            return;

        const cell = this.cellGrid[row][col];
        
        if (cell.owner === playerId && cell.owner !== null)
            return;

        cell.paint(playerId, color);

        this.renderer.drawCell(cell);
    }

    render() {
        this.renderer.render(this.camera);
        this.renderer.drawMouseIndicator(this.input.mouseX, this.input.mouseY);
    }

    resize() {
        if (!this.camera)
            return;

        const rect = document.getElementById("grid-canvas").getBoundingClientRect();
        this.camera.width = window.innerWidth - rect.left;
        this.camera.height = window.innerHeight - rect.top;

        this.renderer.resize(this.camera.width, this.camera.height);
    }


}