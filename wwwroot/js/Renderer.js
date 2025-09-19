export class Renderer {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x333333
        });

        document.getElementById('canvas-container').appendChild(this.app.view);

        this.worldContainer = new PIXI.Container();
        this.app.stage.addChild(this.worldContainer);

        this.backgroundLayer = new PIXI.Container();

        this.paintTexture = PIXI.RenderTexture.create({
            width: canvasWidth,
            height: canvasHeight
        });
        this.paintLayer = new PIXI.Sprite(this.paintTexture);

        this.entityLayer = new PIXI.Container();
        this.worldContainer.addChild(this.backgroundLayer);
        this.worldContainer.addChild(this.paintLayer);
        this.worldContainer.addChild(this.entityLayer);

        this.worldContainer.setChildIndex(this.backgroundLayer, 0);
        this.worldContainer.setChildIndex(this.paintLayer, 1);
        this.worldContainer.setChildIndex(this.entityLayer, 2);
        
        this.uiLayer = new PIXI.Container();
        this.app.stage.addChild(this.uiLayer);

        this.mouseIndicator = new PIXI.Graphics();
        this.uiLayer.addChild(this.mouseIndicator);
        this.mouseIndicator.visible = false;

        this.overlayCanvas = document.getElementById("grid-canvas");
        this.overlayCanvas.width = this.canvasWidth;
        this.overlayCanvas.height = this.canvasHeight;
        this.overlayCanvas.style.position = "absolute";
        this.overlayCanvas.style.top = "0";
        this.overlayCanvas.style.left = "0";
        this.overlayCanvas.style.opacity = "0";

        this.cellBrush = new PIXI.Graphics();
    }

    render(camera) {
        this.worldContainer.x = -camera.x;
        this.worldContainer.y = -camera.y;
    }

    drawCell(cell) {
        this.cellBrush.clear();
        this.cellBrush.beginFill(cell.color);
        this.cellBrush.drawRect(cell.x * cell.size, cell.y * cell.size, cell.size, cell.size);
        this.cellBrush.endFill();

        this.app.renderer.render(this.cellBrush, {
            renderTexture: this.paintTexture,
            clear: false
        });
    }

    drawMouseIndicator(x, y) {
        if (document.pointerLockElement === this.overlayCanvas) {
            this.mouseIndicator.clear();
            this.mouseIndicator.beginFill(0xFF0000);
            this.mouseIndicator.drawCircle(x, y, 5);
            this.mouseIndicator.endFill();
            this.mouseIndicator.visible = true;
        } 
        else {
            this.mouseIndicator.visible = false;
        }
    }

    resize(width, height) {
        this.app.renderer.resize(width, height);
        this.overlayCanvas.width = width;
        this.overlayCanvas.height = height;
    }
}