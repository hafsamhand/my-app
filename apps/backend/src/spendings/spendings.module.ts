import { Module } from '@nestjs/common';
import { SpendingsService } from './spendings.service';
import { SpendingsController } from './spendings.controller';

@Module({
  providers: [SpendingsService],
  controllers: [SpendingsController],
  exports: [SpendingsService],
})
export class SpendingsModule {}
