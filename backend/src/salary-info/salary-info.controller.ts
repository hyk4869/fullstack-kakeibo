import { Controller, Get } from '@nestjs/common';
import { SalaryInfoService } from './salary-info.service';
import { MCompany, MHireDate, TSalary, TTax } from '@prisma/client';

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
}
