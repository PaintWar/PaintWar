export class Camera {
    constructor(width, height, speed = 5, edgeThreshold = 1) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.edgeThreshold = edgeThreshold;
    }

    move(mouseX, mouseY, mapWidth, mapHeight) {
        let moveX = 0, moveY = 0;

        if(mouseX < this.edgeThreshold)
            moveX = this.speed;
        else if(mouseX > this.width - this.edgeThreshold)
            moveX = -this.speed;

        if(mouseY < this.edgeThreshold)
            moveY = this.speed;
        else if(mouseY > this.height - this.edgeThreshold)
            moveY = -this.speed;

        this.x = Math.max(0, Math.min(mapWidth - this.width, this.x - moveX));
        this.y = Math.max(0, Math.min(mapHeight - this.height, this.y - moveY));
    }
}
