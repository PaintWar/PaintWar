using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class MenuHub : Hub
    {
        public async Task NewMatch()
        {
            Match match = State.matchCreate();
            // should add user to the match, but we can figure that out later
            // when we add some kind of login system
            await Clients.Caller.SendAsync("JoinMatch", match.id);
        }

        public async Task JoinMatch(String matchId)
        {
            if (!State.matchExists(matchId))
            {
                await Clients.Caller.SendAsync("JoinFailed");
            }
            else
            {
                // should add user to the match, but we can figure that out later
                // when we add some kind of login system
                await Clients.Caller.SendAsync("JoinMatch", matchId);
            }
        }
    }
}