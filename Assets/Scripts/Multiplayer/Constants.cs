public static class Constants
{
    // Can probably use an enum for colors
    public static readonly int[] Colors = { 0xff0000, 0x00ff00, 0x0000ff, 0x008000, 0xffff00, 0xffa500, 0xffc0cb };
    public static readonly int MaximumPlayerCount = Colors.Count();

    public const string ValidIdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    public const int IdLength = 5;
}