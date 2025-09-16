using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class MenuHub : Hub
    {
        public async Task NewMatch()
        {
            Match match = State.matchCreate();
            // add user to the match
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
                // add user to the match
                await Clients.Caller.SendAsync("JoinMatch", matchId);
            }
        }
    }
}