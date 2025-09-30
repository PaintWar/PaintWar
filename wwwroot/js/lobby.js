import startGame from "./main.js";

const startGameButton = document.getElementById("startGameButton");
const lobbyIdText = document.getElementById("lobbyIdText");
const playerList = document.getElementById("playerList");

export default function joinLobby(id) {
    startGameButton.disabled = true;
    lobbyIdText.textContent = id;

    // Hide menu
    const menuContainer = document.getElementById('menu-container');
    menuContainer.style.display = 'none';

    // Un-hide lobby
    const lobbyContainer = document.getElementById('lobby-container');
    lobbyContainer.style.display = 'flex';

    var connection = new signalR.HubConnectionBuilder().withUrl("/lobbyHub?lobby=" + id).withAutomaticReconnect().build();
    setupConnection(connection, id);
}

function setupConnection(connection, id) {
    connection.start().then(function () {
        startGameButton.disabled = false;
    }).catch(function (err) {
        return console.error(err.toString());
    });

    connection.on("MatchStart", function () {
        startGame(id);
    })

    connection.on("UpdatePlayerList", function (players) {
        playerList.innerHTML = "";
        players.forEach((p) => {
            var temp = document.createElement("li");
            temp.innerText = p.name + (p.id == localStorage.getItem("UUID") ? " (YOU)" : "");
            playerList.appendChild(temp);
        });
    })

    connection.on("FailedNotHost", function () {
        console.log("Not host");
    })

    connection.on("FailedNotEnoughPlayers", function () {
        console.log("Not enough players");
    })

    startGameButton.addEventListener("click", e => {
        connection.invoke("StartMatch", localStorage.getItem("UUID")).catch(function (err) {
            return console.error(err.toString());
        });
    })
}