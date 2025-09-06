

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class UserService extends PrismaService {

  async findByUsername(username: any) {
    const result = await this.user.findFirstOrThrow({
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
    const result = await this.user.findUnique({
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
    return result
  }

}
