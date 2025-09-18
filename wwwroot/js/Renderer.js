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
    }

    render(camera) {
        this.worldContainer.x = -camera.x;
        this.worldContainer.y = -camera.y;
    }

    drawMouseIndicator(x, y) {
        if (document.pointerLockElement === this.overlayCanvas) {
            this.mouseIndicator.clear();
            this.mouseIndicator.beginFill(0xFF0000);
            this.mouseIndicator.drawCircle(x, y, 5);
            this.mouseIndicator.endFill();
            this.mouseIndicator.visible = true;
        } else {
            this.mouseIndicator.visible = false;
        }
    }

    resize(width, height) {
        this.app.renderer.resize(width, height);
    }
}