import { Module } from '@nestjs/common';
import { AllIncomeInfoController } from './all-income-info.controller';
import { AllIncomeInfoService } from './all-income-info.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AllIncomeInfoController],
  providers: [AllIncomeInfoService, PrismaService],
})
export class AllIncomeInfoModule {}
