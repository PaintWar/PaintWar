export class Painting {
    constructor(canvas, camera, mapWidth, mapHeight) {
        this.canvas = canvas;
        this.camera = camera;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        
        // Create offscreen buffer
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = mapWidth;
        this.bufferCanvas.height = mapHeight;
        this.bufferContext = this.bufferCanvas.getContext('2d');
        this.bufferContext.fillStyle = 'rgba(0, 0, 0, 0)';
        this.bufferContext.fillRect(0, 0, mapWidth, mapHeight);
        
        this.isPainting = false;
        this.brushColor = '#ff0040ff';
        this.brushSize = 15;
    }

    startPainting(e) {
        this.isPainting = true;
        this.paint(e);
    }

    paint(e) {
        if (!this.isPainting) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.paintAt(x, y);
    }

    paintAt(screenX, screenY) {
        const worldX = screenX + this.camera.x;
        const worldY = screenY + this.camera.y;
        
        // Draw to the offscreen buffer
        this.bufferContext.fillStyle = this.brushColor;
        this.bufferContext.beginPath();
        this.bufferContext.arc(worldX, worldY, this.brushSize, 0, Math.PI * 2);
        this.bufferContext.fill();
    }

    stopPainting() {
        this.isPainting = false;
    }

    draw(context, camera) {
        // Draw the pre-rendered buffer (paintings)
        context.drawImage(
            this.bufferCanvas, 
            camera.x, camera.y, camera.width, camera.height,
            0, 0, camera.width, camera.height
        );
    }

    clear() {
        this.bufferContext.fillStyle = 'rgba(0, 0, 0, 0)';
        this.bufferContext.fillRect(0, 0, this.mapWidth, this.mapHeight);
    }

    setBrushColor(color) {
        this.brushColor = color;
    }

    setBrushSize(size) {
        this.brushSize = size;
    }
}