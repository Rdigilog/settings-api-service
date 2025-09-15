// redis-cache.config.ts
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CONFIG_KEYS } from './config.keys';

export const RedisCacheOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      url: `${configService.get<string>(CONFIG_KEYS.REDIS_URL)}/0`, // cache in db 0
    });

    return {
      store: () => store,
      ttl: 60 * 5, // default TTL 5 mins
    };
  },
};
