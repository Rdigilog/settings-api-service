import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateComplianceDocumentDto } from 'src/models/documents/compliance-document.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class ComplianceDocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
  ) {}

  async list(companyId: string, page: number, size: number) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const result = await this.prisma.complianceDocument.findMany({
        where: { companyId },
        include: { employee: true },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.complianceDocument.count({
        where: { companyId },
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
      const result = await this.prisma.complianceDocument.findUnique({
        where: { id },
        include: { employee: true },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async create(
    payload: CreateComplianceDocumentDto,
    companyId: string,
    uploadedById: string,
  ) {
    try {
      const result = await this.prisma.complianceDocument.create({
        data: { ...payload, companyId, uploadedById },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(id: string, payload: Partial<CreateComplianceDocumentDto>) {
    try {
      const result = await this.prisma.complianceDocument.update({
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
      await this.prisma.complianceDocument.delete({ where: { id } });
      return { error: 0, body: 'Compliance document deleted successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
