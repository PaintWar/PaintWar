public class Player
{
    public string Id { get; }
    public int Number { get; }
    public Player(string id, int number) => (Id, Number) = (id, number);
}