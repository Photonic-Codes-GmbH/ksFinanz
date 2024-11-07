import { NgModule, Provider } from '@angular/core'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { CommonModule } from '@angular/common'

import { DateInterceptor } from './interceptors/date.interceptor'

const dateInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: DateInterceptor,
  multi: true
}

@NgModule({
  imports: [
		CommonModule
  ],
  declarations: [
  ],
  providers: [
    dateInterceptorProvider
  ],
  exports: [
  ]
})
export class CoreModule {
}
