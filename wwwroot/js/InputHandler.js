export class InputHandler {
    constructor(canvas) {
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.leftMouseDown = false;
        this.rightMouseDown = false;
        this.lastClick = null;

        document.addEventListener("mousemove", (e) => {
            if (document.pointerLockElement === canvas) {
                this.mouseX += e.movementX;
                this.mouseY += e.movementY;
                const rect = document.getElementById("grid-canvas").getBoundingClientRect();
                this.mouseX = Math.max(0, Math.min(this.mouseX, window.innerWidth - rect.left));
                this.mouseY = Math.max(0, Math.min(this.mouseY, window.innerHeight - rect.top));
            }
            else {
                const rect = document.getElementById("grid-canvas").getBoundingClientRect();
                this.mouseX = e.clientX - rect.x;
                this.mouseY = e.clientY - rect.y;
            }
        });

        document.addEventListener("mousedown", (e) => {
            if (e.button === 0) this.leftMouseDown = true;
            if (e.button === 2) this.rightMouseDown = true;
            this.lastClick = { x: this.mouseX, y: this.mouseY, button: e.button };
        });

        document.addEventListener("mouseup", (e) => {
            if (e.button === 0) this.leftMouseDown = false;
            if (e.button === 2) this.rightMouseDown = false;
        });

    }
}
