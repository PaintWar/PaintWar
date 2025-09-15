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
		int nth_upd = 0;
		while (true)
		{
			Time.getDeltaTime();
			foreach (GameObject obj in gameObjects)
			{
				foreach (MonoUpdater upd in obj.updaters)
				{
					upd.Update();
				}
			}
			++nth_upd;
			//if (nth_upd % 50 == 0) Console.WriteLine("update");
		}
	}

	public static void globalFixedUpdate()
	{
		int nth_fupd = 0;
		while (true)
		{
			float timeNow = (float)Stopwatch.GetTimestamp() / (float)TimeSpan.TicksPerMillisecond;
			foreach (GameObject obj in gameObjects)
			{
				foreach (MonoUpdater upd in obj.updaters)
				{
					upd.FixedUpdate();
				}
			}
			float updatedTime = (float)Stopwatch.GetTimestamp() / (float)TimeSpan.TicksPerMillisecond;
			Thread.Sleep((int)((1000f * Time.fixedDeltaTime) - (updatedTime - timeNow)));
			++nth_fupd;
			if (nth_fupd % 50 == 0) Console.WriteLine("fixed update");
		}
	}
}