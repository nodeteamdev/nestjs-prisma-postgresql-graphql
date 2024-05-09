import { Field, GraphQLTimestamp, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@user/models/user.model';

@ObjectType({ description: 'post' })
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  published: boolean;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => Int)
  authorId: number;

  @Field(() => GraphQLTimestamp)
  dateCreated: Date;

  @Field(() => GraphQLTimestamp)
  dateModified: Date;
}
