import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyInfoService {
  constructor(private prisma: PrismaService) {}
  async getCompanyContent() {
    const result = await this.prisma.mCompany.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }
  async getHireDateContent() {
    const result = await this.prisma.mHireDate.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }
}
