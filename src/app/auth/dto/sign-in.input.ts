import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

@InputType()
export default class SignInInput {
  @Field(() => String, { nullable: false })
  @IsEmail()
  email!: string;

  @Field(() => String, { nullable: false })
  @Length(8)
  password!: string;
}
