import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class RefreshTokenInput {
  @Field(() => String, { nullable: false })
  token: string;
}
