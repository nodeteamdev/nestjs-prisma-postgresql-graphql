import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import UpdateUserInput from './dto/update-user.input';
import CreateUserInput from './dto/create-user.input';
import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@auth/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createOne(createUserInput);
  }

  @Query(() => [User], { name: 'user' })
  findAll() {
    return this.userService.many({});
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.one({ id });
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateOne({
      where: {
        id: updateUserInput.id,
      },
      data: {
        ...updateUserInput,
      },
    });
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.deleteOne({ id });
  }
}
