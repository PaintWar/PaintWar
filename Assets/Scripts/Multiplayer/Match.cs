using System.Drawing;

public class Match : IEquatable<Match>
{
    public string Id { get; set; }
    public List<Player> players = new List<Player>();

    // Maybe these hardcoded values shouldn't be here
    public const int mapWidth = 250, mapHeight = 250;
    public List<List<Cell>> Cells { get; set; } = new List<List<Cell>>();
    public List<int> Colors = new List<int> { 0xff0000, 0x0000ff };
    public Match()
    {
        this.Id = randomId();
        
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
    public Match(string matchId) => this.Id = matchId;

    
    private string randomId()
    {
        Random rand = new Random();
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const int len = 5;

        char[] id = new char[len];

        for (int i = 0; i < len; i++)
            id[i] = chars[rand.Next(chars.Length)];

        return new String(id);
    }

    public bool Equals(Match? other) => other is not null && this.Id == other.Id;

    public void AddPlayer(Player player) => players.Add(player);
}