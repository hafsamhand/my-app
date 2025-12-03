import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExampleModule } from './example/example.module';
import { LoansModule } from './loans/loans.module';
import { SpendingsModule } from './spendings/spendings.module';
import { SavingsModule } from './savings/savings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ExampleModule,
    LoansModule,
    SpendingsModule,
    SavingsModule,
  ],
})
export class AppModule {}
