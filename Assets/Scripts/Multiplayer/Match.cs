using Microsoft.AspNetCore.SignalR;
using PaintWar.Hubs;

public class Match
{
    public GameLoop matchLoop = new();
    private readonly IHubContext<GameHub> hubContext;
    public string Id { get; }
    public List<Player> Players = new List<Player>();

    public Player? Player(string id) => Players.FirstOrDefault((player) => player.PrivateId == id);

    public Match(Lobby lobby, IHubContext<GameHub> hubContext)
    {
        (Id, Players) = (lobby.Id, lobby.Players);
        this.hubContext = hubContext;
        matchLoop.Start();
        matchLoop.RunUpdate();
        matchLoop.RunFixedUpdate();
        
        SpawnGameObject("Example", new Vector3(100, 100, 0));
        
        foreach (Player player in Players)
        {
            player.StartUpdateLoop();
        }

        for (int y = 0; y < mapHeight; y++)
        {
            var row = new List<Cell>();
            for (int x = 0; x < mapWidth; x++)
            {
                row.Add(new Cell());
            }
            Cells.Add(row);
        }
    }

    // Maybe these hardcoded values shouldn't be here
    public const int mapWidth = 250, mapHeight = 250;
    public List<List<Cell>> Cells { get; } = new List<List<Cell>>();

    private void SpawnGameObject(string type, Vector3 position)
    {
        GameObject obj = GameObjectFactory.Create(type, hubContext, this, position);
        matchLoop.AddGameObject(obj);
        hubContext.Clients.Group("Game-" + Id).SendAsync("CreateGameObject", obj.Id, type, obj.transform.position?.x, obj.transform.position?.y);
    }

}