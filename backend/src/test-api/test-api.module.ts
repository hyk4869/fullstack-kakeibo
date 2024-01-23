import { Module } from '@nestjs/common';
import { TestApiController } from './test-api.controller';
import { TestApiService } from './test-api.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestApiController],
  providers: [TestApiService, PrismaService],
})
export class TestApiModule {}
