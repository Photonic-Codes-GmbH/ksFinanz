import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {
  public isSaveDialogVisible: boolean = false;
  public isSaveSuccededDialogVisible: boolean = false;

  public constructor() {
  }

  public openSaveDialog(): void {
    this.isSaveDialogVisible = true;
  }

  public closeSaveDialog(): void {
    this.isSaveDialogVisible = false;
  }

  public openSaveSuccededDialog(): void {
    this.isSaveSuccededDialogVisible = true;
  }

  public closeSaveSuccededDialog(): void {
    this.isSaveSuccededDialogVisible = false;
  }
}
