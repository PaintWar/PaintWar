public static class State
{
    public static List<Match> matches = new List<Match>();

    public static bool matchExists(string matchId) => matches.Contains(new Match(matchId));

    public static Match matchGet(string matchId) =>
        matches.Find((Match match) => match == new Match(matchId)) ?? matchCreate();

    public static Match matchCreate()
    {
        Match match;

        do
        {
            match = new Match();
        } while (matches.Contains(match));

        matches.Add(match);
        return match;
    }
}
