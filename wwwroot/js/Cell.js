export class Cell {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.owner = null;
        this.color = 0xffffff;
    }

    paint(playerId, color) {
        this.owner = playerId;
        this.color = color;
    }
}