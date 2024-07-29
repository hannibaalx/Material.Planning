import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import * as XLSX from 'xlsx';
import { EoReportService } from 'src/app/service/eo-report.service';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { EoReportList } from 'src/app/models/eo-report-list';
import { EoReportPurchaseOrderReq } from 'src/app/models/eo-report-purchase-order-req';

const moment = _moment;

@Component({
  selector: 'app-eopurchaseorder',
  templateUrl: './eopurchaseorder.component.html',
  styleUrls: ['./eopurchaseorder.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class EopurchaseorderComponent implements OnInit, OnDestroy {

  postartdate = new FormControl(moment().subtract(1, 'years'));
  poenddate = new FormControl(moment());
  minDate = moment().subtract(1, 'years');
  maxDate = moment();
  postations$: Observable<EoReportList[]>;
  postatus$: Observable<EoReportList[]>;
  filteredPoMEN$: Observable<string[]>; 
  filteredPoMPN$: Observable<string[]>;
  filteredPON$: Observable<string[]>;
  hidePoMEN: boolean = true;
  hidePoMPN: boolean = true;
  hidePON: boolean = true;
  hidePoBtn: boolean = false;
  hidePoSpinner: boolean = true;
  selectedPoStartDate: Date;
  selectedPoEndDate: Date;
  selectedPon: string;
  selectedPoMpn: string;
  selectedPoMen: string;
  selectedPoStatus: string[];
  selectedPoShipStation: string[];
  eoReportPurchaseOrderReq: EoReportPurchaseOrderReq;
  resp: any;
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'EO Purchase Order Report - ' + this.currentDate + '.xlsx';

  @ViewChild('allPoSelected', { static: true }) private allPoSelected: MatSelectionList;
  @ViewChild('allPoStationSelected', { static: true }) private allPoStationSelected: MatSelectionList;

  constructor(
    private eoReportService: EoReportService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.postations$ = this.eoReportService.getPoStations();
    this.postatus$ = this.eoReportService.getPoStatus();
  }

  ngOnDestroy() {

  }
  
  // openPPAMMaintSnackBar() {
  //   // var currentTime = moment.utc();
  //   // var warnStartTime = moment.utc("16:45", "HH:mm");
  //   // var warnEndTime = moment.utc("17:00", "HH:mm");

  //   // var maintStartTime = moment.utc('17:00', 'HH:mm');
  //   // var maintEndTime = moment.utc("18:00", "HH:mm");

  //   var currentTime = moment.utc();
  //   var warnStartTime = moment.utc("17:45", "HH:mm");
  //   var warnEndTime = moment.utc("18:00", "HH:mm");

  //   var maintStartTime = moment.utc('18:00', 'HH:mm');
  //   var maintEndTime = moment.utc("18:20", "HH:mm");

  //   var warnIsBetween = currentTime.isBetween(warnStartTime, warnEndTime);
  //   var maintTimeIsBetween = currentTime.isBetween(maintStartTime, maintEndTime);
    
  //   if(warnIsBetween)
  //   this.snackBar.open('IM3 maintenance will begin at 12pm CST.', 'Close', {
  //     duration: 3000
  //   });

  //   if(maintTimeIsBetween)
  //   this.snackBar.open('IM3 is currently updating from 12pm to 12:20pm CST.', 'Close', {
  //     //duration: 3000
  //   });
  // }

  selectAll(listName: string) { 
    switch (listName) {
      case 'postatus':
        this.allPoSelected.selectAll();
        break;
      case 'poshipstation':
        this.allPoStationSelected.selectAll();
        break;
     }
  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'postatus':
        this.allPoSelected.deselectAll();
        break;
      case 'poshipstation':
        this.allPoStationSelected.deselectAll();
        break;
     }
  }

  autoSearch(value, type: string) { 
    switch (type) { 
      case "men":
        if (value.target.value.length > 9) {
          // change this
          this.filteredPoMEN$ = this.eoReportService.autoSearchPurchaseOrder(value.target.value, type);
          this.hidePoMEN= true;
        }
        else { 
          this.hidePoMEN = false;
        }
        break;
        break;
      case "mpn":
        if (value.target.value.length > 4) {
          // change this
          this.filteredPoMPN$ = this.eoReportService.autoSearchPurchaseOrder(value.target.value, type);
          this.hidePoMPN = true;
        }
        else { 
          this.hidePoMPN = false;
        }
        break;
      case "pon":
        if (value.target.value.length > 4) {
          // change this
          this.filteredPON$ = this.eoReportService.autoSearchPurchaseOrder(value.target.value, type);
          this.hidePON = true;
        }
        else { 
          this.hidePON = false;
        }
        break;
    }
  }

  getSelectedPoStatus(selectedVal) { 
    this.selectedPoStatus = [];
      selectedVal.forEach(element => {
        this.selectedPoStatus.push(element._text.nativeElement.innerText)
      });
  }

  getSelectedPoShipStation(selectedVal) { 
    this.selectedPoShipStation = [];
      selectedVal.forEach(element => {
        this.selectedPoShipStation.push(element._text.nativeElement.innerText)
      });
  }

  generateReport() {
    // this.openPPAMMaintSnackBar();
    this.hidePoSpinner = false;
    this.getSelectedPoStatus(this.allPoSelected.selectedOptions.selected);
    this.getSelectedPoShipStation(this.allPoStationSelected.selectedOptions.selected);
    const _pon = document.getElementById('poSearchPON') as HTMLFormElement;
    const _mpn = document.getElementById('poSearchMPN') as HTMLFormElement;
    const _men = document.getElementById('poSearchMEN') as HTMLFormElement;
    const _postartdate = document.getElementById('postartdate') as HTMLFormElement;
    const _poenddate = document.getElementById('poenddate') as HTMLFormElement;

    let tmpstartdate = _postartdate.value.split('/');
    let newstartdate = tmpstartdate[2] + '/';
    newstartdate += tmpstartdate[0].length < 10 ? '0' + tmpstartdate[0] : tmpstartdate[0];
    newstartdate += '/' + tmpstartdate[1];

    let tmpenddate = _poenddate.value.split('/');
    let newenddate = tmpenddate[2] + '/';
    newenddate += tmpenddate[0].length < 10 ? '0' + tmpenddate[0] : tmpenddate[0];
    newenddate += '/' + tmpenddate[1];
    
    this.selectedPoStartDate = new Date(newstartdate);
    this.selectedPoEndDate = new Date(newenddate);
    this.selectedPon = _pon.value;
    this.selectedPoMpn = _mpn.value;
    this.selectedPoMen = _men.value;

    this.eoReportPurchaseOrderReq = new EoReportPurchaseOrderReq();
    this.eoReportPurchaseOrderReq.poStartDate = this.selectedPoStartDate;
    this.eoReportPurchaseOrderReq.poEndDate = this.selectedPoEndDate;
    this.eoReportPurchaseOrderReq.selectedPoStatus = this.selectedPoStatus;
    this.eoReportPurchaseOrderReq.selectedPoShipStation = this.selectedPoShipStation;
    this.eoReportPurchaseOrderReq.selectedPoMen = this.selectedPoMen;
    this.eoReportPurchaseOrderReq.selectedPoMpn = this.selectedPoMpn;
    this.eoReportPurchaseOrderReq.selectedPon = this.selectedPon;

    this.eoReportService.downloadReportPurchaseOrder(this.eoReportPurchaseOrderReq)
      .subscribe(result => {
        this.hidePoSpinner = true;
        this.hidePoBtn = true;
        return this.resp = result;
    });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblPoResult'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.hidePoBtn = !this.hidePoBtn
  }

}
