import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BonusInfoService } from './bonus-info.service';
import { TBonus, TTaxBonus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('bonusInfo')
export class BonusInfoController {
  constructor(private readonly bonusInfoService: BonusInfoService) {}

  /**
   * TTaxBonusを保存
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/salaryTax')
  async postSaveSalaryTaxContent(@Body() postData: TTaxBonus[]): Promise<TTaxBonus[]> {
    return this.bonusInfoService.postBonusTaxContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/salaryTax/deletecontent')
  async postDeleteSalaryTaxContent(@Body() postData: TTaxBonus[]): Promise<TTaxBonus[]> {
    return this.bonusInfoService.deleteBonusTaxContent(postData);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/bonusTax')
  async getBonusTaxContent(@Query('userID') userID: string): Promise<TTaxBonus[]> {
    return this.bonusInfoService.getBonusTax(userID);
  }

  /**
   * TBonusを保存
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/salary')
  async postSaveSalaryContent(@Body() postData: TBonus[]): Promise<TBonus[]> {
    return this.bonusInfoService.postBonusContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/salary/deletecontent')
  async postDeleteSalaryContent(@Body() postData: TBonus[]): Promise<TBonus[]> {
    return this.bonusInfoService.deleteBonusContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/bonus')
  async getBonusContent(@Query('userID') userID: string): Promise<TBonus[]> {
    return this.bonusInfoService.getBonus(userID);
  }
}
