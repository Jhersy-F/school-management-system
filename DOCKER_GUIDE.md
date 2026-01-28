# Docker Guide for School Management System

This guide explains how to use Docker with your Nuxt/Vue application.

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on Windows
- Basic understanding of Docker concepts

## 🏗️ Project Structure

```
school-management-system/
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build with hot-reload
├── docker-compose.yml      # Orchestrates app + database
├── .dockerignore          # Files to exclude from Docker
└── .env.docker            # Example environment variables
```

## 🚀 Quick Start

### Development Mode (Recommended for Development)

1. **Start the application with hot-reload:**
   ```bash
   docker-compose --profile dev up
   ```

2. **Access your application:**
   - App: http://localhost:3000
   - Database: localhost:5432

3. **Stop the application:**
   ```bash
   docker-compose --profile dev down
   ```

### Production Mode

1. **Build and start:**
   ```bash
   docker-compose --profile prod up --build
   ```

2. **Stop:**
   ```bash
   docker-compose --profile prod down
   ```

## 🛠️ Common Commands

### View running containers
```bash
docker ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app-dev
docker-compose logs -f db
```

### Rebuild containers
```bash
# Development
docker-compose --profile dev up --build

# Production
docker-compose --profile prod up --build
```

### Access container shell
```bash
# App container
docker exec -it school-app-dev sh

# Database container
docker exec -it school-db psql -U postgres -d school_management
```

### Run database migrations
```bash
# Inside the app container
docker exec -it school-app-dev npm run db:migrate

# Or from host (if you have node_modules)
docker-compose --profile dev exec app-dev npm run db:migrate
```

### Clean up everything
```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes (⚠️ deletes database data)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root (or copy `.env.docker`):

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=school_management
DB_PORT=5432
NODE_ENV=development
PORT=3000
```

### Database Connection

When running in Docker, use this connection string:
```
postgresql://postgres:postgres@db:5432/school_management
```

**Note:** `db` is the service name from `docker-compose.yml`

## 📝 Key Concepts

### Multi-Stage Builds (Production)
The production `Dockerfile` uses multi-stage builds:
1. **deps** - Installs dependencies
2. **builder** - Builds the Nuxt app
3. **runner** - Runs the optimized build (smallest image)

### Hot-Reload (Development)
The development setup mounts your source code as volumes, so changes are reflected immediately without rebuilding.

### Profiles
Docker Compose profiles let you run different configurations:
- `dev` - Development mode with hot-reload
- `prod` - Production mode with optimized build

### Health Checks
The database service has a health check to ensure it's ready before the app starts.

## 🐛 Troubleshooting

### Port already in use
If port 3000 or 5432 is already in use:
```bash
# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

### Database connection failed
1. Check if database is healthy:
   ```bash
   docker ps
   ```
   Look for "healthy" status

2. View database logs:
   ```bash
   docker-compose logs db
   ```

### Hot-reload not working
1. Ensure volumes are mounted correctly in `docker-compose.yml`
2. Restart the container:
   ```bash
   docker-compose --profile dev restart app-dev
   ```

### Permission issues (Linux/Mac)
```bash
# Fix ownership
sudo chown -R $USER:$USER .
```

### Clean slate restart
```bash
# Stop everything
docker-compose down -v

# Remove images
docker rmi school-management-system-app-dev
docker rmi school-management-system-app

# Start fresh
docker-compose --profile dev up --build
```

## 🎯 Best Practices

1. **Use `.dockerignore`** - Keeps images small and builds fast
2. **Environment variables** - Never commit `.env` files
3. **Named volumes** - Persist database data between restarts
4. **Health checks** - Ensure services are ready before connecting
5. **Multi-stage builds** - Smaller production images
6. **Non-root user** - Better security in production

## 📚 Next Steps

1. **Add database migrations** to your startup script
2. **Configure CI/CD** to build Docker images
3. **Use Docker secrets** for sensitive data in production
4. **Set up monitoring** with Docker logs
5. **Consider Kubernetes** for production orchestration

## 🔗 Useful Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nuxt Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

## 💡 Tips

- Use `docker-compose --profile dev up -d` to run in detached mode (background)
- Use `docker-compose logs -f app-dev` to follow logs in real-time
- Keep your Docker images updated: `docker-compose pull`
- Monitor resource usage: `docker stats`
