var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

GameLoop.globalStart();

Thread web = new Thread(app.Run);
Thread t1 = new Thread(GameLoop.globalUpdate);
Thread t2 = new Thread(GameLoop.globalFixedUpdate);

t1.Start();
t2.Start();
web.Start();
