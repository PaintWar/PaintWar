public static class Utils
{
    private static Random Rand = new Random();

    // Returns a random ID. Does not check whether the ID exists already.
    public static string RandomId()
    {
        char[] NewId = new char[Constants.IdLength];

        for (int i = 0; i < Constants.IdLength; i++)
            NewId[i] = Constants.ValidIdChars[Rand.Next(Constants.ValidIdChars.Length)];

        return new String(NewId);
    }
}