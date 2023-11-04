import { Controller, Get, Query } from '@nestjs/common';
import { MonthlySpendingService } from './monthly-spending.service';
// import { TMonthlySpending } from 'src/models/TmonthlySpending.model';
import { MCategory, TMonthlySpending } from '@prisma/client';

@Controller('monthly-spending')
export class MonthlySpendingController {
  constructor(
    private readonly monthlySpendingService: MonthlySpendingService,
  ) {}

  @Get()
  async getMonthlySpendingWithCategory(): Promise<TMonthlySpending[]> {
    return this.monthlySpendingService.getMonthlySpendingWithCategory();
  }
  @Get('/category')
  async getCategory(): Promise<MCategory[]> {
    return this.monthlySpendingService.getCategory();
  }
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
