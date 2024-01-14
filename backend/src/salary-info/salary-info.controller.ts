import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SalaryInfoService } from './salary-info.service';
import { TBonus, TSalary, TTax, TTaxBonus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('salaryInfo')
export class SalaryInfoController {
  constructor(private readonly salaryInfoService: SalaryInfoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/salaryTax')
  async getSalaryTaxContent(@Query('userID') userID: string): Promise<TTax[]> {
    return this.salaryInfoService.getSalaryTax(userID);
  }

  @Post('/salaryTax')
  async postSaveSalaryTaxContent(@Body() postData: TTax[]): Promise<TTax[]> {
    return this.salaryInfoService.postSalaryTaxContent(postData);
  }

  @Post('/salaryTax/deletecontent')
  async postDeleteSalaryTaxContent(@Body() postData: TTax[]): Promise<TTax[]> {
    return this.salaryInfoService.deleteSalaryTaxContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/salary')
  async getSalaryContent(@Query('userID') userID: string): Promise<TSalary[]> {
    return this.salaryInfoService.getSalary(userID);
  }

  @Post('/salary')
  async postSaveSalaryContent(@Body() postData: TSalary[]): Promise<TSalary[]> {
    return this.salaryInfoService.postSalaryContent(postData);
  }

  @Post('/salary/deletecontent')
  async postDeleteSalaryContent(@Body() postData: TSalary[]): Promise<TSalary[]> {
    return this.salaryInfoService.deleteSalaryContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/bonusTax')
  async getBonusTaxContent(@Query('userID') userID: string): Promise<TTaxBonus[]> {
    return this.salaryInfoService.getBonusTax(userID);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/bonus')
  async getBonusContent(@Query('userID') userID: string): Promise<TBonus[]> {
    return this.salaryInfoService.getBonus(userID);
  }
}
