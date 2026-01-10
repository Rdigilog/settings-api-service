import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { CreateDocumentDto } from 'src/models/documents/create.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
  ) {}

  async list(companyId: string, page: number, size: number, search = '') {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.DocumentWhereInput = { companyId };

      if (search) {
        filter.title = { contains: search, mode: 'insensitive' };
      }

      const result = await this.prisma.document.findMany({
        where: filter,
        include: { category: true },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.document.count({ where: filter });
      return {
        error: 0,
        body: this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        ),
      };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async view(id: string) {
    try {
      const result = await this.prisma.document.findUnique({
        where: { id },
        include: { category: true },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async create(
    payload: CreateDocumentDto,
    companyId: string,
    createdById: string,
  ) {
    try {
      const result = await this.prisma.document.create({
        data: {
          ...payload,
          companyId,
          createdById,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(id: string, payload: Partial<CreateDocumentDto>) {
    try {
      const result = await this.prisma.document.update({
        where: { id },
        data: payload,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.document.delete({ where: { id } });
      return { error: 0, body: 'Document deleted successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
