import { Module } from '@nestjs/common';
import { PasswordModule } from './password/password.module';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { authConstants } from './auth.constants';
import { PrismaService } from '@providers/prisma/prisma.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    PasswordModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: authConstants.jwt.accessTtl,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    GqlAuthGuard,
    PrismaService,
    TokenService,
  ],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
