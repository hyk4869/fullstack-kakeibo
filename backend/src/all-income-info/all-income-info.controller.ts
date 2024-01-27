import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AllIncomeInfoService } from './all-income-info.service';
import { AuthGuard } from '@nestjs/passport';
import { AllIncomeData } from './interface/allIncomeInfoInterface';

@Controller('all-income-info')
export class AllIncomeInfoController {
  constructor(private readonly allIncomeInfoService: AllIncomeInfoService) {}

  /**
   * 全データを取得
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllIncomeInfo(@Query('userID') userID: string): Promise<AllIncomeData> {
    return this.allIncomeInfoService.getAllIncomeInfo(userID);
  }
}
