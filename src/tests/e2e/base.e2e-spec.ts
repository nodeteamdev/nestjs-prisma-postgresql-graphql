import healthTests from './modules/health/health.controller.e2e';
import authTests from './modules/auth/auth.resolver.e2e';
import userTests from './modules/user/user.resolver.e2e';
import postTests from './modules/post/post.resolver.e2e';
import BaseContext from './context/base-context';

describe('App (e2e)', () => {
  const ctx = new BaseContext();

  beforeAll(async () => {
    await ctx.init();
  });

  describe('HealthController (e2e)', healthTests.bind(null, ctx));

  describe('AuthResolver (e2e)', authTests.bind(null, ctx));

  describe('UserResolver (e2e)', userTests.bind(null, ctx));

  describe('PostResolver (e2e)', postTests.bind(null, ctx));

  afterAll(async () => {
    await ctx.end();
  });
});
