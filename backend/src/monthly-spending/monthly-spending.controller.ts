import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MonthlySpendingService } from './monthly-spending.service';
import { MCategory, TMonthlySpending } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('summaryTable')
export class MonthlySpendingController {
  constructor(private readonly monthlySpendingService: MonthlySpendingService) {}

  /**
   * TMonthlyとMCategoryをDBからクライアントに送信
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMonthlySpendingWithCategory(@Query('userID') userID: string): Promise<TMonthlySpending[]> {
    return this.monthlySpendingService.getMonthlySpendingWithCategory(userID);
  }

  /**
   * 期間を指定してTMonthlyとMCategoryをDBからクライアントに送信
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('/someContent')
  async getMonthlySpendingByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('userID') userID: string,
  ): Promise<TMonthlySpending[]> {
    const startDateDate = new Date(startDate);
    const endDateDate = new Date(endDate);

    const monthlySpending = await this.monthlySpendingService.getMonthlySpendingByDateRange(
      startDateDate,
      endDateDate,
      userID,
    );
    return monthlySpending;
  }

  /**
   * TMonthlySpendingを保存
   */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async postSaveContent(@Body() postData: TMonthlySpending[]): Promise<TMonthlySpending[]> {
    return this.monthlySpendingService.postMonthlySpending(postData);
  }

  /**
   * TMonthlySpendingを削除
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/deleteContent')
  async postDeleteContent(@Body() postData: TMonthlySpending[]): Promise<TMonthlySpending[]> {
    return this.monthlySpendingService.deleteContent(postData);
  }
}
