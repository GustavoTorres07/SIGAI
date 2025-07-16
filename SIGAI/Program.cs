using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SIGAI.Data;
using SIGAI.Models.Entidades;
using SIGAI.Services;               // Asegúrate de usar el namespace correcto
using SIGAI.Services.Interfaces;  // Para la interfaz IAuditoriaServicio

var builder = WebApplication.CreateBuilder(args);

// -------------------- Base de Datos --------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<SIGAIDbContext>(options =>
    options.UseSqlServer(connectionString,
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }));

// -------------------- Identity --------------------
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

    // Duración de la cookie si RememberMe = true
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;

    // Importante: la cookie solo será persistente si RememberMe = true (por defecto)
    options.Cookie.IsEssential = true;
});

// Aquí registrás tu clase personalizada para ClaimsPrincipalFactory
builder.Services.AddScoped<IUserClaimsPrincipalFactory<Usuario>, AppClaimsPrincipalFactory>();

// -------------------- Servicios MVC y Filtros --------------------
builder.Services.AddControllersWithViews(options =>
{
});

builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<SIGAI.Filters.AuditoriaFiltro>();
});

builder.Services.AddRazorPages();

// -------------------- Servicios de Auditoría --------------------
builder.Services.AddHttpContextAccessor(); // Necesario para obtener datos del contexto actual

// Aquí registras tu servicio de auditoría (Scoped para que viva por petición HTTP)
builder.Services.AddScoped<IAuditoriaServicio, AuditoriaServicio>();

var app = builder.Build();

// -------------------- Middleware Pipeline --------------------
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

// -------------------- Rutas --------------------
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

// -------------------- Inicialización DB + Seed --------------------
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