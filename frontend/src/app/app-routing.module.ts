import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaugrundstueckeComponent } from './baugrundstuecke/baugrundstuecke.component';
import { EigenheimeComponent } from './eigenheime/eigenheime.component';
import { EigentumswohnungenComponent } from './eigentumswohnungen/eigentumswohnungen.component';
import { RenditeobjekteComponent } from './renditeobjekte/renditeobjekte.component';
import { MietpreisefuerwohnungenComponent } from './mietpreisefuerwohnungen/mietpreisefuerwohnungen.component';
import { BueromietenComponent } from './bueromieten/bueromieten.component';
import { LadenmietenComponent } from './ladenmieten/ladenmieten.component';
import { HallenmietenComponent } from './hallenmieten/hallenmieten.component';
import { BaugrundstueckefuergewerbeComponent } from './baugrundstueckefuergewerbe/baugrundstueckefuergewerbe.component';

const routes: Routes = [
  { path: '', component: BaugrundstueckeComponent },
  { path: 'eigenheime', component: EigenheimeComponent },
  { path: 'eigentumswohnungen', component: EigentumswohnungenComponent },
  { path: 'renditeobjekte', component: RenditeobjekteComponent },
  { path: 'mietpreise_fuer_wohnungen', component: MietpreisefuerwohnungenComponent },
  { path: 'bueromieten', component: BueromietenComponent },
  { path: 'ladenmieten', component: LadenmietenComponent },
  { path: 'hallenmieten', component: HallenmietenComponent },
  { path: 'baugrundstuecke_fuer_gewerbe', component: BaugrundstueckefuergewerbeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
