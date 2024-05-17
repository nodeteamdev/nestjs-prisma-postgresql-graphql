import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@common/prisma.service';
import { Post } from './models/post.model';
import { PaginationArgs } from '@common/dto/pagination.args';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async one(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async many(pagination: PaginationArgs): Promise<Post[]> {
    const cursor = pagination.cursor
      ? {
          id: pagination.cursor,
        }
      : undefined;

    return this.prisma.post.findMany({
      skip: pagination.skip,
      take: pagination.take,
      cursor,
      orderBy: {
        id: pagination.order,
      },
    });
  }

  async createOne(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async updateOne(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where, data } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }

  async deleteOne(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }
}
