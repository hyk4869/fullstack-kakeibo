import { Controller, Get } from '@nestjs/common';
import { SalaryInfoService } from './salary-info.service';
import { MCompany } from '@prisma/client';

@Controller('salaryInfo')
export class SalaryInfoController {
  constructor(private readonly salaryInfoService: SalaryInfoService) {}

  @Get('/companyName')
  async getCompanyContent(): Promise<MCompany[]> {
    return this.salaryInfoService.getCompanyContent();
  }
}
