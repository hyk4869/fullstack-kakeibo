import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TMonthlySpending } from 'src/models/monthlySpending.model';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(TMonthlySpending)
    private readonly tMonthlySpendingRepository: Repository<TMonthlySpending>,
  ) {}
  /**全てのmonthly_spendingを取得 */
  async getMonthlySpending(): Promise<TMonthlySpending[]> {
    return await this.tMonthlySpendingRepository.find();
  }
}
