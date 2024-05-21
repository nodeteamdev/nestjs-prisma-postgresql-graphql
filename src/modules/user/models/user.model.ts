import {
  Field,
  GraphQLTimestamp,
  HideField,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Post } from '@post/models/post.model';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType({ description: 'user' })
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @HideField()
  password: string;

  @Field(() => Role)
  role: Role;

  @Field({ nullable: true })
  name: string;

  @Field(() => GraphQLTimestamp)
  dateCreated: Date;

  @Field(() => [Post], { nullable: true })
  posts: Post[];
}
