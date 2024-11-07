import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KeycloakGuard } from './core/guards/keycloak.guard';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
