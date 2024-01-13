import { Body, Controller, Post, Query } from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import { MasterData } from './interface/masterDataInterface';

@Controller('masterData')
export class MasterDataController {
  constructor(private readonly masterDataservice: MasterDataService) {}

  @Post()
  async getMasterData(@Body('userID') userID: string): Promise<MasterData> {
    return await this.masterDataservice.getMasterData(userID);
  }
}
