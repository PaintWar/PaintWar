public class Match
{
    public string Id { get; }
    public List<Player> Players = new List<Player>();

    // public Match(Lobby lobby) => (Id, Players) = (lobby.Id, lobby.Players);

    public Match(Lobby lobby)
    {
        (Id, Players) = (lobby.Id, lobby.Players);

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
}