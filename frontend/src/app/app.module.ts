import { HttpClient, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { MaterialModule } from './material.module'

import { AppComponent } from './app.component'
import { BaugrundstueckeComponent } from './baugrundstuecke/baugrundstuecke.component'
import { BaugrundstueckefuergewerbeComponent } from './baugrundstueckefuergewerbe/baugrundstueckefuergewerbe.component'
import { BueromietenComponent } from './bueromieten/bueromieten.component'
import { CoreModule } from './core/core.module'
import { EigenheimeComponent } from './eigenheime/eigenheime.component'
import { EigentumswohnungenComponent } from './eigentumswohnungen/eigentumswohnungen.component'
import { HallenmietenComponent } from './hallenmieten/hallenmieten.component'
import { ImmoTabelleComponent } from './immotabelle/immotabelle.component'
import { LadenmietenComponent } from './ladenmieten/ladenmieten.component'
import { MietpreisefuerwohnungenComponent } from './mietpreisefuerwohnungen/mietpreisefuerwohnungen.component'
import { RenditeobjekteComponent } from './renditeobjekte/renditeobjekte.component'
import { SharedModule } from './shared/shared.module'

@NgModule({
  declarations: [
    AppComponent,
    ImmoTabelleComponent,
    BaugrundstueckeComponent,
    EigenheimeComponent,
    EigentumswohnungenComponent,
    RenditeobjekteComponent,
    MietpreisefuerwohnungenComponent,
    BueromietenComponent,
    LadenmietenComponent,
    HallenmietenComponent,
    BaugrundstueckefuergewerbeComponent
  ],
  imports: [
		CoreModule,
		SharedModule,
		HttpClientModule,
    BrowserModule,
		BrowserAnimationsModule,
		MaterialModule,
    AppRoutingModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
