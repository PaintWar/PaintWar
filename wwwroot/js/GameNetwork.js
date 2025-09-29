export class GameNetwork {
    constructor(connection, matchId, game) {
        this.connection = connection;
        this.matchId = matchId;
        this.game = game;
        this.connection.on("MapInit", (mapWidth, mapHeight, cells) => {
            console.log("0");
            this.game.loadMap(mapWidth, mapHeight, cells);
        });
        this.connection.on("CellUpdated", (x, y, playerId, color) => {
            this.game.paintCell(x, y, playerId, color);
        });
    }
    paintCell(row, col) {
        return this.connection.invoke("PaintCell", this.matchId, row, col);
    }
    
}