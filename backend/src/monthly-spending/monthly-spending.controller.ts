import { Controller, Get } from '@nestjs/common';
import { MonthlySpendingService } from './monthly-spending.service';
import { TMonthlySpending } from 'src/models/TmonthlySpending.model';

@Controller('monthly-spending')
export class MonthlySpendingController {
  constructor(
    private readonly monthlySpendingService: MonthlySpendingService,
  ) {}

  @Get()
  async getMonthlySpending(): Promise<TMonthlySpending[]> {
    return this.monthlySpendingService.getMonthlySpending();
  }
}
