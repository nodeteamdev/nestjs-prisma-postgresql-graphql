import Order from '@dto/gql-order.enum';
import gqlResponse from '@tests/e2e/common/gql-response';
import BaseContext from '@tests/e2e/context/base-context';
import { getMockedPassword, getMockedUser } from '@tests/mocks/user.mock';

const userTests = (ctx: BaseContext) => {
  const customPassword = getMockedPassword();
  const customUser = getMockedUser(customPassword);
  let accessToken = 'no-token';
  let userId = 0;

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

    userId = signIn.user.id;
    accessToken = signIn.accessToken;
  });

  it('Get users', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `{
      users(take: 1, order: ${Order.desc}) {
        id
      }
    }`,
    );
    const { users } = gqlResponse(res);

    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users[0].id).toBeGreaterThan(0);
  });

  it('Get User', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `{
      user(id: ${userId}) {
        id
        email
      }
    }`,
    );
    const { user } = gqlResponse(res);

    expect(user.id).toBe(userId);
    expect(user.email.toLowerCase()).toBe(customUser.email.toLowerCase());
  });

  it('Update User', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `mutation {
      updateUser(updateUserInput: {
        name: "${customUser.name}"
      }) {
        id
        name
      }
    }`,
    );
    const { updateUser } = gqlResponse(res);

    expect(updateUser.id).toBe(userId);
    expect(updateUser.name).toBe(customUser.name);
  });

  it('Remove User', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `mutation {
      removeUser {
        id
        name
      }
    }`,
    );
    const { removeUser } = gqlResponse(res);

    expect(removeUser.id).toBe(userId);
    expect(removeUser.name).toBe(customUser.name);
  });
};

export default userTests;
