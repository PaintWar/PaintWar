using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class LobbyHub : Hub
    {
        private string? GetLobbyId()
        {
            return Context.GetHttpContext()?.Request.Query["lobby"].ToString();
        }

        private Lobby? GetLobby()
        {
            string? id = GetLobbyId();
            if (id is null) return null;
            return State.Lobby(id);
        }

        private string GetLobbyGroupName()
        {
            return "Lobby-" + GetLobbyId();
        }

        private async Task UpdateColorState()
        {
            Lobby? lobby = GetLobby();
            if (lobby is null) return;

            String?[] state = (String?[]) Constants.Colors.Select((_, i) => lobby.Players.FirstOrDefault(player => player.Color == i)?.PublicId).ToArray();

            await Clients.Group(GetLobbyGroupName()).SendAsync("UpdateColorState", state);
        }

        override public async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetLobbyGroupName());

            Lobby? lobby = GetLobby();
            if (lobby is null) return;

            await UpdateColorState();
            await Clients.Caller.SendAsync("PossibleColors", Constants.Colors);
            await Clients.Group(GetLobbyGroupName()).SendAsync("UpdatePlayerList",
                                lobby.Players.Select((player) => new { player.PublicId, player.Name }));
            await base.OnConnectedAsync();
        }

        public async Task StartMatch(string playerId)
        {
            Lobby? lobby = GetLobby();
            if (lobby is null) return;

            (bool, string)[] state = {
                (playerId != lobby.host?.PrivateId, "FailedNotHost"),
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

        public async Task ChangeColor(string id, int color)
        {
            Lobby? lobby = GetLobby();
            if (lobby is null) return;

            Player? player = lobby.Players.FirstOrDefault((player) => player.PrivateId == id);
            if (player is null) return;
            if (player.Color == color) return;

            if (lobby.ColorTaken(color))
            {
                await Clients.Caller.SendAsync("FailedColorTaken");
                return;
            }

            player.Color = color;
            await UpdateColorState();
        }
    }
}