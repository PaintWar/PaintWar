import startGame from "./main.js";

const startGameButton = document.getElementById("startGameButton");
const lobbyIdText = document.getElementById("lobbyIdText");

export default function joinLobby(id) {
    startGameButton.disabled = true;
    lobbyIdText.textContent = id;

    // Hide menu
    const menuContainer = document.getElementById('menu-container');
    menuContainer.style.display = 'none';

    // Un-hide lobby
    const lobbyContainer = document.getElementById('lobby-container');
    lobbyContainer.style.display = 'flex';

    var connection = new signalR.HubConnectionBuilder().withUrl("/lobbyHub?lobby=" + id).build();
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

    connection.on("FailedNotHost", function () {
        console.log("Not host");
    })

    connection.on("FailedNotEnoughPlayers", function () {
        console.log("Not enough players");
    })

    startGameButton.addEventListener("click", e => {
        connection.invoke("StartMatch", "random id").catch(function (err) {
            return console.error(err.toString());
        });
    })
}