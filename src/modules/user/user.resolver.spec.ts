import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Role } from '@prisma/client';
import { mockDeep, DeepMockProxy, mockReset } from 'jest-mock-extended';
import { PrismaService } from '@providers/prisma/prisma.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { mockedUser } from '@mocks/user.mock';
import Order from '@dto/gql-order.enum';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
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

  beforeEach(() => {
    mockReset(prismaMock);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should find user in array', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockedUser]);

    expect(
      await resolver.findAll({
        skip: 0,
        take: 10,
        order: Order.desc,
      }),
    ).toHaveLength(1);
  });

  it('should find user by id', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockedUser);

    expect(await resolver.findOne(mockedUser.id)).toHaveProperty(
      'name',
      mockedUser.name,
    );
  });

  it('should update user', async () => {
    const { id, ...updateUserInput } = {
      ...mockedUser,
      role: Role.ADMIN,
    };

    prismaMock.user.update.mockResolvedValue({
      ...updateUserInput,
      id,
    });

    const result = await resolver.updateUser(updateUserInput, mockedUser);

    expect(result).toHaveProperty('role', updateUserInput.role);
  });

  it('should remove post', async () => {
    prismaMock.user.delete.mockResolvedValue(mockedUser);

    expect(await resolver.removeUser(mockedUser)).toHaveProperty(
      'id',
      mockedUser.id,
    );
  });
});
