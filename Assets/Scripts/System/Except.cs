public class UnassignedBehaviourException : Exception
{
	public UnassignedBehaviourException() : base()
	{
		Console.WriteLine("ERROR: Attempting to execute a Behaviour with no assigned GameObject!");
	}
	public UnassignedBehaviourException(string message) : base(message)
	{

	}
	public UnassignedBehaviourException(string message, Exception inner) : base(message, inner)
	{

	}
}