import { Component, Input, OnInit } from '@angular/core';
import { ProjectDataCacheService } from 'src/app/project-data-cache.service';

import { AutomationsService } from 'src/app/automations.service';
import { ExcelService } from 'src/app/excel.service';
import { Trigger } from 'src/app/automations.service';
import { DialogsService } from '../dialogs.service';

@Component({
  selector: 'app-hallenmieten',
  templateUrl: './hallenmieten.component.html',
  styleUrls: ['./hallenmieten.component.css']
})
export class HallenmietenComponent {
  @Input()
  public prefix: string = '';

  public constructor(public readonly projectDataCacheService: ProjectDataCacheService, private readonly excelService: ExcelService, private readonly automationsService: AutomationsService, private readonly dialogsService: DialogsService) {
    this.automationsService.reRegisterTriggers(this);
  }

  public ngOnInit(): void {
  }public triggers_savebutton: string[] = [];

public addTrigger_savebutton(trigger: Trigger): void {
  if (!this.triggers_savebutton.includes(trigger.id) && trigger.id === '7') {
    this.triggers_savebutton.push(trigger.id);
  }
}

public removeTrigger_savebutton(trigger: Trigger): void {
  const index = this.triggers_savebutton.indexOf(trigger.id);
  if (index > -1) {
    this.triggers_savebutton.splice(index, 1);
  }
}

public trigger_savebutton(): void {
  if (!this.triggers_savebutton) { return; }
  for (const triggerId of this.triggers_savebutton) {
    const trigger = this.automationsService.automations.find(automation => automation.trigger?.id === triggerId)?.trigger;
    if (trigger) {
      trigger.triggerAction();
    }
  }
}

public onButtonClicked_savebutton(): void {
  this.dialogsService.openSaveDialog();
}
}
