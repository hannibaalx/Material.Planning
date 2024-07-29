import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import * as XLSX from 'xlsx';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, timer } from 'rxjs';
import { EoReportList } from 'src/app/models/eo-report-list';
import { EoReportService } from 'src/app/service/eo-report.service';
import { EoReportRepairOrderReq } from 'src/app/models/eo-report-repair-order-req';

const moment = _moment;

@Component({
  selector: 'app-eorepairorder',
  templateUrl: './eorepairorder.component.html',
  styleUrls: ['./eorepairorder.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class EorepairorderComponent implements OnInit, OnDestroy {
  startdate = new FormControl(moment().subtract(1, 'years'));
  enddate = new FormControl(moment());
  minDate = moment().subtract(1, 'years');
  maxDate = moment();
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
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'EO Repair Order Report - ' + this.currentDate + '.xlsx';

  @ViewChild('allRoSelected', { static: true }) private allRoSelected: MatSelectionList;
  @ViewChild('allStationSelected', { static: true }) private allStationSelected: MatSelectionList;

  constructor(
    private eoReportService: EoReportService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // this.currentUser = this.userService.getUser().displayName;
    this.stations$ = this.eoReportService.getRoStations();
    this.rostatus$ = this.eoReportService.getRoStatus();
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

  autoSearch(value, type: string) { 
    switch (type) { 
      case "men":
        if (value.target.value.length > 9) {
          // change this
          this.filteredMEN$ = this.eoReportService.autoSearchRepairOrder(value.target.value, type);
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
          this.filteredMPN$ = this.eoReportService.autoSearchRepairOrder(value.target.value, type);
          this.hideMPN = true;
        }
        else { 
          this.hideMPN = false;
        }
        break;
      case "ron":
        if (value.target.value.length > 4) {
          // change this
          this.filteredRON$ = this.eoReportService.autoSearchRepairOrder(value.target.value, type);
          this.hideRON = true;
        }
        else { 
          this.hideRON = false;
        }
        break;
      case "ata":
        if (value.target.value.length > 1) {
          this.filteredATA$ = this.eoReportService.autoSearchRepairOrder(value.target.value, type);
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
    if (selectedVal !=null) {
      selectedVal.forEach(element => {
        this.selectedRoStatus.push(element._text.nativeElement.innerText)
      });
    }
  }

  getSelectedShipStation(selectedVal) { 
    this.selectedShipStation = [];
    if (selectedVal != null) {
      selectedVal.forEach(element => {
        this.selectedShipStation.push(element._text.nativeElement.innerText)
      });
    }
  }

  generateReport() {
    // this.openPPAMMaintSnackBar();
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
    this.selectedAta = _ata.value;

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

    this.eoReportService.downloadReportRepairOrder(this.eoReportRepairOrderReq)
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
