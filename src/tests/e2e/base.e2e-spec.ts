import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@app/app.module';
import healthTests from './modules/health/health.controller.e2e-spec';
import authTests from './modules/auth/auth.resolver.e2e-spec';
import userTests from './modules/user/user.resolver.e2e-spec';
import postTests from './modules/post/post.resolver.e2e-spec';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('HealthController (e2e)', healthTests);

  describe('AuthResolver (e2e)', authTests);

  describe('UserResolver (e2e)', userTests);

  describe('PostResolver (e2e)', postTests);

  afterAll(async () => {
    await app.close();
  });
});
