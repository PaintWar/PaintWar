public class ExampleUpdater : MonoUpdater
{
	void Start()
	{
		Console.WriteLine("I get called once at the start!");
	}
	void Update()
	{
		Console.WriteLine("I get called every time when a frame is rendered, so you should mostly use me for taking the player's inputs.");
	}
	void FixedUpdate()
	{
		Console.WriteLine("I run in fixed time intervals, which makes me useful for physics calculations.");
	}
}