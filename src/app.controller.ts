import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): Object {
    return {
      message: 'Server is Running!',
    };
  }
}
