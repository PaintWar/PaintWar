import joinLobby from "./lobby.js";

var connection = new signalR.HubConnectionBuilder().withUrl("/menuHub").withAutomaticReconnect().build();

const playerNameInput = document.getElementById("playerNameInput");
const lobbyIdInput = document.getElementById("lobbyIdInput");
const playerNameButton = document.getElementById("playerNameButton");
const joinLobbyButton = document.getElementById("joinLobbyButton");
const newLobbyButton = document.getElementById("newLobbyButton");

playerNameButton.disabled = true;
joinLobbyButton.disabled = true;
newLobbyButton.disabled = true;

connection.start().then(function () {
    playerNameButton.disabled = false;
    joinLobbyButton.disabled = false;
    newLobbyButton.disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

if (localStorage.getItem("UUID") == null) {
    localStorage.setItem("UUID", crypto.randomUUID());
}

if (localStorage.getItem("playerName") == null) {
    // set random name
}

playerNameInput.value = localStorage.getItem("playerName");

function setName() {
    const name = playerNameInput.value.trim();
    localStorage.setItem("playerName", name);
    playerNameInput.value = name;
}

playerNameButton.addEventListener("click", e => {
    setName();
    e.preventDefault();
});

playerNameInput.addEventListener("keypress", e => {
	if (e.key == "Enter") {
        setName();
        e.preventDefault();
	}
});

playerNameInput.addEventListener("focus", () => {
    playerNameInput.select();
})

function joinLobbyRequest() {
    const lobbyId = lobbyIdInput.value.trim();
    connection.invoke("JoinLobby", lobbyId, localStorage.getItem("UUID"), localStorage.getItem("playerName")).catch(function (err) {
        return console.error(err.toString());
    });
}

joinLobbyButton.addEventListener("click", e => {
    joinLobbyRequest();
    e.preventDefault();
});

lobbyIdInput.addEventListener("focus", () => {
    lobbyIdInput.select();
})

lobbyIdInput.addEventListener("keypress", e => {
	if (e.key == "Enter") {
		joinLobbyRequest();
        e.preventDefault();
	}
});

newLobbyButton.addEventListener("click", function (e) {
    connection.invoke("NewLobby", localStorage.getItem("UUID"), localStorage.getItem("playerName")).catch(function (err) {
        return console.error(err.toString());
    });
    e.preventDefault();
});

connection.on("JoinLobby", function (id) {
    joinLobby(id);
});

connection.on("JoinFailedNonExistentLobby", function () {
    console.log("Failed to join lobby, no such lobby");
});

connection.on("JoinFailedMatchInProgress", function () {
    console.log("Failed to join lobby, match already started");
});

connection.on("JoinFailedLobbyFull", function () {
    console.log("Failed to join lobby, lobby is full");
});