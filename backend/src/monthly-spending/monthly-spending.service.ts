import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MCategory } from 'src/models/Mcategory.model';
import { TMonthlySpending } from 'src/models/TmonthlySpending.model';
import { Repository } from 'typeorm';

// @Injectable()
// export class MonthlySpendingService {
//   constructor(
//     @InjectRepository(TMonthlySpending)
//     private readonly tMonthlySpendingRepository: Repository<TMonthlySpending>,
//     @InjectRepository(MCategory) // MCategoryのリポジトリを注入
//     private readonly mCategoryRepository: Repository<MCategory>,
//   ) {}
//   /**全てのmonthly_spendingを取得 */
//   async getMonthlySpending(): Promise<TMonthlySpending[]> {
//     return await this.tMonthlySpendingRepository.find();
//   }
//   async getCategories(): Promise<MCategory[]> {
//     return await this.mCategoryRepository.find();
//   }
// }

@Injectable()
export class MonthlySpendingService {
  constructor(
    @InjectRepository(TMonthlySpending)
    private readonly tMonthlySpendingRepository: Repository<TMonthlySpending>,
  ) {}

  async getMonthlySpendingWithCategory(): Promise<TMonthlySpending[]> {
    return this.tMonthlySpendingRepository
      .createQueryBuilder('spending')
      .leftJoinAndSelect('spending.category', 'category')
      .getMany();
  }
}
