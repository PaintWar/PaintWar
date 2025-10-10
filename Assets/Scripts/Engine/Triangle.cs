public class Triangle
{
	public Vector3 A = new Vector3();
	public Vector3 B = new Vector3();
	public Vector3 C = new Vector3();
    public float area;
	public Triangle(Vector3 A, Vector3 B, Vector3 C)
	{
		this.A = A;
		this.B = B;
		this.C = C;
		if(A==B||B==C||C==A)
		{
			Console.WriteLine("ERROR: Triangle with zero area!");
			System.Environment.Exit(-1);
		}
        area = Physics2D.CrossProduct(B-A,C-B).Length()/2;
	}
	public float Area() //unsigned area
	{
		return area;
	}
}
