import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma.service';
import { randomInt, randomUUID } from 'crypto';
import SignUpInput from './dto/sign-up.input';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let prismaMock: DeepMockProxy<PrismaClient>;
  const userInfo: SignUpInput = {
    email: `${randomInt(10000)}@example.com.invalid`,
    password: `${randomUUID()}$`,
    name: randomUUID(),
  };
  let refreshToken: string = '';

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('signUp', async () => {
    const res = await resolver.signUp(userInfo);

    expect(res).toBeDefined();

    expect(res.accessToken.length).toBeGreaterThan(1);
    expect(res.refreshToken.length).toBeGreaterThan(1);
  });

  it('signIn', async () => {
    const res = await resolver.signIn({
      email: userInfo.email,
      password: userInfo.password,
    });

    expect(res).toBeDefined();

    expect(res.accessToken.length).toBeGreaterThan(1);
    expect(res.refreshToken.length).toBeGreaterThan(1);

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
});
