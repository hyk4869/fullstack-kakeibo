import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // constructor(private readonly config: ConfigService) {
  //   super({
  //     datasources: {
  //       db: {
  //         url: config.get('DATABASE_URL'),
  //       },
  //     },
  //   });
  // }

  async onModuleInit() {
    await this.$connect();
  }
}

//ConfigServiceは、NestJSアプリケーション内で環境変数や構成ファイルから設定情報を取得し、
//それらの設定情報をアプリケーション内で使用できるようにするためのサービス
