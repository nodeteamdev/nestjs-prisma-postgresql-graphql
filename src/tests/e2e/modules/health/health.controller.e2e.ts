import BaseContext from '@tests/e2e/context/base-context';

const healthTests = (ctx: BaseContext) => {
  it('Prisma should be healthy', async () => {
    const res = await ctx.request.get('/health/prisma');

    expect(res.body.status).toBe('ok');
  });

  it('Memory should be healthy', async () => {
    const res = await ctx.request.get('/health/memory');

    expect(res.body.status).toBeDefined();
  });
};

export default healthTests;
