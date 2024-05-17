import { Module } from '@nestjs/common';
import { PostModule } from '@post/post.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { appConstants } from './app.constants';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { upperDirectiveTransformer } from 'src/common/directives/upper-case.directive';
import { HealthModule } from 'src/health/health.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: appConstants.cacheDefaultTtl,
        isGlobal: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    UserModule,
    PostModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
