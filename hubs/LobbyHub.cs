using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class LobbyHub : Hub
    {
        private string GetLobbyId() => Context.GetHttpContext()?.Request.Query["lobby"].ToString() ?? "";
        private string GetLobbyGroupName() => "Lobby-" + GetLobbyId();

        private string GetPrivateId() => Context.GetHttpContext()?.Request.Query["privateId"].ToString() ?? "";

        override public async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetLobbyGroupName());

            Lobby? lobby = State.Lobby(GetLobbyId());
            if (lobby == null) return;

            await Clients.Group(GetLobbyGroupName()).SendAsync("UpdatePlayerList",
                                lobby.Players.Select((player) => new { player.PublicId, player.Name, player.Number }));
            await base.OnConnectedAsync();
        }

        public async Task StartMatch()
        {
            Lobby? lobby = State.Lobby(GetLobbyId());
            if (lobby == null) return;

            (bool, string)[] state = {
                (GetPrivateId() != lobby.Players.First().PrivateId, "FailedNotHost"),
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

            State.StartMatch(lobby);
            await Clients.Group(GetLobbyGroupName()).SendAsync("MatchStart");
        }

        // Color selection should probably be handled here
    }
}