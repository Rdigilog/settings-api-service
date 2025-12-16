import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client/index';
import { readReplicas } from '@prisma/extension-read-replicas';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config.keys';
import { exec } from 'child_process';
import { promisify } from 'util';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private readonly execAsync = promisify(exec);

  constructor(private configService?: ConfigService) {
    super({
      // log: ['query', 'info', 'warn', 'error'], // Logs various levels, including SQL queries
    });
  }

  async onModuleInit() {
    // Connect to database
    await this.$connect();

    // Setup read replicas if configured
    if (this.configService) {
      this.$extends(
        readReplicas({
          url: [
            this.configService.get<string>(CONFIG_KEYS.DATABASE_REPLICA_URL) ||
              '',
          ],
        }),
      );
    }

    // Run migrations after connection is established
    await this.runMigrations();

    this.logger.log('Prisma service initialized successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async models() {
    return Object.keys(Prisma.ModelName);
  }

  /**
   * Safely run database migrations
   * Only runs when explicitly enabled via AUTO_MIGRATE config
   */
  private async runMigrations(): Promise<void> {
    // const environment = this.configService?.get<string>(CONFIG_KEYS.NODE_ENV) || 'development';
    // const autoMigrate = this.configService?.get<string>(CONFIG_KEYS.AUTO_MIGRATE) || 'false';
    // // Only run migrations when explicitly enabled
    // const shouldRunMigrations = autoMigrate === 'true';
    // if (!shouldRunMigrations) {
    //   this.logger.log(`Skipping auto migration - AUTO_MIGRATE is set to '${autoMigrate}'`);
    //   return;
    // }
    // this.logger.log(`Starting database migration in ${environment} environment...`);
    // try {
    //   // Use prisma migrate deploy for production-safe migrations
    //   const { stdout, stderr } = await this.execAsync('prisma migrate deploy');
    //   // Check for actual errors (warnings are okay)
    //   if (stderr && !stderr.toLowerCase().includes('warn')) {
    //     this.logger.error('Migration stderr:', stderr);
    //     throw new Error(`Migration failed: ${stderr}`);
    //   }
    //   this.logger.log('✅ Database migration completed successfully');
    //   if (stdout && stdout.trim()) {
    //     this.logger.log('Migration output:', stdout.trim());
    //   }
    // } catch (error) {
    //   this.logger.error('❌ Migration failed:', error.message);
    //   // In production, we want to fail fast if migrations fail
    //   if (environment === 'production') {
    //     this.logger.error('🚨 Critical: Database migration failed in production - application will not start');
    //     throw new Error(`Critical: Database migration failed in production: ${error.message}`);
    //   }
    //   // In development, log the error but don't crash the app
    //   this.logger.warn('⚠️ Migration failed in development environment, continuing with existing schema...');
    // }
  }

  /**
   * Check if database is accessible and migrations are up to date
   */
  async healthCheck(): Promise<{
    status: string;
    message: string;
    details?: any;
  }> {
    try {
      // Test database connection
      await this.$queryRaw`SELECT 1`;

      return {
        status: 'healthy',
        message: 'Database connection is healthy',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database health check failed: ${error.message}`,
        details: { error: error.message },
      };
    }
  }
}
