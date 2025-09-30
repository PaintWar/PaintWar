using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class MenuHub : Hub
    {
        public async Task NewLobby(string playerId, string playerName)
        {
            Lobby lobby = State.NewLobby();
            if (lobby.AddPlayer(new Player(playerId, playerName, lobby.Players.Count)))
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

            lobby.AddPlayer(new Player(playerId, playerName, lobby.Players.Count));
            await Clients.Caller.SendAsync("JoinLobby", lobbyId);
        }
    }
}