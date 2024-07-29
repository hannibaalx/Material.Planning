import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import * as XLSX from 'xlsx';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { EoReportList } from 'src/app/models/eo-report-list';
import { EoReportPoDiscrepancyReq } from 'src/app/models/eo-report-po-discrepancy-req';
import { EoReportService } from 'src/app/service/eo-report.service';

const moment = _moment;

@Component({
  selector: 'app-eo-po-discrepancy',
  templateUrl: './eo-po-discrepancy.component.html',
  styleUrls: ['./eo-po-discrepancy.component.css'],
    providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class EoPoDiscrepancyComponent implements OnInit {
  podstartdate = new FormControl(moment().subtract(2, 'years'));
  podenddate = new FormControl(moment());
  minDate = moment().subtract(2, 'years');
  maxDate = moment();
  poPlanners$: Observable<EoReportList[]>;
  routinggrp$: Observable<EoReportList[]>;
  exceptionreason$: Observable<EoReportList[]>;
  filteredOrderNum$: Observable<string[]>;
  filteredExceptNum$: Observable<string[]>;
  filteredMEN$: Observable<string[]>; 
  filteredMPN$: Observable<string[]>;
  filteredRON$: Observable<string[]>;
  filteredATA$: Observable<string[]>;
  filteredEo$: Observable<string[]>;
  filteredPoDiscrepancyEo$: Observable<string[]>;
  filteredPlannerName$: Observable<string[]>;
  filteredDash8$: Observable<string[]>;
  filteredPoDiscrepancyDash8$: Observable<string[]>;
  selectedPoDiscrepancyPlanner: string[];
  selectedRoutingGroup: string[] = [];
  selectedExceptionReason: string[] = [];
  selectedExceptionNumber: string = "";
  selectedOrderNumber: string = "";
  selectedMpn: string = "";
  selectedMen: string = "";
  selectedAta: string = "";
  selectedPoDash8: string = "";
  selectedPoEo: string = "";
  selectedStartDate: string;
  selectedEndDate: string;
  eoPoDiscrepancyReq: EoReportPoDiscrepancyReq;
  hideOrderNum: boolean = true;
  hideExceptNum: boolean = true;
  hideMEN: boolean = true;
  hideMPN: boolean = true;
  hidePoBtn: boolean = false;
  hideEoNumber: boolean = true;
  hidePoDiscrepancyDash8: boolean = true;
  hidePoDiscrepancyEO: boolean = true;
  hidePlannerName: boolean = true;
  hideDash8: boolean = true;
  hidePo
  hidePoSpinner: boolean = true;
  resp: any;
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'PO Discrepancy Report - ' + this.currentDate + '.xlsx';
  
  @ViewChild('allPoPlannerSelected', { static: true }) private allPoPlannerSelected: MatSelectionList;
  @ViewChild('allRoutingGroupSelected', { static: true }) private allRoutingGroupSelected: MatSelectionList;
  @ViewChild('allExceptionReasonSelected', { static: true }) private allExceptionReasonSelected: MatSelectionList;

  constructor(
    private eoReportService: EoReportService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.poPlanners$ = this.eoReportService.getPoDiscrepancyPlanners();
    this.routinggrp$ = this.eoReportService.getRoutingGroups();
    this.exceptionreason$ = this.eoReportService.getExceptionReasons();
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
      case "eo":
        if (value.target.value.length > 4) {
          this.filteredPoDiscrepancyEo$ = this.eoReportService.autoSearchPoDiscrepancy(value.target.value, type);
          this.hidePoDiscrepancyEO = true;
        }
        else { 
          this.hidePoDiscrepancyEO = false;
        }
        break;
      case "dash8":
        if (value.target.value.length > 11) {
          this.filteredPoDiscrepancyDash8$ = this.eoReportService.autoSearchPoDiscrepancy(value.target.value, type);
          this.hidePoDiscrepancyDash8 = true;
        }
        else { 
          this.hidePoDiscrepancyDash8 = false;
        }
        break;
      case "ordernum":
        if (value.target.value.length > 3) {
          // change this
          this.filteredOrderNum$ = this.eoReportService.autoSearchPoDiscrepancy(value.target.value, type);
          this.hideOrderNum= true;
        }
        else { 
          this.hideOrderNum = false;
        }
        break;
      case "exceptionnumber":
        if (value.target.value.length > 3) {
          // change this
          this.filteredExceptNum$ = this.eoReportService.autoSearchPoDiscrepancy(value.target.value, type);
          this.hideExceptNum= true;
        }
        else { 
          this.hideExceptNum = false;
        }
        break;
      case "men":
        if (value.target.value.length > 9) {
          // change this
          this.filteredMEN$ = this.eoReportService.autoSearchPoDiscrepancy(value.target.value, type);
          this.hideMEN= true;
        }
        else { 
          this.hideMEN = false;
        }
        break;
      case "mpn":
        if (value.target.value.length > 5) {
          // change this
          this.filteredMPN$ = this.eoReportService.autoSearchPoDiscrepancy(value.target.value, type);
          this.hideMPN = true;
        }
        else { 
          this.hideMPN = false;
        }
        break;
    }
  }

  selectAll(listName: string) { 
    switch (listName) {
      case 'poplanner':
        this.allPoPlannerSelected.selectAll();
        break;
      case 'postatus':
        this.allRoutingGroupSelected.selectAll();
        break;
      case 'exceptionreason':
        this.allExceptionReasonSelected.selectAll();
        break;
     }
  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'poplanner':
        this.allPoPlannerSelected.deselectAll();
        break;
      case 'postatus':
        this.allRoutingGroupSelected.deselectAll();
        break;
      case 'exceptionreason':
        this.allExceptionReasonSelected.deselectAll();
        break;
     }
  }

  getSelectedPoDiscrepancyPlanners(selectedVal) {
    this.selectedPoDiscrepancyPlanner = [];
      selectedVal.forEach(element => {
        this.selectedPoDiscrepancyPlanner.push(element._text.nativeElement.innerText)
      });
   }

  getSelectedRoutingGroup(selectedVal) { 
    this.selectedRoutingGroup = [];
      selectedVal.forEach(element => {
        this.selectedRoutingGroup.push(element._text.nativeElement.innerText)
      });
  }

  getSelectedExceptionReason(selectedVal) { 
    this.selectedExceptionReason = [];
      selectedVal.forEach(element => {
        this.selectedExceptionReason.push(element._text.nativeElement.innerText)
      });
  }

  generateReport() {
    // this.openPPAMMaintSnackBar();
    this.hidePoSpinner = false;
    this.getSelectedPoDiscrepancyPlanners(this.allPoPlannerSelected.selectedOptions.selected);
    this.getSelectedRoutingGroup(this.allRoutingGroupSelected.selectedOptions.selected);
    this.getSelectedExceptionReason(this.allExceptionReasonSelected.selectedOptions.selected);
    const _ordernumber = document.getElementById('orderNumber') as HTMLFormElement;
    const _exceptionNumber = document.getElementById('exceptionNumber') as HTMLFormElement;
    const _mpn = document.getElementById('podSearchMPN') as HTMLFormElement;
    const _men = document.getElementById('podSearchMEN') as HTMLFormElement;
    const _eo = document.getElementById('searchPoEO') as HTMLFormElement;
    const _dash8 = document.getElementById('searchPoDash8') as HTMLFormElement;

    const _startdate = document.getElementById('podstartdate') as HTMLFormElement;
    const _enddate = document.getElementById('podenddate') as HTMLFormElement;
    this.selectedStartDate = _startdate.value;
    this.selectedEndDate = _enddate.value;
    this.selectedOrderNumber = _ordernumber.value;
    this.selectedExceptionNumber = _exceptionNumber.value;
    this.selectedMpn = _mpn.value;
    this.selectedMen = _men.value;
    this.selectedPoDash8 =_dash8.value;
    this.selectedPoEo = _eo.value;

    this.eoPoDiscrepancyReq = new EoReportPoDiscrepancyReq();
    let tmpstartdate = this.selectedStartDate.split('/');
    let newstartdate = tmpstartdate[2] + '/';
    newstartdate += tmpstartdate[0].length < 10 ? '0' + tmpstartdate[0] : tmpstartdate[0];
    newstartdate += tmpstartdate[1].length < 2 ? '/0' + tmpstartdate[1] : '/' + tmpstartdate[1];

    let tmpenddate = this.selectedEndDate.split('/');
    let newenddate = tmpenddate[2] + '/';
    newenddate += tmpenddate[0].length < 10 ? '0' + tmpenddate[0] : tmpenddate[0];
    newenddate += tmpenddate[1].length < 2 ? '/0' + tmpenddate[1] : '/' + tmpenddate[1];
    this.eoPoDiscrepancyReq.podstartDate = new Date(newstartdate);
    this.eoPoDiscrepancyReq.podendDate = new Date(newenddate);
    this.eoPoDiscrepancyReq.selectedPlannerName = this.selectedPoDiscrepancyPlanner;
    this.eoPoDiscrepancyReq.selectedRoutingGroup = this.selectedRoutingGroup;
    this.eoPoDiscrepancyReq.selectedExceptionReason = this.selectedExceptionReason;
    this.eoPoDiscrepancyReq.selectedOrderNumber = this.selectedOrderNumber;
    this.eoPoDiscrepancyReq.selectedExceptionNumber = this.selectedExceptionNumber;
    this.eoPoDiscrepancyReq.selectedMen = this.selectedMen;
    this.eoPoDiscrepancyReq.selectedMpn = this.selectedMpn;
    this.eoPoDiscrepancyReq.selectedDash8 = this.selectedPoDash8;
    this.eoPoDiscrepancyReq.selectedEo = this.selectedPoEo;

    this.eoReportService.downloadPoDiscrepancyReport(this.eoPoDiscrepancyReq)
      .subscribe(result => {
        this.hidePoSpinner = true;
        this.hidePoBtn = true;
        return this.resp = result;
    });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblPodResult'); 
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
