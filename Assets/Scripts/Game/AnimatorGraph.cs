public class AnimatorGraph
{
    public string CurrentAnimation { get; private set; }
    private Dictionary<string, List<AnimatorTransition>> transitions = new();

    public AnimatorGraph(string initiaAnimation) => CurrentAnimation = initiaAnimation;

        public void AddTransition(string from, string to, Func<bool> condition)
        {
            if (!transitions.ContainsKey(from))
            {
                transitions[from] = new List<AnimatorTransition>();
            }
            transitions[from].Add(new AnimatorTransition(to, condition));
        }

    public void Update()
    {
        if (!transitions.ContainsKey(CurrentAnimation)) return;

        foreach (AnimatorTransition transition in transitions[CurrentAnimation])
        {
            if (transition.Condition())
            {
                CurrentAnimation = transition.To;
            }
        }
        
    }
    
}