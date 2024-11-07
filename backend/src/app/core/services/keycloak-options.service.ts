import { Injectable } from '@nestjs/common';
import { KeycloakConnectOptions, KeycloakConnectOptionsFactory } from 'nest-keycloak-connect';

import { ConfigService } from './config.service';

@Injectable()
export class KeycloakOptionsService implements KeycloakConnectOptionsFactory {
  public constructor(private readonly configService: ConfigService) {
  }

  public createKeycloakConnectOptions(): KeycloakConnectOptions {
    const options: KeycloakConnectOptions = {
      authServerUrl: this.configService.config.keycloak.url,
      realm: this.configService.config.keycloak.realm,
      clientId: this.configService.config.keycloak.clientId,
      secret: this.configService.config.keycloak.clientSecret,
    };

    return options;
  }
}
