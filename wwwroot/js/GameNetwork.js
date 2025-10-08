export class GameNetwork {
    constructor(connection, game) {
        this.connection = connection;
        this.game = game;
        this.connection.on("MapInit", (mapWidth, mapHeight, cells) => {
            this.game.loadMap(mapWidth, mapHeight, cells);
        });
        this.connection.on("CellUpdated", (x, y, playerId, color) => {
            this.game.paintCell(x, y, playerId, color);
        });
    }
    paintCell(row, col) {
        return this.connection.invoke("PaintCell", row, col);
    }
}