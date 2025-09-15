public class GameObject
{
	Transform transform;
	public List<MonoUpdater> updaters = new List<MonoUpdater>();
	public GameObject()
	{
		transform = new Transform();
	}
	public void addUpdater(MonoUpdater upd)
	{
		updaters.Add(new MonoUpdater(this));
	}
}