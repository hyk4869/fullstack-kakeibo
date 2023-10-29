import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TMonthlySpending } from 'src/models/TmonthlySpending.model';
import { Repository } from 'typeorm';

@Injectable()
export class MonthlySpendingService {
  constructor(
    @InjectRepository(TMonthlySpending)
    private readonly tMonthlySpendingRepository: Repository<TMonthlySpending>,
  ) {}
  /**全てのmonthly_spendingを取得 */
  async getMonthlySpending(): Promise<TMonthlySpending[]> {
    return await this.tMonthlySpendingRepository.find();
  }
}
