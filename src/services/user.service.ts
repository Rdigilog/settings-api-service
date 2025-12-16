/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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
          select: { companyId: true, role: true, company: true },
        },
      },
    });
  }

  async findComapnyById(companyId: string) {
    return await this.prismaService.company.findUnique({
      where: { id: companyId },
    });
  }
}
