import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy, mockReset } from 'jest-mock-extended';
import { PrismaService } from '@providers/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authConstants } from './auth.constants';
import { PasswordModule } from './password/password.module';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { TokenService } from './token.service';
import { CacheModule } from '@nestjs/cache-manager';
import { defaultPassword, defaultUser } from '@mocks/user.mock';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let refreshToken: string = '';
  let accessToken: string = '';

  beforeAll(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.registerAsync({
          isGlobal: true,
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            ttl: configService.get<number>('CACHE_TTL'),
          }),
          inject: [ConfigService],
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
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
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        AuthService,
        JwtStrategy,
        GqlAuthGuard,
        TokenService,
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  beforeEach(async () => {
    mockReset(prismaMock);
  });

  it('signUp', async () => {
    prismaMock.user.create.mockResolvedValue(defaultUser);

    const res = await resolver.signUp({
      ...defaultUser,
      password: defaultPassword,
    });

    expect(res).toBeDefined();

    expect(res.accessToken.length).toBeGreaterThan(1);
    expect(res.refreshToken.length).toBeGreaterThan(1);
  });

  it('signIn', async () => {
    prismaMock.user.findUnique.mockResolvedValue(defaultUser);

    const res = await resolver.signIn({
      email: defaultUser.email,
      password: defaultPassword,
    });

    expect(res).toBeDefined();

    expect(res.accessToken.length).toBeGreaterThan(1);
    expect(res.refreshToken.length).toBeGreaterThan(1);

    accessToken = res.accessToken;
    refreshToken = res.refreshToken;
  });

  it('refreshToken', async () => {
    const res = await resolver.refreshToken({
      token: refreshToken,
    });

    expect(res).toBeDefined();

    expect(res.accessToken.length).toBeGreaterThan(1);
    expect(res.refreshToken.length).toBeGreaterThan(1);

    refreshToken = res.refreshToken;
  });

  it('refreshToken', async () => {
    const res = await resolver.logout(
      {
        ...defaultUser,
        posts: [],
      },
      accessToken,
    );

    expect(res).toBeDefined();

    expect(res.success).toBe(true);
  });
});
