import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client/index';
import { readReplicas } from '@prisma/extension-read-replicas';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config.keys';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService?: ConfigService) {
    super({
      // log: ['query', 'info', 'warn', 'error'], // Logs various levels, including SQL queries
    });
  }
  
  async onModuleInit() {
    await this.$connect();
    if (this.configService) {
      await this.$extends(
        readReplicas({
          url: [this.configService.get<string>(CONFIG_KEYS.DATABASE_REPLICA_URL) || ''],
        }),
      );
    }
    // console.log(Prisma.ModelName);
    // this.$on(Prisma., (e) => {
    //   console.log(e);
    // });
    // this.$on('query', (e) => {
    //   console.log('Query:', e.query); // Logs the SQL query
    //   console.log('Params:', e.params); // Logs the actual parameters
    //   console.log('Duration:', e.duration); // Optional: Logs query duration
    // });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async models() {
    return Object.keys(Prisma.ModelName);
  }
}
