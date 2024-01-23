import { Body, Controller, Post } from '@nestjs/common';
import { TestApiService } from './test-api.service';

@Controller('test-api')
export class TestApiController {
  constructor(private readonly testApiService: TestApiService) {}

  @Post('/test-post')
  async testPost(@Body() postData: Record<string, any>) {
    return this.testApiService.testPost(postData);
  }
}
