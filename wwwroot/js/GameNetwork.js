export class GameNetwork {
    constructor(connection, matchId, game) {
        this.connection = connection;
        this.matchId = matchId;
        this.game = game;
        this.connection.on("Map", (mapWidth, mapHeight, cells) => {
            console.log("Paint map");
            this.game.loadMap(mapWidth, mapHeight, cells);
        });
        this.connection.on("CellUpdated", (x, y, playerId, color) => {
            this.game.paintCell(x, y, playerId, color);
        });
    }
    paintCell(row, col) {
        console.log(this.matchId);
        return this.connection.invoke("PaintCell", this.matchId, row, col);
    }
    
}