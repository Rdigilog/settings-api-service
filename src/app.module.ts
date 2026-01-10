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
import { HealthController } from './controllers/health.controller';
import { BranchService } from './services/branch.service';
import { EmployeeService } from './services/employee.service';
import { CompanyService } from './services/company.service';
import { JobRoleService } from './services/job-role.service';
import { LeaveService } from './services/leave.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import { PrismaService } from './config/prisma.service';
import configuration from './config/configuration';
// import { validationSchema } from './config/validation.schema';
import { BusinessCategoryService } from './services/business_category.service';
import { BusinessCategoryController } from './controllers/business_category.controller';
import { FileController } from './controllers/file.controller';
import { SupportService } from './services/support.service';
import { SupportController } from './controllers/support.controller';
import { DocumentCategoryService } from './services/document-category.service';
import { DocumentCategoryController } from './controllers/document-category.controller';
import { DocumentService } from './services/document.service';
import { DocumentController } from './controllers/document.controller';
import { ComplianceDocumentService } from './services/compliance-document.service';
import { ComplianceDocumentController } from './controllers/compliance-document.controller';
import { CourseService } from './services/course.service';
import { CourseController } from './controllers/course.controller';
import { OnboardingService } from './services/onboarding.service';
import { OnboardingController } from './controllers/onboarding.controller';
// import { OnboardingStepService } from './services/onboarding-step.service';
// import { OnboardingStepController } from './controllers/onboarding-step.controller';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   // rootPath: join(__dirname, '..', 'uploads'),
    //   rootPath: './public',
    //   serveRoot: '/public',
    // }),
    ConfigModule.forRoot({
      load: [configuration],
      // validationSchema,
      isGlobal: true,
      cache: true, // Cache the configuration to avoid repeated AWS calls
    }),
    QueueConfig,
    JwtConfig,
    MailConfig,
    HttpModule,
    UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions),
  ],
  controllers: [
    BranchController,
    CompanyController,
    JobRoleController,
    EmployeeController,
    HealthController,
    BusinessCategoryController,
    FileController,
    SupportController,
    DocumentCategoryController,
    DocumentController,
    ComplianceDocumentController,
    CourseController,
    OnboardingController,
    // OnboardingStepController,
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
    PrismaService,
    BusinessCategoryService,
    SupportService,
    DocumentCategoryService,
    DocumentService,
    ComplianceDocumentService,
    CourseService,
    OnboardingService,
    // OnboardingStepService,
  ],
})
export class AppModule {}
