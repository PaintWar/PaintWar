public struct Vector2
{
	public float x;
	public float y;
	public Vector2(float x, float y)
	{
		this.x = x;
		this.y = y;
	}
	public Vector2()
	{
		x = 0;
		y = 0;
	}
	public static implicit operator Vector3(Vector2 vec)
	{
		return new Vector3(vec.x,vec.y,0);
	}
	public float Length()
	{
		return (float)Math.Sqrt((x * x) + (y * y));
	}
	public static Vector2 operator -(Vector2 vec)
	{
		return new Vector2(-vec.x, -vec.y);
	}
	public static Vector2 operator +(Vector2 v1, Vector2 v2)
	{
		return new Vector2(v1.x + v2.x, v1.y + v2.y);
	}
	public static Vector2 operator -(Vector2 v1, Vector2 v2)
	{
		return new Vector2(v1.x - v2.x, v1.y - v2.y);
	}
	public static bool operator ==(Vector2 v1, Vector2 v2)
	{
		return (v1.x==v2.x) && (v1.y==v2.y);
	}
	public static bool operator !=(Vector2 v1, Vector2 v2)
	{
		return !(v1==v2);
	}
	/*public override bool Equals(object obj)
	{
		if(obj==null)return false;
		if(obj.GetType()!=typeof(Vector3))return false;
		Vector2? other = obj as Vector2?;
		return (x==other.x)&&(y==other.y);
	}
	public override int GetHashCode()
	{
		return (int)x;
	}*/
}