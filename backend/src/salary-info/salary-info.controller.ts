import { Controller, Get } from '@nestjs/common';
import { SalaryInfoService } from './salary-info.service';
import { MCompany, MHireDate, TBonus, TSalary, TTax, TTaxBonus } from '@prisma/client';

@Controller('salaryInfo')
export class SalaryInfoController {
  constructor(private readonly salaryInfoService: SalaryInfoService) {}

  @Get('/salaryTax')
  async getSalaryTaxContent(): Promise<TTax[]> {
    return this.salaryInfoService.getSalaryTax();
  }

  @Get('/salary')
  async getSalaryContent(): Promise<TSalary[]> {
    return this.salaryInfoService.getSalary();
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
