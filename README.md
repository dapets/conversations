## Tech stack
- Frontend
  - React with Next.js 14
- Backend
  - C# 12 with .NET 8
  - ASP.NET Core 8
  - EF Core
  - SQLite
  - Caddyserver (for automatic https and as a reverse-proxy.)
## Setting up a development environment
### Frontend
Next.js 14 requires a Node.js version >= 18.17. The project was developed with v21.6.1.

A compatible Node.js version can be found [here](https://nodejs.org/en/download/current).

You also need to install the pnpm package manager. Install via `npm install -g pnpm`.

`cd` to the `frontend/` folder and start the dev server with `pnpm run dev`.

### Backend
Download and install .NET 8 from [here](https://dotnet.microsoft.com/en-us/download/dotnet/8.0).

`cd` to the `backend/` folder and start the API with `dotnet watch run`.

## Deploying
Deployment is done via [Docker Compose V2](https://docs.docker.com/compose/migrate/#what-are-the-differences-between-compose-v1-and-compose-v2). The easiest way to install docker is via Docker Desktop. You can find installation instructions [here](https://docs.docker.com/engine/install/).

Once you have docker installed you can spin up the backend, frontend and caddy by running `docker compose up` in the project's root directory.

The project is currently hosted under [https://conversation-demo.de](https://conversation-demo.de) using a Hetzner CCX13.
