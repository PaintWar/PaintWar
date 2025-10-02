public class GameObject
{
	public Transform transform;
	public List<MonoUpdater> updaters = new List<MonoUpdater>();
	public long physicsLayerMask = 0;
	public string? tag = null;
	public GameObject()
	{
		transform = new Transform();
	}
	public void addUpdater(MonoUpdater upd)
	{
		updaters.Add(upd);
		if (upd.gameObject != null)
		{
			Console.WriteLine("WARNING: overriding the assigned GameObject of a MonoUpdater!");
		}
		upd.gameObject = this;
	}
	public T? GetComponent<T>() where T : MonoUpdater
	{
		foreach (object upd in updaters)
		{
			if (upd.GetType() == typeof(T)) return upd as T;
		}
		return null;
	}
	public void setPhysicsLayer(String layer, bool value)
	{
		physicsLayerMask = ((value ? 1L : 0L) << Physics2D.physicsLayers[layer]) | (physicsLayerMask ^ (((physicsLayerMask >> Physics2D.physicsLayers[layer]) & 1) << Physics2D.physicsLayers[layer]));
	}
	public void setPhysicsLayer(int layer, bool value)
	{
		if (layer >= 64 || layer < 0)
		{
			Console.WriteLine("WARNING: physics layer overflow!");
		}
		physicsLayerMask = ((value ? 1L : 0L) << layer) | (physicsLayerMask ^ (((physicsLayerMask >> layer) & 1) << layer));
	}
	public bool CompareTag(string otherTag)
	{
		return tag == otherTag;
	}
	public static implicit operator bool(GameObject? obj)
	{
		return obj!=null;
	}
	//TODO: add Instantiate
	//TODO: add Destroy
}