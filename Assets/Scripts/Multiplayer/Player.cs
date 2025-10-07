public class Player
{
    public string PrivateId { get; }
    public string PublicId { get; }
    public string Name { get; }
    public int Color { get; set; }

    public Player(string privateId, string publicId, string name, int color)
        => (PrivateId, PublicId, Name, Color) = (privateId, publicId, name, color);
}