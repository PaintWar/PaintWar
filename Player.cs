public class Player
{
    public string Id { get; set; }
    public int Number { get; set; }
    public Player(string id, int number)
    {
        this.Id = id;
        this.Number = number;
    }
}
