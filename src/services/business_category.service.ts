import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { CreateJobRoleDto } from 'src/models/company/job-role.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class BusinessCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
  ) {}

  async list(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'name',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const filter: Prisma.BusinessCategoryWhereInput = { companyId };

      if (search) {
        filter.OR = [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      const result = await this.prisma.businessCategory.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.businessCategory.count({
        where: filter,
      });

      const paginatedProduct = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );

      return { error: 0, body: paginatedProduct };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async create(payload: CreateJobRoleDto, companyId: string) {
    try {
      const { name } = payload;

      const result = await this.prisma.businessCategory.create({
        data: {
          name,
          companyId,
        },
      });

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async delete(name: string, companyId: string) {
    try {
      await this.prisma.businessCategory.delete({
        where: {
          name_companyId: {
            name,
            companyId,
          },
        },
      });

      return {
        error: 0,
        body: 'Job Role deleted successfully',
      };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
