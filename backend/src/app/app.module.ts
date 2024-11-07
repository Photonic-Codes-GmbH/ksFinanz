import { Module } from '@nestjs/common';
import { KeycloakConnectModule } from 'nest-keycloak-connect';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { KeycloakOptionsService } from './core/services/keycloak-options.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({ imports: [CoreModule], useExisting: KeycloakOptionsService }),
    CoreModule,
    SharedModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {
}
