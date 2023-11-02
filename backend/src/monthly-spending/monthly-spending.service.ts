import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { format } from 'date-fns';

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
  // async getMonthlySpendingWithCategory() {
  //   const monthlySpendings = await this.prisma.tMonthlySpending.findMany({
  //     include: {
  //       category: true,
  //     },
  //   });

  //   /**  日付フォーマット変換 */
  //   const formattedMonthlySpendings = monthlySpendings.map((spending) => ({
  //     ...spending,
  //     paymentDay: format(spending.paymentDay, 'yyyy-MM-dd HH:mm'),
  //   }));

  //   return formattedMonthlySpendings;
  // }
}
