/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthComapny, AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateComplianceDocumentDto } from 'src/models/documents/compliance-document.dto';
import type { activeCompaany, LoggedInUser } from 'src/models/types/user.types';
import { ComplianceDocumentService } from 'src/services/compliance-document.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('compliance-document')
@ApiTags('Compliance Document')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class ComplianceDocumentController {
  constructor(
    private readonly service: ComplianceDocumentService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('compliance-document.list')
  @Get()
  async list(
    @AuthComapny() company: activeCompaany,
    @Query('page') page = 1,
    @Query('size') size = 50,
    // @Query('search') search?: string,
  ) {
    try {
      if (!company) {
        return this.responseService.badRequest('No company specified');
      }
      const result = await this.service.list(company.id, page, size);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e);
    }
  }

  @RouteName('compliance-document.view')
  @Get(':id')
  async view(@Param('id') id: string) {
    const result = await this.service.view(id);
    return this.responseService.success(result.body);
  }

  @RouteName('compliance-document.create')
  @Post()
  async create(
    @AuthComapny() company: activeCompaany,
    @AuthUser() user: LoggedInUser,
    @Body() payload: CreateComplianceDocumentDto,
  ) {
    try {
      if (!company) {
        return this.responseService.badRequest('No company specified');
      }
      const result = await this.service.create(payload, company.id, user.id);
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

  @RouteName('compliance-document.delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.service.delete(id);
    return this.responseService.success(result.body);
  }
}
