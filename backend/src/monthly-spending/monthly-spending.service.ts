import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { format } from 'date-fns';
import { MCategory } from '@prisma/client';

@Injectable()
export class MonthlySpendingService {
  constructor(private prisma: PrismaService) {}

  async getMonthlySpendingWithCategory() {
    return this.prisma.tMonthlySpending.findMany({
      include: {
        category: true,
      },
    });
  }

  async getCategory(): Promise<MCategory[]> {
    return this.prisma.mCategory.findMany();
  }
}
