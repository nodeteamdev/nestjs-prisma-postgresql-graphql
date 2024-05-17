import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './models/post.model';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@auth/guards/gql-auth.guard';
import { PaginationArgs } from '@dto/pagination.args';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postService.createOne(createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll(@Args() pagination: PaginationArgs) {
    return this.postService.many(pagination);
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postService.one({ id });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.updateOne({
      where: {
        id: updatePostInput.id,
      },
      data: {
        ...updatePostInput,
      },
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postService.deleteOne({ id });
  }
}
