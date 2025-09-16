public class Match : IEquatable<Match>
{
    public string id { get; set; }
    public List<Player> players = new List<Player>();

    public Match(string matchId) => this.id = matchId;

    public bool Equals(Match? other) => other is not null && this.id == other.id;
}