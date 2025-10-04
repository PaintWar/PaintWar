import startGame from "./main.js";

let player;

const startGameButton = document.getElementById("startGameButton");
const lobbyIdText = document.getElementById("lobbyIdText");
const playerList = document.getElementById("playerList");

export default function joinLobby(id, p) {
    player = p;

    console.log(globalThis.player);

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
        console.log("Not host");
    })

    connection.on("FailedNotEnoughPlayers", () => {
        console.log("Not enough players");
    })

    startGameButton.addEventListener("click", (e) => {
        connection.invoke("StartMatch", player.privateId).catch((err) => {
            return console.error(err.toString());
        });
    })
}