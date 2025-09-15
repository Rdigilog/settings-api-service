import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config.keys';

export const QueueConfig: any = BullModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    connection: {
      url: `${configService.get<string>(CONFIG_KEYS.REDIS_URL)}/1`,
    },
    defaultJobOptions: {
      removeOnComplete: 1000,
      removeOnFail: 5000,
      attempts: 3,
    },
  }),
});
