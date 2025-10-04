using System.Diagnostics;
public class Time
{
	public float previousTime = 0;
	public float deltaTime = 0;
	public float fixedDeltaTime = 0.02f; //in seconds
	public void getDeltaTime()
	{
		float T = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f);
		deltaTime = T - previousTime;
		previousTime = T;
	}
}