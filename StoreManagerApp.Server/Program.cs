using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register AppDbContext using SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

//  Correct CORS origin based on your frontend port
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactClient", policy =>
    {
        policy.WithOrigins("https://localhost:53302") // ✅ Match your React app port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ✅ Global Exception Handler Middleware
app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
        if (contextFeature != null)
        {
            var errorResponse = new
            {
                error = "Internal Server Error",
                message = contextFeature.Error.Message
            };

            var json = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(json);
        }
    });
});

// Serve static files (if using React build)
app.UseDefaultFiles();
app.UseStaticFiles();

// Use Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Enable CORS early in the pipeline
app.UseCors("AllowReactClient");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Fallback for React Router
app.MapFallbackToFile("/index.html");

app.Run();
