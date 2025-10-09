using Microsoft.AspNetCore.SignalR;
using PaintWar.Hubs;

public static class State
{
    public static List<Match> Matches { get; } = new List<Match>();
    public static List<Lobby> Lobbies { get; } = new List<Lobby>();

    public static Match? Match(string id) => Matches.FirstOrDefault((match) => match.Id == id);
    public static Lobby? Lobby(string id) => Lobbies.FirstOrDefault((lobby) => lobby.Id == id);

    public static bool MatchExists(string id) => Matches.Any((match) => match.Id == id);
    public static bool MatchExists(Match match) => MatchExists(match.Id);
    public static bool LobbyExists(string id) => Lobbies.Any((lobby) => lobby.Id == id);
    public static bool LobbyExists(Lobby lobby) => LobbyExists(lobby.Id);

    public static bool? LobbyFull(string id) => Lobby(id)?.Full;

    public static Match StartMatch(Lobby lobby, IHubContext<GameHub> hubContext)
    {
        Console.WriteLine("Creating match");
        Match NewMatch = new Match(lobby, hubContext);
        Matches.Add(NewMatch);
        Console.WriteLine(Matches.Count);
        return NewMatch;
    }

    public static Lobby NewLobby()
    {
        Lobby NewLobby = new Lobby();

        while (LobbyExists(NewLobby))
        {
            NewLobby = new Lobby();
        }

        Lobbies.Add(NewLobby);
        return NewLobby;
    }
}