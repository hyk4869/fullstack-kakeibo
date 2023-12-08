import { Controller, Get } from '@nestjs/common';
import { SalaryInfoService } from './salary-info.service';
import { MCompany, MHireDate } from '@prisma/client';

@Controller('salaryInfo')
export class SalaryInfoController {
  constructor(private readonly salaryInfoService: SalaryInfoService) {}

  @Get('/companyName')
  async getCompanyContent(): Promise<MCompany[]> {
    return this.salaryInfoService.getCompanyContent();
  }
  @Get('/hireDate')
  async getHireDateContenc(): Promise<MHireDate[]> {
    return this.salaryInfoService.getHireDateContent();
  }
}
