using PaintWar.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapHub<MenuHub>("/menuHub");

GameLoop.globalStart();

Thread web = new Thread(app.Run);
Thread t1 = new Thread(GameLoop.globalUpdate);
Thread t2 = new Thread(GameLoop.globalFixedUpdate);

t1.Start();
t2.Start();
web.Start();
