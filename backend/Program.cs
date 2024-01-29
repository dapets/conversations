using System.Text.Json.Serialization;
using backend.Entities;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DevContext>();
builder.Services.Configure<JsonOptions>(options =>
{
    // options.SerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
}

var app = builder.Build();

app.MapGet("/chats", (DevContext db) => db
    .Users
    .Include(u => u.Chats)
    .ThenInclude(c => c.Members)
    .First());

app.Run();
