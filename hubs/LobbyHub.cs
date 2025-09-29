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
            await base.OnConnectedAsync();
        }

        public async Task StartMatch(string playerId)
        {
            Lobby? lobby = State.Lobby(GetLobbyId() ?? "Trust me bro");
            if (lobby == null) return;
            var players = lobby.Players;

            if (!(players?.First().Id == playerId))
            {
                await Clients.Group(GetLobbyGroupName()).SendAsync("FailedNotHost");
            }
            else if (players?.Count <= 1)
            {
                await Clients.Group(GetLobbyGroupName()).SendAsync("FailedNotEnoughPlayers");
            }
            else
            {
                State.StartMatch(lobby);
                await Clients.Group(GetLobbyGroupName()).SendAsync("MatchStart");
            }
        }

        // Color selection should probably be handled here
    }
}