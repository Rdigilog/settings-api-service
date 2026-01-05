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
import { AuthGuard } from 'src/guards/auth.guard';
import { RouteName } from 'src/decorators/route-name.decorator';
import { ResponsesService } from 'src/utils/services/responses.service';
import { SupportService } from 'src/services/support.service';
import { AuthComapny, AuthUser } from 'src/decorators/logged-in-user-decorator';
import type { activeCompaany, LoggedInUser } from 'src/models/types/user.types';
import { TicketStatus } from '@prisma/client';
import {
  CreateTicketDto,
  SendTicketMessageDto,
} from 'src/models/support/create.dto';

@Controller('support')
@ApiTags('Support')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class SupportController {
  constructor(
    private readonly service: SupportService,
    private readonly responseService: ResponsesService,
  ) {}

  /* ===============================
   * LIST TICKETS
   * =============================== */
  @RouteName('support.ticket.list')
  @ApiOperation({ summary: 'List support tickets' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get()
  async list(
    @AuthComapny() company: activeCompaany,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('status') status?: TicketStatus,
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
        status,
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

  /* ===============================
   * CREATE TICKET
   * =============================== */
  @RouteName('support.ticket.create')
  @ApiOperation({ summary: 'Create support ticket' })
  @Post()
  async create(
    @AuthUser() user: LoggedInUser,
    @Body() payload: CreateTicketDto,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      if (!company) {
        return this.responseService.badRequest('No company specified');
      }
      const result = await this.service.create(payload, user.id, company.id);

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

  /* ===============================
   * VIEW TICKET
   * =============================== */
  @RouteName('support.ticket.view')
  @ApiOperation({ summary: 'View support ticket details' })
  @ApiParam({ name: 'ticketId', type: String })
  @Get(':ticketId')
  async view(
    @AuthUser() user: LoggedInUser,
    @Param('ticketId') ticketId: string,
  ) {
    try {
      const result = await this.service.view(ticketId, user.id);

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

  /* ===============================
   * UPDATE TICKET
   * =============================== */
  @RouteName('support.ticket.update')
  @ApiOperation({ summary: 'Update support ticket' })
  @Patch(':ticketId')
  @Put(':ticketId')
  async update(
    @AuthUser() user: LoggedInUser,
    @Param('ticketId') ticketId: string,
    @Body() payload: any,
  ) {
    try {
      const result = await this.service.update(ticketId, payload, user.id);

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

  /* ===============================
   * DELETE TICKET
   * =============================== */
  @RouteName('support.ticket.delete')
  @ApiOperation({ summary: 'Delete support ticket' })
  @ApiParam({ name: 'ticketId', type: String })
  @Delete(':ticketId')
  async delete(
    @AuthUser() user: LoggedInUser,
    @Param('ticketId') ticketId: string,
  ) {
    try {
      const result = await this.service.delete(ticketId, user.id);

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

  /* ===============================
   * SEND MESSAGE
   * =============================== */
  @RouteName('support.ticket.message.send')
  @ApiOperation({ summary: 'Send message to support ticket' })
  @ApiParam({ name: 'ticketId', type: String })
  @ApiBody({ type: SendTicketMessageDto })
  @Post(':ticketId/message')
  async sendMessage(
    @AuthUser() user: LoggedInUser,
    @Param('ticketId') ticketId: string,
    @Body() payload: SendTicketMessageDto,
  ) {
    try {
      const result = await this.service.sendMessage(
        ticketId,
        payload,
        user.id,
        false,
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
