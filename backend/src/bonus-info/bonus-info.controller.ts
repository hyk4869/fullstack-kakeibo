import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BonusInfoService } from './bonus-info.service';
import { TBonus, TTaxBonus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('bonusInfo')
export class BonusInfoController {
  constructor(private readonly bonusInfoService: BonusInfoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/bonusTax')
  async getBonusTaxContent(@Query('userID') userID: string): Promise<TTaxBonus[]> {
    return this.bonusInfoService.getBonusTax(userID);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/bonus')
  async getBonusContent(@Query('userID') userID: string): Promise<TBonus[]> {
    return this.bonusInfoService.getBonus(userID);
  }
}
