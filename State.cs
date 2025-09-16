public static class State
{
    public static List<Match> matches = new List<Match>();

    public static bool matchExists(string matchId) => matches.Contains(new Match(matchId));

    public static void createMatch(string matchId) => matches.Add(new Match(matchId));
}
