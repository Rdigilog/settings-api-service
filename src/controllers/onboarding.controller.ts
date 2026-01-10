/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthComapny } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateOnboardingDto,
  UpdateOnboardingDto,
} from 'src/models/onboarding-flow/create.dto';
import type { activeCompaany } from 'src/models/types/user.types';
import { OnboardingService } from 'src/services/onboarding.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('onboarding')
@ApiTags('Onboarding')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class OnboardingController {
  constructor(
    private readonly service: OnboardingService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('onboarding.list')
  @Get()
  async list(
    @AuthComapny() company: activeCompaany,
    @Query('page') page = 1,
    @Query('size') size = 50,
    @Query('search') search?: string,
  ) {
    try {
      if (!company) {
        return this.responseService.badRequest('No company specified');
      }
      const result = await this.service.list(company.id, page, size, search);
      if (result.error === 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('onboarding.view')
  @Get(':id')
  async view(@Param('id') id: string) {
    try {
      const result = await this.service.view(id);
      if (result.error === 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('onboarding.create')
  @Post()
  async create(
    @Body() payload: CreateOnboardingDto,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      if (!company) {
        return this.responseService.badRequest('No company specified');
      }
      const result = await this.service.create(payload, company.id);
      if (result.error === 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('onboarding.update')
  @Patch(':id')
  @Put(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateOnboardingDto) {
    try {
      const result = await this.service.update(id, payload);
      if (result.error === 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('onboarding.delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const result = await this.service.delete(id);
      if (result.error === 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
