using Microsoft.AspNetCore.SignalR;

namespace PaintWar.Hubs
{
    public class MenuHub : Hub
    {
        public async Task JoinGame(String matchId)
        {
            Console.WriteLine(matchId);

            if (!State.matchExists(matchId))
            {
                State.createMatch(matchId);
            }

            // add user to the match
            await Clients.Caller.SendAsync("JoinGame", matchId);
        }
    }
}