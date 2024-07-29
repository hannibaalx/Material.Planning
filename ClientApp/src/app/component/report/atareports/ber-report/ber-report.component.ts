import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import * as XLSX from 'xlsx';
import { MatSelectionList } from '@angular/material/list';
import { Observable } from 'rxjs';
import { ReportService } from 'src/app/service/report.service';
import { JifReportList } from 'src/app/models/jif-report-list';
import { JifReportReq } from 'src/app/models/jif-report-req';
import { BerReportList } from 'src/app/models/ber-report-list';
import { BerReportReq } from 'src/app/models/ber-report-req';

const moment = _moment;

@Component({
  selector: 'app-ber-report',
  templateUrl: './ber-report.component.html',
  styleUrls: ['./ber-report.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
  
export class BerReportComponent implements OnInit {
  startdate = new FormControl(moment().subtract(1, 'years'));
  enddate = new FormControl(moment());
  minDate = moment().subtract(1, 'years');
  maxDate = moment();
  resp: any;
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'Ber Report - ' + this.currentDate + '.xlsx';
  hideBtn: boolean = false;
  hideBerSpinner: boolean = true;
  hideMePartNumber: boolean = true;
  hideMaterialType: boolean = true;
  selectedPlanners: string[] = [];
  selectedMePartNumber: string;
  selectedMaterialType: string;

  selectedStartDate: string;
  selectedEndDate: string;
  berReportReq: BerReportReq;

  filteredME$: Observable<string[]>;
  filteredMaterialType$: Observable<string[]>;

  @ViewChild('allPlannerSelected', { static: true }) private allPlannerSelected: MatSelectionList;

  planners$: Observable<BerReportList[]>;

  constructor(
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.planners$ = this.reportService.getBerPlannerName();
  }

  autoSearch(value, type: string) {
    switch (type) {
      case "me_part_number":
        if (value.target.value.length > 4) {
          this.filteredME$ = this.reportService.getBerAutoSearch(value.target.value, type);
          this.hideMePartNumber = true;
        }
        else { 
          this.hideMePartNumber = false;
        }
        break;
      case "material_type":
        if (value.target.value.length > 1) {
          this.filteredMaterialType$ = this.reportService.getBerAutoSearch(value.target.value, type);
          this.hideMaterialType = true;
        }
        else { 
          this.hideMaterialType = false;
        }
        break;
    }
  }
  
  selectAll(listName: string) { 
    switch (listName) {
      case 'planner':
        this.allPlannerSelected.selectAll();
        break;
     }
  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'planner':
        this.allPlannerSelected.deselectAll();
        break;
     }
  }

  getSelectedPlanner(selectedVal) { 
    this.selectedPlanners = [];
      selectedVal.forEach(element => {
        this.selectedPlanners.push(element._text.nativeElement.innerText)
      });
  }

  generateReport() {
    this.hideBerSpinner = false;
    this.getSelectedPlanner(this.allPlannerSelected.selectedOptions.selected);
    const _mepartnumber = document.getElementById('berSearchME') as HTMLFormElement;
    const _materialtype = document.getElementById('searchMaterialType') as HTMLFormElement;
    const _startdate = document.getElementById('berstartdate') as HTMLFormElement;
    const _enddate = document.getElementById('berenddate') as HTMLFormElement;  
    this.selectedMePartNumber = _mepartnumber.value;
    this.selectedMaterialType = _materialtype.value;

    this.selectedStartDate = _startdate.value;
    this.selectedEndDate = _enddate.value;
    
    this.berReportReq = new BerReportReq();
    let tmpstartdate = this.selectedStartDate.split('/');
    let newstartdate = tmpstartdate[2] + '/';
    newstartdate += tmpstartdate[0].length < 10 ? '0' + tmpstartdate[0] : tmpstartdate[0];
    newstartdate += '/' + tmpstartdate[1];

    let tmpenddate = this.selectedEndDate.split('/');
    let newenddate = tmpenddate[2] + '/';
    newenddate += tmpenddate[0].length < 10 ? '0' + tmpenddate[0] : tmpenddate[0];
    newenddate += '/' + tmpenddate[1];

    this.berReportReq.startDate = new Date(newstartdate);
    this.berReportReq.endDate = new Date(newenddate);
    this.berReportReq.selectedPlanners = this.selectedPlanners;
    this.berReportReq.selectedMePartNumber = this.selectedMePartNumber;
    this.berReportReq.selectedMaterialType = this.selectedMaterialType;
    
    this.reportService.downloadBerReport(this.berReportReq)
      .subscribe(data => {
        this.hideBerSpinner = true;
        this.hideBtn = true;
          return this.resp = data;
        });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblBerResult'); 
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
