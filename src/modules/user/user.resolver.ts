import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@auth/guards/gql-auth.guard';
import UpdateUserInput from './dto/update-user.input';
import { CurrentUser } from '@decorators/current-user.decorator';
import { PaginationArgs } from '@dto/pagination.args';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  findAll(@Args() pagination: PaginationArgs) {
    return this.userService.many(pagination);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.one({ id });
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    return this.userService.updateOne({
      where: {
        id: user.id,
      },
      data: {
        ...updateUserInput,
      },
    });
  }

  @Mutation(() => User)
  removeUser(@CurrentUser() user: User) {
    return this.userService.deleteOne({ id: user.id });
  }
}
