import { Field, GraphQLTimestamp, Int, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/models/post.model';

@ObjectType({ description: 'user' })
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => GraphQLTimestamp)
  dateCreated: Date;

  @Field(() => [Post], { nullable: 'items' })
  posts: Post[];
}
