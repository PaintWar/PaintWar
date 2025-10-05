using Microsoft.AspNetCore.SignalR;
using PaintWar.Hubs;
using System.Runtime.Remoting;

public static class GameObjectFactory
{
    private static Dictionary<string, Func<GameObject, IHubContext<GameHub>, Match, GameObject>> factories = new()
    {
        { "Example", CreateExample }
    };

    public static GameObject Create(string type, IHubContext<GameHub> hubContext, Match match, Vector3 position)
    {
        if (factories.TryGetValue(type, out var factory))
        {
            GameObject obj = new GameObject();
            obj.transform.position = position;
            return factory(obj, hubContext, match);
        }
        throw new ArgumentException($"Unknown object type: {type}");
    }

    private static GameObject CreateExample(GameObject obj, IHubContext<GameHub> hubContext, Match match)
    {
        obj.addUpdater(new TestObjUpdater());

        AnimatorGraph animator = AnimationLibrary.GetAnimator("Example", obj);
        obj.addUpdater(new AnimatorUpdater(animator, hubContext, match));
        return obj;
    }

}