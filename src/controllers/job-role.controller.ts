/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthComapny } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  AssignJobRoleDto,
  CreateJobRoleDto,
} from 'src/models/company/job-role.dto';
import type { activeCompaany } from 'src/models/types/user.types';
import { JobRoleService } from 'src/services/job-role.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('job-role')
@ApiTags('Job Role')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
export class JobRoleController {
  constructor(
    private readonly service: JobRoleService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('job-role.list')
  @ApiOperation({ summary: 'List all job roles with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get()
  async list(
    @AuthComapny() company: activeCompaany,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      if (!company) {
        return this.responseService.badRequest('No company specified');
      }
      const result = await this.service.list(
        company.id,
        page,
        size,
        search,
        sortBy,
        sortDirection,
      );
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('job-role.create')
  @ApiOperation({ summary: 'Create a new job role' })
  @Post()
  async create(
    @AuthComapny() company: activeCompaany,
    @Body() payload: CreateJobRoleDto,
  ) {
    try {
      if (!company) {
        return this.responseService.badRequest('No company specified');
      }
      const result = await this.service.create(payload, company.id);
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      if (result.error == 1) {
        return this.responseService.badRequest(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('job-role.update')
  @ApiOperation({ summary: 'Update job role information' })
  @Patch(':jobRoleId')
  @Put(':jobRoleId')
  async update(
    // @AuthUser() user: LoggedInUser,
    @Body() payload: Partial<CreateJobRoleDto>,
    @Param('jobRoleId') id: string,
  ) {
    try {
      const result = await this.service.update(payload, id);
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      if (result.error == 1) {
        return this.responseService.badRequest(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('job-role.delete')
  @ApiOperation({ summary: 'delete job role information' })
  @Delete(':jobRoleId')
  async deleteJobRole(
    // @AuthUser() user: LoggedInUser,
    @Param('jobRoleId') id: string,
  ) {
    try {
      const result = await this.service.delete(id);
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      if (result.error == 1) {
        return this.responseService.badRequest(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Post(':jobRoleId/assign')
  @ApiOperation({ summary: 'Assign job role to multiple users' })
  @ApiParam({
    name: 'jobRoleId',
    description: 'The ID of the job role to assign',
    type: String,
    example: 'c3b84f6b-543e-48b0-9a6c-49c875d3a3ef',
  })
  @ApiBody({
    type: AssignJobRoleDto,
    description: 'List of user IDs to assign this job role to',
  })
  async assignJobRole(
    @Param('jobRoleId') jobRoleId: string,
    @Body() dto: AssignJobRoleDto,
  ) {
    try {
      const result = await this.service.assignJobRole(jobRoleId, dto.userIds);
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      if (result.error == 1) {
        return this.responseService.badRequest(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
