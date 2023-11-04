import { Controller, Get } from '@nestjs/common';
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
}
