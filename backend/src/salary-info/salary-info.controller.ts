import { Controller, Get } from '@nestjs/common';
import { SalaryInfoService } from './salary-info.service';
import { MCompany, MHireDate, TTax } from '@prisma/client';

@Controller('salaryInfo')
export class SalaryInfoController {
  constructor(private readonly salaryInfoService: SalaryInfoService) {}

  @Get('/salaryTax')
  async getSalaryTaxContent(): Promise<TTax[]> {
    return this.salaryInfoService.getSalaryTax();
  }
}
