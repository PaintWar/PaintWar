import { Camera } from './Camera.js';
import { InputHandler } from './InputHandler.js';
import { Renderer } from './Renderer.js';
import { Cell } from './Cell.js';
import { NumericTrack } from './NumericTrack.js';
import { SpriteTrack } from './SpriteTrack.js';
import { Animation } from './Animation.js';
import { Animator } from './Animator.js';
import { AnimationLibrary } from './AnimationLibrary.js';
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
        this.entities = {};
        this.animators = [];
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
                    this.paintCell(row, col, cells[row][col].ownerId, cells[row][col].color)
                }
            }
        }

        // Delete after showcasing animations 
        //this.tempFunnctionToShowAnimation();
        
    }

    // Delete after showcasing animations 
    tempFunnctionToShowAnimation() {
        const block = new PIXI.Graphics();
        block.beginFill(0xFFAA00);
        block.drawRect(-25, -25, 50, 50);
        block.endFill();
        block.x = 100;
        block.y = 100;
        block.scale.set(1, 1);
        block.rotation = 0;

        this.renderer.entityLayer.addChild(block);
        this.entities.push(block);

        const moveXTrack = new NumericTrack("x", [
            { time: 0, value: 100 },
            { time: 2, value: 400 },
            { time: 4, value: 100, callback: this.message.bind(this) }
            ]
        );
        const moveYTrack = new NumericTrack("y", [
            { time: 0, value: 100 },
            { time: 2, value: 300 },
            { time: 4, value: 100 }
            ]
        );
        const rotationTrack = new NumericTrack("rotation", [
            { time: 0, value: 0 },
            { time: 4, value: Math.PI * 2 }
        ]
        );
        const scaleTrack = new NumericTrack("scale.x", [
            { time: 0, value: 1 },
            { time: 2, value: 2 },
            { time: 4, value: 1 }
        ]
        );
        const scaleYTrack = new NumericTrack("scale.y", scaleTrack.keyframes);
        const colorTrack = new SpriteTrack("tint", [
            { time: 0, value: 0xFF0000 },
            { time: 1, value: 0x00FF00 },
            { time: 2, value: 0x0000FF },
            { time: 3, value: 0xFFFF00 },
            { time: 4, value: 0xFF0000}
        ]);

        const animation = new Animation([moveXTrack, moveYTrack, scaleTrack, scaleYTrack, rotationTrack, colorTrack], true);
        
        const animator = new Animator(block);
        animator.addAnimation("Example", animation)
        animator.play("Example");
        this.animators.push(animator);
    }

    initialize() {
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.renderer = new Renderer(this.canvasWidth, this.canvasHeight);
        this.input = new InputHandler(this.renderer.overlayCanvas);
    }

    addGameObject(id, type, x, y) {
        if (this.entities[id] != null) {
            const old = this.entities[id];
            this.renderer.entityLayer.removeChild(old.sprite);
            const index = this.animators.indexOf(old.animator);
            if (index !== -1) {
                this.animators.splice(index, 1);   
            }
            delete this.entities[id];
        }
        const sprite = new PIXI.Graphics();
        sprite.beginFill(0x00AAFF);
        sprite.drawRect(-25, -25, 50, 50);
        sprite.endFill();
        sprite.x = x;
        sprite.y = y;
        this.renderer.entityLayer.addChild(sprite);
        const animations = AnimationLibrary.getAnimations(type);
        const animator = new Animator(sprite);

        for (const [name, anim] of Object.entries(animations)) {
            animator.addAnimation(name, anim);
        }
        this.entities[id] = { sprite: sprite, animator: animator };
        this.animators.push(animator);
    }

    changeAnimation(id, animation) {
        const animator = this.entities[id].animator;
        animator.play(animation);
    }

    run() {
        this.running = true;
        this.gameLoop();
    }
    message() {
        console.log("finished loop");
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
        const deltaTime = this.renderer.app.ticker.deltaMS / 1000; // seconds
        this.animators.forEach(animator => animator.update(deltaTime))
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
        const block = new PIXI.Graphics();
        block.beginFill(color);
        
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