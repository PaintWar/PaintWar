List<GameObject> gameObjects = new List<GameObject>();

void globalStart()
{
	Time.previousTime = (float)Stopwatch.GetTimestamp() / (float)TimeSpan.TicksPerMillisecond / 1000f;
	foreach (GameObject obj in gameObjects)
	{
		foreach (MonoUpdater upd in obj.updaters)
		{
			upd.Start();
		}
	}
}

void globalUpdate()
{
	Time.getDeltaTime();
	foreach (GameObject obj in gameObjects)
	{
		foreach (MonoUpdater upd in obj.updaters)
		{
			upd.Update();
		}
	}
}

void globalFixedUpdate()
{
	while (True)
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
		Thread.Sleep((1000f * Time.fixedDeltaTime) - (updatedTime - timeNow));
	}
}

globalStart();

Thread t1 = new Thread(globalUpdate);
Thread t2 = new Thread(globalFixedUpdate);

t1.Start();
t2.Start();