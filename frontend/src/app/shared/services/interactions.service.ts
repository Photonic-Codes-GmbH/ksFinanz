import { Injectable } from '@angular/core'

import { DataService } from './data.service'

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  public constructor(public readonly dataService: DataService) {
  }
}
