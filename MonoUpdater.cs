public class MonoUpdater
{
	GameObject gameObject;
	public MonoUpdater(GameObject obj)
	{
		gameObject = obj;
	}
	public void Start();
	public void Update();
	public void FixedUpdate();
}