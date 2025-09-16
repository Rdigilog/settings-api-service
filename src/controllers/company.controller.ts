import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CompanyUpdateDto,
  ShiftSettingDto,
  DigiTimeSettingDto,
  HolidayRequestRuleSettingDto,
  BreakComplianceSettingDto,
} from 'src/models/company/company.dto';
import { CreateRotaRuleSettingDto } from 'src/models/company/rota-rule.dto';
import {
  CreateLeavePolicyDto,
  UpdateLeavePolicyDto,
} from 'src/models/leave/leave.dto';
import {
  CreateTaskStageDto,
  UpdateTaskStageDto,
} from 'src/models/task/create.dto';
import type { LoggedInUser } from 'src/models/types/user.types';
import { CompanyService } from 'src/services/company.service';
import { LeaveService } from 'src/services/leave.service';
import { TaskService } from 'src/services/task.service';
import { ResponsesService } from 'src/utils/services/responses.service';

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
  ) {}

  @ApiExtraModels(CompanyUpdateDto)
  @RouteName('settings.company.update')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CompanyUpdateDto) }, // pull in DTO schema
        {
          type: 'object',
          properties: {
            banner: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @Patch('')
  async updateCompany(
    @Body() payload: CompanyUpdateDto,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.update(
        payload,
        user.userRole[0].companyId as string,
      );
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
  async company(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getcompany(user.userRole[0].companyId as string);
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
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setShiftSetting(
        payload,
        user.userRole[0].companyId as string,
      );
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
  async companyShiftSetting(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getShiftSetting(
        user.userRole[0].companyId as string,
      );
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
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setRotaRule(
        payload,
        user.userRole[0].companyId as string,
      );
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
  async companyRotaRule(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getRotaRule(user.userRole[0].companyId as string);
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
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setDigiTimetSetting(
        payload,
        user.userRole[0].companyId as string,
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
  async companyDigiTimeSetting(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getDigiTimetSetting(
        user.userRole[0].companyId as string,
      );
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
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setHolidayRequestSetting(
        payload,
        user.userRole[0].companyId as string,
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
  async companyHolidayRequest(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getHolidayRequestSetting(
        user.userRole[0].companyId as string,
      );
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
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setBreaks(
        payload,
        user.userRole[0].companyId as string,
      );
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
  async companyBreaks(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getBreaks(user.userRole[0].companyId as string);
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
    @AuthUser() user: LoggedInUser,
    @Body() dto: CreateLeavePolicyDto,
  ) {
    try {
      const result = await this.leaveService.createLeavePolicy(
        user.userRole[0].companyId as string,
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

  @Get('leave-policy')
  @ApiOperation({ summary: 'Get all leave policies for the company' })
  async findAllLeavePolicy(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.leaveService.findAllLeavePolicy(
        user.userRole[0].companyId as string,
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

  @Get('leave-policy/:id')
  @ApiOperation({ summary: 'Get a single leave policy by ID' })
  async findOneLeavePolicy(
    @AuthUser() user: LoggedInUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      const result = await this.leaveService.findOneLeavePolicy(
        user.userRole[0].companyId as string,
        id,
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

  @Patch('leave-policy/:id')
  @ApiOperation({ summary: 'Update a leave policy' })
  async updateLeavePolicy(
    @AuthUser() user: LoggedInUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeavePolicyDto,
  ) {
    try {
      const result = await this.leaveService.updateLeavePolicy(
        user.userRole[0].companyId as string,
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
    @AuthUser() user: LoggedInUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      const result = await this.leaveService.removeLeavePolicy(
        user.userRole[0].companyId as string,
        id,
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

  @RouteName('company.task-stage.create')
  @Post()
  @ApiOperation({ summary: 'Create a new task stage' })
  async createStage(
    @AuthUser() user: LoggedInUser,
    @Body() dto: CreateTaskStageDto,
  ) {
    try {
      const result = await this.taskService.createStage(
        user.userRole[0].companyId as string,
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
  @Get()
  @ApiOperation({ summary: 'List all task stages for the company' })
  async listStages(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.taskService.listStages(
        user.userRole[0].companyId as string,
      );

      if (result.error == 2) return this.responseService.exception(result.body);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('company.task-stage.update')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task stage' })
  async updateStage(
    @AuthUser() user: LoggedInUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskStageDto,
  ) {
    try {
      const result = await this.taskService.updateStage(
        user.userRole[0].companyId as string,
        id,
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
}
