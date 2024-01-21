import { Module } from '@nestjs/common';
import { BonusInfoController } from './bonus-info.controller';
import { BonusInfoService } from './bonus-info.service';

@Module({
  controllers: [BonusInfoController],
  providers: [BonusInfoService]
})
export class BonusInfoModule {}
