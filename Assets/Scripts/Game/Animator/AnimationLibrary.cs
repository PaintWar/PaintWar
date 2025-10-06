public static class AnimationLibrary
{
    private static Dictionary<string, Func<GameObject, AnimatorGraph>> animations = new()
    {
        {"Example", CreateExampleAnimations}
    };

    public static AnimatorGraph GetAnimator(string type, GameObject obj)
    {
        if (animations.TryGetValue(type, out var factory))
        {
            return factory(obj);
        }
        throw new ArgumentException($"Unknown animation type: {type}");
    }

    private static AnimatorGraph CreateExampleAnimations(GameObject obj)
    {
        AnimatorGraph animator = new AnimatorGraph("Idle");

        var testUpd = obj.GetComponent<TestObjUpdater>() as TestObjUpdater;
        if (testUpd == null)
        {
            testUpd = new TestObjUpdater();
            obj.addUpdater(testUpd);
        }

        animator.AddTransition("Idle", "Walk", () => testUpd.isWalking);
        animator.AddTransition("Walk", "Idle", () => !testUpd.isWalking);

        return animator;
    }
}