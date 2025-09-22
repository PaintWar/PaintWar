using System.Diagnostics;
public static class GameLoop
{
	static List<GameObject> gameObjects = new List<GameObject>();

	public static void globalStart()
	{
		//Example Updater
		GameObject g = new GameObject();
		g.addUpdater(new ExampleUpdater());
		gameObjects.Add(g);

		Time.previousTime = (float)Stopwatch.GetTimestamp() / (float)TimeSpan.TicksPerMillisecond / 1000f;
		foreach (GameObject obj in gameObjects)
		{
			foreach (MonoUpdater upd in obj.updaters)
			{
				upd.Start();
			}
		}
	}

	public static void globalUpdate()
	{
		while (true)
		{
			Time.getDeltaTime();
			float timeNow = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f); // <-- delete this when rendering works
			foreach (GameObject obj in gameObjects)
			{
				foreach (MonoUpdater upd in obj.updaters)
				{
					upd.Update();
				}
			}
			float updatedTime = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f); // <-- delete this when rendering works
			if(updatedTime-timeNow < Time.fixedDeltaTime*1000f)                                        //
			{                                                                                          //
				Thread.Sleep((int)((1000f * Time.fixedDeltaTime) - (updatedTime - timeNow)));          //
			}                                                                                          //
		}
	}

	public static void globalFixedUpdate()
	{
		float accumulator = 0;
		float timeNow = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f);
		while (true)
		{
			float updatedTime = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f);
			accumulator += (updatedTime - timeNow);
			timeNow = updatedTime;
			
			while(accumulator >= Time.fixedDeltaTime)
			{
				foreach (GameObject obj in gameObjects)
				{
					foreach (MonoUpdater upd in obj.updaters)
					{
						upd.FixedUpdate();
					}
				}
				accumulator -= Time.fixedDeltaTime;
			}
			
			Thread.Sleep((int)(Math.Max(((1000f * Time.fixedDeltaTime) - accumulator), 0)));
		}
	}
}