import startGame from "./main.js";
import requestAlert from "./alert.js";

let player;

const startGameButton = document.getElementById("startGameButton");
const lobbyIdText = document.getElementById("lobbyIdText");
const playerList = document.getElementById("playerList");

export default function joinLobby(id, p) {
    player = p;

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
    connection.start().then(() => {
        startGameButton.disabled = false;
    }).catch((err) => {
        return console.error(err.toString());
    });

    connection.on("MatchStart", () => {
        startGame(id, player);
    })

    connection.on("UpdatePlayerList", (players) => {
        playerList.innerHTML = "";
        players.forEach((p) => {
            var temp = document.createElement("li");
            temp.innerText = p.name + (p.publicId == player.publicId ? " (YOU)" : "");
            playerList.appendChild(temp);
        });
    })

    connection.on("FailedNotHost", () => {
        requestAlert("Only the host can start the match.")
    })

    connection.on("FailedNotEnoughPlayers", () => {
        requestAlert("There aren't enough players to start a match.")
    })

    startGameButton.addEventListener("click", (e) => {
        connection.invoke("StartMatch", player.privateId).catch((err) => {
            return console.error(err.toString());
        });
    })
}