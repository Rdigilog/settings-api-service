import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
  ) {}

  async list(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'id',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const filter: Prisma.EmployeeWhereInput = { companyId };

      if (search) {
        filter.OR = [
          {
            profile: {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            profile: {
              lastName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            employeeCode: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      const result = await this.prisma.employee.findMany({
        where: filter,
        select: {
          id: true,
          payRate: true,
          countryCode: true,
          employeeCode: true,
          timezone: true,
          period: true,
          phoneNumber: true,
          screenshotFrequency: true,
          annualLeave: true,
          bankHoliday: true,
          hours: true,
          screenshotIntervalMinutes: true,
          appTrackingType: true,
          appScrennshotNotification: true,
          inviteAccepted: true,
          activityTrackingEmployee: true,

          branch: {
            select: {
              branch: true,
            },
          },
          department: {
            select: {
              department: true,
            },
          },
          attendance: {
            take: 1,
            orderBy: { updatedAt: 'desc' },
          },
          inviteLink: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              imageUrl: true,
            },
          },
          jobInformation: {
            select: {
              jobRole: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
              currencyCode: true,
              payRatePerHour: true,
              location: true,
              employmentDate: true,
              workType: true,
              workDays: true,
              workStatus: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.employee.count({
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
}
