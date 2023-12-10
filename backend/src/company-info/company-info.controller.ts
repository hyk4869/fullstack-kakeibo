import { Controller, Get } from '@nestjs/common';
import { CompanyInfoService } from './company-info.service';
import { MCompany, MHireDate } from '@prisma/client';

@Controller('companyInfo')
export class CompanyInfoController {
  constructor(private readonly companyInfoService: CompanyInfoService) {}
  @Get('/companyName')
  async getCompanyContent(): Promise<MCompany[]> {
    return this.companyInfoService.getCompanyContent();
  }
  @Get('/hireDate')
  async getHireDateContent(): Promise<MHireDate[]> {
    return this.companyInfoService.getHireDateContent();
  }
}
