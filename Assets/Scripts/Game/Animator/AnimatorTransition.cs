public readonly struct AnimatorTransition
{
    public string To { get; }
    public Func<bool> Condition { get; }

    public AnimatorTransition(string to, Func<bool> condition)
        => (To, Condition) = (to, condition);
}