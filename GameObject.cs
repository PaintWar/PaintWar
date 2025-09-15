public class GameObject
{
	public List<MonoUpdater> updaters = new List<MonoUpdater>();
	public void addUpdater(MonoUpdater upd)
	{
		updaters.add(new MonoUpdater(this));
	}
}