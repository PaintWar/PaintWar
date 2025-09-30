public class Player
{
    public string Id { get; }
    public string Name { get; }
    public int Number { get; }
    public Player(string id, string name, int number) => (Id, Name, Number) = (id, name, number);
}