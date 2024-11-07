import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './core/services/config.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

function initializeKeycloak(keycloak: KeycloakService, configService: ConfigService) {
  return () => keycloak.init({
    config: {
      url: configService.config.keycloak.url,
      realm: configService.config.keycloak.realm,
      clientId: configService.config.keycloak.clientId
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
    },
    loadUserProfileAtStartUp: true
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    KeycloakAngularModule,
    AppRoutingModule
  ],
  providers: [
    HttpClient,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigService]
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
