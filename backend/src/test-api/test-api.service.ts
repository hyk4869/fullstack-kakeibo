import { Injectable } from '@nestjs/common';
import { MCompany } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilFunctions } from 'src/util/utils';

@Injectable()
export class TestApiService {
  constructor(private prisma: PrismaService) {}

  private util = new UtilFunctions();

  async testPost(postData: Record<string, any>) {
    const result = await this.util.getFindManyData<MCompany>(postData, this.util.mCompany);
    return result;
  }
}
