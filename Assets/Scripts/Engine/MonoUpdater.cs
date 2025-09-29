public class MonoUpdater
{
	public GameObject? gameObject;
	public MonoUpdater()
	{
		gameObject = null;
	}
	public MonoUpdater(GameObject obj)
	{
		obj.addUpdater(this);
	}
	public virtual void Start()
	{
		
	}
	public virtual void Update()
	{
		
	}
	public virtual void FixedUpdate()
	{
		
	}
	public static implicit operator bool(MonoUpdater? obj)
	{
		return obj!=null;
	}
}