import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import UserCreateInput from './create-user.input';

@InputType()
export default class UpdateUserInput extends PartialType(UserCreateInput) {
  @Field(() => Int)
  @Min(0)
  id!: number;
}
