import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { DropzoneFile } from 'dropzone';

export class ColumnHeaderConstant {

  public static HEADER_TITLE = [
      'item',
      'quantity',
      'assyopt',
      'reference',
      'value',
      'mfgpn',
      'description',
      'fiveBoardsTotal',
      'replacementNotes',
      'partNumber',
      'partName',
      'x',
      'y',
      'rot',
      'side',
      'mirror',
      'mountType',
      'notes'
  ];
}

export class HeaderColumnCellConstant {

  public static COLUMN_HEADER_LETTER = ['A','B','C','D','E','J','K','P', 'Q'];
}

export interface ColumnHeaderName {

  item: number,
  quantity: number,
  assyopt: string,
  reference: string,
  value: string,
  mfgpn: {

    value: string,
    isMismatched?: boolean,
    oppositeColumn?: string
  },
  description: string,
  fiveBoardsTotal: string,
  replacementNotes:  string,
  partNumber: {

    value: string,
    isMismatched?: boolean,
    oppositeColumn?: string
  },
  partName: string,
  x:  string,
  y: string,
  rot: string,
  side: string,
  mirror: string,
  mountType: string,
  notes?: string
}

export interface Excel {

  item: number,
  quantity: number,
  assyopt: string,
  reference: string,
  value: number,
  mfgpn: {

    value: string,
    isMismatched: boolean,
    oppositeColumn: string
  },
  description: string,
  fiveBoardsTotal: number,
  replacementNotes: string,
  partNumber: number,
  partName: string,
  x: number,
  y: number,
  rot: string,
  side: string,
  mirror: string,
  mountType: string,
  notes?: string
}

@Injectable({

  providedIn: 'root'
})
export class ExcelService {

  headerColumn: string[] = HeaderColumnCellConstant.COLUMN_HEADER_LETTER; // Constant cell header for first excel
  columnName: string[] = ColumnHeaderConstant.HEADER_TITLE; // Constant column name
  isLoading: boolean = false; // check if the app is loading
  isShowTable: boolean = false; // flag to show table
  dataSource: ColumnHeaderName[] = []; // table data source
  temporaryDataSource: ColumnHeaderName[] = [];
  mismatchesDataSource: ColumnHeaderName[] = [];
  alphabetDropdownData: string[]; //fill Spalte auswählen form with alphabet
  excelSplittedValue: string[] = []; //
  selectedTabIndex: number = 0; // use to monitor tab index
  MAX_FILE: number = 2;  // maximum number of file that can be uploaded
  isTableValid: boolean = true;
  orderNamesFirstTab: string[] = [];
  orderNamesSecondTab: string[] = [];
  isShowMismatches = false;
  dataSource_ : any = [];
  columnNames_: any;
  selectedRefIndexFirstTab: number = 0;

  // TODO: Use interface
  excelData: any = []; //an excel data that are already read by the library
  SheetNames: any = []; // sample variable for excel sheet data, to be optimize if possible
  tableData: any[] = []; // variable where we store the combine data to loop the table
  fileUploaded: string[] = []; // store file name as label

  public constructor(private readonly fileService: FileService) {

    this.alphabetDropdownData = this.fileService.returnContantAlphabet();
  }

/*

██████╗ ███████╗ █████╗ ██████╗     ███████╗██╗██╗     ███████╗
██╔══██╗██╔════╝██╔══██╗██╔══██╗    ██╔════╝██║██║     ██╔════╝
██████╔╝█████╗  ███████║██║  ██║    █████╗  ██║██║     █████╗
██╔══██╗██╔══╝  ██╔══██║██║  ██║    ██╔══╝  ██║██║     ██╔══╝
██║  ██║███████╗██║  ██║██████╔╝    ██║     ██║███████╗███████╗
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝╚══════╝╚══════╝

*/
  /**
    * Triggered, once the user uploads an excel file
    * Store the data into respective variables
    * @parameters file as File
    TODO: use type file
  **/
	public onSelectFile(file: DropzoneFile, caller: any, fn: (excelData: any) => void) {

		// Die 'file' Eigenschaft des DropzoneFile-Objekts ist eine File-Instanz
		this.fileService.readExcelFile(file).then((workBook) => {

				const fileName = file.name
				this.SheetNames = workBook.SheetNames

				this.excelData = workBook
				console.log('excelData', this.excelData, "found")

				this.fileUploaded.push(fileName)
				caller.showLoadingDialog = false

        fn(this.excelData)
			}
		)
	}

	/**
		*Trigger per change on the field
		*Check if the  form field is valid
		*if yes output the data and properly display it on the table
		TODO: use type file
		TODO: seperate the logic
	**/
  public outputExceltoTable() {

    switch(this.selectedTabIndex) {

      case 0:
        this.getExcel();
        break;
      case 1:
        this.getExcelOutput();
        break;
    }
  }

  public getExcel() {

    // if(this.excelReferenceDataForm.get('column')?.value && this.excelReferenceDataForm.get('line')?.value && this.orderNamesFirstTab.length === 0) {

    //   this.getOrderNames(this.orderNamesFirstTab, this.excelReferenceDataForm, 1)
    // }

    // if(this.excelReferenceDataForm.valid) {

      this.isLoading = true;
      const excelSelectedData: any = ""//this.excelReferenceDataForm.value; //Get the user selected value in the form
      const selectedColumnConcat = excelSelectedData.column + excelSelectedData.line // concat the selected column and line. e.g A1
      const selectedField = this.excelData.Sheets[excelSelectedData.sheet][selectedColumnConcat]; //get the selected field. e.g get data in A1
      const excelOutputArray: any[] = [];
      const workSheet = this.excelData.Sheets[excelSelectedData.sheet]; //get the selected field. e.g get data in A1
      let cell = selectedColumnConcat;
      let startLine = excelSelectedData.line;
      const selectedOrderIndex = this.orderNamesFirstTab.findIndex((element) => element === excelSelectedData.order);
      const selectedPositionIndex = this.orderNamesFirstTab.findIndex((element) => element === excelSelectedData.position);
      this.selectedRefIndexFirstTab = this.alphabetDropdownData.findIndex((element) => element === excelSelectedData.column);
      let excelOutputArray_: any = [];
      for (let index = 0; workSheet[cell] !== undefined; index++) {

        cell = excelSelectedData.column + startLine;
        if(workSheet[cell]) {

          try {

            // loop the splited data, push it into array together with other data
            const splittedCellValue = workSheet[cell].v.split(excelSelectedData.seperator)
            splittedCellValue.forEach((splitOutput: string) => {


              const cellArray: any[] = [];
              const excelBuildData: Excel = {

                item: 0,
                quantity: 0,
                assyopt: '',
                reference: '',
                value: 0,
                mfgpn: {

                  value: '',
                  isMismatched: false,
                  oppositeColumn: 'partNumber'
                },
                description: '',
                fiveBoardsTotal: 0,
                replacementNotes: 'null',
                partNumber: 0,
                partName: '',
                x: 0,
                y: 0,
                rot: '',
                side: '',
                mirror: '',
                mountType: '',
                notes: ''
              };
              this.alphabetDropdownData.forEach((alphabet: string) => {

                const concatCell = alphabet + startLine // concat alphabet and choosen line of the user. E.g Output: A11, B11
                if(this.excelData.Sheets[excelSelectedData.sheet][concatCell]) {

                  const rowData = this.excelData.Sheets[excelSelectedData.sheet][concatCell]?.v
                  cellArray.push(rowData);
                } else{

                  cellArray.push(null);
                }
              });
              let rowObject: any = {
};
              this.orderNamesFirstTab.forEach((column, index) => {

                if (index === this.selectedRefIndexFirstTab) {

                  rowObject[column] = splitOutput
                }
                else if (index === selectedOrderIndex || index === selectedPositionIndex){

                  let value = '';
                  if (!cellArray[index]) {

                    value = '';
                  } else {

                    value = typeof cellArray[index] === 'string' ? cellArray[index].trim() : cellArray[index];
                  }
                  let mismatchObj = {

                    value: value,
                    isMismatched: false,
                    oppositeColumn: ''
                  };
                  rowObject[column] = mismatchObj;
                }
                else {

                  rowObject[column] = typeof cellArray[index] === 'string' ? cellArray[index].trim() : cellArray[index];
                }
              });
              excelOutputArray_.push(rowObject)

              excelBuildData.item = cellArray[0];
              excelBuildData.quantity = cellArray[1];
              excelBuildData.assyopt = cellArray[2];
              excelBuildData.reference = splitOutput;
              excelBuildData.value = cellArray[4];
              excelBuildData.mfgpn = {

                value: cellArray[selectedOrderIndex],
                isMismatched: false,
                oppositeColumn: 'partNumber'
              };
              excelBuildData.description = cellArray[10];
              excelBuildData.fiveBoardsTotal = cellArray[15];
              excelBuildData.replacementNotes = cellArray[16];

              excelOutputArray.push(excelBuildData);


            });
          } catch (error) {

            console.log(error);
          }
        }
        startLine++;
      }

      this.columnNames_ = this.orderNamesFirstTab.slice();
      this.dataSource = excelOutputArray;
      this.dataSource_ = excelOutputArray_;
      // this.temporaryDataSource = this.dataSource
      this.temporaryDataSource = this.dataSource_
      console.log('excelOutputArray',this.dataSource_)
      setTimeout(() => {

        this.isLoading = false;
        this.isShowTable = true;
      }, 3000)

      this.selectedTabIndex = 1;

    // }
    console.log('first', this.dataSource_)
  }

  public getExcelOutput() {

    // if(this.excelDataForm.get('column')?.value && this.excelDataForm.get('line')?.value && this.orderNamesSecondTab.length === 0) {

    //   this.getOrderNames(this.orderNamesSecondTab, this.excelDataForm, 2)
    // }

    // if(this.excelDataForm.valid) {

      this.isShowTable = false;
      this.isLoading = true;

      const excelSelectedData: any = ""//this.excelDataForm.value; //Get the user selected value in the form
      const selectedColumnConcat = excelSelectedData.column + excelSelectedData.line // concat the selected column and line. e.g A1
      const workSheet = this.excelData.Sheets[excelSelectedData.sheet]; //get the selected field. e.g get data in A1
      const startCell = selectedColumnConcat;
      let startLine = excelSelectedData.line;
      const selectedRefIndex = this.alphabetDropdownData.findIndex((element) => element === excelSelectedData.column);
      this.orderNamesSecondTab.splice(selectedRefIndex, 1);
      const selectedOrderIndex = this.orderNamesSecondTab.findIndex((element) => element === excelSelectedData.order);
      const selectedPositionIndex = this.orderNamesSecondTab.findIndex((element) => element === excelSelectedData.position);


      for (let index = 0; workSheet[startCell] !== undefined; index++) {

        const cell = excelSelectedData.column + startLine;
        const cellArray: any[] = [];
        if(workSheet[cell]) {

          // if (this.dataSource.find(e=> e.reference == workSheet[cell].v)) {

          if (this.dataSource_.find((e: any) => e[this.orderNamesFirstTab[this.selectedRefIndexFirstTab]] == workSheet[cell].v)) {

            // debugger;
            this.alphabetDropdownData.forEach((alphabet: string, index) => {
 //loop all cell A1,B1 until the result is undefined
              if(index === selectedRefIndex) {

                return
              }

              const concatCell = alphabet + startLine // concat alphabet and choosen line of the user. E.g Output: A11, B11
              if(this.excelData.Sheets[excelSelectedData.sheet][concatCell]) {

                const rowData = this.excelData.Sheets[excelSelectedData.sheet][concatCell]?.v //
                cellArray.push(rowData);
              }
              const rowDataIndex = this.dataSource.findIndex(x => x.reference == workSheet[cell].v);
              const rowDataIndex_ = this.dataSource_.findIndex((x: any) => x[this.orderNamesFirstTab[this.selectedRefIndexFirstTab]] == workSheet[cell].v);

              let rowObject: any = {
};
              this.orderNamesSecondTab.forEach((column, index) => {

                if(index === selectedOrderIndex || index === selectedPositionIndex) {

                  let value = '';
                  if (!cellArray[index]) {

                    value = '';
                  } else {

                    value = typeof cellArray[index] === 'string' ? cellArray[index].trim() : cellArray[index];
                  }
                  this.dataSource_[rowDataIndex_][column] = {

                    value: value,
                    isMismatched: false,
                    oppositeColumn: ''
                  };
                } else {

                  this.dataSource_[rowDataIndex_][column] =  typeof cellArray[index] === 'string' ? cellArray[index].trim() : cellArray[index];
                }
              });
              // this.dataSource_[rowDataIndex_][this.excelDataForm?.value.order].isMismatched = this.dataSource_[rowDataIndex_][this.excelDataForm?.value.order].value !== this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.order].value;
              // this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.order].isMismatched = this.dataSource_[rowDataIndex][this.excelDataForm?.value.order].value !== this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.order].value;

              // this.dataSource_[rowDataIndex_][this.excelDataForm?.value.order].oppositeColumn = this.excelReferenceDataForm?.value.order;
              // this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.order].oppositeColumn = this.excelDataForm?.value.order;

              // this.dataSource_[rowDataIndex_][this.excelDataForm?.value.position].isMismatched =
              //   this.dataSource_[rowDataIndex_][this.excelDataForm?.value.position].value === 'DNP' && this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.position].value === '_'
              // || this.dataSource_[rowDataIndex_][this.excelDataForm?.value.position].value === '' && this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.position].value === 'DNP'
              // ;
              // this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.position].isMismatched =
              //   this.dataSource_[rowDataIndex_][this.excelDataForm?.value.position].value === '' && this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.position].value === 'DNP'
              // || this.dataSource_[rowDataIndex_][this.excelDataForm?.value.position].value === 'DNP' && this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.position].value === '_'
              // ;

              // this.dataSource_[rowDataIndex_][this.excelDataForm?.value.position].oppositeColumn = this.excelReferenceDataForm?.value.position;
              // this.dataSource_[rowDataIndex_][this.excelReferenceDataForm?.value.position].oppositeColumn = this.excelDataForm?.value.position;
              this.dataSource_[rowDataIndex_]['notes'] = '';
              // this.dataSource[rowDataIndex].mfgpn.isMismatched = this.dataSource[rowDataIndex].mfgpn.value !== this.dataSource[rowDataIndex].partNumber.value;

              this.dataSource[rowDataIndex].partNumber = {

                value: cellArray[selectedOrderIndex],
                isMismatched: false,
                oppositeColumn: 'mfgpn'
              };
              this.dataSource[rowDataIndex].partName = cellArray[2];
              this.dataSource[rowDataIndex].x = cellArray[3];
              this.dataSource[rowDataIndex].y = cellArray[4];
              this.dataSource[rowDataIndex].rot = cellArray[5];
              this.dataSource[rowDataIndex].side = cellArray[6];
              this.dataSource[rowDataIndex].mirror = cellArray[7];
              this.dataSource[rowDataIndex].mountType = cellArray[8];

              this.dataSource[rowDataIndex].partNumber.isMismatched = this.dataSource[rowDataIndex].mfgpn.value !== this.dataSource[rowDataIndex].partNumber.value;
              this.dataSource[rowDataIndex].mfgpn.isMismatched = this.dataSource[rowDataIndex].mfgpn.value !== this.dataSource[rowDataIndex].partNumber.value;

            });
          } else {

            this.dataSource_.push({
})
            this.alphabetDropdownData.forEach((alphabet: string, index) => {
 //loop all cell A1,B1 until the result is undefined
              if (index === selectedRefIndex) {

                return
              }

              const concatCell = alphabet + startLine // concat alphabet and choosen line of the user. E.g Output: A11, B11
              if (this.excelData.Sheets[excelSelectedData.sheet][concatCell]) {

                const rowData = this.excelData.Sheets[excelSelectedData.sheet][concatCell]?.v //
                cellArray.push(rowData);
              }

              this.orderNamesSecondTab.forEach((column, index) => {

                this.dataSource_[this.dataSource_.length - 1][column] = cellArray[index];
              });

              this.dataSource_[this.dataSource_.length - 1][this.orderNamesFirstTab[this.selectedRefIndexFirstTab]] = {

                value: workSheet[cell].v,
                isMismatched: true,
                oppositeColumn: ''
              };
              // this.dataSource_[this.dataSource_.length - 1][this.orderNamesFirstTab[this.selectedRefIndexFirstTab]] = workSheet[cell].v;
            })
          }
        } else {

          workSheet[startCell] = undefined;
        }
        startLine++;
      }

      console.log('this.dataSource_',this.dataSource_)
      this.dataSource_.map((element: any) => {

        if (!element.hasOwnProperty(excelSelectedData.position) || !element.hasOwnProperty(excelSelectedData.order)) {

          element[this.orderNamesFirstTab[this.selectedRefIndexFirstTab]] = {

            value: element[this.orderNamesFirstTab[this.selectedRefIndexFirstTab]],
            isMismatched: true,
          };
        }
      })
      this.orderNamesSecondTab.forEach((column) => this.columnNames_.push(column))
      this.columnNames_.push('Notes');
      // this.isTableValid = !this.dataSource.find((element) => element.partNumber.isMismatched || element.mfgpn.isMismatched);
      this.isTableValid = true//!this.dataSource_.find((element: any) => element[this.excelReferenceDataForm?.value.order]?.isMismatched || element[this.excelDataForm?.value.order]?.isMismatched || element[this.excelReferenceDataForm?.value.position]?.isMismatched || element[this.excelDataForm?.value.position]?.isMismatched);
      setTimeout(() => {

        this.isLoading = false;
        this.isShowTable = true;
      }, 700);
    // }
  }

  public exportDataTHT() {

    this.fileService.thtExcelExport(this.dataSource_);
  }

  public exportData(mountType?: string) {

    this.fileService.ExcelExport(this.temporaryDataSource, mountType);
  }

  public getOrderNames(orderNames: any, form: any, subtraction: number) {

    const excelSelectedData = form.value; //Get the user selected value in the form
    let startLine = excelSelectedData.line;

    this.alphabetDropdownData.forEach((alphabet: string) => {

      const concatCell = alphabet + (startLine - subtraction) // concat alphabet and choosen line of the user. E.g Output: A11, B11
      if(this.excelData.Sheets[excelSelectedData.sheet][concatCell]) {

        const rowData = this.excelData.Sheets[excelSelectedData.sheet][concatCell]?.v
        orderNames.push(rowData);
      }
    });
  }

  public getExcelReferenceOutput() {

    // if(this.excelReferenceDataForm.valid) {

      const excelSelectedData: any = "" //this.excelReferenceDataForm.value; //Get the user selected value in the form
      const selectedColumnConcat = excelSelectedData.column + excelSelectedData.line // concat the selected column and line. e.g A1
      const selectedField = this.excelData.Sheets[excelSelectedData.sheet][selectedColumnConcat]; //get the selected field. e.g get data in A1
      const excelOutputArray: any[] = [];
      try {

        this.excelSplittedValue = selectedField.v?.split(excelSelectedData.seperator); // split the value using user selected seperator
      } catch (error) {

        console.log('Seperator doesnt exist');
      } finally {

        if (this.excelSplittedValue.length > 0) {

          this.excelSplittedValue.forEach((element: string) => {
 //Loop the output of seperated valoue
            const cellArray: any[] = [];
            this.alphabetDropdownData.forEach((alphabet: string) => {
 //loop all cell A1,B1 until the result is undefined
              const concatCell = alphabet + excelSelectedData.line // concat alphabet and choosen line of the user. E.g Output: A11, B11
              if(this.excelData.Sheets[excelSelectedData.sheet][concatCell] && this.headerColumn.includes(alphabet)) {

                const rowData = this.excelData.Sheets[excelSelectedData.sheet][concatCell]?.v //
                cellArray.push(rowData);
              }

            });
            const excelBuildData: Excel = {

              item: cellArray[0],
              quantity: cellArray[1],
              assyopt: cellArray[2],
              reference: element,
              value: cellArray[4],
              mfgpn: cellArray[5],
              description: cellArray[6],
              fiveBoardsTotal: cellArray[7],
              replacementNotes: 'null',
              partNumber: 0,
              partName: '',
              x: 0,
              y: 0,
              rot: '',
              side: '',
              mirror: '',
              mountType: ''
            };
            excelOutputArray.push(excelBuildData);

          });
        } else if (this.excelSplittedValue.length == 0) {

            const cellArray: any[] = [];
            this.alphabetDropdownData.forEach((alphabet: string) => {
 //loop all cell A1,B1 until the result is undefined
              const concatCell = alphabet + excelSelectedData.line // concat alphabet and choosen line of the user. E.g Output: A11, B11
              if(this.excelData.Sheets[excelSelectedData.sheet][concatCell] && this.headerColumn.includes(alphabet)) {

                const rowData = this.excelData.Sheets[excelSelectedData.sheet][concatCell]?.v //
                cellArray.push(rowData);
              }

            });
            const excelBuildData: Excel = {

              item: cellArray[0],
              quantity: cellArray[1],
              assyopt: cellArray[2],
              reference: cellArray[3],
              value: cellArray[4],
              mfgpn: cellArray[5],
              description: cellArray[6],
              fiveBoardsTotal: cellArray[7],
              replacementNotes: 'null',
              partNumber: 0,
              partName: '',
              x: 0,
              y: 0,
              rot: '',
              side: '',
              mirror: '',
              mountType: '',
            };
            excelOutputArray.push(excelBuildData);
        }
        this.dataSource = excelOutputArray;
        // this.temporaryDataSource = this.dataSource
        this.temporaryDataSource = this.dataSource_
        this.isLoading = false;
      }

    // }
    console.log('first', this.dataSource_)
  }
}