import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { CreateOnboardingDto } from 'src/models/onboarding-flow/create.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
  ) {}
  async list(companyId: string, page: number, size: number, search?: string) {
    try {
      const where: Prisma.OnboardingWhereInput = {
        companyId,
      };

      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }
      const { offset, limit } = this.responseService.pagination(page, size);

      const result = await this.prisma.onboarding.findMany({
        where,
        include: { steps: true },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.onboarding.count();
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
      const result = await this.prisma.onboarding.findUnique({
        where: { id },
        include: { steps: true },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async create(payload: CreateOnboardingDto, companyId: string) {
    try {
      const { steps, ...rest } = payload;
      const result = await this.prisma.onboarding.create({
        data: {
          ...rest,
          company: {
            connect: { id: companyId },
          },
          steps: steps
            ? {
                createMany: {
                  data: steps.map((step) => {
                    const { employees, ...s } = step;
                    return {
                      ...s,
                      employees: {
                        create: employees?.map((id) => id),
                      },
                    };
                  }),
                },
              }
            : undefined,
        },
        include: { steps: true },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(id: string, payload: Partial<CreateOnboardingDto>) {
    try {
      const { steps, ...rest } = payload;

      const result = await this.prisma.onboarding.update({
        where: { id },
        data: {
          ...rest,
          steps: steps
            ? {
                deleteMany: {},
                createMany: {
                  data: steps.map((step) => {
                    const { employees, ...s } = step;
                    return {
                      ...s,
                      employees: {
                        create: employees?.map((id) => id),
                      },
                    };
                  }),
                },
              }
            : undefined,
        },
        include: { steps: true },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.onboarding.delete({ where: { id } });
      return { error: 0, body: 'Onboarding deleted successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
