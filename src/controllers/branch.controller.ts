import {
  Controller,
  Request,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateBranchDto,
  AssignBranchUserDto,
} from 'src/models/branch/branch.dto';
import type { LoggedInUser } from 'src/models/types/user.types';
import { BranchService } from 'src/services/branch.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@ApiTags('Branch')
@Controller('branch')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
export class BranchController {
  constructor(
    private readonly service: BranchService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('branch.list')
  @ApiOperation({ summary: 'List all branches with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get()
  async list(
    @AuthUser() user: LoggedInUser,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const result = await this.service.list(
        user.userRole[0].companyId as string,
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

  @RouteName('branch.create')
  @ApiOperation({ summary: 'Create a new branch' })
  @Post()
  async create(@Request() req, @Body() payload: CreateBranchDto) {
    try {
      const result = await this.service.create(payload, req.user.company.id);
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

  @RouteName('branch.assign')
  @ApiOperation({ summary: 'Assign users to a branch' })
  @Patch(':branchId/assign')
  async assignToBranch(
    @Body() payload: AssignBranchUserDto,
    @Param('branchId') branchId: string,
  ) {
    try {
      const result = await this.service.assingToBranch(payload, branchId);
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

  @RouteName('branch.unassign')
  @ApiOperation({ summary: 'Unassign users from a branch' })
  @Delete(':branchId/unassign')
  async removeFromBranch(
    @Body() payload: AssignBranchUserDto,
    @Param('branchId') branchId: string,
  ) {
    try {
      const result = await this.service.removeFromBranch(payload, branchId);
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

  @RouteName('branch.update')
  @ApiOperation({ summary: 'Update branch information' })
  @Patch(':branchId')
  @Put(':branchId')
  async update(
    @Body() payload: Partial<CreateBranchDto>,
    @Param('branchId') id: string,
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
}
