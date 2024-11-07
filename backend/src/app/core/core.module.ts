import { Module } from '@nestjs/common';

import { ConfigService } from './services/config.service';
import { TypeOrmOptionsService } from './services/typeorm-options.service';
import { KeycloakOptionsService } from './services/keycloak-options.service';

@Module({
  imports: [
  ],
  controllers: [
  ],
  providers: [
    ConfigService,
    TypeOrmOptionsService,
    KeycloakOptionsService
  ],
  exports: [
    ConfigService,
    TypeOrmOptionsService,
    KeycloakOptionsService
  ],
})
export class CoreModule {
}
