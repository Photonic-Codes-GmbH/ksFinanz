import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BackendConfig, Config, KeycloakConfig } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public config: Config;

  public baseUrl: string;

  public constructor() {
    this.config = new Config(
      new BackendConfig(environment.backendProtocol, environment.backendDomain, environment.backendPort, environment.backendPrefix),
      new KeycloakConfig(environment.keycloakUrl, environment.keycloakRealm, environment.keycloakClientId)
    );

    this.baseUrl = `${this.config.backend.protocol}://${this.config.backend.domain}${this.config.backend.port ? `:${this.config.backend.port}` : ''}/${this.config.backend.prefix}`;
  }
}
