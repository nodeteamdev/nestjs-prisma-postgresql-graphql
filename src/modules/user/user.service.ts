import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { PaginationArgs } from '@dto/pagination.args';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async one(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async many(pagination: PaginationArgs): Promise<User[]> {
    const cursor = pagination.cursor
      ? {
          id: pagination.cursor,
        }
      : undefined;

    return this.prisma.user.findMany({
      skip: pagination.skip,
      take: pagination.take,
      cursor,
      orderBy: {
        id: pagination.order,
      },
    });
  }

  async updateOne(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
