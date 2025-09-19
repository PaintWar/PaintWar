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
		updaters.Add(upd);
		if(upd.gameObject!=null)
		{
			Console.WriteLine("WARNING: overriding the assigned GameObject of a MonoUpdater!");
		}
		upd.gameObject=this;
	}
	public MonoUpdater? GetComponent<T>()
	{
		foreach(MonoUpdater upd in updaters)
		{
			if(upd.GetType()==typeof(T))return upd;
		}
		return null;
	}
}