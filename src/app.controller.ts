import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  public getHome(): string {
    return 'your app is running';
  }
}
