import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [SavingsService],
  controllers: [SavingsController],
  exports: [SavingsService],
})
export class SavingsModule {}
