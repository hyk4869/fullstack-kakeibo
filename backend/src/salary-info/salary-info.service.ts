import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalaryInfoService {
  constructor(private prisma: PrismaService) {}

  async getSalaryTax() {
    const result = await this.prisma.tTax.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

  async getSalary() {
    const result = await this.prisma.tSalary.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }
}
