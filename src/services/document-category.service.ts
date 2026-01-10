import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { CreateDocumentCategoryDto } from 'src/models/documents/category.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class DocumentCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
  ) {}

  async list(companyId: string, page: number, size: number, search = '') {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const filter: Prisma.DocumentCategoryWhereInput = { companyId };
      if (search) {
        filter.name = { contains: search, mode: 'insensitive' };
      }

      const result = await this.prisma.documentCategory.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.documentCategory.count({
        where: filter,
      });
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
      const result = await this.prisma.documentCategory.findUnique({
        where: { id },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async create(payload: CreateDocumentCategoryDto, companyId: string) {
    try {
      const result = await this.prisma.documentCategory.create({
        data: { ...payload, companyId },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(id: string, payload: Partial<CreateDocumentCategoryDto>) {
    try {
      const result = await this.prisma.documentCategory.update({
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
      await this.prisma.documentCategory.delete({ where: { id } });
      return { error: 0, body: 'Category deleted successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
