using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SIGAI.Configuracion;
using SIGAI.Data;
using SIGAI.Models.Entidades;
using SIGAI.Services;
using SIGAI.Services.Interfaces;
using SIGAI.Filters;

var builder = WebApplication.CreateBuilder(args);

// Conexión DB
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<SIGAIDbContext>(options =>
    options.UseSqlServer(connectionString));

// Identity
builder.Services.AddIdentity<Usuario, Rol>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
})
    .AddEntityFrameworkStores<SIGAIDbContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Auth/Login";
    options.LogoutPath = "/Auth/Logout";
    options.AccessDeniedPath = "/Auth/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
    options.Cookie.IsEssential = true;
});

// Servicios personalizados
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserClaimsPrincipalFactory<Usuario>, AppClaimsPrincipalFactory>();
builder.Services.AddScoped<IAuditoriaServicio, AuditoriaServicio>();

// Configuración Dashboard (mapeo desde appsettings.json)
builder.Services.Configure<DashboardOptions>(
    builder.Configuration.GetSection("DashboardOptions"));

// MVC + filtros
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<AuditoriaFiltro>();
});
builder.Services.AddRazorPages();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Rutas
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

// Inicialización y seed
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<SIGAIDbContext>();
        await context.Database.MigrateAsync();
        await SeedInicial.InicializarAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error durante la inicialización de la base de datos");
    }
}

app.Run();
