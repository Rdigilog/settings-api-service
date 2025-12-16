/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  // Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  // UploadedFile,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  // ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  // getSchemaPath,
} from '@nestjs/swagger';
import { AuthComapny } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CompanyUpdateDto,
  ShiftSettingDto,
  DigiTimeSettingDto,
  HolidayRequestRuleSettingDto,
  BreakComplianceSettingDto,
  ActivityTrackingSettingDto,
  NotificationSettingDto,
} from 'src/models/company/company.dto';
import { CreateRotaRuleSettingDto } from 'src/models/company/rota-rule.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateLeavePolicyDto,
  UpdateLeavePolicyDto,
} from 'src/models/leave/leave.dto';
import {
  CreateTaskStageDto,
  UpdateTaskStageDto,
} from 'src/models/task/create.dto';
import type { activeCompaany } from 'src/models/types/user.types';
import { CompanyService } from 'src/services/company.service';
import { LeaveService } from 'src/services/leave.service';
import { TaskService } from 'src/services/task.service';
import { FileUploadService } from 'src/utils/services/file-upload.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { EmployeeSettingDto } from 'src/models/company/employee.dto';

@ApiTags('Company')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
@Controller('company')
export class CompanyController {
  constructor(
    private readonly service: CompanyService,
    private readonly responseService: ResponsesService,
    private readonly leaveService: LeaveService,
    private readonly taskService: TaskService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  // @UseInterceptors(FileInterceptor('banner'))
  // @ApiConsumes('multipart/form-data')
  @RouteName('settings.company.update')
  @ApiExtraModels(CompanyUpdateDto)
  // @ApiBody({
  //   schema: {
  //     allOf: [
  //       { $ref: getSchemaPath(CompanyUpdateDto) }, // pull in DTO schema
  //       {
  //         type: 'object',
  //         properties: {
  //           banner: { type: 'string', format: 'binary' },
  //         },
  //       },
  //     ],
  //   },
  // })
  @Patch('')
  async updateCompany(
    @Body() payload: CompanyUpdateDto,
    @AuthComapny() company: activeCompaany,
    // @UploadedFile() banner: Express.Multer.File,
    // @AuthUser() user: LoggedInUser,
  ) {
    try {
      // if (banner) {
      //   // this.fileRemovalQueue.add('REMOVE_PROFILE_PIC', profile?.imageUrl);
      //   const fileUploadResult =
      //     await this.fileUploadService.uploadPicture(banner);
      //   // console.log(fileUploadResult)
      //   payload.bannerUrl = fileUploadResult.url;
      // }
      if (payload['banner']) {
        delete payload['banner'];
      }
      const result = await this.service.update(payload, company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.get')
  @ApiOperation({ summary: 'Get company information' })
  @Get()
  async company(@AuthComapny() company: activeCompaany) {
    try {
      const result = await this.service.getcompany(company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.shift.update')
  @ApiOperation({ summary: 'Update company shift settings' })
  @Patch('shift')
  async updateCompanyShiftSetting(
    @Body() payload: ShiftSettingDto,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.setShiftSetting(payload, company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.shift.get')
  @ApiOperation({ summary: 'Get company shift settings' })
  @Get('shift')
  async companyShiftSetting(@AuthComapny() company: activeCompaany) {
    try {
      const result = await this.service.getShiftSetting(company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.rota-rule.update')
  @ApiOperation({ summary: 'Update company rota rule settings' })
  @Patch('rota-rule')
  async updateCompanyRotaRule(
    @Body() payload: CreateRotaRuleSettingDto,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.setRotaRule(payload, company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.rota-rule.get')
  @ApiOperation({ summary: 'Get company rota rule settings' })
  @Get('rota-rule')
  async companyRotaRule(@AuthComapny() company: activeCompaany) {
    try {
      const result = await this.service.getRotaRule(company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.digi-time.update')
  @ApiOperation({ summary: 'Update company digital time settings' })
  @Patch('digi-time')
  async updateDigiTimeSetting(
    @Body() payload: DigiTimeSettingDto,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.setDigiTimetSetting(
        payload,
        company.id,
      );
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.digi-time.get')
  @ApiOperation({ summary: 'Get company digital time settings' })
  @Get('digi-time')
  async companyDigiTimeSetting(@AuthComapny() company: activeCompaany) {
    try {
      const result = await this.service.getDigiTimetSetting(company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.holiday-request.update')
  @ApiOperation({ summary: 'Update company holiday request settings' })
  @Patch('holiday-request')
  async updateHolidayRequest(
    @Body() payload: HolidayRequestRuleSettingDto,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.setHolidayRequestSetting(
        payload,
        company.id,
      );
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.holiday-request.get')
  @ApiOperation({ summary: 'Get company holiday request settings' })
  @Get('holiday-request')
  async companyHolidayRequest(@AuthComapny() company: activeCompaany) {
    try {
      const result = await this.service.getHolidayRequestSetting(company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.breaks.update')
  @ApiOperation({ summary: 'Update company break compliance settings' })
  @Patch('breaks')
  async updateBreaks(
    @Body() payload: BreakComplianceSettingDto,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.setBreaks(payload, company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.breaks.get')
  @ApiOperation({ summary: 'Get company break compliance settings' })
  @Get('breaks')
  async companyBreaks(
    // @AuthUser() user: LoggedInUser,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.getBreaks(company.id);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Post('leave-policy')
  @ApiOperation({ summary: 'Create a new leave policy' })
  async createLeavePolicy(
    @AuthComapny() company: activeCompaany,
    @Body() dto: CreateLeavePolicyDto,
  ) {
    try {
      const result = await this.leaveService.createLeavePolicy(company.id, dto);

      if (result.error === 2)
        return this.responseService.exception(result.body);
      if (result.error === 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get('leave-policy')
  @ApiOperation({ summary: 'Get all leave policies for the company' })
  async findAllLeavePolicy(
    // @AuthUser() user: LoggedInUser
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.leaveService.findAllLeavePolicy(company.id);

      if (result.error === 2)
        return this.responseService.exception(result.body);
      if (result.error === 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get('leave-policy/:id')
  @ApiOperation({ summary: 'Get a single leave policy by ID' })
  async findOneLeavePolicy(
    @AuthComapny() company: activeCompaany,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      const result = await this.leaveService.findOneLeavePolicy(company.id, id);

      if (result.error === 2)
        return this.responseService.exception(result.body);
      if (result.error === 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('leave-policy/:id')
  @ApiOperation({ summary: 'Update a leave policy' })
  async updateLeavePolicy(
    @AuthComapny() company: activeCompaany,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeavePolicyDto,
  ) {
    try {
      const result = await this.leaveService.updateLeavePolicy(
        company.id,
        id,
        dto,
      );

      if (result.error === 2)
        return this.responseService.exception(result.body);
      if (result.error === 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Delete('leave-policy/:id')
  @ApiOperation({ summary: 'Delete a leave policy' })
  async removeLeavePolicy(
    @AuthComapny() company: activeCompaany,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      const result = await this.leaveService.removeLeavePolicy(company.id, id);

      if (result.error === 2)
        return this.responseService.exception(result.body);
      if (result.error === 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.task-stage.create')
  @Post('task-stage')
  @ApiOperation({ summary: 'Create a new task stage' })
  async createStage(
    @AuthComapny() company: activeCompaany,
    @Body() dto: CreateTaskStageDto,
  ) {
    try {
      const result = await this.taskService.createStage(company.id, dto);

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.task-stage.list')
  @Get('task-stage')
  @ApiOperation({ summary: 'List all task stages for the company' })
  async listStages(@AuthComapny() company: activeCompaany) {
    try {
      const result = await this.taskService.listStages(company.id);

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.task-stage.create')
  @Patch('notification-setting')
  @ApiOperation({ summary: 'Create a new task stage' })
  async updateCompanyNotificationSetting(
    @AuthComapny() company: activeCompaany,
    @Body() dto: NotificationSettingDto,
  ) {
    try {
      const companyId = company.id;
      const result = await this.service.updatecompanyNotification(
        companyId,
        dto,
      );

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.task-stage.list')
  @Get('notification-setting')
  @ApiOperation({ summary: 'List all task stages for the company' })
  async getCompanyNotificationSetting(@AuthComapny() company: activeCompaany) {
    try {
      const result = await this.service.getNotificationSetting(company.id);

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
  @RouteName('company.task-stage.create')
  @Patch('activity-tracking')
  @ApiOperation({ summary: 'Create a new task stage' })
  async updateActivitiyTrackingSetting(
    @AuthComapny() company: activeCompaany,
    @Body() dto: ActivityTrackingSettingDto,
  ) {
    try {
      const companyId = company.id;
      const result = await this.service.updateActivityTrackingSetting(
        companyId,
        dto,
      );

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.task-stage.list')
  @Get('activity-tracking')
  @ApiOperation({ summary: 'List all task stages for the company' })
  async getActivityTracking(
    // @AuthUser() user: LoggedInUser,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.getActivityTrackingSetting(company.id);

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.payrate.update')
  @Patch('/employees')
  @ApiOperation({ summary: 'Update a Pay rate' })
  @ApiBody({ type: [EmployeeSettingDto] })
  async updatePayRate(
    @AuthComapny() company: activeCompaany,
    @Body() dto: EmployeeSettingDto[],
  ) {
    try {
      const result = await this.service.updatePayRate(dto, company.id);

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.task-stage.update')
  @Patch('task-stage/:id')
  @ApiOperation({ summary: 'Update a task stage' })
  async updateStage(
    @AuthComapny() company: activeCompaany,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskStageDto,
  ) {
    try {
      const result = await this.taskService.updateStage(company.id, id, dto);

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
