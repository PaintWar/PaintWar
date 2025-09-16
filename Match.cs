public class Match : IEquatable<Match>
{
    public string id { get; set; }
    public List<Player> players = new List<Player>();

    public Match() => this.id = randomId();

    public Match(string matchId) => this.id = matchId;

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

    public bool Equals(Match? other) => other is not null && this.id == other.id;
}