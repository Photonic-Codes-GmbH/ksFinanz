import { Component, Input, OnInit } from '@angular/core';
import { ProjectDataCacheService } from 'src/app/project-data-cache.service';

import { AutomationsService } from 'src/app/automations.service';
import { ExcelService } from 'src/app/excel.service';
import { DialogsService } from './dialogs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
//  @ViewChild(RouterOutlet, { static: false })
//  public outlet!: RouterOutlet;

  @Input()
  public prefix: string = '';

  public wohnen: string = 'Wohnen';

  public constructor(
    public readonly projectDataCacheService: ProjectDataCacheService,
    private readonly excelService: ExcelService,
    private readonly automationsService: AutomationsService,
    public readonly dialogsService: DialogsService
  ) {
    this.automationsService.reRegisterTriggers(this);
  }

  public ngOnInit(): void {
  }

  public save(): void {
//    const component = this.outlet.component as any;

//    Object.getOwnPropertyNames(component.__proto__).forEach((methodName) => {
//      if (methodName.startsWith('trigger_')) {
//        component[methodName]();
//      }
//    });

//    this.automationsService.automations.forEach((automation) => {
//      automation.trigger?.triggerAction();
//    });

    const mergedAutomation = this.automationsService.mergeAutomations();
    mergedAutomation.trigger?.triggerAction();

    this.dialogsService.closeSaveDialog();

    this.dialogsService.openSaveSuccededDialog();
    setTimeout(() => this.dialogsService.closeSaveSuccededDialog(), 1500);
  }
}
