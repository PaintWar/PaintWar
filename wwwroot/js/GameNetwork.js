export class GameNetwork {
    constructor(connection, matchId, game) {
        this.connection = connection;
        this.matchId = matchId;
        this.game = game;
        this.connection.on("Map", (mapWidth, mapHeight, cells) => {
            this.game.loadMap(mapWidth, mapHeight, cells);
        });
        this.connection.on("CellUpdated", (x, y, playerId, color) => {
            this.game.paintCell(x, y, playerId, color);
        });
        this.connection.on("LifePaintUpdated", (newAmount) => {
            this.game.setLifePaint(newAmount);
        });
    }
    paintCell(row, col) {
        return this.connection.invoke("PaintCell", this.matchId, row, col);
    }
    
}