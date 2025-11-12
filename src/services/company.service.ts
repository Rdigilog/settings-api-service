import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { PrismaService } from 'src/config/prisma.service';
import {
  CompanyUpdateDto,
  RotaRuleSettingDto,
  ShiftSettingDto,
  HolidayRequestRuleSettingDto,
  DigiTimeSettingDto,
  BreakComplianceSettingDto,
  PayRateDto,
  NotificationSettingDto,
  ActivityTrackingSettingDto,
} from 'src/models/company/company.dto';
import { EmployeeSettingDto } from 'src/models/company/employee.dto';
import { GeneralService } from 'src/utils/services/general.service';
import { ResponsesService } from 'src/utils/services/responses.service';

type RangeType = 'day' | 'week' | 'month' | 'year';
@Injectable()
export class CompanyService extends PrismaService {
  listStages(companyId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly responseService: ResponsesService,
    private readonly generalService: GeneralService,
  ) {
    super();
  }
  async dashboardSummary(companyId: string, range: RangeType) {
    try {
      // const result = await this.$transaction(
      //   async (tx) => {
      //     const dateRange = this.generalService.getDateRange(range); // 'day', 'week', etc.
      //     const currentStart = format(dateRange.currentStartDate, 'yyyy-MM-dd');
      //     const currentEnd = format(dateRange.currentEndDate, 'yyyy-MM-dd');
      //     const previousStart = format(
      //       dateRange.previousStartDate,
      //       'yyyy-MM-dd',
      //     );
      //     const previousEnd = format(dateRange.previousEndDate, 'yyyy-MM-dd');
      //     const current = await tx.attendance.groupBy({
      //       by: ['status'],
      //       where: {
      //         date: {
      //           gte: currentStart,
      //           lte: currentEnd,
      //         },
      //         companyId,
      //       },
      //     });
      //     const previous = await tx.attendance.groupBy({
      //       by: ['status'],
      //       where: {
      //         date: {
      //           gte: currentStart,
      //           lte: currentEnd,
      //         },
      //         companyId,
      //       },
      //     });

      //     const currentAbsent = await tx.employee.findMany({
      //       where: {
      //         companyId,
      //       },
      //       select: {
      //         user: {
      //           select: {
      //             attendance: {
      //               where: {
      //                 date: {
      //                   gte: currentStart,
      //                   lte: currentEnd,
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     });
      //     const previousAbsent = await tx.employee.findMany({
      //       where: {
      //         companyId,
      //       },
      //       select: {
      //         user: {
      //           select: {
      //             attendance: {
      //               where: {
      //                 date: {
      //                   gte: previousStart,
      //                   lte: previousEnd,
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     });

      //     return {
      //       current,
      //       previous,
      //       previousAbsent,
      //       currentAbsent,
      //     };
      //   },
      //   {
      //     timeout: 10000, // corrected spelling from "timeOut" to "timeout"
      //   },
      // );

      return { error: 0, body: [] };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async updatePayRate(payload: EmployeeSettingDto[], companyId: string) {
    try {
      // if(payload?.length){
      await Promise.all(
        payload.map(async (staff) => {
          const { employeeId, ...rest } = staff;
          await this.employee.update({
            where: { id: employeeId },
            data: {
              ...rest,
              // jobInformation:payRate ? {
              //   update:{
              //     payRatePerHour:payRate,

              //   }
              // }:undefined
            },
          });
        }),
      );
      // }
      return { error: 0, body: 'Employee settings updated' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(payload: CompanyUpdateDto, id: string) {
    try {
      // const planId = payload?.planId;
      payload = { ...payload, planId: payload?.planId || '' };
      const { planId, weeklyOff, ...rest } = payload;
      delete payload.planId;
      const result = await this.company.update({
        where: { id },
        data: {
          ...(planId && {
            plan: { connect: { id: planId } },
          }),
          ...rest, // strips undefined fields
          weeklyOff: weeklyOff,
        },
      });

      return { error: 0, body: result };
    } catch (e) {
      console.log(e);
      return this.responseService.errorHandler(e);
    }
  }

  async getcompany(companyId: string) {
    try {
      const result = await this.company.findFirst({
        where: { id: companyId },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setRotaRule(payload: RotaRuleSettingDto, companyId: string) {
    try {
      const result = await this.rotaRuleSetting.upsert({
        where: { companyId },
        update: {
          ...payload,
        },
        create: {
          ...payload,
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

  async getRotaRule(companyId: string) {
    try {
      const result = await this.rotaRuleSetting.findFirst({
        where: { companyId },
        include: {},
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setShiftSetting(payload: ShiftSettingDto, companyId: string) {
    try {
      const result = await this.shiftSetting.upsert({
        where: { companyId },
        update: {
          ...payload,
        },
        create: {
          ...payload,
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

  async getShiftSetting(companyId: string) {
    try {
      const result = await this.shiftSetting.findFirst({
        where: { companyId },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setHolidayRequestSetting(
    payload: HolidayRequestRuleSettingDto,
    companyId: string,
  ) {
    try {
      const result = await this.holidayRequestRuleSetting.upsert({
        where: { companyId },
        update: {
          ...payload,
        },
        create: {
          ...payload,
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

  async getHolidayRequestSetting(companyId: string) {
    try {
      const result = await this.holidayRequestRuleSetting.findFirst({
        where: { companyId },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setDigiTimetSetting(payload: DigiTimeSettingDto, companyId: string) {
    try {
      const { apps, ...rest } = payload;
      const result = await this.digiTimeSetting.upsert({
        where: { companyId },
        update: {
          ...rest,
          apps: {
            deleteMany: {},
            createMany: {
              data:
                apps?.map((app) => {
                  return { ...app, companyId };
                }) || [],
            },
          },
        },
        create: {
          ...rest,
          company: {
            connect: {
              id: companyId,
            },
          },
          apps: {
            createMany: {
              data:
                apps?.map((app) => {
                  return { ...app, companyId };
                }) || [],
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async getDigiTimetSetting(companyId: string) {
    try {
      const result = await this.digiTimeSetting.findFirst({
        where: { companyId },
        include: { apps: true },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async getNotificationSetting(companyId: string) {
    try {
      const result = await this.notificationSetting.findFirst({
        where: { companyId },
        include: {
          memberNotificationRecipient: {
            select: {
              jobRole: true,
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async updatecompanyNotification(
    companyId: string,
    payload: NotificationSettingDto,
  ) {
    try {
      const { jobroleIds, ...rest } = payload;
      const result = await this.notificationSetting.upsert({
        where: { companyId },
        update: {
          ...rest,
          memberNotificationRecipient: jobroleIds.length
            ? {
                createMany: {
                  data: jobroleIds.map((id) => ({ jobRoleId: id })),
                },
              }
            : undefined,
        },
        create: {
          ...rest,
          memberNotificationRecipient: jobroleIds.length
            ? {
                createMany: {
                  data: jobroleIds.map((id) => ({ jobRoleId: id })),
                },
              }
            : undefined,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
        include: {
          memberNotificationRecipient: {
            select: {
              jobRole: true,
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  // async getNotificationSetting(companyId: string) {
  //   try {
  //     const result = await this.notificationSetting.findFirst({
  //       where: { companyId },
  //     });
  //     return { error: 0, body: result };
  //   } catch (e) {
  //     return this.responseService.errorHandler(e);
  //   }
  // }
  async getActivityTrackingSetting(companyId: string) {
    try {
      const result = await this.activityTrackingSetting.findFirst({
        where: { companyId },
        include: {
          activityTrackingEmployee: {
            select: {
              employee: {
                select: {
                  id: true,
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                      userId: true,
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async updateActivityTrackingSetting(
    companyId: string,
    payload: ActivityTrackingSettingDto,
  ) {
    try {
      const {
        memberIds,
        managerDeleteScreenshot,
        productiveApps,
        unproductiveApps,
        ...rest
      } = payload;
      const result = await this.activityTrackingSetting.upsert({
        where: { companyId },
        update: {
          ...rest,
          managerDeleteScreenshot,
          productiveApps: productiveApps,
          unproductiveApps: unproductiveApps,
          activityTrackingEmployee: memberIds?.length
            ? {
                createMany: {
                  data: memberIds.map((id) => ({ employeeId: id, companyId })),
                },
              }
            : undefined,
        },
        create: {
          ...rest,
          managerDeleteScreenshot,
          productiveApps: productiveApps,
          unproductiveApps: unproductiveApps,
          activityTrackingEmployee: memberIds?.length
            ? {
                createMany: {
                  data: memberIds.map((id) => ({ employeeId: id, companyId })),
                },
              }
            : undefined,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
        include: {
          activityTrackingEmployee: {
            select: {
              employee: {
                select: {
                  id: true,
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                      userId: true,
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setBreaks(payload: BreakComplianceSettingDto, companyId: string) {
    try {
      const { breaks, ...rest } = payload;
      const result = await this.breakComplianceSetting.upsert({
        where: { companyId },
        update: {
          ...rest,
          breaks: {
            deleteMany: {},
            createMany: {
              data:
                breaks?.map((app) => {
                  return { ...app };
                }) || [],
            },
          },
        },
        create: {
          ...rest,
          company: {
            connect: {
              id: companyId,
            },
          },
          breaks: {
            createMany: {
              data:
                breaks?.map((app) => {
                  return { ...app };
                }) || [],
            },
          },
        },
        include: {
          breaks: true,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async getBreaks(companyId: string) {
    try {
      const result = await this.breakComplianceSetting.findFirst({
        where: { companyId },
        include: { breaks: true },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
