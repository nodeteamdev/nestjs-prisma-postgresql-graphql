import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional, Max, Min } from 'class-validator';
import { Order, GqlOrder } from './gql-order.enum';
import OrderDirection from '../types/order-direction.type';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  skip?: number;

  @Field(() => Int)
  @IsOptional()
  @Min(0)
  @Max(100)
  take: number = 10;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  cursor?: number;

  @Field(() => GqlOrder)
  @IsOptional()
  @IsEnum(Order)
  order: OrderDirection = Order.asc;
}
