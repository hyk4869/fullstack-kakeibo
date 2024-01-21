import { Injectable } from '@nestjs/common';
import { TBonus, TTaxBonus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BonusInfoService {
  constructor(private prisma: PrismaService) {}

  async getBonus(userID: string): Promise<TBonus[]> {
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

  async getBonusTax(userID: string): Promise<TTaxBonus[]> {
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
}
