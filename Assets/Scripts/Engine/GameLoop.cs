using System.Diagnostics;
public class GameLoop
{
	private readonly List<GameObject> gameObjects = new List<GameObject>();
    private readonly CancellationTokenSource cts = new();
    public void AddGameObject(GameObject obj) => gameObjects.Add(obj);
     
	public void Start()
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
    public void Stop() => cts.Cancel();

    public Task RunUpdate()
    {
        return Task.Run(() =>
        {
            while (!cts.Token.IsCancellationRequested)
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
                if (updatedTime - timeNow < Time.fixedDeltaTime * 1000f)                                        //
                {                                                                                          //
                    Thread.Sleep((int)((1000f * Time.fixedDeltaTime) - (updatedTime - timeNow)));          //
                }     
            }
        }, cts.Token);
    }

    public Task RunFixedUpdate()
    {
        return Task.Run(() =>
        {
            float accumulator = 0;
            float timeNow = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f);
            while (!cts.Token.IsCancellationRequested)
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
        }, cts.Token);
	}
}