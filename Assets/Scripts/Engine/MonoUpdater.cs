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
	public virtual void OnTriggerEnter2D(Collider2D other)
	{

	}
	public virtual void OnTriggerStay2D(Collider2D other)
	{

	}
	public virtual void OnTriggerExit2D(Collider2D other)
	{

	}
	public static implicit operator bool(MonoUpdater? obj)
	{
		return obj is not null;
	}
}