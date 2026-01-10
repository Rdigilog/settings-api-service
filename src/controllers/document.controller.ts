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
import { AuthComapny, AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
} from 'src/models/documents/create.dto';
import type { activeCompaany, LoggedInUser } from 'src/models/types/user.types';
import { DocumentService } from 'src/services/document.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('document')
@ApiTags('Document')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class DocumentController {
  constructor(
    private readonly service: DocumentService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('document.list')
  @ApiOperation({ summary: 'List documents' })
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
    const result = await this.service.list(company.id, page, size, search);
    return this.responseService.success(result.body);
  }

  @RouteName('document.view')
  @ApiOperation({ summary: 'View document' })
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

  @RouteName('document.create')
  @ApiOperation({ summary: 'Create document' })
  @Post()
  async create(
    @AuthComapny() company: activeCompaany,
    @AuthUser() user: LoggedInUser,
    @Body() payload: CreateDocumentDto,
  ) {
    try {
      if (!company) {
        return this.responseService.badRequest('No company specified');
      }
      const result = await this.service.create(payload, company.id, user.id);
      if (result.error === 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('document.update')
  @Patch(':id')
  @Put(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateDocumentDto) {
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

  @RouteName('document.delete')
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
