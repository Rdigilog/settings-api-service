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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthComapny } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateDocumentCategoryDto,
  UpdateDocumentCategoryDto,
} from 'src/models/documents/category.dto';
import type { activeCompaany } from 'src/models/types/user.types';
import { DocumentCategoryService } from 'src/services/document-category.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('document-category')
@ApiTags('Document Category')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class DocumentCategoryController {
  constructor(
    private readonly service: DocumentCategoryService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('document-category.list')
  @ApiOperation({ summary: 'List document categories' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'search', required: false })
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

  @RouteName('document-category.view')
  @ApiOperation({ summary: 'View document category' })
  @Get(':id')
  async view(@Param('id') id: string) {
    const result = await this.service.view(id);
    return this.responseService.success(result.body);
  }

  @RouteName('document-category.create')
  @ApiOperation({ summary: 'Create document category' })
  @Post()
  async create(
    @AuthComapny() company: activeCompaany,
    @Body() payload: CreateDocumentCategoryDto,
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

  @RouteName('document-category.update')
  @Patch(':id')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateDocumentCategoryDto,
  ) {
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

  @RouteName('document-category.delete')
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
