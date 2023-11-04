import { Controller, Get, Query } from '@nestjs/common';
import { MonthlySpendingService } from './monthly-spending.service';
import { MCategory, TMonthlySpending } from '@prisma/client';

@Controller('monthly-spending')
export class MonthlySpendingController {
  constructor(
    private readonly monthlySpendingService: MonthlySpendingService,
  ) {}

  /** TMonthlyとMCategoryをDBからクライアントに送信 */
  @Get()
  async getMonthlySpendingWithCategory(): Promise<TMonthlySpending[]> {
    return this.monthlySpendingService.getMonthlySpendingWithCategory();
  }

  /** MCategoryをDBからクライアントに送信 */
  @Get('/category')
  async getCategory(): Promise<MCategory[]> {
    return this.monthlySpendingService.getCategory();
  }

  /** 期間を指定してTMonthlyとMCategoryをDBからクライアントに送信 */
  @Get('/someContent')
  async getMonthlySpendingByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<TMonthlySpending[]> {
    const startDateDate = new Date(startDate);
    const endDateDate = new Date(endDate);

    const monthlySpending =
      await this.monthlySpendingService.getMonthlySpendingByDateRange(
        startDateDate,
        endDateDate,
      );
    return monthlySpending;
  }
}
