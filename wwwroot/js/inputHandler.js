export class InputHandler {
    constructor(canvas) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
        this.canvas = canvas;

        canvas.addEventListener("mousemove", e => {
            const rect = canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        canvas.addEventListener("mousedown", () => {
            this.isMouseDown = true;
        });
        
        canvas.addEventListener("mouseup", () => {
            this.isMouseDown = false;
        });
    }
}