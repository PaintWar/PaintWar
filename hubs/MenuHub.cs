using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class MenuHub : Hub
    {
        public async Task NewMatch()
        {
            Match match = State.matchCreate();
            await Clients.Caller.SendAsync("JoinMatch", match.Id);
        }

        public async Task JoinMatch(String matchId)
        {
            if (!State.matchExists(matchId))
            {
                await Clients.Caller.SendAsync("JoinFailed");
            }
            else
            {
                await Clients.Caller.SendAsync("JoinMatch", matchId);
            }
        }
    }
}