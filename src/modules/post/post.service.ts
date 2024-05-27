import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { PrismaService } from '@providers/prisma/prisma.service';
import { PaginationArgs } from '@dto/pagination.args';
import CreatePostWithAuthorInput from './dto/create-post-with-author.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async authorByPost(postId: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { posts: { some: { id: postId } } },
    });
  }

  async one(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
      include: { author: true },
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
      include: { author: true },
    });
  }

  async createOne(data: CreatePostWithAuthorInput): Promise<Post> {
    return this.prisma.post.create({
      data,
      include: { author: true },
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
      include: { author: true },
    });
  }

  async deleteOne(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
      include: { author: true },
    });
  }
}
