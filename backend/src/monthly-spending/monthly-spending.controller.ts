import { Controller, Get } from '@nestjs/common';
import { MonthlySpendingService } from './monthly-spending.service';
import { TMonthlySpending } from 'src/models/TmonthlySpending.model';
import { MCategory } from 'src/models/Mcategory.model';

// @Controller('monthly-spending')
// export class MonthlySpendingController {
//   constructor(
//     private readonly monthlySpendingService: MonthlySpendingService,
//   ) {}

//   @Get()
//   async getMonthlySpending(): Promise<TMonthlySpending[]> {
//     return this.monthlySpendingService.getMonthlySpending();
//   }
//   @Get('categories') // 新しいエンドポイントを追加
//   async getCategories(): Promise<MCategory[]> {
//     return this.monthlySpendingService.getCategories();
//   }
// }

@Controller('monthly-spending')
export class MonthlySpendingController {
  constructor(
    private readonly monthlySpendingService: MonthlySpendingService,
  ) {}

  @Get()
  async getMonthlySpendingWithCategory(): Promise<TMonthlySpending[]> {
    return this.monthlySpendingService.getMonthlySpendingWithCategory();
  }
}
