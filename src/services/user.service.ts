import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Queue } from "bullmq";
import { PrismaService } from "src/config/prisma.service";
import { UpdateProfileDto, EmployeeDto } from "src/models/onboarding/profile.dto";
import { InitiateRegistrationDto, PhoneNumberDTO, CompanyDetailsDTO, InviteUserDTO } from "src/models/onboarding/SignUp.dto";
import { ResponsesService } from "src/utils/services/responses.service";
import { UtilsService } from "src/utils/services/utils.service";


@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  async findByUsername(username: any) {
    const result = await this.prismaService.user.findFirstOrThrow({
      where: {
        OR: [
          { email: { equals: username, mode: 'insensitive' } },
          { phoneNumber: username },
        ],
      },
    });
    return result;
  }

  async findById(id: string, includePassword = false) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        active: true,
        deleted: true,
        profile: true,
        password: includePassword,
        userRole: {
          select: { role: true, company: true },
        },
      },
    });
  }

}
