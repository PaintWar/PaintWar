public class Lobby
{
    public string Id { get; }
    public List<Player> Players { get; } = new List<Player>();

    public Lobby() => Id = Utils.RandomId();

    public bool AddPlayer(Player player)
    {
        if (Full)
        {
            return false;
        }

        if (Players.Any((p) => p.Id == player.Id))
        {
            return false;
        }

        Players.Add(player);
        return true;
    }

    public bool Full => Players.Count >= Constants.MaximumPlayerCount;
}