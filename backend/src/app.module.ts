import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonthlySpendingModule } from './monthly-spending/monthly-spending.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SalaryInfoModule } from './salary-info/salary-info.module';
import { CompanyInfoModule } from './company-info/company-info.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MonthlySpendingModule,
    PrismaModule,
    SalaryInfoModule,
    CompanyInfoModule,
    UserModule,
    AuthModule,
    // ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
