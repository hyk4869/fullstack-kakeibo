import { Module } from '@nestjs/common';
import { BonusInfoController } from './bonus-info.controller';
import { BonusInfoService } from './bonus-info.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [BonusInfoController],
  providers: [BonusInfoService, PrismaService],
})
export class BonusInfoModule {}
