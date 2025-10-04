public class CircleCollider2D : Collider2D
{
	public CircleCollider2D(float radius, Vector2 offset)
	{
		triangles.Add(new Triangle(new Vector2(radius,0), new Vector2(radius*(float)Math.Cos(2/3*Math.PI), radius*(float)Math.Sin(2/3*Math.PI)), new Vector2(radius*(float)Math.Cos(4/3*Math.PI), radius*(float)Math.Sin(4/3*Math.PI))));
		//add more polygons (fractal-esque)
	}
}