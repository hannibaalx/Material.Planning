import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { EoReportService } from 'src/app/service/eo-report.service';
import { EoReportList } from 'src/app/models/eo-report-list';
import { EoReportReq } from 'src/app/models/eo-report-req';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-eo-full-schedule',
  templateUrl: './eo-full-schedule.component.html',
  styleUrls: ['./eo-full-schedule.component.css']
})
export class EoFullScheduleComponent implements OnInit, OnDestroy {
  @ViewChild('allPlannerSelected', { static: true }) private allPlannerSelected: MatSelectionList;
  @ViewChild('allDateRangeSelected', { static: true }) private allDateRangeSelected: MatSelectionList;
  @ViewChild('allStationSelected', { static: true }) private allStationSelected: MatSelectionList;
  @ViewChild('allFleetSelected', { static: true }) private allFleetSelected: MatSelectionList;
  // @ViewChild('allCarrierSelected', { static: true }) private allCarrierSelected: MatSelectionList;
  @ViewChild('allDataSourceSelected', { static: true }) private allDataSourceSelected: MatSelectionList;
  
  // plannerNames: string[] = ['Ainsley', 'Antonio', 'Bruce', 'Kathy', 'Monroe', 'Nancy', 'Romel', 'Tamara', 'Tim', 'Valane'];
  // objPlannerNames = [{ name: 'Ainsley' }, { name: 'Antonio' }, { name: 'Bruce' }, { name: 'Kathy' }, { name: 'Monroe' }, { name: 'Nancy' }, { name: 'Romel' }, { name: 'Tamara' }, { name: 'Tim' }, { name: 'Valane'}];
  dateRange: string[] = ['30 Days', '60 Days', '90 Days', '120 Days', '180 Days', '180+ Days'];
  // stations = [{ station: 'DFW' }, { station: 'PHX' }, { station: 'PHL' }, { station: 'BFM' }, { station: 'CLT' }];
  // fleets = [{ fleet: 'A320 FRONTIER' }, { fleet: 'A320' }, { fleet: 'B757' }, { fleet: 'E190' }];
  // carriers: string[] = ['LAA', 'LUS'];

  //currentUser: string;
  planners$: Observable<EoReportList[]>;
  // carriers$: Observable<EoReportList[]>;
  dataResource$: Observable<EoReportList[]>;
  fleets$: Observable<EoReportList[]>;
  stations$: Observable<EoReportList[]>;
  eoControl = new FormControl();
  dash8Control = new FormControl();
  acControl = new FormControl();
  filteredEo$: Observable<string[]>;
  filteredEo: any;
  filteredDash8$: Observable<string[]>;
  filteredAC$: Observable<string[]>;
  hideEoNumber: boolean = true;
  hideDash8: boolean = true;
  hideAC: boolean = true;
  selectedPlanners: string[] = [];
  selectedDateRanges: string[] = [];
  selectedStations: string[] = [];
  selectedFleets: string[] = [];
  selectedCarriers: string[] = [];
  selectedDataSource: string[] = [];
  selectedEoNumber: string = "";
  selectedDash8: string = "";
  selectedAC: string = "";
  adIndVal: string = "";
  eoReportReq: EoReportReq;
  resp: any;
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'Full Schedule Report - ' + this.currentDate + '.xlsx';
  hideBtn: boolean = false;
  hideFsSpinner: boolean = true;

  fsSearchEO: string = "";
  dash8Term: string = "";
  acTerm: string = "";
  test: any;

  constructor(
    private eoReportService: EoReportService,
    private snackBar: MatSnackBar
  ) {  }

  ngOnInit() {
    this.planners$ = this.eoReportService.getFullSchedulePlannerNames();
    // this.carriers$ = this.eoReportService.getCarriers(); 
    this.dataResource$ = this.eoReportService.getDataResource();
    this.fleets$ = this.eoReportService.getFleets();
    this.stations$ = this.eoReportService.getStations();
    this.eoControl.valueChanges.pipe(
      startWith(''),
      map(value =>
        //this._eofilter(value)
        this.autoSearch(value, 'eonumber')
      )
    );
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
      case "eonumber":
        if (value.target.value.length > 4) {
          // this.filteredEo$ = this.eoReportService.getAutoSearch(value.target.value, type);
          this.filteredEo$ = this.eoReportService.getAutoSearch(value.target.value, type);
          this.hideEoNumber = true;
        }
        else { 
          this.hideEoNumber = false;
        }
        break;
      case "dash8":
        if (value.target.value.length > 11) {
          this.filteredDash8$ = this.eoReportService.getAutoSearch(value.target.value, type);
          this.hideDash8 = true;
        }
        else { 
          this.hideDash8 = false;
        }
        break;
      case "ac":
        if (value.target.value.length > 1) {
          this.filteredAC$ = this.eoReportService.getAutoSearch(value.target.value, type);
          this.hideAC = true;
        }
        else { 
          this.hideAC = false;
        }
        break;
    }
   }

  selectAll(listName: string) { 
    switch (listName) {
      case 'planner':
        this.allPlannerSelected.selectAll();
        break;
      case 'daterange':
        this.allDateRangeSelected.selectAll();
        break;
      case 'station':
        this.allStationSelected.selectAll();
        break;
      case 'fleet':
        this.allFleetSelected.selectAll();
        break;
      // case 'carrier':
      //   this.allCarrierSelected.selectAll();
      //   break;
      case 'datasource':
        this.allDataSourceSelected.selectAll();
     }

  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'planner':
        this.allPlannerSelected.deselectAll();
        break;
      case 'daterange':
        this.allDateRangeSelected.deselectAll();
        break;
      case 'station':
        this.allStationSelected.deselectAll();
        break;
      case 'fleet':
        this.allFleetSelected.deselectAll();
        break;
      // case 'carrier':
      //   this.allCarrierSelected.deselectAll();
      //   break;
        case 'datasource':
          this.allDataSourceSelected.deselectAll();
          break;
     }
  }

  eonumberdisplay(subject) { 
    return subject ? subject : undefined;
  }

  dash8display(subject) { 
    return subject ? subject : undefined;
  }

  acdisplay(subject) { 
    return subject ? subject : undefined;
  }

  getSelectedPlanner(selectedVal) { 
    //this.allPlannerSelected.selectedOptions.selected[0]._text.nativeElement.innerText
    this.selectedPlanners = [];
      selectedVal.forEach(element => {
        this.selectedPlanners.push(element._text.nativeElement.innerText)
      });
  }

  getSelectedDateRange(selectedVal) { 
    this.selectedDateRanges = [];
      selectedVal.forEach(element => {
        this.selectedDateRanges.push(element._text.nativeElement.innerText)
      });
  }

  getSelectedStations(selectedVal) { 
    this.selectedStations = [];
      selectedVal.forEach(element => {
        this.selectedStations.push(element._text.nativeElement.innerText)
      });
  }

  getSelectedFleets(selectedVal) { 
    this.selectedFleets = [];
      selectedVal.forEach(element => {
        this.selectedFleets.push(element._text.nativeElement.innerText)
      });
  }

  // getSelectedCarriers(selectedVal) { 
  //   this.selectedCarriers = [];
  //   if (selectedVal != []) {
  //     selectedVal.forEach(element => {
  //       this.selectedCarriers.push(element._text.nativeElement.innerText)
  //     });
  //   }
  // }

  getSelectedDataSource(selectedVal) { 
    this.selectedDataSource = [];
      selectedVal.forEach(element => {
        this.selectedDataSource.push(element._text.nativeElement.innerText)
      });
  }

  generateReport() {
    //this.openPPAMMaintSnackBar();
    this.hideFsSpinner = false;
    this.getSelectedPlanner(this.allPlannerSelected.selectedOptions.selected);
    this.getSelectedDateRange(this.allDateRangeSelected.selectedOptions.selected);
    this.getSelectedStations(this.allStationSelected.selectedOptions.selected);
    this.getSelectedFleets(this.allFleetSelected.selectedOptions.selected);
    // this.getSelectedCarriers(this.allCarrierSelected.selectedOptions.selected);
    this.getSelectedDataSource(this.allDataSourceSelected.selectedOptions.selected);
    const adind = document.getElementById('chkAdInd') as HTMLFormElement;
    const _eonumber = document.getElementById('fsSearchEO') as HTMLFormElement;
    const _dash8 = document.getElementById('fsSearchDash8') as HTMLFormElement;
    const _ac = document.getElementById('searchAC') as HTMLFormElement;
    this.selectedEoNumber = _eonumber.value;
    this.selectedDash8 = _dash8.value;
    this.selectedAC = _ac.value;
    this.adIndVal = (adind.classList[3] == 'mat-checkbox-checked') ? 'Y' : '';

    this.eoReportReq = new EoReportReq();
    this.eoReportReq.selectedPlanners = this.selectedPlanners;
    this.eoReportReq.selectedDateRange = this.selectedDateRanges;
    this.eoReportReq.selectedStations = this.selectedStations;
    this.eoReportReq.selectedFleets = this.selectedFleets;
    // this.eoReportReq.selectedCarriers = this.selectedCarriers;
    this.eoReportReq.selectedDataSource = this.selectedDataSource;
    this.eoReportReq.selectedEoNumber = this.selectedEoNumber;
    this.eoReportReq.selectedDash8 = this.selectedDash8;
    this.eoReportReq.selectedAC = this.selectedAC;
    this.eoReportReq.adInd = this.adIndVal;

    this.eoReportService.downloadReport(this.eoReportReq)
      .subscribe(result => {
        this.hideFsSpinner = true;
        this.hideBtn = true;
          return this.resp = result;
        });
    
        //this.exportexcel();

  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblFSResult'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, this.fileName);
     this.hideBtn = !this.hideBtn
  }

  // private _eofilter(value: string): string[] { 
  //   const filterValue = value.toLowerCase();
  //   return this.eoReportService.getAutoSearch(value, 'eonumber').pipe .filter(x =>
  //     x.toLowerCase().includes(filterValue)
  //   );
  // }

}
