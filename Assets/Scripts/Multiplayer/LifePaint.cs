public class LifePaint
{
    private int _amount;
    public int Amount => _amount;

    public void Add(int value) => _amount += value;

    public bool Spend(int cost)
    {
        if (_amount >= cost)
        {
            _amount -= cost;
            return true;
        }

        return false;
    }
}