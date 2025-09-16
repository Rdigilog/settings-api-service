# Database Migration Guide

This guide explains how to safely manage database migrations in the DigiLog Settings API Service.

## Overview

The application now includes **safe auto migration** capabilities that automatically run database migrations on startup when configured appropriately. This ensures your database schema stays in sync with your application code.

## Migration Features

### ✅ Safe Auto Migration

- **Environment-aware**: Only runs in production or when explicitly enabled
- **Fail-safe**: Graceful error handling with proper logging
- **Health monitoring**: Built-in health checks for migration status
- **Production-ready**: Uses `prisma migrate deploy` for safe production migrations

### ✅ Migration Scripts

Added convenient npm scripts for database management:

```bash
# Generate Prisma client
pnpm run db:generate

# Deploy migrations (production-safe)
pnpm run db:migrate

# Create and apply new migration (development)
pnpm run db:migrate:dev

# Reset database and apply all migrations
pnpm run db:migrate:reset

# Push schema changes without creating migration files
pnpm run db:push

# Seed the database
pnpm run db:seed

# Open Prisma Studio
pnpm run db:studio
```

## Configuration

### Environment Variables

| Variable               | Default       | Description                                         |
| ---------------------- | ------------- | --------------------------------------------------- |
| `AUTO_MIGRATE`         | `false`       | Enable auto migration on startup                    |
| `NODE_ENV`             | `development` | Environment mode (production, staging, development) |
| `DATABASE_URL`         | -             | Primary database connection string                  |
| `DATABASE_URL_REPLICA` | -             | Read replica connection string                      |

### Auto Migration Behavior

Auto migration runs when:

- `AUTO_MIGRATE=true`

```bash
# Enable auto migration in development
AUTO_MIGRATE=true

# Production automatically enables auto migration
NODE_ENV=production
```

## Usage Scenarios

### Development Environment

```bash
# 1. Make schema changes in prisma/schema.prisma
# 2. Create migration
pnpm run db:migrate:dev

# 3. Or push changes directly (no migration file)
pnpm run db:push
```

### Production Deployment

```bash
# 1. Build the application
pnpm run build

# 2. Deploy with auto migration enabled
AUTO_MIGRATE=true NODE_ENV=production pnpm run start:prod

# Or use Docker (auto migration enabled by default)
docker-compose -f docker-compose.prod.yml up -d
```

### Docker Deployment

The Docker configuration includes:

- **Multi-stage build** with Prisma client generation
- **Health checks** for database connectivity
- **Auto migration** enabled by default in production
- **Proper dependency ordering** (database ready before app starts)

```bash
# Build and run with Docker
docker-compose -f docker-compose.prod.yml up -d

# Check health status
curl http://localhost:3000/api/v1/health
```

## Health Monitoring

### Health Check Endpoints

- `GET /api/v1/health` - Overall service health
- `GET /api/v1/health/db` - Database-specific health check

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "status": "healthy",
    "message": "Database connection and migrations are healthy",
    "details": {
      "migrationStatus": "Database is up to date!"
    }
  },
  "uptime": 3600,
  "memory": {
    "rss": 45678912,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1234567
  }
}
```

## Migration Best Practices

### 1. Development Workflow

```bash
# 1. Make schema changes
# Edit prisma/schema.prisma

# 2. Create migration
pnpm run db:migrate:dev

# 3. Review generated migration file
# Check prisma/migrations/[timestamp]_[name]/migration.sql

# 4. Test the migration
pnpm run db:migrate:reset
pnpm run db:seed
```

### 2. Production Deployment

```bash
# 1. Test migrations locally first
pnpm run db:migrate:dev

# 2. Build for production
pnpm run build

# 3. Deploy with auto migration
AUTO_MIGRATE=true pnpm run start:prod
```

### 3. Schema Changes

**Safe Changes:**

- Adding new optional fields
- Adding new tables
- Adding new indexes
- Adding new enums

**Requires Care:**

- Dropping columns (ensure no data loss)
- Changing column types
- Adding required fields (provide defaults)
- Renaming columns/tables

**Dangerous Changes:**

- Dropping tables
- Changing primary keys
- Complex data transformations

### 4. Migration Files

Always review generated migration files before applying:

```sql
-- Good: Adding optional field
ALTER TABLE "users" ADD COLUMN "new_field" TEXT;

-- Good: Adding new table
CREATE TABLE "new_table" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "new_table_pkey" PRIMARY KEY ("id")
);

-- Requires review: Changing column type
ALTER TABLE "users" ALTER COLUMN "age" TYPE INTEGER USING "age"::INTEGER;
```

## Troubleshooting

### Common Issues

#### 1. Migration Fails on Startup

```bash
# Check logs
docker logs digilog-app-prod

# Manual migration
docker exec -it digilog-app-prod npx prisma migrate deploy

# Check migration status
docker exec -it digilog-app-prod npx prisma migrate status
```

#### 2. Database Connection Issues

```bash
# Check database health
curl http://localhost:3000/api/v1/health/db

# Test connection manually
docker exec -it digilog-app-prod npx prisma db pull
```

#### 3. Schema Drift

```bash
# Reset and reapply all migrations
pnpm run db:migrate:reset

# Or push current schema
pnpm run db:push
```

### Recovery Procedures

#### 1. Failed Migration in Production

```bash
# 1. Check migration status
npx prisma migrate status

# 2. If migration is partially applied, resolve manually
# 3. Mark migration as resolved
npx prisma migrate resolve --applied [migration_name]

# 4. Continue with remaining migrations
npx prisma migrate deploy
```

#### 2. Database Rollback

```bash
# 1. Create rollback migration
# 2. Apply rollback
npx prisma migrate deploy

# 3. Or reset to previous state
npx prisma migrate reset
```

## Security Considerations

### 1. Database Access

- Use read replicas for queries when possible
- Limit migration permissions to necessary operations
- Use connection pooling for production

### 2. Migration Safety

- Always backup production database before migrations
- Test migrations on staging environment first
- Use transactions for complex migrations
- Monitor migration execution time

### 3. Environment Isolation

- Separate databases for development, staging, and production
- Use different migration strategies per environment
- Never run development migrations on production

## Monitoring and Alerting

### 1. Health Checks

Set up monitoring for:

- Database connectivity
- Migration status
- Application startup time
- Memory usage

### 2. Logging

Monitor logs for:

- Migration execution
- Database connection issues
- Health check failures
- Performance metrics

### 3. Alerts

Configure alerts for:

- Migration failures
- Database connectivity issues
- Health check failures
- Unusual migration execution times

## Conclusion

The safe auto migration system provides:

- ✅ **Automatic schema synchronization**
- ✅ **Environment-aware execution**
- ✅ **Comprehensive error handling**
- ✅ **Health monitoring**
- ✅ **Production-ready deployment**

This ensures your database schema stays in sync with your application code while maintaining safety and reliability across all environments.
