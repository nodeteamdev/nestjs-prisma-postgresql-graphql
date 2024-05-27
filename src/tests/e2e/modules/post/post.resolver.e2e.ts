import Order from '@dto/gql-order.enum';
import { faker } from '@faker-js/faker';
import gqlResponse from '@tests/e2e/common/gql-response';
import BaseContext from '@tests/e2e/context/base-context';
import { getMockedPost } from '@tests/mocks/post.mock';
import { getMockedPassword, getMockedUser } from '@tests/mocks/user.mock';

const postTests = (ctx: BaseContext) => {
  const customPassword = getMockedPassword();
  let customUser = getMockedUser(customPassword);
  let customPost = getMockedPost(customUser);
  let accessToken = 'no-token';

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
    customUser = {
      ...customUser,
      id: signIn.user.id,
    };
    customPost = {
      ...customPost,
      author: customUser,
      authorId: customUser.id,
    };
  });

  it('Create post', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `mutation {
      createPost(createPostInput: {
         title: "${customPost.title}"
         content: "${customPost.content}"
      }) {
        id
        title
        content
        author {
          id
        }
      }
    }`,
    );
    const { createPost } = gqlResponse(res);

    expect(createPost.id).toBe(customPost.id);
    expect(createPost.author.id).toBe(customPost.authorId);

    customPost = createPost;
  });

  it('Get posts', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `{
      posts(take: 1, order: ${Order.desc}) {
        id
      }
    }`,
    );
    const { posts } = gqlResponse(res);

    expect(posts.length).toBeGreaterThanOrEqual(1);
    expect(posts[0].id).toBeGreaterThanOrEqual(1);
  });

  it('Get post', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `{
        post(id: ${customPost.id}) {
          id
          title
          author {
            id
          }
        }
      }`,
    );
    const { post } = gqlResponse(res);

    expect(post.id).toBe(customPost.id);
    expect(post.title).toBe(customPost.title);
    expect(post.author.id).toBe(customPost.author?.id);
  });

  it('Update post', async () => {
    const published = true;
    const title = faker.word.noun();
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `mutation {
      updatePost(updatePostInput: {
        id: ${customPost.id}
        title: "${title}"
        published: true
      }) {
        id
        title
        published
      }
    }`,
    );
    console.dir(res.body, { depth: null });
    const { updatePost } = gqlResponse(res);

    expect(updatePost.id).toBe(customPost.id);
    expect(updatePost.title).toBe(title);
    expect(updatePost.published).toBe(published);

    customPost = {
      ...customPost,
      title,
      published,
    };
  });

  it('Remove post', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `mutation {
      removePost(id: ${customPost.id}) {
        id
      }
    }`,
    );
    const { removePost } = gqlResponse(res);

    expect(removePost.id).toBe(customPost.id);
  });
};

export default postTests;
