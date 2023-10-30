import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonthlySpendingModule } from './monthly-spending/monthly-spending.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [MonthlySpendingModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
