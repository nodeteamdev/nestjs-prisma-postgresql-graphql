import { Field, InputType } from '@nestjs/graphql';
import SignUpInput from '@auth/dto/sign-up.input';
import { IsEmail, IsStrongPassword } from 'class-validator';

@InputType()
export default class UpdateUserInput extends SignUpInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @IsStrongPassword({ minLength: 8 })
  password: string;
}
