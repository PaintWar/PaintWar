public class Lobby
{
    public string Id { get; }
    public List<Player> Players { get; } = new List<Player>();

    public Lobby() => Id = Utils.RandomId();

    public void AddPlayer(Player player)
    {
        if (!Full)
            Players.Add(player);
    }

    public bool Full => Players.Count >= Constants.MaximumPlayerCount;
}