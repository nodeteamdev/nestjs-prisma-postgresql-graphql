import { Test, TestingModule } from '@nestjs/testing';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy, mockReset } from 'jest-mock-extended';
import { PrismaService } from '@providers/prisma/prisma.service';
import { getMockedPost } from '@mocks/post.mock';
import { CreatePostInput } from './dto/create-post.input';
import { defaultUser } from '@mocks/user.mock';
import Order from '@dto/gql-order.enum';
import { UpdatePostInput } from './dto/update-post.input';

describe('PostResolver', () => {
  const mockedPost = getMockedPost();
  let resolver: PostResolver;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostResolver,
        PostService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    resolver = module.get<PostResolver>(PostResolver);
  });

  beforeEach(() => {
    mockReset(prismaMock);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create post', async () => {
    const postInput: CreatePostInput = {
      title: mockedPost.title,
      content: mockedPost.content,
    };

    prismaMock.post.create.mockResolvedValue(mockedPost);

    expect(await resolver.createPost(postInput, defaultUser)).toHaveProperty(
      'id',
      1,
    );
  });

  it('should find post in array', async () => {
    prismaMock.post.findMany.mockResolvedValue([mockedPost]);

    expect(
      await resolver.findAll({
        skip: 0,
        take: 10,
        order: Order.desc,
      }),
    ).toHaveLength(1);
  });

  it('should find post by id', async () => {
    prismaMock.post.findUnique.mockResolvedValue(mockedPost);

    expect(await resolver.findOne(mockedPost.id)).toHaveProperty(
      'title',
      mockedPost.title,
    );
  });

  it('should update post', async () => {
    const postUpdateInput: UpdatePostInput = {
      id: mockedPost.id,
      published: true,
      title: mockedPost.title,
      content: mockedPost.content,
    };

    prismaMock.post.update.mockResolvedValue({
      ...mockedPost,
      published: true,
    });

    expect(
      await resolver.updatePost(postUpdateInput, defaultUser),
    ).toHaveProperty('published', true);
  });

  it('should remove post', async () => {
    prismaMock.post.delete.mockResolvedValue(mockedPost);

    expect(
      await resolver.removePost(mockedPost.id, defaultUser),
    ).toHaveProperty('id', mockedPost.id);
  });
});
