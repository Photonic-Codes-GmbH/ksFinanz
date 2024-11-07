import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';

import { AppService } from './app.service';

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  public constructor(private readonly appService: AppService) {
  }

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
}
