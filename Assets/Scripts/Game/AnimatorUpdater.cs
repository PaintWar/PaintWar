using Microsoft.AspNetCore.SignalR;
using PaintWar.Hubs;

public class AnimatorUpdater : MonoUpdater
{
    private AnimatorGraph animator;
    private IHubContext<GameHub> hubContext;
    private Match match;
    public AnimatorUpdater(AnimatorGraph animator, IHubContext<GameHub> hubContext, Match match)
    {
        this.animator = animator;
        this.hubContext = hubContext;
        this.match = match;
    }
    public string CurrentAnimation => animator.CurrentAnimation;

    public override void Update()
    {
        string previous = animator.CurrentAnimation;
        animator.Update();
        if (previous != animator.CurrentAnimation)
        {
            hubContext.Clients.Group("Game-" + match.Id).SendAsync("AnimationChanged", gameObject!.Id, animator.CurrentAnimation);
        }
    }
}