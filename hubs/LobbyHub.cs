using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class LobbyHub : Hub
    {
        private string? GetLobbyId()
        {
            return Context.GetHttpContext()?.Request.Query["lobby"].ToString();
        }

        private string GetLobbyGroupName()
        {
            return "Lobby-" + GetLobbyId();
        }

        override public async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetLobbyGroupName());

            string? id = GetLobbyId();
            if (id == null) return;

            Lobby? lobby = State.Lobby(id);
            if (lobby == null) return;

            await Clients.Group(GetLobbyGroupName()).SendAsync("UpdatePlayerList",
                                lobby.Players.Select((player) => new { player.PublicId, player.Name, player.Number }));
            await base.OnConnectedAsync();
        }

        public async Task StartMatch(string playerId)
        {
            string? id = GetLobbyId();
            if (id == null) return;

            Lobby? lobby = State.Lobby(id);
            if (lobby == null) return;

            (bool, string)[] state = {
                (playerId != lobby.Players.First().PrivateId, "FailedNotHost"),
                (lobby.Players.Count <= 1, "FailedNotEnoughPlayers")
            };

            foreach ((bool failed, string message) in state)
            {
                if (failed)
                {
                    await Clients.Caller.SendAsync(message);
                    return;
                }
            }

            await Clients.Group(GetLobbyGroupName()).SendAsync("MatchStart");
        }

        // Color selection should probably be handled here
    }
}