import { Controller, Get } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { TMonthlySpending } from 'src/models/monthlySpending.model';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get()
  async getMonthlySpending(): Promise<TMonthlySpending[]> {
    return this.connectionService.getMonthlySpending();
  }
}
