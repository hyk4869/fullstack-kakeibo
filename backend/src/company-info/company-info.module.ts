import { Module } from '@nestjs/common';
import { CompanyInfoController } from './company-info.controller';
import { CompanyInfoService } from './company-info.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CompanyInfoController],
  providers: [CompanyInfoService, PrismaService],
})
export class CompanyInfoModule {}
