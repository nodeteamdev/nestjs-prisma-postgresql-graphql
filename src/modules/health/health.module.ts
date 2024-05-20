import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaService } from '@providers/prisma/prisma.service';

@Module({
  imports: [TerminusModule],
  providers: [PrismaService],
  controllers: [HealthController],
})
export class HealthModule {}
