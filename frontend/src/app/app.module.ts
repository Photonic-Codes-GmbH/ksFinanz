import { NgModule } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { CoreModule } from './core/core.module'
import { SharedModule } from './shared/shared.module'
import { SyncfusionModule } from './syncfusion.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
		CoreModule,
		SharedModule,
		HttpClientModule,
    BrowserModule,
		BrowserAnimationsModule,
		SyncfusionModule,
    AppRoutingModule,
  ],
  providers: [
		HttpClient,
	],
  bootstrap: [
		AppComponent,
]
})
export class AppModule {
}
