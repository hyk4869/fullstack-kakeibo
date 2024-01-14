import { Module } from '@nestjs/common';
import { MonthlySpendingService } from './monthly-spending.service';
import { MonthlySpendingController } from './monthly-spending.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [MonthlySpendingController],
  providers: [MonthlySpendingService, PrismaService, JwtService],
})
export class MonthlySpendingModule {}
