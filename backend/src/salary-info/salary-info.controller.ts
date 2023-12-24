import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalaryInfoService } from './salary-info.service';
import { TBonus, TSalary, TTax, TTaxBonus } from '@prisma/client';

@Controller('salaryInfo')
export class SalaryInfoController {
  constructor(private readonly salaryInfoService: SalaryInfoService) {}

  @Get('/salaryTax')
  async getSalaryTaxContent(): Promise<TTax[]> {
    return this.salaryInfoService.getSalaryTax();
  }

  @Post('/salaryTax')
  async postSaveSalaryTaxContent(@Body() postData: TTax[]): Promise<TTax[]> {
    return this.salaryInfoService.postSalaryTaxContent(postData);
  }

  @Post('/salaryTax/deletecontent')
  async postDeleteSalaryTaxContent(@Body() postData: TTax[]): Promise<TTax[]> {
    return this.salaryInfoService.deleteSalaryTaxContent(postData);
  }

  @Get('/salary')
  async getSalaryContent(): Promise<TSalary[]> {
    return this.salaryInfoService.getSalary();
  }

  @Post('/salary')
  async postSaveSalaryContent(@Body() postData: TSalary[]): Promise<TSalary[]> {
    return this.salaryInfoService.postSalaryContent(postData);
  }

  @Post('/salary/deletecontent')
  async postDeleteSalaryContent(@Body() postData: TSalary[]): Promise<TSalary[]> {
    return this.salaryInfoService.deleteSalaryContent(postData);
  }

  @Get('/bonusTax')
  async getBonusTaxContent(): Promise<TTaxBonus[]> {
    return this.salaryInfoService.getBonusTax();
  }

  @Get('/bonus')
  async getBonusContent(): Promise<TBonus[]> {
    return this.salaryInfoService.getBonus();
  }
}
