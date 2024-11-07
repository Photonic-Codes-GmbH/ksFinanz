import { Injectable, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

import { ProjectDataCacheService } from './project-data-cache.service';
import { ExcelService } from 'src/app/excel.service';
import automations from './automations.json';

@Injectable({
  providedIn: 'root'
})
export class AutomationsService {
  public triggerMap: Map<string, Type<unknown>> = new Map<string, Type<unknown>>();
  public actionMap: Map<string, Type<unknown>> = new Map<string, Type<unknown>>();

  public automations!: Automation[];

  public constructor(
    private readonly http: HttpClient,
    private readonly projectDataCacheService: ProjectDataCacheService,
    private readonly excelService: ExcelService
  ) {
    this.triggerMap.set('file-uploaded', FileUploadedTrigger);
    this.triggerMap.set('button-clicked', ButtonClickedTrigger);

    this.actionMap.set('split-and-trim', SplitAndTrimAction);
    this.actionMap.set('download-file', DownloadFileAction);
    this.actionMap.set('custom-script', CustomScriptAction);
    this.actionMap.set('export-excel', ExportExcelAction);
    this.actionMap.set('send-email', SendEmailAction);

    this.loadAutomations();
  }

  public loadAutomations() {
    this.automations = [];

    const serializedAutomations = automations;

    for (const serializedAutomation of serializedAutomations) {
      const createdAutomation = new Automation();
      createdAutomation.id = serializedAutomation.id;
      createdAutomation.name = serializedAutomation.name;

      if (serializedAutomation?.trigger?.name) {
        const createdTrigger = new (this.triggerMap.get(serializedAutomation.trigger.name)!)() as any;

        createdTrigger.id = serializedAutomation.trigger.id;
        createdTrigger.name = serializedAutomation.trigger.name;
        createdTrigger.saveLayoutId = serializedAutomation.trigger.saveLayoutId;
        createdTrigger.automation = createdAutomation;

        createdAutomation.trigger = createdTrigger;
      }

      if (serializedAutomation?.action?.name) {
        const createdAction = this.loadSaveAction(createdAutomation, serializedAutomation.action);
        createdAutomation.action = createdAction;
      }

      this.automations.push(createdAutomation);
    }
  }

  private loadSaveAction(automation: Automation, saveAction: any): Action {
    let firstAction: Action | undefined;

    let previousAction: Action | undefined;
    let currentAction: Action | undefined;

    let currentSaveAction: any = saveAction;

    while (currentSaveAction) {
      if (currentSaveAction) {
        currentAction = Object.assign(new (this.actionMap.get(currentSaveAction.name)!)() as any, currentSaveAction);
        currentAction!.automation = automation;

        if (!previousAction) {
          firstAction = currentAction!;
        }

        if (previousAction) {
          previousAction.nextAction = currentAction;
          currentAction!.previousAction = previousAction;
        }

        if (currentSaveAction.name === 'split-and-trim') {
          (currentAction! as SplitAndTrimAction).excelService = this.excelService;
        }

        if (currentSaveAction.name === 'send-email') {
          (currentAction! as SendEmailAction).http = this.http;
          (currentAction! as SendEmailAction).projectDataCacheService = this.projectDataCacheService;
        }
      }

      currentSaveAction = currentSaveAction.nextAction;

      previousAction = currentAction;
      currentAction = undefined;
    }

    return firstAction!;
  }

  public reRegisterTriggers(layoutComponent: any) {
    for (const automation of this.automations) {
      if (!automation.trigger) { continue; }

      Object.getOwnPropertyNames(layoutComponent.__proto__).forEach((methodName) => {
        if (methodName.startsWith('removeTrigger')) {
          layoutComponent[methodName](automation.trigger);
        }
      });

      Object.getOwnPropertyNames(layoutComponent.__proto__).forEach((methodName) => {
        if (methodName.startsWith('addTrigger')) {
          layoutComponent[methodName](automation.trigger);
        }
      });
    }
  }

  public mergeAutomations(): Automation {
    const first = automations[0].action!;

    const mergedAutomation = new Automation();
    mergedAutomation.id = 'merged-automation-0';
    mergedAutomation.name = 'Merged Automation';

    // Create Trigger
    const trigger = new ButtonClickedTrigger();

    trigger.id = 'merged-trigger-0';
    trigger.name = 'button-clicked';
    trigger.saveLayoutId = 'merged-trigger-0';

    trigger.automation = mergedAutomation;
    mergedAutomation.trigger = trigger;

    // Merge Texts
    let mergedTexts = '';
    this.automations.forEach((automation) => {
      if (automation.action && automation.action.name === 'send-email') {
        mergedTexts += (automation.action as SendEmailAction).text;
      }
    });

    // Create Action
    const action = new SendEmailAction();

    action.id = first.id;
    action.name = first.name;
    action.service = first.service;
    action.host = first.host;
    action.port = first.port;
    action.secure = first.secure;
    action.user = first.user;
    action.password = first.password;
    action.from = first.from;
    action.to = first.to;
    action.subject = first.subject;
    action.text = mergedTexts;

    action.automation = mergedAutomation;
    mergedAutomation.action = action;

    action.http = this.http;
    action.projectDataCacheService = this.projectDataCacheService;

    return mergedAutomation;
  }
}

export abstract class Trigger {
  public id!: string;
  public name!: string;
  public saveLayoutId?: string;
  public automation?: Automation;

  public triggerAction(): void {
    if (this.automation && this.automation.action) {
      this.automation.action.executeAction();
    }
  }
}

export class ButtonClickedTrigger extends Trigger {
}

export class FileUploadedTrigger extends Trigger {
  public input: any;

  public override triggerAction(): void {
    if (this.automation && this.automation.action) {
      this.automation.action.input = this.input;
    }

    super.triggerAction();
  }
}

export abstract class Action {
  public id!: string;
  public name!: string;

  public previousAction?: Action;
  public nextAction?: Action;

  public automation?: Automation;

  public input: any;
  public output: any;

  public executeAction(test?: boolean): void {
    if (this.previousAction && test) {
      this.previousAction.executeAction(true);
      this.input = this.previousAction.output;
    }

    console.log('START ' + this.name);
    this.action();
    console.log('FINISHED ' + this.name + ' WITH ' + this.output);

    if (!this.output) {
      this.output = this.input;
    }

    if (this.nextAction && !test) {
      this.nextAction.input = this.output;
      this.nextAction.executeAction();
    }
  }

  public abstract action(): void;
}

export class CustomScriptAction extends Action {
  public code: string = '';

  public action(): void {
    try {
      eval(this.code);
    } catch (error) {
      console.error('ERROR CustomScriptAction: ' + error);
    }
  }
}

export class DownloadFileAction extends Action {
  public fileName: string = '';
  public fileExtension: string = '';

  public action(): void {
    const blob = new Blob([this.input], { type: 'charset=utf-8' });
    saveAs(blob, `${this.fileName}.${this.fileExtension}`);
  }
}

export class ExportExcelAction extends Action {
  public fileName: string = '';

  public action(): void {
    this.output = this.excelExport(Object.values(this.input));
  }

  private excelExport(excelData: any, mountType?: string) {
    let finalExcelData;

    if (mountType) {
      const seperatedExcelData = this.seperateExcelData(excelData, mountType);
      finalExcelData = seperatedExcelData
    } else {
      finalExcelData = excelData;
    }

    var exportExcelData = XLSX.utils.json_to_sheet(finalExcelData) ;

    // A workbook is the name given to an Excel file
    var wb = XLSX.utils.book_new() // make Workbook of Excel

    // add Worksheet to Workbook
    // Workbook contains one or more worksheets
    let workSheetName: string = '';
    if (mountType === 'THROUGH') {
      workSheetName = 'THT_IMPORT'
    } else if (mountType === 'SMD') {
      workSheetName = 'SMT_IMPORT'
    }
    XLSX.utils.book_append_sheet(wb, exportExcelData, workSheetName) // name of Worksheet AND what data is inside

    // export Excel file
    XLSX.writeFile(wb, (this.fileName ?? 'Default') + '.xlsx') // name of the file is 'book.xlsx'
  }

  seperateExcelData(exportData: any, mountType:string) {

    const excelFinalOutputData: any[] = [];
    let result: any[] = [];

    let importType = '';
    if (mountType === 'SMD') {
      importType = 'SMT_IMPORT'
    } else if (mountType === 'THROUGH') {
      importType = 'THT_IMPORT'
    }

    exportData.forEach((element: any) => {
      if (element.MountTYPE !== mountType && element.MountTYPE) {
        return;
      }
      if (element['Reference'].isMismatched !== undefined && element['Reference'].isMismatched === true) return;
      let newObject: any;

      let foundObject = result.find((elem:any) => !elem.isFilled && elem.itemNumber === element.Item && elem.side === element.Side && elem.assyopt === element.ASSY_OPT.value);
      if (!foundObject) {
        newObject = {
          itemNumber: element.Item,
          cells: [],
          side: element.Side,
          isFilled: false,
          sortNum: 999,
          assyopt: element.ASSY_OPT.value,
          isSeparator: false,
          'Teile-Nr.': element['Teile-Nr.']
        }
        newObject.cells.push(element['Reference'] || element['Reference'].value);

        result.push(
          newObject
        )
      } else {
        newObject = foundObject;
        newObject.cells.push(element['Reference'] || element['Reference'].value);
        if(newObject.cells.length >= 10) {
          newObject.isFilled = true;
        }
      }

      if ((element.Side === "TOP" || "Top") && element.ASSY_OPT.value !== 'DNP') {
        newObject.sortNum = 1;
      } else if (element.Side === "TOP" || "Top") {
        newObject.sortNum = 2;
      } else if (element.Side === "BOTTOM" && element.ASSY_OPT.value !== 'DNP') {
        newObject.sortNum = 3;
      } else if (element.Side === "BOTTOM" ) {
        newObject.sortNum = 4;
      } else if (!element.Side && element.ASSY_OPT.value === 'DNP') {
        newObject.sortNum = 5;
      }

      result.sort(function(firstObj: any, secondObj: any) {
        return firstObj.sortNum-secondObj.sortNum;
      });
    });

    let counter = 0;
    this.nineSeparator(result, importType);
    result.forEach((element) => {
      // add this for testing: 'side': element.side, 'assyopt': element.assyopt
      excelFinalOutputData.push({
        'Designator': element.cells.join(','),
        'SachNr.': element.isSeparator ? 999999 : element['Teile-Nr.'] || ++counter,
        'X-Koord': 0,
        'Y-Koord': 0,
        'Rot': 0,
        'Anzahl Teile': element.cells.length,
        'BG': importType,
        'side': element.side,
        'assyopt': element.assyopt
      })
    });

    return excelFinalOutputData;
  }

  private nineSeparator( result: any, importType: string) {
    let sepArr = result.reduce((accumulator: any, currentValue: any) => {
      if (accumulator.every((item: any) => !(item.sortNum === currentValue.sortNum))) accumulator.push(currentValue);
      return accumulator;
    }, []);
    if (sepArr.length > 0) {
      sepArr.splice(0, 1);
    }
    sepArr.forEach((num: any) => {
      let inx = result.findIndex((elem: any) => elem.sortNum === num.sortNum);

      if (inx !== -1) {
        result.splice(inx, 0, {
          itemNumber: 0,
          cells: [],
          side: '',
          isFilled: true,
          sortNum: num.sortNum+ 0.1,
          assyopt: '',
          isSeparator: true
        });
      }
    })
  }
}

export class SplitAndTrimAction extends Action {

  public constructor() {

			super()
  }

  public excelService!: ExcelService;

	excelData!: WorkBook;

	getAllStuff(){

		const excelDataString = ``
		if(excelDataString == "") return console.error('There is no excelData in the trigger element, have you selected a file?')
		this.excelData = JSON.parse(excelDataString) as WorkBook

		this.getAllSheets()
		this.getAllColumns()
	}


	/*
███████╗██╗  ██╗███████╗███████╗████████╗    ███████╗███████╗██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
██╔════╝██║  ██║██╔════╝██╔════╝╚══██╔══╝    ██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
███████╗███████║█████╗  █████╗     ██║       ███████╗█████╗  ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
╚════██║██╔══██║██╔══╝  ██╔══╝     ██║       ╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
███████║██║  ██║███████╗███████╗   ██║       ███████║███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝       ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
	*/
  public sheet: string = '';
	public get selectedSheet(): string {

		return this.sheet
	}

	public set selectedSheet(value: string) {

		this.sheet = value
		this.getAllStuff()
	}

	allSheets: string[] = []
	/**
	 * @returns The list of sheetnames of the excelData of the UI Element of the trigger of the current automation
	 */
	public getAllSheets() {

		// Return the list of sheetnames
		this.allSheets = this.excelData.SheetNames

		console.log('allSheets:', this.allSheets)
	}

	/*
 ██████╗ ██████╗ ██╗     ██╗   ██╗███╗   ███╗███╗   ██╗    ███████╗███████╗██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
██╔════╝██╔═══██╗██║     ██║   ██║████╗ ████║████╗  ██║    ██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
██║     ██║   ██║██║     ██║   ██║██╔████╔██║██╔██╗ ██║    ███████╗█████╗  ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
██║     ██║   ██║██║     ██║   ██║██║╚██╔╝██║██║╚██╗██║    ╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
╚██████╗╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚████║    ███████║███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
 ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝    ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

	*/

  public _column: string = ''
	public get column(): string {

		return this._column
	}

	public set column(value: string) {

		this._column = value
	}

	allColumns: string[] = []
	/**
	 * @returns The list of sheetnames of the excelData of the UI Element of the trigger of the current automation
	 */
	public getAllColumns() {
		console.log('getAllColumns called')

		const selectedSheet = this.excelData.Sheets[this.selectedSheet]
		if(!selectedSheet) return console.error('No sheet selected. I\'m trying to get all columns from the trigger')
		console.log('This is the selected sheet:', selectedSheet)

		const columns = []
		for (let key in selectedSheet) {

			if (key.length === 2 && key.endsWith('1')) columns.push(key.charAt(0))
		}

		this.allColumns = columns
	}

  public _separator: string = ''
  public get separator(): string {

		return this._separator
	}
	public set separator(value: string) {

		this._separator = value
	}

  public file: any;

	/**
   * Split & Trim ACTION
	 *
	 * Uses the selected sheet and uses the selected column,
	 *
	 * iterates over all rows and splits the value of the selected column by the
	 * separator.
	 *
	 * For each splitting, it creates a new row with the same values as the original
	 * row,
	 *
	 * except for the selected column, which is the splitted value.
	 *
   * Der Sinn und Zweck dieser Action ist es, die in der Variable column
	 * angegebene Spalte zu durchlaufen und alle Zellen, die den in der Variable
	 * separator angegebenen Wert enthalten, zu splitten.
	 *
   * Es muss dabei sichergestellt werden, dass die Zellen, die den Wert nicht
	 * enthalten, nicht verändert werden.
	 *
   * Es muss dabei sichergestellt werden, dass die Zellen, die den Wert enthalten,
	 * in mehrere Zellen aufgeteilt werden, wobei dafür neue Zeilen eingefügt werden
	 * müssen, diese neuen Zeilen müssen dabei die gleichen Werte in den anderen
	 * Spalten enthalten.
	 *
   * Wenn einmal eine Zelle aufgesplittet wurde und danach eine Zelle kommt, die
	 * nicht aufgesplittet werden muss, dann muss die geprüfte Zelle richtig sein
	 * und auch die Daten der anderen Spalten. Die Daten der anderen Spalten müssen
	 * weiterhin aus der korrekten Zeile kommen.
	 *
   * @returns The updated sheet
   */
  public action(): void {

		// All input fields must have a value
    if (!this.selectedSheet) return console.log('No sheet selected')
    if (!this.column) return console.log('No column selected')
    if (!this.separator) return console.log('No separator selected')

    const sheet = this.excelService.excelData.Sheets[this.selectedSheet]
    //console.log(excelData)

    // Store a clone of the sheet
    const sheetClone = { ...sheet }

    if (!sheet) return console.log('Sheet not found')

    // Iterate over all rows of the selected sheet in the selected column
    let rowIndex = 0
    let cloneRowIndex = 1
    while (sheet[this.column + (rowIndex + 1)]) {

      rowIndex++
      let oldCellKey = this.column + rowIndex
      let cloneCellKey = this.column + cloneRowIndex

      // console.log('going over ', oldCellKey)
      const cellContent = sheet[oldCellKey]

      const isString = cellContent.t == 's'
      const containsSeparator = isString && cellContent.v.includes(this.separator)

      if (!isString || !containsSeparator) {

        // Replace the cell in sheetClone
        sheetClone[cloneCellKey] = { ...cellContent }
        // console.log('Writing from '+oldCellKey+' to new '+cloneCellKey+':', sheetClone[cloneCellKey].v)

        // Copy the rest of the row
        this.allColumns.forEach((column: string) => {

          if (column == this.column) return
          const sourceCellKey = column + rowIndex
          const targetCellKey = column + cloneRowIndex

          // Copy the value from the original cell to the new cell
          // if (column == "B") console.log('Copying value from old', sourceCellKey, 'to new', targetCellKey, "value is", sheet[sourceCellKey].v)
          sheetClone[targetCellKey] = { ...sheet[sourceCellKey] }
        })
        cloneRowIndex++
        cloneCellKey = this.column + cloneRowIndex

        continue
      }
      // console.log('We need to split:', cellContent)

      // Split the value by the separator
      const splittedValues = cellContent.v.split(this.separator)
      // console.log('We need to split cell '+oldCellKey+' with these values:', splittedValues)

      splittedValues.forEach((value: string, index: number) => {

        sheetClone[cloneCellKey] = { ...cellContent, v: value.trim() }
        // console.log('Writing '+sheetClone[cloneCellKey].v+' into new', cloneCellKey)

        // Copy the rest of the row
        this.allColumns.forEach((column: string) => {

          if (column == this.column) return
          const sourceCellKey = column + rowIndex
          const targetCellKey = column + cloneRowIndex

          // Copy the value from the original cell to the new cell
          // if (column == "B") console.log('Copying value from old', sourceCellKey, 'to new', targetCellKey, "value is", sheet[sourceCellKey].v)
          sheetClone[targetCellKey] = { ...sheet[sourceCellKey] }
        })

        cloneRowIndex++
        cloneCellKey = this.column + cloneRowIndex
      })
    }

    console.log('Updated sheet:', sheetClone)
		this.output = sheetClone
  }
}

export class SendEmailAction extends Action {
  public service: string = '';
  public host: string = '';
  public port: number = 0;
  public secure: boolean = false;
  public user: string = '';
  public password: string = '';

  public from: string = '';
  public to: string = '';
  public subject: string = '';
  public text: string = '';

  public http!: HttpClient;
  public projectDataCacheService!: ProjectDataCacheService;

  public action(): void {
    console.log('Sending email...');

    const resolvedText = this.text.replace(/\$([a-zA-Z0-9!\-]+)/g, (match, p1) => {
      const value = this.projectDataCacheService.getValue(p1);
      return value ? ''+value : match;
    });

    const message =
`<!DOCTYPE html>
<html>
<body>
<p>Name: ${this.projectDataCacheService.getValue('_name_') ?? ''}</p><br/>

${resolvedText}
</body>
</html>
`;

    this.http.post('https://general-backend.testing.photonic-codes.cloud/api/login', {
      service: this.service,
      host: this.host,
      port: this.port,
      secure: this.secure,
      user: this.user,
      password: this.password
    }).subscribe(() => {
      this.http.post('https://general-backend.testing.photonic-codes.cloud/api/send-email', {
        from: this.from,
        to: this.to,
        subject: this.subject,
        text: message
      }).subscribe(() => {
        console.log('Email sent!');
      });
    });
  }
}

export class Automation {
  public id!: string;
  public name!: string;
  public trigger?: Trigger;
  public action?: Action;
}