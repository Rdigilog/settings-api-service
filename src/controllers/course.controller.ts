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
import { AuthComapny, AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateCourseDto,
  UpdateCourseDto,
} from 'src/models/courses/create.dto';
import type { activeCompaany, LoggedInUser } from 'src/models/types/user.types';
import { CourseService } from 'src/services/course.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('course')
@ApiTags('Course')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class CourseController {
  constructor(
    private readonly service: CourseService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('course.list')
  @Get()
  async list(
    @AuthComapny() company: activeCompaany,
    @Query('page') page = 1,
    @Query('size') size = 50,
  ) {
    const result = await this.service.list(company.id, page, size);
    return this.responseService.success(result.body);
  }

  @RouteName('course.view')
  @Get(':id')
  async view(@Param('id') id: string) {
    const result = await this.service.view(id);
    return this.responseService.success(result.body);
  }

  @RouteName('course.create')
  @Post()
  async create(
    @AuthComapny() company: activeCompaany,
    @AuthUser() user: LoggedInUser,
    @Body() payload: CreateCourseDto,
  ) {
    const result = await this.service.create(payload, company.id, user.id);
    return this.responseService.success(result.body);
  }

  @RouteName('course.update')
  @Patch(':id')
  @Put(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateCourseDto) {
    const result = await this.service.update(id, payload);
    return this.responseService.success(result.body);
  }

  @RouteName('course.delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.service.delete(id);
    return this.responseService.success(result.body);
  }
}
