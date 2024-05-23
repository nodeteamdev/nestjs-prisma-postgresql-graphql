import Order from '@dto/gql-order.enum';
import { faker } from '@faker-js/faker';
import gqlResponse from '@tests/e2e/common/gql-response';
import BaseContext from '@tests/e2e/context/base-context';
import { getMockedPassword, getMockedUser } from '@tests/mocks/user.mock';

const postTests = (ctx: BaseContext) => {
  const customPassword = getMockedPassword();
  const customUser = getMockedUser(customPassword);
  let accessToken = 'no-token';
  let postId = 0;

  beforeAll(async () => {
    await ctx.request.getGql(`mutation {
      signUp (signUpInput: {
        email: "${customUser.email}"
        password: "${customPassword}"
      }) {
        accessToken
        refreshToken
      }
    }`);
    const res = await ctx.request.getGql(`mutation {
      signIn(signInInput: {
         email: "${customUser.email}"
         password: "${customPassword}"
      }) {
        accessToken
        refreshToken
        user {
          id
        }
      }
    }`);
    const { signIn } = gqlResponse(res);

    accessToken = signIn.accessToken;
  });

  it('Get posts', async () => {
    const res = await ctx.request.getGql(`mutation {
      createPost(createPostInput: {
         title: "${faker.word.noun}"
         content: "${faker.string.alphanumeric({ length: { min: 20, max: 100 } })}"
      }) {
        id
        title
        content
      }
    }`);
    const { posts } = gqlResponse(res);

    expect(posts.length).toBeGreaterThanOrEqual(1);
    expect(posts[0].id).toBeGreaterThan(0);
  });

  it('Get post', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `{
      post(id: ${postId}) {
        id
        email
      }
    }`,
    );
    const { post } = gqlResponse(res);

    expect(post.id).toBe(postId);
    expect(post.email).toBe(customPost.email);
  });

  it('Update post', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `mutation {
      updatepost(updatepostInput: {
        name: "${customPost.name}"
      }) {
        id
        name
      }
    }`,
    );
    const { updatepost } = gqlResponse(res);

    expect(updatepost.id).toBe(postId);
    expect(updatepost.name).toBe(customPost.name);
  });

  it('Remove post', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `mutation {
      removepost {
        id
        name
      }
    }`,
    );
    const { removepost } = gqlResponse(res);

    expect(removepost.id).toBe(postId);
    expect(removepost.name).toBe(customPost.name);
  });
};

export default postTests;
