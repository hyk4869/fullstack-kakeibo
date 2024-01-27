import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllIncomeData } from './interface/allIncomeInfoInterface';
import { TBonus, TSalary, TTax, TTaxBonus } from '@prisma/client';

@Injectable()
export class AllIncomeInfoService {
  constructor(private prisma: PrismaService) {}

  async getAllIncomeInfo(userID: string): Promise<AllIncomeData> {
    const getBonusTax = await this.getBonusTax(userID);
    const getBonus = await this.getBonus(userID);
    const getSalaryTax = await this.getSalaryTax(userID);
    const getSalary = await this.getSalary(userID);

    return {
      salaryData: getSalary,
      salaryTaxData: getSalaryTax,
      bonusData: getBonus,
      bonusTaxData: getBonusTax,
    };
  }

  private async getBonusTax(userID: string): Promise<TTaxBonus[]> {
    const result = await this.prisma.tTaxBonus.findMany({
      where: {
        userId: userID,
      },
      include: {
        TBonus: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

  private async getBonus(userID: string): Promise<TBonus[]> {
    const result = await this.prisma.tBonus.findMany({
      where: {
        userId: userID,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

  private async getSalaryTax(userID: string): Promise<TTax[]> {
    const result = await this.prisma.tTax.findMany({
      where: {
        userId: userID,
      },
      include: {
        TSalary: true,
        MCompany: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

  private async getSalary(userID: string): Promise<TSalary[]> {
    const result = await this.prisma.tSalary.findMany({
      where: {
        userId: userID,
      },
      include: {
        MCompany: true,
        TTax: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }
}
