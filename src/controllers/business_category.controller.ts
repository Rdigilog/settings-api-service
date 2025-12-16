/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  // Patch,
  Post,
  // Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
  // ApiParam,
  // ApiBody
} from '@nestjs/swagger';
import { AuthComapny, AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import {
  CreateJobRoleDto,
  // AssignJobRoleDto,
} from 'src/models/company/job-role.dto';
import type { activeCompaany, LoggedInUser } from 'src/models/types/user.types';
import { BusinessCategoryService } from 'src/services/business_category.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('business-category')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
@Controller('business-category')
export class BusinessCategoryController {
  constructor(
    private readonly service: BusinessCategoryService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('business-category.list')
  @ApiOperation({ summary: 'List all job roles with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get()
  async list(
    @AuthUser() user: LoggedInUser,
    @AuthComapny() company: activeCompaany,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
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

  @RouteName('business-category.create')
  @ApiOperation({ summary: 'Create a new job role' })
  @Post()
  async create(
    @AuthUser() user: LoggedInUser,
    @Body() payload: CreateJobRoleDto,
  ) {
    try {
      const result = await this.service.create(
        payload,
        user.userRole[0].companyId as string,
      );
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

  @RouteName('business-category.delete')
  @ApiOperation({ summary: 'delete job role information' })
  @Delete(':businessCategoryId')
  async deleteJobRole(
    @AuthUser() user: LoggedInUser,
    @Param('businessCategoryId') id: string,
  ) {
    try {
      const result = await this.service.delete(
        id,
        user.userRole[0].companyId as string,
      );
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
