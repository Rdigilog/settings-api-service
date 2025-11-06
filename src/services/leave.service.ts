import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import {
  CreateLeavePolicyDto,
  UpdateLeavePolicyDto,
} from 'src/models/leave/leave.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class LeaveService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }
  async list(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.LeaveWhereInput = {};
      if (search) {
        filter.OR = [];
      }

      const result = await this.leave.findMany({
        where: filter,
        include: {
          applicant: true,
          company: true,
          leavePolicy:true,

        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      // if (result.length) {
      const totalItems = await this.leave.count({ where: filter });
      const paginatedProduct = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );
      return { error: 0, body: paginatedProduct };
      // }
      // return { error: 1, body: 'No Leave found' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async createLeavePolicy(companyId: string, dto: CreateLeavePolicyDto) {
    try {
      const leavePolicy = await this.leavePolicy.create({
        data: {
          name: dto.name,
          description: dto.description,
          companyId,

          accrualSchedule: dto.accrualSchedule,
          joinDatePolicy: dto.joinDatePolicy,
          maxAccrualHours: dto.maxAccrualHours,
          allowNegative: dto.allowNegative,
          requiresApproval: dto.requiresApproval,
          balanceRollover: dto.balanceRollover,
          paid: dto.paid,

          approvalLevel1Id: dto.approvalLevel1Id,
          approvalLevel2Id: dto.approvalLevel2Id,
          autoAddNewMembers: dto.autoAddNewMembers,

          // Relations
          branches: dto.branches
            ? { connect: dto.branches.map((id) => ({ id })) }
            : undefined,
          members: dto.members
            ? { connect: dto.members.map((id) => ({ id })) }
            : undefined,
          jobRoles: dto.jobRoles?.length
            ? {
                connect: dto.jobRoles.map((id) => ({
                  id,
                })),
              }
            : undefined,
        },
      });
      return { error: 0, body: leavePolicy };
    } catch (e) {
      return { error: 2, body: e.message };
    }
  }

  async findAllLeavePolicy(companyId: string) {
    try {
      const leavePolicies = await this.leavePolicy.findMany({
        where: { companyId },
        include: {
          branches: true,
          members: true,
          jobRoles:true
        },
      });

      // if (leavePolicies.length) {
      return { error: 0, body: leavePolicies };
      // }
      // return { error: 1, body: 'No Leave policy found' };
    } catch (e) {
      return { error: 2, body: e.message };
    }
  }

  async findOneLeavePolicy(companyId: string, id: string) {
    try {
      const leavePolicy = await this.leavePolicy.findFirst({
        where: { id, companyId },
        include: {
          branches: true,
          members: true,
          jobRoles:true,
        },
      });

      if (!leavePolicy) {
        return { error: 1, body: 'Leave policy not found' };
      }
      return { error: 0, body: leavePolicy };
    } catch (e) {
      return { error: 2, body: e.message };
    }
  }

  async updateLeavePolicy(
    companyId: string,
    id: string,
    dto: UpdateLeavePolicyDto,
  ) {
    try {
      const exists = await this.leavePolicy.findFirst({
        where: { id, companyId },
      });
      if (!exists) {
        return { error: 1, body: 'Leave policy not found' };
      }

      const leavePolicy = await this.leavePolicy.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.accrualSchedule !== undefined && {
            accrualSchedule: dto.accrualSchedule,
          }),
          ...(dto.joinDatePolicy !== undefined && {
            joinDatePolicy: dto.joinDatePolicy,
          }),
          ...(dto.maxAccrualHours !== undefined && {
            maxAccrualHours: dto.maxAccrualHours,
          }),
          ...(dto.allowNegative !== undefined && {
            allowNegative: dto.allowNegative,
          }),
          ...(dto.requiresApproval !== undefined && {
            requiresApproval: dto.requiresApproval,
          }),
          ...(dto.balanceRollover !== undefined && {
            balanceRollover: dto.balanceRollover,
          }),
          ...(dto.paid !== undefined && { paid: dto.paid }),
          ...(dto.approvalLevel1Id !== undefined && {
            approvalLevel1Id: dto.approvalLevel1Id,
          }),
          ...(dto.approvalLevel2Id !== undefined && {
            approvalLevel2Id: dto.approvalLevel2Id,
          }),
          ...(dto.autoAddNewMembers !== undefined && {
            autoAddNewMembers: dto.autoAddNewMembers,
          }),

          // Replace relations
          ...(dto.branches && {
            branches: { set: dto.branches.map((id) => ({ id })) },
          }),
          ...(dto.members && {
            members: { set: dto.members.map((id) => ({ id })) },
          }),
          ...(dto.jobRoles && {
            jobRoles: { set: dto.jobRoles.map((id) => ({ id })) },
          }),
        },
      });

      return { error: 0, body: leavePolicy };
    } catch (e) {
      return { error: 2, body: e.message };
    }
  }

  async removeLeavePolicy(companyId: string, id: string) {
    try {
      const exists = await this.leavePolicy.findFirst({
        where: { id, companyId },
      });
      if (!exists) {
        return { error: 1, body: 'Leave policy not found' };
      }

      const deleted = await this.leavePolicy.delete({
        where: { id },
      });

      return { error: 0, body: deleted };
    } catch (e) {
      return { error: 2, body: e.message };
    }
  }
}
