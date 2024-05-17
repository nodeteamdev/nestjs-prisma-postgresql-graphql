import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Success {
  @Field({ description: 'Is result successful' })
  success: boolean;
}
