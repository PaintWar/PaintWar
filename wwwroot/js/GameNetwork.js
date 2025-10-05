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
        this.connection.on("CreateGameObject", (id, type, x, y, animation) => {
            console.log("Created", id, type, x, y);
            this.game.addGameObject(id, type, x, y);
            this.game.changeAnimation(id, animation);
        });
        this.connection.on("AnimationChanged", (id, animation) => {
            this.game.changeAnimation(id, animation);
        });
        this.connection.on("Test", (number) => {
            console.log(number);
        });
        
    }
    paintCell(row, col) {
        return this.connection.invoke("PaintCell", this.matchId, this.player.privateId, row, col);
    }
}