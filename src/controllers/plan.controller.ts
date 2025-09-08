import { AuthGuard } from '@app/guard/auth.guard';
import { FeatureDto, PlanDto } from '@app/model/plans/plan.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouteName } from 'libs/decorators/route-name.decorator';
import { PlanService } from 'packages/repository/services/plan.service';

@Controller('plan')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@ApiTags('Plans')
@UseGuards(AuthGuard)
export class PlanController {
  constructor(
    private readonly service: PlanService,
    private readonly responseService: ResponsesService,
  ) {}
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get('')
  @RouteName('plan.list')
  async list(
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const result = await this.service.all(
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

  @Post()
  @RouteName('plan.create')
  async create(@Body() payload: PlanDto) {
    try {
      const result = await this.service.create(payload);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('/:planId')
  @RouteName('plan.update')
  async update(@Body() payload: PlanDto, @Param('planId') planId: string) {
    try {
      const result = await this.service.update(payload, planId);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get('feature')
  @ApiOperation({ summary: 'Get all features (paginated)' })
  @ApiResponse({ status: 200, description: 'List of features with pagination' })
  async all(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('search') search = '',
    @Query('sortBy') sortBy = 'updatedAt',
    @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    return this.service.all(
      Number(page),
      Number(size),
      search,
      sortBy,
      sortDirection,
    );
  }

  @Get('feature/list')
  @ApiOperation({ summary: 'Get simple list of active features' })
  @ApiResponse({ status: 200, description: 'Active features only' })
  async listFeature() {
    return this.service.listFeature();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new feature' })
  @ApiResponse({ status: 201, description: 'Feature created successfully' })
  async createFeature(@Body() payload: FeatureDto) {
    return this.service.createFeature(payload);
  }

  @Patch('feature/:id')
  @ApiOperation({ summary: 'Update an existing feature' })
  @ApiResponse({ status: 200, description: 'Feature updated successfully' })
  async updateFeature(@Param('id') id: string, @Body() payload: FeatureDto) {
    return this.service.updateFeature(payload, id);
  }

  @Delete('feature/:id')
  @ApiOperation({ summary: 'Delete a feature' })
  @ApiResponse({ status: 200, description: 'Feature deleted successfully' })
  async delete(@Param('id') id: string) {
    return this.service.deleteFeature(id);
  }
}
