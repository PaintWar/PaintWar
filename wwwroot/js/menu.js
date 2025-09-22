import startGame from "./main.js";

var connection = new signalR.HubConnectionBuilder().withUrl("/menuHub").build();

var joinButton = document.getElementById("join-btn");
var startButton = document.getElementById("start-btn");
joinButton.disabled = true;
startButton.disabled = true;

connection.start().then(function () {
    joinButton.disabled = false;
    startButton.disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

joinButton.addEventListener("click", function (e) {
    var matchId = document.getElementById("matchId").value.trim();
    connection.invoke("JoinMatch", matchId).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

startButton.addEventListener("click", function (e) {
    connection.invoke("NewMatch").catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

connection.on("JoinMatch", function (matchId) {
    console.log("Joined game: " + matchId);
    document.getElementById("matchIdText").textContent = matchId;

    var gameConnection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();
    gameConnection.start().then(() => {
        gameConnection.invoke("JoinMatch", matchId);
        startGame(gameConnection, matchId);
    });
});

connection.on("JoinFailed", function () {
    console.log("Failed to join game");
});