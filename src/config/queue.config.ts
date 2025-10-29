import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config.keys';

export const QueueConfig = BullModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    connection: {
      url: `${configService.get<string>('REDIS_URL')}`,
    },
    defaultJobOptions: {
      removeOnComplete: 1000,
      removeOnFail: 5000,
      attempts: 3,
    },
  }),
});
