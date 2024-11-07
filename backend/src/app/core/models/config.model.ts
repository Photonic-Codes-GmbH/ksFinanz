export class Config {
  public backend: BackendConfig;
  public keycloak: KeycloakConfig;
  public database: DatabaseConfig;

  public constructor(backend: BackendConfig, keycloak: KeycloakConfig, database: DatabaseConfig) {
    this.backend = backend;
    this.keycloak = keycloak;
    this.database = database;
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
  public clientSecret: string;

  public constructor(url: string, realm: string, clientId: string, clientSecret: string) {
    this.url = url;
    this.realm = realm;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
}

export class DatabaseConfig {
  public host: string;
  public port: string;
  public username: string;
  public password: string;
  public name: string;

  public constructor(host: string, port: string, username: string, password: string, name: string) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.name = name;
  }
}
