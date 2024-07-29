import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectionList } from '@angular/material/list';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable } from 'rxjs';
import { ReportService } from 'src/app/service/report.service';
import * as _moment from 'moment';
import * as XLSX from 'xlsx';
import { FormControl } from '@angular/forms';
import { EoReportCancelledPoReq } from 'src/app/models/eo-report-cancelled-po-req';

const moment = _moment;

@Component({
  selector: 'app-eo-cancelled-po',
  templateUrl: './eo-cancelled-po.component.html',
  styleUrls: ['./eo-cancelled-po.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class EoCancelledPoComponent implements OnInit {
  cpostartdate = new FormControl(moment().subtract(7, 'days'));
  cpoenddate = new FormControl(moment());
  minDate = moment().subtract(2, 'years');
  maxDate = moment();
  filteredCpoMEN$: Observable<string[]>; 
  filteredCpoMPN$: Observable<string[]>;
  filteredCpon$: Observable<string[]>;
  selectedCreator: string[];
  selectedCpoStartDate: Date;
  selectedCpoEndDate: Date;
  selectedCpoMpn: string;
  selectedCpoMen: string;
  selectedCpoPon: string;
  hideCpoMEN: boolean = true;
  hideCpoMPN: boolean = true;
  hideCpoSpinner: boolean = true;
  hideCpon: boolean = true;
  hideCpoBtn: boolean = false;
  eoReportCancelledPoReq: EoReportCancelledPoReq;
  resp: any;
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'Cancelled PO Report - ' + this.currentDate + '.xlsx';
  
  @ViewChild('allCreatorSelected', { static: true }) private allCreatorSelected: MatSelectionList;

  cproCreator = [
    { id: 1, creator: 'NON-SSR' },
    { id: 2, creator: 'SSR' }
  ];

  constructor(
    private reportService: ReportService
  ) { }

  ngOnInit() {
  }

  autoSearch(value, type: string) {
    switch (type) {
      case "men":
        if (value.target.value.length > 9) {
          // change this
          this.filteredCpoMEN$ = this.reportService.autoSearchCancelledPurchaseOrder(value.target.value, type);
          this.hideCpoMEN = true;
        }
        else {
          this.hideCpoMEN = false;
        }
        break;
      case "mpn":
        if (value.target.value.length > 4) {
          // change this
          this.filteredCpoMPN$ = this.reportService.autoSearchCancelledPurchaseOrder(value.target.value, type);
          this.hideCpoMPN = true;
        }
        else {
          this.hideCpoMPN = false;
        }
        break;
        case "pon":
          if (value.target.value.length > 4) {
            // change this
            this.filteredCpon$ = this.reportService.autoSearchCancelledPurchaseOrder(value.target.value, type);
            this.hideCpon = true;
          }
          else { 
            this.hideCpon = false;
          }
          break;
    }
  }

  selectAll(listName: string) { 
    switch (listName) {
      case 'creator':
        this.allCreatorSelected.selectAll();
        break;
      // case 'shipstation':
      //   this.allStationSelected.selectAll();
      //   break;
     }
  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'creator':
        this.allCreatorSelected.deselectAll();
        break;
      // case 'shipstation':
      //   this.allStationSelected.deselectAll();
      //   break;
     }
  }

  getSelectedCreator(selectedVal) { 
    this.selectedCreator = [];
    if (selectedVal != null) {
      selectedVal.forEach(element => {
        this.selectedCreator.push(element._text.nativeElement.innerText)
      });
    }
  }

  generateReport() {
    this.hideCpoSpinner = false;
    this.getSelectedCreator(this.allCreatorSelected.selectedOptions.selected);
    const _mpn = document.getElementById('cpoSearchMPN') as HTMLFormElement;
    const _men = document.getElementById('cpoSearchMEN') as HTMLFormElement;
    const _cpon = document.getElementById('cpoSearchPON') as HTMLFormElement;
    const _postartdate = document.getElementById('cpostartdate') as HTMLFormElement;
    const _poenddate = document.getElementById('cpoenddate') as HTMLFormElement;

    let tmpstartdate = _postartdate.value.split('/');
    let newstartdate = tmpstartdate[2] + '/';
    newstartdate += tmpstartdate[0].length < 10 ? '0' + tmpstartdate[0] : tmpstartdate[0];
    newstartdate += '/' + tmpstartdate[1];

    let tmpenddate = _poenddate.value.split('/');
    let newenddate = tmpenddate[2] + '/';
    newenddate += tmpenddate[0].length < 10 ? '0' + tmpenddate[0] : tmpenddate[0];
    newenddate += '/' + tmpenddate[1];
    
    this.selectedCpoStartDate = new Date(newstartdate);
    this.selectedCpoEndDate = new Date(newenddate);
    
    this.selectedCpoMpn = _mpn.value;
    this.selectedCpoMen = _men.value;
    this.selectedCpoPon = _cpon.value;

    this.eoReportCancelledPoReq = new EoReportCancelledPoReq();
    this.eoReportCancelledPoReq.cpoStartDate = this.selectedCpoStartDate;
    this.eoReportCancelledPoReq.cpoEndDate = this.selectedCpoEndDate;
    this.eoReportCancelledPoReq.selectedCreator = this.selectedCreator;
    this.eoReportCancelledPoReq.selectedCpoMen = this.selectedCpoMen;
    this.eoReportCancelledPoReq.selectedCpoMpn = this.selectedCpoMpn;
    this.eoReportCancelledPoReq.selectedCpoPon = this.selectedCpoPon;    

    this.reportService.downloadCancelledPurchaseOrder(this.eoReportCancelledPoReq)
      .subscribe(result => {
        this.hideCpoSpinner = true;
        this.hideCpoBtn = true;
        return this.resp = result;
    });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblCpoResult'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.hideCpoBtn = !this.hideCpoBtn;
  }

}
