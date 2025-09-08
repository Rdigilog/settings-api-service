import { Prisma } from '@prisma/client/edge.js';

export type LoggedInUser = Prisma.UserGetPayload<{
  include: { profile: true; userRole: true };
}>;
