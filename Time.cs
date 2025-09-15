public static class Time
{
	public float previousTime = 0;
	public float deltaTime = 0;
	public static float fixedDeltaTime = 0.2f;
	public static float getDeltaTime()
	{
		float T = (float)Stopwatch.GetTimestamp() / (float)TimeSpan.TicksPerMillisecond / 1000f;
		deltaTime = T - previousTime;
		previousTime = T;
	}
}