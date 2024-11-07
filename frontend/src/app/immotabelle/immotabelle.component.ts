import { Component, Input, OnInit } from '@angular/core';
import { ProjectDataCacheService } from 'src/app/project-data-cache.service';

import { AutomationsService } from 'src/app/automations.service';
import { ExcelService } from 'src/app/excel.service';

@Component({
  selector: 'app-immotabelle',
  templateUrl: './immotabelle.component.html',
  styleUrls: ['./immotabelle.component.scss']
})
export class ImmoTabelleComponent implements OnInit {
  @Input()
  public prefix: string = '';

  @Input()
  public title: string = 'ImmoTabelle';

  public constructor(public readonly projectDataCacheService: ProjectDataCacheService, private readonly excelService: ExcelService, private readonly automationsService: AutomationsService) {
    this.automationsService.reRegisterTriggers(this);
  }

  public ngOnInit(): void {
  }
}
