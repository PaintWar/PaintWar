public class Transform
{
	public GameObject? gameObject;
	List<Transform> childTree = new List<Transform>();
	public int childCount = 0;
	public Vector3? position = new Vector3(0, 0, 0);
	public Vector3? rotation = new Vector3(0, 0, 0);
	public Vector3? scale = new Vector3(1, 1, 1);

	public void addChild(Transform t)
	{
		childTree.Add(t);
		childCount++;
	}
	public Transform? getChild(int index)
	{
		if ((index < childCount - 1) || (index < 0))
		{
			Console.WriteLine("WARNING: Trying to access child out of bounds!");
			return null;
		}
		return childTree[index];
	}
}