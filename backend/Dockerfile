# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine as build-env
WORKDIR /build-backend

Copy ./backend.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release --no-restore -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /backend
COPY --from=build-env /build-backend/out .

EXPOSE 3001
ENTRYPOINT ["dotnet", "backend.dll"]
