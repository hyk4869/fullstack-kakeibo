import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SalaryInfoService } from './salary-info.service';
import { TBonus, TSalary, TTax, TTaxBonus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('salaryInfo')
export class SalaryInfoController {
  constructor(private readonly salaryInfoService: SalaryInfoService) {}

  /**
   * TTaxを保存
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/salaryTax')
  async postSaveSalaryTaxContent(@Body() postData: TTax[]): Promise<TTax[]> {
    return this.salaryInfoService.postSalaryTaxContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/salaryTax/deletecontent')
  async postDeleteSalaryTaxContent(@Body() postData: TTax[]): Promise<TTax[]> {
    return this.salaryInfoService.deleteSalaryTaxContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/salaryTax')
  async getSalaryTaxContent(@Query('userID') userID: string): Promise<TTax[]> {
    return this.salaryInfoService.getSalaryTax(userID);
  }

  /**
   * TSalaryを保存
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/salary')
  async postSaveSalaryContent(@Body() postData: TSalary[]): Promise<TSalary[]> {
    return this.salaryInfoService.postSalaryContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/salary/deletecontent')
  async postDeleteSalaryContent(@Body() postData: TSalary[]): Promise<TSalary[]> {
    return this.salaryInfoService.deleteSalaryContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/salary')
  async getSalaryContent(@Query('userID') userID: string): Promise<TSalary[]> {
    return this.salaryInfoService.getSalary(userID);
  }
}
