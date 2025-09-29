public class Collider2D : MonoUpdater
{
	public long enterMask = 0;
	public long collisionMask = 0;
	public bool isTrigger = false;
	public List<Collider2D> enteredTriggers = new List<Collider2D>();
	public List<Collider2D> stayingTriggers = new List<Collider2D>();
	public List<Triangle> triangles = new List<Triangle>();
	public void enterTrigger(Collider2D other)
	{
		if (!enteredTriggers.Contains(other))
		{
			enteredTriggers.Add(other);
		}
	}
	public void processTriggers()
	{
		foreach (Collider2D col in enteredTriggers)
		{
			if (!stayingTriggers.Contains(col)) onTriggerEnter2D(col);
			else onTriggerStay2D(col);
		}
		foreach (Collider2D col in stayingTriggers)
		{
			if (!enteredTriggers.Contains(col)) onTriggerExit2D(col);
		}
		stayingTriggers.Clear();
		foreach (Collider2D col in enteredTriggers)
		{
			stayingTriggers.Add(col);
		}
		enteredTriggers.Clear();
	}
	public bool Collide(Collider2D other)
	{
		foreach (Triangle t1 in this.triangles)
		{
			foreach (Triangle t2 in other.triangles)
			{
				if (Physics2D.OverlapTriangles2D(t1, t2)) return true;
			}
		}
		return false;
	}
	public virtual void onTriggerEnter2D(Collider2D other)
	{

	}
	public virtual void onTriggerStay2D(Collider2D other)
	{

	}
	public virtual void onTriggerExit2D(Collider2D other)
	{

	}
}