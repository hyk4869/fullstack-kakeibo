import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TMonthlySpending } from 'src/models/monthlySpending.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([TMonthlySpending]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'calc-spending-1030',
      entities: [TMonthlySpending],
      synchronize: true,
    }),
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService],
})
export class ConnectionModule {}
