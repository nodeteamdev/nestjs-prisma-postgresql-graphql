import { Field, InputType } from '@nestjs/graphql';
import SignUpInput from 'src/auth/dto/sign-up.input';
import { Role } from '@prisma/client';

@InputType()
export default class CreateUserInput extends SignUpInput {
  @Field(() => Role)
  role: Role;
}
