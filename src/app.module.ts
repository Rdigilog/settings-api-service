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
import { StatusInterceptor } from './interceptors/status.interceptor';
import { BranchController } from './controllers/branch.controller';
import { CompanyController } from './controllers/company.controller';
import { EmployeeController } from './controllers/employee.controller';
import { JobRoleController } from './controllers/job-role.controller';
import { BranchService } from './services/branch.service';
import { EmployeeService } from './services/employee.service';
import { CompanyService } from './services/company.service';
import { JobRoleService } from './services/job-role.service';
import { LeaveService } from './services/leave.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import { PrismaService } from './config/prisma.service';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

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
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema,
      isGlobal: true,
    }),
    HttpModule,
    UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions),
  ],
  controllers: [
    BranchController,
    CompanyController,
    JobRoleController,
    EmployeeController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusInterceptor,
    },
    BranchService,
    EmployeeService,
    CompanyService,
    JobRoleService,
    LeaveService,
    TaskService,
    UserService,
    PrismaService
  ],
})
export class AppModule {}
