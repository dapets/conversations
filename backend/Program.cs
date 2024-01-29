using System.Text.Json.Serialization;
using backend.Entities;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DevContext>();
builder.Services.Configure<JsonOptions>(options =>
{
    // options.SerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    // options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
}

var app = builder.Build();

app.MapGet("/chats", (DevContext db) => db
    .Chats
    .Include(c => c.Members)
    .Where(c => c.Members.Any(m => m.Id == 145))
    .Select(c => c.Members)
);

app.Run();
