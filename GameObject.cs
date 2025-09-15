public class GameObject
{
	public List<MonoUpdater> updaters = new List<MonoUpdater>();
	public GameObject()
	{
		;
	}
	public void addUpdater(MonoUpdater upd)
	{
		updaters.Add(new MonoUpdater(this));
	}
}