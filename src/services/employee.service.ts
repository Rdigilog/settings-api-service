import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class EmployeeService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }

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
        filter.OR = [];
      }
      
   const result = await this.employee.findMany({
        where: filter,
        select: {
          id: true,
          payRate: true,
          countryCode: true,
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
          branch:true,
          department:true,
          inviteLink:true,
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
        const totalItems = await this.employee.count({ where: filter });
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
}
