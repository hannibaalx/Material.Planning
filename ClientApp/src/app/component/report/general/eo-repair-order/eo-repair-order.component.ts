import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import * as XLSX from 'xlsx';
import { MatSelectionList } from '@angular/material/list';
import { Observable, timer } from 'rxjs';
import { EoReportList } from 'src/app/models/eo-report-list';
import { EoReportRepairOrderReq } from 'src/app/models/eo-report-repair-order-req';
import { ReportService } from 'src/app/service/report.service';
//tslint:disable-next-line:no-duplicate-imports
//import {default as _rollupMoment} from 'moment';
//import * as moment from "moment";

//const moment = _rollupMoment || _moment;
const moment = _moment;

@Component({
  selector: 'app-eo-repair-order',
  templateUrl: './eo-repair-order.component.html',
  styleUrls: ['./eo-repair-order.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class EoRepairOrderComponent implements OnInit, OnDestroy {
  //minDate: string;
  //maxDate: Date;
  // startdate = new FormControl(moment().subtract(1, 'years'));
  startdate = new FormControl(moment());
  enddate = new FormControl(moment());
  maxDate = moment();
  //minDate = moment().subtract(1, 'years');
  stations$: Observable<EoReportList[]>;
  rostatus$: Observable<EoReportList[]>;
  filteredMEN$: Observable<string[]>; 
  filteredMPN$: Observable<string[]>;
  filteredRON$: Observable<string[]>;
  filteredATA$: Observable<string[]>;
  selectedRoStatus: string[] = [];
  selectedShipStation: string[] = [];
  selectedRon: string = "";
  selectedMpn: string = "";
  selectedMen: string = "";
  selectedAta: string = "";
  selectedStartDate: string;
  selectedEndDate: string;
  eoReportRepairOrderReq: EoReportRepairOrderReq;
  hideMEN: boolean = true;
  hideMPN: boolean = true;
  hideRON: boolean = true;
  hideATA: boolean = true;
  hideRoBtn: boolean = false;
  hideRoSpinner: boolean = true;
  resp: any;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Repair Order Report - ' + this.currentDate + '.xlsx';

  @ViewChild('allRoSelected', { static: true }) private allRoSelected: MatSelectionList;
  @ViewChild('allStationSelected', { static: true }) private allStationSelected: MatSelectionList;
  
  // roStatus = [
  //   { id: 1, status: 'OPENED' },
  //   { id: 2, status: 'PAID' },
  //   { id: 3, status: 'RECEIVED' },
  //   { id: 4, status: 'SHIPMENT REVIEW' },
  //   { id: 5, status: 'WARRENTY REVIEW' }
  // ];

  constructor(
    // private userService: UserService,
    private reportService: ReportService
  ) {
    // const currentYear = new Date().getFullYear();
    // this.minDate = new Date(currentYear - 2, 0, 1);
    // this.maxDate = new Date();
   }

  ngOnInit() {
    this.stations$ = this.reportService.getRoStations();
    this.rostatus$ = this.reportService.getRoStatus();
  }

  ngOnDestroy() {

   }

  autoSearch(value, type: string) { 
    switch (type) { 
      case "men":
        if (value.target.value.length > 9) {
          // change this
          this.filteredMEN$ = this.reportService.autoSearchRepairOrder(value.target.value, type);
          this.hideMEN= true;
        }
        else { 
          this.hideMEN = false;
        }
        break;
        break;
      case "mpn":
        if (value.target.value.length > 5) {
          // change this
          this.filteredMPN$ = this.reportService.autoSearchRepairOrder(value.target.value, type);
          this.hideMPN = true;
        }
        else { 
          this.hideMPN = false;
        }
        break;
      case "ron":
        if (value.target.value.length > 4) {
          // change this
          this.filteredRON$ = this.reportService.autoSearchRepairOrder(value.target.value, type);
          this.hideRON = true;
        }
        else { 
          this.hideRON = false;
        }
        break;
      case "ata":
        if (value.target.value.length > 1) {
          this.filteredATA$ = this.reportService.autoSearchRepairOrder(value.target.value, type);
          this.hideATA = true;
        }
        else { 
          this.hideATA = false;
        }
    }
  }

  selectAll(listName: string) { 
    switch (listName) {
      case 'rostatus':
        this.allRoSelected.selectAll();
        break;
      case 'shipstation':
        this.allStationSelected.selectAll();
        break;
     }
  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'rostatus':
        this.allRoSelected.deselectAll();
        break;
      case 'shipstation':
        this.allStationSelected.deselectAll();
        break;
     }
  }

  getSelectedRoStatus(selectedVal) { 
    this.selectedRoStatus = [];
    if (selectedVal) {
      selectedVal.forEach(element => {
        this.selectedRoStatus.push(element._text.nativeElement.innerText)
      });
    }
  }

  getSelectedShipStation(selectedVal) { 
    this.selectedShipStation = [];
    if (selectedVal) {
      selectedVal.forEach(element => {
        this.selectedShipStation.push(element._text.nativeElement.innerText)
      });
    }
  }

  generateReport() {
    this.hideRoSpinner = false;
    this.getSelectedRoStatus(this.allRoSelected.selectedOptions.selected);
    this.getSelectedShipStation(this.allStationSelected.selectedOptions.selected);
    const _ron = document.getElementById('roSearchRON') as HTMLFormElement;
    const _mpn = document.getElementById('roSearchMPN') as HTMLFormElement;
    const _men = document.getElementById('roSearchMEN') as HTMLFormElement;
    const _ata = document.getElementById('roSearchATA') as HTMLFormElement;
    const _startdate = document.getElementById('startdate') as HTMLFormElement;
    const _enddate = document.getElementById('enddate') as HTMLFormElement;
    this.selectedStartDate = _startdate.value;
    this.selectedEndDate = _enddate.value;
    this.selectedRon = _ron.value;
    this.selectedMpn = _mpn.value;
    this.selectedMen = _men.value;
//    this.selectedAta = _ata.value;

    this.eoReportRepairOrderReq = new EoReportRepairOrderReq();
    let tmpstartdate = this.selectedStartDate.split('/');
    let newstartdate = tmpstartdate[2] + '/';
    newstartdate += tmpstartdate[0].length < 10 ? '0' + tmpstartdate[0] : tmpstartdate[0];
    newstartdate += '/' + tmpstartdate[1];

    let tmpenddate = this.selectedEndDate.split('/');
    let newenddate = tmpenddate[2] + '/';
    newenddate += tmpenddate[0].length < 10 ? '0' + tmpenddate[0] : tmpenddate[0];
    newenddate += '/' + tmpenddate[1];
    this.eoReportRepairOrderReq.startDate = new Date(newstartdate);
    this.eoReportRepairOrderReq.endDate = new Date(newenddate);
    this.eoReportRepairOrderReq.selectedROStatus = this.selectedRoStatus;
    this.eoReportRepairOrderReq.selectedShipStation = this.selectedShipStation;
    this.eoReportRepairOrderReq.selectedMen = this.selectedMen;
    this.eoReportRepairOrderReq.selectedMpn = this.selectedMpn;
    this.eoReportRepairOrderReq.selectedRon = this.selectedRon;
    this.eoReportRepairOrderReq.selectedAta = this.selectedAta;

    this.reportService.downloadReportRepairOrder(this.eoReportRepairOrderReq)
      .subscribe(result => {
        this.hideRoSpinner = true;
        this.hideRoBtn = true;
        return this.resp = result;
    });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblRoResult'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.hideRoBtn = !this.hideRoBtn
  }

}
