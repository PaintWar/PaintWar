var connection = new signalR.HubConnectionBuilder().withUrl("/menuHub").build();

var joinButton = document.getElementById("join-btn");
joinButton.disabled = true;

connection.start().then(function () {
    joinButton.disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("JoinGame", function (matchId) {
    console.log("Joined game: " + matchId);
    // Actually do something here
    // Hide elements etc.
});

joinButton.addEventListener("click", function (e) {
    var matchId = document.getElementById("matchId").value;
    connection.invoke("JoinGame", matchId).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});