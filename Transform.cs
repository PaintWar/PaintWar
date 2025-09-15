public class Transform
{
	public GameObject? gameObject;
	List<Transform> childTree = new List<Transform>();
	public int childCount = 0;
	public Vector3? position;
	public Vector3? rotation;
	public Vector3? scale;

	public void addChild(Transform t)
	{
		childTree.Add(t);
		childCount++;
	}
	public Transform getChild(int index)
	{
		if ((index < childCount - 1) || (index < 0))
		{
			Console.WriteLine("Trying to access child out of bounds");
			return null;
		}
		return childTree[index];
	}
}