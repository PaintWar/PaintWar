import startGame from "./main.js";
import requestAlert from "./alert.js";
import { colorPopup } from "./popupMenu.js";

let player;

// For color selection popup
let colors;
let associatedPlayers;

const colorSelectButton = document.getElementById("colorSelectButton");
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
            temp.innerText = p.name;
            if (p.publicId === player.publicId) {
                temp.style.textDecoration = "underline";
                temp.style.fontWeight = "bold";
            }
            playerList.appendChild(temp);
        });
    })

    connection.on("FailedNotHost", () => {
        requestAlert("Only the host can start the match.");
    })

    connection.on("FailedNotEnoughPlayers", () => {
        requestAlert("There aren't enough players to start a match.");
    })

    startGameButton.addEventListener("click", (e) => {
        connection.invoke("StartMatch", player.privateId).catch((err) => {
            return console.error(err.toString());
        });
    })

    connection.on("PossibleColors", (Colors) => {
        colors = Colors;
    })

    connection.on("FailedColorTaken", () => {
        requestAlert("That color is already taken.");
    })

    connection.on("UpdateColorState", (associatedPlayersUpdated) => {
        associatedPlayers = associatedPlayersUpdated;

        if (document.getElementById("color-popup-menu") !== null) {
            colorPopup(connection, player, colors, associatedPlayers);
        }
    })

    colorSelectButton.addEventListener("click", (e) => {
        colorSelectButton.blur();
        colorPopup(connection, player, colors, associatedPlayers);
    })
}