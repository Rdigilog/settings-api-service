/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Prisma, TicketStatus, MessageSenderType } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import {
  CreateTicketDto,
  SendTicketMessageDto,
} from 'src/models/support/create.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class SupportService {
  constructor(
    private readonly responseService: ResponsesService,
    private readonly prisma: PrismaService,
  ) {}

  /* =========================
   * CREATE TICKET
   * ========================= */
  async create(payload: CreateTicketDto, userId: string, companyId: string) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.create({
          data: {
            subject: payload.subject,
            priority: payload.priority,
            reference: `SUP-${Date.now()}`,
            createdById: userId,
            companyId,
          },
        });

        await tx.ticketMessage.create({
          data: {
            ticket: {
              connect: {
                id: ticket.id,
              },
            },
            senderId: userId,
            senderType: MessageSenderType.USER,
            message: payload.message,
          },
        });

        return ticket;
      });

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  /* =========================
   * LIST TICKETS
   * ========================= */
  async list(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    status?: TicketStatus,
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const filter: Prisma.TicketWhereInput = {
        companyId,
      };

      if (status) {
        filter.status = status;
      }

      if (search) {
        filter.OR = [
          { subject: { contains: search, mode: 'insensitive' } },
          { reference: { contains: search, mode: 'insensitive' } },
        ];
      }

      const result = await this.prisma.ticket.findMany({
        where: filter,
        include: {
          assignedTo: {
            select: { id: true, email: true, lastName: true, firstName: true },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.ticket.count({ where: filter });

      const paginatedData = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );

      return { error: 0, body: paginatedData };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  /* =========================
   * VIEW SINGLE TICKET
   * ========================= */
  async view(id: string, userId: string) {
    try {
      const result = await this.prisma.ticket.findFirst({
        where: {
          id,
          createdById: userId,
        },
        include: {
          messages: {
            // where: { isInternal: false },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!result) {
        return { error: 1, body: 'Ticket not found' };
      }

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  /* =========================
   * UPDATE TICKET
   * ========================= */
  async update(id: string, payload: Prisma.TicketUpdateInput, userId: string) {
    try {
      const result = await this.prisma.ticket.updateMany({
        where: {
          id,
          createdById: userId,
        },
        data: payload,
      });

      if (!result.count) {
        return { error: 1, body: 'Ticket not found or unauthorized' };
      }

      return { error: 0, body: 'Ticket updated successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  /* =========================
   * DELETE TICKET
   * ========================= */
  async delete(id: string, userId: string) {
    try {
      await this.prisma.ticket.deleteMany({
        where: {
          id,
          createdById: userId,
        },
      });

      return { error: 0, body: 'Ticket deleted successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  /* =========================
   * SEND MESSAGE
   * ========================= */
  async sendMessage(
    ticketId: string,
    payload: SendTicketMessageDto,
    senderId: string,
    isAgent = false,
  ) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        return { error: 1, body: 'Ticket not found' };
      }

      const message = await this.prisma.ticketMessage.create({
        data: {
          ticketId,
          senderId,
          senderType: isAgent
            ? MessageSenderType.AGENT
            : MessageSenderType.USER,
          message: payload.message,
          //   isInternal: isAgent ? payload.isInternal ?? false : false,
        },
      });

      // Auto status handling
      if (ticket.status === TicketStatus.RESOLVED && !isAgent) {
        await this.prisma.ticket.update({
          where: { id: ticketId },
          data: { status: TicketStatus.OPEN },
        });
      }

      if (isAgent) {
        await this.prisma.ticket.update({
          where: { id: ticketId },
          data: { status: TicketStatus.PENDING },
        });
      }

      return { error: 0, body: message };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
