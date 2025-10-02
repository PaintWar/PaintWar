public class PolygonCollider2D : Collider2D
{
	public PolygonCollider2D(List<Vector2>points)
	{
		triangles=Physics2D.Triangulate(points);
	}
	public PolygonCollider2D(List<Triangle>triangles)
	{
		this.triangles=triangles;
	}
}