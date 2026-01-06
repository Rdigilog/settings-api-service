import { Body, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import {
  CreateBranchDto,
  AssignBranchUserDto,
} from 'src/models/branch/branch.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class BranchService {
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
      const filter: Prisma.BranchWhereInput = { companyId };
      if (search) {
        filter.OR = [];
      }

      const result = await this.prisma.branch.findMany({
        where: filter,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          country: {
            select: {
              code: true,
              name: true,
            },
          },
          manager: {
            select: {
              profile: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
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
      const totalItems = await this.prisma.branch.count({ where: filter });
      const paginatedProduct = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );
      return { error: 0, body: paginatedProduct };
      // }
      // return { error: 1, body: 'No Order found' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async create(payload: CreateBranchDto, companyId: string) {
    try {
      const { countryCode, managerId, ...rest } = payload;
      const data: Prisma.BranchCreateInput = {
        ...rest,
        company: {
          connect: { id: companyId },
        },
        country: {},
      };

      if (countryCode) {
        data.country = { connect: { code: countryCode } };
      }

      // let employee:Employee
      if (managerId) {
        data.manager = { connect: { id: managerId } };
      }
      const result = await this.prisma.branch.create({
        data,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(payload: Partial<CreateBranchDto>, branchId: string) {
    try {
      const result = await this.prisma.branch.update({
        where: {
          id: branchId,
        },
        data: {
          ...payload,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async delete(branchId: string) {
    try {
      await this.prisma.employeeBranch.deleteMany({
        where: {
          branchId,
        },
      });

      const result = await this.prisma.branch.delete({
        where: {
          id: branchId,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async assingToBranch(payload: AssignBranchUserDto, branchId: string) {
    try {
      const result = await this.prisma.employeeBranch.createMany({
        data: payload.emaployeeId.map((userId) => {
          return { employeeId: userId, branchId: branchId };
        }),
      });
      if (result.count) {
        const branch = await this.prisma.branch.findUnique({
          where: { id: branchId },
          include: {
            employees: {
              select: {
                employee: true,
              },
            },
          },
        });
        return { error: 0, body: branch };
      }
      return { error: 1, body: "failed to assign user('s) to branch" };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async removeFromBranch(payload: AssignBranchUserDto, branchId: string) {
    try {
      const result = await this.prisma.employeeBranch.deleteMany({
        where: { employeeId: { in: payload.emaployeeId }, branchId: branchId },
      });
      if (result.count) {
        const branch = await this.prisma.branch.findUnique({
          where: { id: branchId },
          include: {
            employees: {
              select: {
                employee: true,
              },
            },
          },
        });
        return { error: 0, body: branch };
      }
      return { error: 1, body: "failed to unassign user('s) from branch" };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
