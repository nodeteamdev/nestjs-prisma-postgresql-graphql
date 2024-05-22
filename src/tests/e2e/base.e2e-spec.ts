import healthTests from './modules/health/health.controller.e2e';
// import authTests from './modules/auth/auth.resolver.e2e-spec';
// import userTests from './modules/user/user.resolver.e2e-spec';
// import postTests from './modules/post/post.resolver.e2e-spec';
import BaseContext from './context/base-context';

describe('App (e2e)', () => {
  const ctx = new BaseContext();

  beforeAll(async () => {
    await ctx.init();
  });

  describe('HealthController (e2e)', healthTests.bind(null, ctx));

  // describe('AuthResolver (e2e)', authTests);

  // describe('UserResolver (e2e)', userTests);

  // describe('PostResolver (e2e)', postTests);

  afterAll(async () => {
    await ctx.end();
  });
});
