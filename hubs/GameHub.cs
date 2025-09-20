using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class GameHub : Hub
    {
        public async Task JoinMatch(string matchId)
        {
            Match match = State.matchGet(matchId);
            if (match == null) return;
            match.AddPlayer(new Player(Context.ConnectionId, match.players.Count));
            await Groups.AddToGroupAsync(Context.ConnectionId, matchId);

            await Clients.Caller.SendAsync("Map", Match.mapWidth, Match.mapHeight, match.Cells);
        }
        public async Task PaintCell(string matchId, int row, int col)
        {
            if (!State.matchExists(matchId)) return;
            Match match = State.matchGet(matchId);

            Player? player = match.players.FirstOrDefault(p => p.Id == Context.ConnectionId);
            if (player == null) return;

            if (row < 0 || col >= Match.mapWidth || row < 0 || row >= Match.mapHeight) return;
            if (match.Cells[row][col].OwnerId == player.Id) return;
            match.Cells[row][col].OwnerId = player.Id;
            match.Cells[row][col].Color = match.Colors[player.Number];
            await Clients.Group(matchId).SendAsync("CellUpdated", row, col, player.Id, match.Colors[player.Number]);
        }
    }
}