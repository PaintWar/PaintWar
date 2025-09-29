public struct Vector3
{
	public float x;
	public float y;
	public float z;
	public Vector3(float x, float y, float z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
	public Vector3()
	{
		x = 0;
		y = 0;
		z = 0;
	}
	public static implicit operator Vector2(Vector3 vec)
	{
		return new Vector2(vec.x,vec.y);
	}
	public float Length()
	{
		return (float)Math.Sqrt((x * x) + (y * y) + (z * z));
	}
	public static Vector3 operator -(Vector3 vec)
	{
		return new Vector3(-vec.x, -vec.y, vec.z);
	}
	public static Vector3 operator +(Vector3 v1, Vector3 v2)
	{
		return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
	}
	public static Vector3 operator -(Vector3 v1, Vector3 v2)
	{
		return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
	}
	public static bool operator ==(Vector3 v1, Vector3 v2)
	{
		return (v1.x==v2.x) && (v1.y==v2.y) && (v1.z==v2.z);
	}
	public static bool operator !=(Vector3 v1, Vector3 v2)
	{
		return !(v1==v2);
	}
	/*public override bool Equals(object obj)
	{
		if(obj==null)return false;
		if(obj.GetType()!=typeof(Vector3?))return false;
		Vector3? other = obj as Vector3?;
		return (x==other.x)&&(y==other.y)&&(z==other.z);
	}
	public override int GetHashCode()
	{
		return (int)x;
	}*/
}