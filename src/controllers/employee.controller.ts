/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthComapny } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import type { activeCompaany } from 'src/models/types/user.types';
import { EmployeeService } from 'src/services/employee.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('employee')
@ApiTags('Employee')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(
    private readonly service: EmployeeService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('employee.list')
  @ApiOperation({ summary: 'List all employees with pagination and search' })
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
}
