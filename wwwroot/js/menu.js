import startGame from "./main.js";
import requestAlert from "./alert.js";

var connection = new signalR.HubConnectionBuilder().withUrl("/menuHub").build();

const matchIdInput = document.getElementById("matchId");
const joinButton = document.getElementById("join-btn");
const startButton = document.getElementById("start-btn");
joinButton.disabled = true;
startButton.disabled = true;

connection.start().then(function () {
    joinButton.disabled = false;
    startButton.disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

function joinMatch() {
    const matchId = document.getElementById("matchId").value.trim();
    connection.invoke("JoinMatch", matchId).catch(function (err) {
        return console.error(err.toString());
    });
}

joinButton.addEventListener("click", e => {
    joinMatch();
    e.preventDefault();
});

matchIdInput.addEventListener("keypress", e => {
	if (e.key == "Enter") {
		joinMatch(e);
        e.preventDefault();
	}
});

startButton.addEventListener("click", function (e) {
    connection.invoke("NewMatch").catch(function (err) {
        return console.error(err.toString());
    });
    e.preventDefault();
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
    const matchId = document.getElementById("matchId").value.trim();
    requestAlert("Failed to join game with id: " + matchId);
});