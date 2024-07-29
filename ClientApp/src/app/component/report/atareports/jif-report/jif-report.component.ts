import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectionList } from '@angular/material/list';
import * as _moment from 'moment';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import { ReportService } from 'src/app/service/report.service';
import { JifReportList } from 'src/app/models/jif-report-list';
import { JifReportReq } from 'src/app/models/jif-report-req';

const moment = _moment;

@Component({
  selector: 'app-jif-report',
  templateUrl: './jif-report.component.html',
  styleUrls: ['./jif-report.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class JifReportComponent implements OnInit {
  startdate = new FormControl(moment().subtract(1, 'years'));
  enddate = new FormControl(moment());
  minDate = moment().subtract(1, 'years');
  maxDate = moment();
  resp: any;
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'Jif Report - ' + this.currentDate + '.xlsx';
  hideBtn: boolean = false;
  hideFsSpinner: boolean = true;
  hideMePartNumber: boolean = false;
  hideMfgPartNumber: boolean = true;
  hideSerialNumber: boolean = true;
  selectedPlanners: string[] = [];
  selectedDateRanges: string[] = [];
  selectedStations: string[] = [];
  selectedMePartNumber: string;
  selectedMfgPartNumber: string;
  selectedSerialNumber: string;
  selectedStartDate: string;
  selectedEndDate: string;
  jifReportReq: JifReportReq;

  filteredME$: Observable<string[]>;
  filteredMfg$: Observable<string[]>;
  filteredSerialNumber$: Observable<string[]>;

  @ViewChild('allPlannerSelected', { static: true }) private allPlannerSelected: MatSelectionList;
  @ViewChild('allStationSelected', { static: true }) private allStationSelected: MatSelectionList;

  planners$: Observable<JifReportList[]>;
  stations$: Observable<JifReportList[]>;

  constructor(
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.planners$ = this.reportService.getJifPlannerName();
    this.stations$ = this.reportService.getJifStation();
  }

  autoSearch(value, type: string) {
    switch (type) {
      case "me_part_number":
        if (value.target.value.length > 4) {
          this.filteredME$ = this.reportService.getJifAutoSearch(value.target.value, "me_part_number");
          this.hideMePartNumber = true;
        }
        else { 
          this.hideMePartNumber = false;
        }
        break;
      case "mfg_part_number":
        if (value.target.value.length > 3) {
          this.filteredMfg$ = this.reportService.getJifAutoSearch(value.target.value, "mfg_part_number");
          this.hideMfgPartNumber = true;
        }
        else { 
          this.hideMfgPartNumber = false;
        }
        break;
      case "serial_number":
        if (value.target.value.length > 1) {
          this.filteredSerialNumber$ = this.reportService.getJifAutoSearch(value.target.value, "serial_number");
          this.hideSerialNumber = true;
        }
        else { 
          this.hideSerialNumber = false;
        }
        break;
    }
   }

  selectAll(listName: string) { 
    switch (listName) {
      case 'planner':
        this.allPlannerSelected.selectAll();
        break;
      case 'station':
        this.allStationSelected.selectAll();
        break;
     }
  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'planner':
        this.allPlannerSelected.deselectAll();
        break;
      case 'station':
        this.allStationSelected.deselectAll();
        break;
     }
  }

  getSelectedPlanner(selectedVal) { 
    this.selectedPlanners = [];
      selectedVal.forEach(element => {
        this.selectedPlanners.push(element._text.nativeElement.innerText)
      });
  }

  getSelectedStations(selectedVal) { 
    this.selectedStations = [];
      selectedVal.forEach(element => {
        this.selectedStations.push(element._text.nativeElement.innerText)
      });
  }


  generateReport() {
    this.hideFsSpinner = false;
    this.getSelectedPlanner(this.allPlannerSelected.selectedOptions.selected);
    this.getSelectedStations(this.allStationSelected.selectedOptions.selected);
    const _mepartnumber = document.getElementById('fsSearchME') as HTMLFormElement;
    const _mfgpartnumber = document.getElementById('fsSearchMfg') as HTMLFormElement;
    const _serialnumber = document.getElementById('searchSerialNumber') as HTMLFormElement;
    const _startdate = document.getElementById('jifstartdate') as HTMLFormElement;
    const _enddate = document.getElementById('jifenddate') as HTMLFormElement;  
    this.selectedMePartNumber = _mepartnumber.value;
    this.selectedMfgPartNumber = _mfgpartnumber.value;
    this.selectedSerialNumber = _serialnumber.value;

    this.selectedStartDate = _startdate.value;
    this.selectedEndDate = _enddate.value;
    
    this.jifReportReq = new JifReportReq();
    let tmpstartdate = this.selectedStartDate.split('/');
    let newstartdate = tmpstartdate[2] + '/';
    newstartdate += tmpstartdate[0].length < 10 ? '0' + tmpstartdate[0] : tmpstartdate[0];
    newstartdate += '/' + tmpstartdate[1];

    let tmpenddate = this.selectedEndDate.split('/');
    let newenddate = tmpenddate[2] + '/';
    newenddate += tmpenddate[0].length < 10 ? '0' + tmpenddate[0] : tmpenddate[0];
    newenddate += '/' + tmpenddate[1];

    this.jifReportReq.startDate = new Date(newstartdate);
    this.jifReportReq.endDate = new Date(newenddate);
    this.jifReportReq.selectedPlanners = this.selectedPlanners;
    this.jifReportReq.selectedStations = this.selectedStations;
    this.jifReportReq.selectedMePartNumber = this.selectedMePartNumber;
    this.jifReportReq.selectedMfgPartNumber = this.selectedMfgPartNumber;
    this.jifReportReq.selectedSerialNumber = this.selectedSerialNumber;
    
    this.reportService.downloadJifReport(this.jifReportReq)
      .subscribe(data => {
        this.hideFsSpinner = true;
        this.hideBtn = true;
          return this.resp = data;
        });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblJifResult'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, this.fileName);
     this.hideBtn = !this.hideBtn
  }

}
