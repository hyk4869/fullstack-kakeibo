import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalaryInfoService {
  constructor(private prisma: PrismaService) {}

  async getCompanyContent() {
    const result = await this.prisma.mCompany.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }
}
