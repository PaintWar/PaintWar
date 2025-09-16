public class Match
{
    public string id { get; set; }
    public List<Player> players = new List<Player>();

    public Match(string matchId) => this.id = matchId;
}
