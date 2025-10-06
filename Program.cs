using PaintWar.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapHub<MenuHub>("/menuHub");
app.MapHub<LobbyHub>("/lobbyHub");
app.MapHub<GameHub>("/gameHub");

GameLoop.globalStart();

Thread web = new Thread(app.Run);
Thread t1 = new Thread(GameLoop.globalUpdate);
Thread t2 = new Thread(GameLoop.globalFixedUpdate);

t1.Start();
t2.Start();
web.Start();
