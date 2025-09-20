public static class State
{
    public static List<Match> matches = new List<Match>();

    public static bool matchExists(string matchId) => matches.Any(m => m.Id == matchId);

    public static Match matchGet(string matchId) => matches.FirstOrDefault(m => m.Id == matchId) ?? matchCreate();

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
