import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { CreateJobRoleDto } from 'src/models/company/job-role.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class JobRoleService {
  constructor(
    private readonly responseService: ResponsesService,
    private readonly prisma: PrismaService,
  ) {
    // super();
  }

  async list(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.JobRoleWhereInput = { companyId };
      if (search) {
        filter.OR = [];
      }

      const result = await this.prisma.jobRole.findMany({
        where: filter,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      // if (result.length) {
      const totalItems = await this.prisma.jobRole.count({ where: filter });
      const paginatedProduct = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );
      return { error: 0, body: paginatedProduct };
      // }
      // return { error: 1, body: 'No Record found' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async create(payload: CreateJobRoleDto, companyId: string) {
    try {
      const { permissions, primaryReportId, secondaryReportId, ...rest } =
        payload;
      const result = await this.prisma.jobRole.create({
        data: {
          ...rest,
          primaryReport: primaryReportId
            ? {
                connect: {
                  id: primaryReportId,
                },
              }
            : undefined,
          secondaryReport: secondaryReportId
            ? {
                connect: {
                  id: secondaryReportId,
                },
              }
            : undefined,
          permissions: permissions?.length
            ? {
                connect: permissions.map((id) => ({ id })),
              }
            : undefined,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(payload: Partial<CreateJobRoleDto>, id: string) {
    try {
      const { permissions, primaryReportId, secondaryReportId, ...rest } =
        payload;
      const result = await this.prisma.jobRole.update({
        where: {
          id,
        },
        data: {
          ...rest,
          primaryReport: primaryReportId
            ? {
                connect: {
                  id: primaryReportId,
                },
              }
            : undefined,
          secondaryReport: secondaryReportId
            ? {
                connect: {
                  id: secondaryReportId,
                },
              }
            : undefined,
          permissions: permissions?.length
            ? {
                deleteMany: {},
                connect: permissions.map((id) => ({ id })),
              }
            : undefined,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.jobInformation.updateMany({
        where: { jobRoleId: id },
        data: { jobRoleId: null },
      });
      await this.prisma.jobRole.delete({
        where: {
          id,
        },
      });
      return { error: 0, body: 'Job Role deleted successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async assignJobRole(jobRoleId: string, userId: string[]) {
    try {
      const result = await Promise.all(
        userId.map(async (id) => {
          const employee = await this.prisma.employee.findFirst({
            where: { userId: id },
          });
          return await this.prisma.jobInformation.upsert({
            where: { employeeId: employee?.id },
            update: {
              jobRole: {
                connect: {
                  id: jobRoleId,
                },
              },
            },
            create: {
              jobRole: {
                connect: {
                  id: jobRoleId,
                },
              },
              employee: {
                connect: {
                  id: employee?.id,
                },
              },
            },
          });
        }),
      );
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
