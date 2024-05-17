import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('prismaCheck', async () => {
    const res = await controller.prismaCheck();

    expect(res.status).toBe('ok');
  });

  it('memoryCheck', async () => {
    const res = await controller.memoryCheck();

    expect(res.status).toBe('ok');
  });
});
