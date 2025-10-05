public class GameObject
{
    string id;
    public string? type;
    public string Id => id;
	public Transform transform;
	public List<MonoUpdater> updaters = new List<MonoUpdater>();
	public GameObject()
	{
        id = Guid.NewGuid().ToString(); 
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