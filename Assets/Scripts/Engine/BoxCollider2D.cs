public class BoxCollider2D : Collider2D
{
	public BoxCollider2D(Vector2 BL, Vector2 UR)
	{
		triangles.Add(new Triangle(BL, new Vector2(BL.x, UR.y), new Vector2(UR.x, BL.y)));
		triangles.Add(new Triangle(UR, new Vector2(BL.x, UR.y), new Vector2(UR.x, BL.y)));
	}
}