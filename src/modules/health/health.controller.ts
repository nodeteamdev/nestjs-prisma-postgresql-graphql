import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@providers/prisma/prisma.service';
import healthConstants from './health.constants';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get('prisma')
  @HealthCheck()
  prismaCheck() {
    return this.health.check([
      async () => this.prismaHealth.pingCheck('prisma', this.prisma),
    ]);
  }

  @Get('memory')
  @HealthCheck()
  memoryCheck() {
    return this.health.check([
      () =>
        this.memory.checkHeap(
          'memory_heap',
          healthConstants.memoryHeapLimit * 1024 * 1024,
        ),
    ]);
  }
}
