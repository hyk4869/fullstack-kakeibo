import { Module } from '@nestjs/common';
import { SalaryInfoController } from './salary-info.controller';
import { SalaryInfoService } from './salary-info.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [SalaryInfoController],
  providers: [SalaryInfoService, PrismaService],
})
export class SalaryInfoModule {}
