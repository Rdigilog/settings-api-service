import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateCourseDto } from 'src/models/courses/create.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
  ) {}

  async list(companyId: string, page: number, size: number) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const result = await this.prisma.course.findMany({
        where: { companyId },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.course.count({
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
      const result = await this.prisma.course.findUnique({ where: { id } });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async create(
    payload: CreateCourseDto,
    companyId: string,
    createdById: string,
  ) {
    try {
      const result = await this.prisma.course.create({
        data: { ...payload, companyId, createdById },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(id: string, payload: Partial<CreateCourseDto>) {
    try {
      const result = await this.prisma.course.update({
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
      await this.prisma.course.delete({ where: { id } });
      return { error: 0, body: 'Course deleted successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
