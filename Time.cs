using System.Diagnostics;
public static class Time
{
	public static float previousTime = 0;
	public static float deltaTime = 0;
	public static float fixedDeltaTime = 0.02f; //in seconds
	public static void getDeltaTime()
	{
		float T = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f);
		deltaTime = T - previousTime;
		previousTime = T;
	}
}