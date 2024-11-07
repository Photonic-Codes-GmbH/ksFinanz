export class Config {
  public backend: BackendConfig;
  public keycloak: KeycloakConfig;

  public constructor(backend: BackendConfig, keycloak: KeycloakConfig) {
    this.backend = backend;
    this.keycloak = keycloak;
  }
}

export class BackendConfig {
  public protocol: string;
  public domain: string;
  public port: string;
  public prefix: string;

  public constructor(protocol: string, domain: string, port: string, prefix: string) {
    this.protocol = protocol;
    this.domain = domain;
    this.port = port;
    this.prefix = prefix;
  }
}

export class KeycloakConfig {
  public url: string;
  public realm: string;
  public clientId: string;

  public constructor(url: string, realm: string, clientId: string) {
    this.url = url;
    this.realm = realm;
    this.clientId = clientId;
  }
}
