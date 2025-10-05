using System.Diagnostics;
public class GameLoop
{
	private readonly List<GameObject> gameObjects = new List<GameObject>();
    private readonly CancellationTokenSource cts = new();
    private readonly Time time = new();
    public void AddGameObject(GameObject obj) => gameObjects.Add(obj);
    public List<GameObject> GetGameObjects() { return gameObjects; }
	public void Start()
    {
        //Example Updater
        GameObject g = new GameObject();
        g.addUpdater(new ExampleUpdater());
        gameObjects.Add(g);

        time.previousTime = (float)Stopwatch.GetTimestamp() / (float)TimeSpan.TicksPerMillisecond / 1000f;
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
                time.getDeltaTime();
                float timeNow = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f); // <-- delete this when rendering works
                foreach (GameObject obj in gameObjects)
                {
                    foreach (MonoUpdater upd in obj.updaters)
                    {
                        upd.Update();
                    }
                }
                float updatedTime = (float)Stopwatch.GetTimestamp() / (float)(Stopwatch.Frequency / 1000f); // <-- delete this when rendering works
                if (updatedTime - timeNow < time.fixedDeltaTime * 1000f)                                        //
                {                                                                                          //
                    Thread.Sleep((int)((1000f * time.fixedDeltaTime) - (updatedTime - timeNow)));          //
                }     
            }
        }, cts.Token);
    }

    public Task RunFixedUpdate()
    {
        return Task.Run(() =>
        {   
            float accumulator = 0;
            float timeNow = (float)Stopwatch.GetTimestamp() / (float)Stopwatch.Frequency;
            while (!cts.Token.IsCancellationRequested)
            {
                float updatedTime = (float)Stopwatch.GetTimestamp() / (float)Stopwatch.Frequency;
                accumulator += (updatedTime - timeNow);
                timeNow = updatedTime;
                while(accumulator >= time.fixedDeltaTime)
                {
                    foreach (GameObject obj in gameObjects)
                    {
                        foreach (MonoUpdater upd in obj.updaters)
                        {
                            upd.FixedUpdate();
                        }
                    }
                    accumulator -= time.fixedDeltaTime;
                }
                
                Thread.Sleep((int)(Math.Max(1000 * (time.fixedDeltaTime - accumulator), 0)));
            }
        }, cts.Token);
	}
}