import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsStrongPassword, Length } from 'class-validator';

@InputType()
export default class SignUpInput {
  @Field(() => String, { nullable: false })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: false })
  @IsStrongPassword({ minLength: 8 })
  password: string;

  @Field(() => String, { nullable: true })
  @Length(1)
  name: string | null;
}
