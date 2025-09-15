public class MonoUpdater
{
	GameObject? gameObject;
	public MonoUpdater()
	{
		;
	}
	public MonoUpdater(GameObject obj)
	{
		gameObject = obj;
	}
	public virtual void Start()
	{
		Console.WriteLine("You shouldn't be seeing this!");
	}
	public virtual void Update()
	{

	}
	public virtual void FixedUpdate()
	{
		Console.WriteLine("You shouldn't be seeing this!");
	}
}