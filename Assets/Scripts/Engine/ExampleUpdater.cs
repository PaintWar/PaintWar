public class ExampleUpdater : MonoUpdater
{
	public override void Start()
	{
		//Console.WriteLine("I get called once at the start!");
	}
	public override void Update()
	{
		//Console.WriteLine("I get called every time when a frame is rendered, so you should mostly use me for taking the player's inputs.");
	}
	public override void FixedUpdate()
	{
		//Console.WriteLine("I run in fixed time intervals, which makes me useful for physics calculations.");
	}
}