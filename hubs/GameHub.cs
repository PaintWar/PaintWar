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

            Lobby? lobby = State.Lobby(id);
            if (lobby == null) return;

            Player? player = lobby.Players.FirstOrDefault(p => p.ConnectionId == null);
            if (player != null)
            {
                player.ConnectionId = Context.ConnectionId;
            }

            await base.OnConnectedAsync();
        }

        public async Task PlayerReady(string gameId, string privateId)
        {
            Lobby? lobby = State.Lobby(gameId);
            if (lobby == null) return;

            Player? player = lobby.Players.FirstOrDefault(p => p.PrivateId == privateId);
            if (player == null) return;

            player.IsReady = true;

            if (lobby.Players.All(p => p.ConnectionId != null && p.IsReady))
            {
                State.StartMatch(lobby, Context.GetHttpContext()!.RequestServices.GetRequiredService<IHubContext<GameHub>>());
                await Clients.Group(GetGameGroupName()).SendAsync("GameReady");
            }
        }
        public async Task RequestMap(string matchId)
        {
            Match? match = State.Match(matchId);
            if (match == null) return;
            await Clients.Caller.SendAsync("MapInit", Match.mapWidth, Match.mapHeight, match.Cells);
        }

        public async Task GetAllObjects(string matchId)
        {

            Match? match = State.Match(matchId);
            if (match == null) return;

            List<GameObject> gameObjects = match.matchLoop.GetGameObjects();
            foreach (GameObject obj in gameObjects)
            {
                if (obj.type != null)
                {
                    var animatorUpdater = obj.GetComponent<AnimatorUpdater>() as AnimatorUpdater;
                    await Clients.Caller.SendAsync("CreateGameObject", obj.Id, obj.type, obj.transform.position?.x, obj.transform.position?.y, animatorUpdater?.CurrentAnimation);
                }

            }

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