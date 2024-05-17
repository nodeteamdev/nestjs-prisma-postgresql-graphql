import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const BearerToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const authorizationHeader = GqlExecutionContext.create(context)
      .getContext()
      .req.rawHeaders.find((header) => header.includes('Bearer')) as string;

    return authorizationHeader.split('Bearer ')[1];
  },
);
