public class Lobby
{
    public string Id { get; }
    public List<Player> Players { get; } = new List<Player>();
    public Player? host = null;

    public Lobby() => Id = Utils.RandomId();

    public bool AddPlayer(string privateId, string publicId, string name)
    {
        if (Full) return false;
        if (Players.Any((player) => player.PrivateId == privateId || player.PublicId == publicId)) return false;

        int color = -1;
        for (int i = 0; i < Constants.Colors.Count(); i++)
        {
            if (!ColorTaken(i))
            {
                color = i;
                break;
            }
        }

        if (color == -1) return false;

        Player player = new Player(privateId, publicId, name, color);

        if (host is null) host = player;
        Players.Add(player);
        return true;
    }

    public bool Full => Players.Count >= Constants.MaximumPlayerCount;
    public bool ColorTaken(int color) => Players.Any(player => player.Color == color);
}