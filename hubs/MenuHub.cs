using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class MenuHub : Hub
    {
        public async Task NewLobby()
        {
            Lobby lobby = State.NewLobby();
            lobby.AddPlayer(new Player("random id", lobby.Players.Count));
            await Clients.Caller.SendAsync("JoinLobby", lobby.Id);
        }

        public async Task JoinLobby(string id)
        {
             (bool, string)[] state = {
                (!State.LobbyExists(id), "JoinFailedNonExistentLobby"),
                (State.MatchExists(id), "JoinFailedMatchInProgress"),
                (State.LobbyFull(id) ?? true, "JoinFailedLobbyFull")
            };

            foreach ((bool failed, string Message) in state)
            {
                if (failed)
                {
                    await Clients.Caller.SendAsync(Message);
                    return;
                }
            }

            Lobby? lobby = State.Lobby(id);
            if (lobby == null) return;

            lobby.AddPlayer(new Player("random id", lobby.Players.Count));
            await Clients.Caller.SendAsync("JoinLobby", id);
        }
    }
}