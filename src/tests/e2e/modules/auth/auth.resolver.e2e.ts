import gqlResponse from '@tests/e2e/common/gql-response';
import BaseContext from '@tests/e2e/context/base-context';
import { getMockedUser, getMockedPassword } from '@tests/mocks/user.mock';

const authTests = (ctx: BaseContext) => {
  const mockedPassword = getMockedPassword();
  const mockedUser = getMockedUser(mockedPassword);
  let accessToken = 'no-token';
  let refreshToken = 'no-token';

  it('Sign Up', async () => {
    const res = await ctx.request.getGql(`mutation {
      signUp (signUpInput: {
        email: "${mockedUser.email}",
        password: "${mockedPassword}",
        name: "${mockedUser.name}"
      }) {
        accessToken
        refreshToken
      }
    }`);
    const { signUp } = gqlResponse(res);

    expect(signUp).toHaveProperty('accessToken');
  });

  it('Sign In', async () => {
    const res = await ctx.request.getGql(`mutation {
      signIn(signInInput: {
         email: "${mockedUser.email}",
         password: "${mockedPassword}"
      }) {
        accessToken
        refreshToken
      }
    }`);
    const { signIn } = gqlResponse(res);

    expect(signIn).toHaveProperty('accessToken');
    expect(signIn).toHaveProperty('refreshToken');

    refreshToken = signIn.refreshToken;
  });

  it('Sign In with User info', async () => {
    const res = await ctx.request.getGql(`mutation {
      signIn(signInInput: {
         email: "${mockedUser.email}",
         password: "${mockedPassword}"
      }) {
        accessToken
        refreshToken
        user {
          name
        }
      }
    }`);
    const { signIn } = gqlResponse(res);

    expect(signIn).toHaveProperty('accessToken');
    expect(signIn).toHaveProperty('refreshToken');
    expect(signIn).toHaveProperty('user');

    expect(signIn.user).toHaveProperty('name', mockedUser.name);

    refreshToken = signIn.refreshToken;
  });

  it('Refresh tokens', async () => {
    const res = await ctx.request.getGql(`mutation {
      refreshToken(refreshTokenInput: {
        token: "${refreshToken}"
      }) {
        accessToken
        refreshToken
      }
    }`);
    const { refreshToken: data } = gqlResponse(res);

    expect(data).toHaveProperty('accessToken');
    expect(data).toHaveProperty('refreshToken');

    accessToken = data.accessToken;
  });

  it('Logout', async () => {
    const res = await ctx.request.getGqlAuth(
      accessToken,
      `mutation {
        logout {
          success
        }
      }`,
    );
    const { logout } = gqlResponse(res);

    expect(logout.success).toBe(true);
  });
};

export default authTests;
