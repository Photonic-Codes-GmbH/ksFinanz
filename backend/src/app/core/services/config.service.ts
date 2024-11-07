import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

import { BackendConfig, Config, DatabaseConfig, KeycloakConfig } from '../models/config.model';

@Injectable()
export class ConfigService {
  public readonly config: Config;

  public constructor() {
    config();

    const backendProtocol = process.env.BACKEND_PROTOCOL || 'http';
    const backendDomain = process.env.BACKEND_DOMAIN || 'localhost';
    const backendPort = process.env.BACKEND_PORT || '3000';
    const backendPrefix = process.env.BACKEND_PREFIX || 'api';

    const keycloakUrl = process.env.KEYCLOAK_URL || '';
    const keycloakRealm = process.env.KEYCLOAK_REALM || '';
    const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || '';
    const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET || '';

    const databaseHost = process.env.DATABASE_HOST || 'localhost';
    const databasePort = process.env.DATABASE_PORT || '3306';
    const databaseUsername = process.env.DATABASE_USERNAME || 'user';
    const databasePassword = process.env.DATABASE_PASSWORD || 'password';
    const databaseName = process.env.DATABASE_NAME || 'db';

    this.config = new Config(
      new BackendConfig(backendProtocol, backendDomain, backendPort, backendPrefix),
      new KeycloakConfig(keycloakUrl, keycloakRealm, keycloakClientId, keycloakClientSecret),
      new DatabaseConfig(databaseHost, databasePort, databaseUsername, databasePassword, databaseName)
    );
  }
}
