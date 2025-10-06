using System.Diagnostics;
public static class GameLoop
{
	public static List<GameObject> gameObjects = new List<GameObject>();

	public static void globalStart()
	{
		//Example Updater
		/*GameObject g = new GameObject();
		g.addUpdater(new ExampleUpdater());
		gameObjects.Add(g);*/

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
				for (int i=0; i<gameObjects.Count; ++i)
				{
					foreach (MonoUpdater upd in gameObjects[i].updaters)
					{
						upd.FixedUpdate();
					}
					//if this GameObject has a collider, update its collision mask
					#pragma warning disable CS8602, CS8604
					Collider2D? col1 = gameObjects[i].GetComponent<Collider2D>();
					if (col1)
					{
						if (col1.isTrigger == false)
						{
							for (int j = i + 1; j < gameObjects.Count; ++j)
							{
								Collider2D? col2 = gameObjects[j].GetComponent<Collider2D>();
								if (col2 && col1.Collide(col2))
								{
									if (col1.isTrigger || col2.isTrigger)
									{
										if (col1.isTrigger) col2.enterTrigger(col1);
										if (col2.isTrigger) col1.enterTrigger(col2);
									}
									else
									{
										for (int k = 0; k < Physics2D.MAX_LAYERS; ++k)
										{
											if ((col1.gameObject.physicsLayerMask & (1L << k)) != 0) col2.enterMask |= (1L << k);
											if ((col2.gameObject.physicsLayerMask & (1L << k)) != 0) col1.enterMask |= (1L << k);
										}
									}
								}
							}
							col1.collisionMask = col1.enterMask;
							col1.enterMask = 0;
							col1.processTriggers();
						}
					}
					#pragma warning restore CS8602, CS8604
				}
				accumulator -= Time.fixedDeltaTime;
			}
			
			Thread.Sleep((int)(Math.Max(((1000f * Time.fixedDeltaTime) - accumulator), 0)));
		}
	}
}