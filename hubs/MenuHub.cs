using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class MenuHub(IWebHostEnvironment env) : Hub
    {
        override public async Task OnConnectedAsync()
        {
            if (env.IsDevelopment())
            {
                await Clients.Caller.SendAsync("Development");
            }
            else
            {
                await Clients.Caller.SendAsync("Production");
            }
            await base.OnConnectedAsync();
        }

        public async Task NewLobby(string playerId, string playerName)
        {
            Lobby lobby = State.NewLobby();
            bool successfullyAddedPlayer = lobby.AddPlayer(new Player(playerId, playerName, lobby.Players.Count));
            if (successfullyAddedPlayer)
            {
                await Clients.Caller.SendAsync("JoinLobby", lobby.Id);
            }
        }

        public async Task JoinLobby(string lobbyId, string playerId, string playerName)
        {
            (bool, string)[] state = {
                (!State.LobbyExists(lobbyId), "JoinFailedNonExistentLobby"),
                (State.MatchExists(lobbyId), "JoinFailedMatchInProgress"),
                (State.LobbyFull(lobbyId) ?? true, "JoinFailedLobbyFull")
            };

            foreach ((bool failed, string message) in state)
            {
                if (failed)
                {
                    await Clients.Caller.SendAsync(message);
                    return;
                }
            }

            Lobby? lobby = State.Lobby(lobbyId);
            if (lobby == null) return;

            bool successfullyAddedPlayer = lobby.AddPlayer(new Player(playerId, playerName, lobby.Players.Count));
            if (successfullyAddedPlayer)
            {
                await Clients.Caller.SendAsync("JoinLobby", lobby.Id);
            }
        }
    }
}