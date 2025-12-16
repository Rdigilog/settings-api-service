import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import {
  CreateTaskStageDto,
  UpdateTaskStageDto,
} from 'src/models/task/create.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly responseService: ResponsesService,
    private readonly prisma: PrismaService,
  ) {
    // super();
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
      const filter: Prisma.TaskWhereInput = {};
      if (search) {
        filter.OR = [];
      }

      // if (status) {
      //   filter.status = status;
      // }

      const result = await this.prisma.task.findMany({
        where: filter,
        include: {
          company: true,
          taskAssignee: true,
          manager: true,
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.prisma.task.count({ where: filter });
        const paginatedProduct = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedProduct };
      }
      return { error: 1, body: 'No Order found' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async createStage(companyId: string, dto: CreateTaskStageDto) {
    try {
      const stage = await this.prisma.taskStage.create({
        data: {
          name: dto.name,
          companyId,
        },
      });
      return { error: 0, body: stage };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async listStages(companyId: string) {
    try {
      const stages = await this.prisma.taskStage.findMany({
        where: { companyId },
        orderBy: { name: 'asc' },
      });

      if (stages.length === 0) {
        return { error: 1, body: 'No Task Stage found' };
      }
      return { error: 0, body: stages };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async updateStage(companyId: string, id: string, dto: UpdateTaskStageDto) {
    try {
      const stage = await this.prisma.taskStage.findFirst({
        where: { id, companyId },
      });
      if (!stage) return { error: 1, body: 'Task Stage not found to update' };

      const updated = await this.prisma.taskStage.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
        },
      });

      return { error: 0, body: updated };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
