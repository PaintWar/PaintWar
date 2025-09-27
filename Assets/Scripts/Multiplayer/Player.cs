public class Player
{
    public string Id { get; set; }
    public int Number { get; set; }
    public LifePaint LifePaint { get; }

    public Player(string id, int number)
    {
        this.Id = id;
        this.Number = number;
        this.LifePaint = new LifePaint();
    }

    public void RewardLifePaint(int amount) => LifePaint.Add(amount);

    public bool TrySpendLifePaint(int cost) => LifePaint.Spend(cost);
}
