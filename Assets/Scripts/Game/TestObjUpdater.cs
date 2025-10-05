public class TestObjUpdater : MonoUpdater
{
    public bool isWalking = false;
    private float timeSinceAnimationChange = 0;
    public override void FixedUpdate()
    {
        timeSinceAnimationChange += 0.02f;
        if (timeSinceAnimationChange >= 4)
        {
            timeSinceAnimationChange = 0;
            isWalking = !isWalking;
        }
    }
}