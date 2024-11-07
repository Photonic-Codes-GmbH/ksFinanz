import { Component } from '@angular/core';

import { DataService } from './shared/services/data.service';
import { InteractionsService } from './shared/services/interactions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public constructor(
    public readonly dataService: DataService,
    public readonly interactionsService: InteractionsService
  ) {
  }
}
