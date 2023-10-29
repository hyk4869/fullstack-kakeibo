import { Module } from '@nestjs/common';
import { MonthlySpendingService } from './monthly-spending.service';
import { MonthlySpendingController } from './monthly-spending.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TMonthlySpending } from 'src/models/TmonthlySpending.model';
import { MCategory } from 'src/models/Mcategory.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([TMonthlySpending, MCategory]), //後ほど検証
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'calc-spending-1030',
      entities: [TMonthlySpending, MCategory], //後ほど検証
      synchronize: true,
    }),
  ],
  providers: [MonthlySpendingService],
  controllers: [MonthlySpendingController],
})
export class MonthlySpendingModule {}
