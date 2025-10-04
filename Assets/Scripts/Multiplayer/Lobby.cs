public class Lobby
{
    public string Id { get; }
    public List<Player> Players { get; } = new List<Player>();

    public Lobby() => Id = Utils.RandomId();

    public bool AddPlayer(string privateId, string publicId, string name, int number)
    {
        if (Full)
        {
            return false;
        }

        if (Players.Any((player) => player.PrivateId == privateId || player.PublicId == publicId))
        {
            return false;
        }

        Players.Add(new Player(privateId, publicId, name, number));
        return true;
    }

    public bool Full => Players.Count >= Constants.MaximumPlayerCount;
}