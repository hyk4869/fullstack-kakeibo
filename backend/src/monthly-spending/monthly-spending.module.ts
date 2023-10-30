import { Module } from '@nestjs/common';
import { MonthlySpendingService } from './monthly-spending.service';
import { MonthlySpendingController } from './monthly-spending.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [MonthlySpendingController],
  providers: [MonthlySpendingService, PrismaService],
})
export class MonthlySpendingModule {}
