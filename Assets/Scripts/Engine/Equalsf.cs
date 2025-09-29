public static class Equalsf
{
	public const float Epsilon = 1e-32f;
	public static bool EQ(this float a, float b)
	{
		return Math.Abs(a-b)<Epsilon;
	}
	public static bool NEQ(this float a, float b)
	{
		return Math.Abs(a-b)>=Epsilon;
	}
}