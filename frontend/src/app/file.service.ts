import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}

  readExcelFile(fileToUpload: File) : Promise<XLSX.WorkBook> {

    //read the file
    const readFile = new FileReader();
    readFile.readAsArrayBuffer(fileToUpload);

    // Read XLSX
    // XLSX has many ways to read.
    // Using file onload method
    return new Promise((resolve) => {

      readFile.onload = (e) => {
        const fileBufferResultArray = e.target?.result;
        const workBook: XLSX.WorkBook = XLSX.read(fileBufferResultArray, {type: 'buffer'});
        const wsname: string = workBook.SheetNames[0];
        const ws: XLSX.WorkSheet = workBook.Sheets[wsname];
        const sheetToJson = (XLSX.utils.sheet_to_json(ws, {header: "A", raw: false}));

        // call endpoint to upload and save on  database
        resolve(workBook);
      }
    })
  }

  getColumnHeader(coordinate: string[], sheet: any) {
    const columnName: any[] = [];
    // sheet['!ref'] = "A4:Q4" // change the sheet range to A2:C3
    // expecting only first 2 rows
    // const data_1 = XLSX.utils.sheet_to_json( sheet,{header:1});
    // console.dir(data_1, {depths: null , colors : true});
    // console.log(sampleData);
      // console.log(sheet[element]);
    coordinate.forEach((element: any) => {
      columnName.push(sheet[element]?.v);
    });
    return columnName;
  }

  returnContantAlphabet() {
    // TODO Improvements for alphabets
    const alphabetString: string = String.fromCharCode(...Array(123).keys()).slice(97);
    const alphabet: string[] = [];
    for (var i = 0; i < alphabetString.length; i++) {
      const upperCaseAlphabet = alphabetString.charAt(i).toUpperCase();
      alphabet.push(upperCaseAlphabet)
    }
    return alphabet;
  }

  thtExcelExport(excelData: any) {
      var exportExcelData = XLSX.utils.json_to_sheet(excelData) ;


    // A workbook is the name given to an Excel file
    var wb = XLSX.utils.book_new() // make Workbook of Excel

    // add Worksheet to Workbook
    // Workbook contains one or more worksheets
    XLSX.utils.book_append_sheet(wb, exportExcelData, 'THT_IMPORT') // name of Worksheet AND what data is inside

    // export Excel file
    XLSX.writeFile(wb, 'book.xlsx') // name of the file is 'book.xlsx'
  }

  ExcelExport(excelData: any, mountType?: string) {
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
    XLSX.writeFile(wb, 'book.xlsx') // name of the file is 'book.xlsx'
  }


  // TODO: Optimization
  // TODO: Transfer all process from app.component to below
  // TODO: Make it reusable
  processCellDataByAlphabet(startLine: number) {
    const alphabet = this.returnContantAlphabet();

    alphabet.forEach((letter: string) => { // Loop all alphabet
      const concatCell = letter + startLine // concat alphabet and choosen line of the user. E.g Output: A11, B11
    });
  }

  nineSeparator( result: any, importType: string) {
    let sepArr = result.reduce((accumulator: any, currentValue: any) => {
      if (accumulator.every((item: any) => !(item.sortNum === currentValue.sortNum)))              accumulator.push(currentValue);
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

  generateItemNumber() {
    return Math.floor(1000000000 + Math.random() * 900000);
  }
}