import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CompanyInfoService } from './company-info.service';
import { MCompany, MHireDate } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('companyInfo')
export class CompanyInfoController {
  constructor(private readonly companyInfoService: CompanyInfoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/companyName')
  async postCompanyContent(@Body() postData: MCompany[]): Promise<MCompany[]> {
    return this.companyInfoService.postCompanyContent(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/hireDate')
  async postHireDataContent(@Body() postData: MHireDate[]): Promise<MHireDate[]> {
    return this.companyInfoService.postHireDataContent(postData);
  }
}
