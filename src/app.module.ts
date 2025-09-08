import { Module } from '@nestjs/common';
import { UtilsModule } from './utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisCacheOptions } from './config/redis.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtConfig } from './config/jwt.config';
import { MailConfig } from './config/mail.config';
import { QueueConfig } from './config/queue.config';
import { PlanController } from './controllers/plan.controller';
import { RoleController } from './controllers/role.controller';
import { TermLegalController } from './controllers/term-legal.controller';
import { StatusInterceptor } from './interceptors/status.interceptor';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   // rootPath: join(__dirname, '..', 'uploads'),
    //   rootPath: './public',
    //   serveRoot: '/public',
    // }),
    QueueConfig,
    JwtConfig,
    MailConfig,
    ConfigModule.forRoot(),
    HttpModule,
    UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions),
  ],
  controllers: [PlanController, RoleController, TermLegalController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusInterceptor,
    },
  ],
})
export class AppModule {}
