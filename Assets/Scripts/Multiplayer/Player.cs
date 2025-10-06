public class Player
{
    public string PrivateId { get; }
    public string PublicId { get; }
    public string Name { get; }
    public int Number { get; }
    public bool IsReady = false;

    public string? ConnectionId { get; set; }

    public Player(string privateId, string publicId, string name, int number)
        => (PrivateId, PublicId, Name, Number) = (privateId, publicId, name, number);
}