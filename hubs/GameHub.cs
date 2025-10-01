using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class GameHub : Hub
    {
        private string? GetGameId()
        {
            return Context.GetHttpContext()?.Request.Query["game"].ToString();
        }

        private string GetGameGroupName()
        {
            return "Game-" + GetGameId();
        }

        override public async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetGameGroupName());

            string? id = GetGameId();
            if (id == null) return;

            Match? match = State.Match(id);
            if (match == null) return;

            await Clients.Caller.SendAsync("MapInit", Match.mapWidth, Match.mapHeight, match.Cells);
            await base.OnConnectedAsync();
        }

        public async Task PaintCell(string matchId, string privateId, int row, int col)
        {
            Match? match = State.Match(matchId);
            if (match == null) return;

            Player? player = match.Player(privateId);
            if (player == null) return;

            if (row < 0 || col >= Match.mapWidth || row < 0 || row >= Match.mapHeight) return;
            if (match.Cells[row][col].OwnerId == player.PrivateId) return;
            match.Cells[row][col].OwnerId = player.PrivateId;
            match.Cells[row][col].Color = Constants.Colors[player.Number];
            await Clients.Group(GetGameGroupName()).SendAsync("CellUpdated", row, col, player.PublicId, Constants.Colors[player.Number]);
        }
    }
}