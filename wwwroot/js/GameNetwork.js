export class GameNetwork {
    constructor(connection, matchId, game, player) {
        this.connection = connection;
        this.matchId = matchId;
        this.game = game;
        this.player = player;
        this.connection.on("MapInit", (mapWidth, mapHeight, cells) => {
            this.game.loadMap(mapWidth, mapHeight, cells);
        });
        this.connection.on("CellUpdated", (x, y, playerId, color) => {
            this.game.paintCell(x, y, playerId, color);
        });
    }
    paintCell(row, col) {
        return this.connection.invoke("PaintCell", this.matchId, this.player.privateId, row, col);
    }
}