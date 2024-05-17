import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaClient, Role } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create user', async () => {
    const createUserInput = {
      email: 'test@gmail.com.invalid',
      password: 'test-password',
      name: 'Test',
      role: Role.USER,
    };

    expect(await resolver.createUser(createUserInput)).toHaveProperty(['id']);
  });
});
