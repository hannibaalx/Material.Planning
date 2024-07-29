import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';
import { EoReportService } from 'src/app/service/eo-report.service';
import { EoReportList } from 'src/app/models/eo-report-list';
import { EoReportPartShortageReq } from 'src/app/models/eo-report-part-shortage-req';
import { EoReportEcoStationReadinessReq } from 'src/app/models/eo-report-eco-station-readiness-req';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-eo-eco-station-readiness',
  templateUrl: './eo-eco-station-readiness.component.html',
  styleUrls: ['./eo-eco-station-readiness.component.css']
})
export class EoEcoStationReadinessComponent implements OnInit {
  @ViewChild('allEcoPlannerSelected', { static: true }) private allEcoPlannerSelected: MatSelectionList;
  @ViewChild('allEcoDataSourceSelected', { static: true }) private allEcoDataSourceSelected: MatSelectionList;
  @ViewChild('dash8Input') dash8Input: ElementRef<HTMLInputElement>;
  @ViewChild('eoNumberInput') eoNumberInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoDash8') matAutocompleteDash8: MatAutocomplete;
  @ViewChild('autoEoNumber') matAutocompleteEoNumber: MatAutocomplete;
  ecoplanners$: Observable<EoReportList[]>;
  datasource$: Observable<EoReportList[]>;
  filteredEcoEo$: Observable<string[]>;
  filteredEcoDash8$: Observable<string[]>;
  hideEcoEoNumber: boolean = true;
  hideEcoDash8: boolean = true;
  selectedEcoPlanners: string[] = [];
  selectedEcoDataSource: string[] = [];
  selectedEcoEoNumber: string[] = [];
  selectedEcoDash8: string[] = [];
  eoReportEcoStationReadinessReq: EoReportEcoStationReadinessReq;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chiplistDash8s: string[] = [];
  chiplistEoNumbers: string[] = [];
  dash8Ctrl = new FormControl();
  eoNumberCtrl = new FormControl();
  filteredDash8s: Observable<string[]>;
  filteredEoNumbers: Observable<string[]>;
  dash8s: string[] = [];
  eoNumbers: string[] = [];
  allDash8s: string[] = []; 
  allEoNumbers: string[] = []; 
  resp: any;
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'ECO Station Readiness Report - ' + this.currentDate + '.xlsx';
  hideEcoBtn: boolean = false;
  hideEcoSpinner: boolean = true;

  eoReportPartShortageReq: EoReportPartShortageReq;

  constructor(
    private userService: UserService,
    private eoReportService: EoReportService,
    private snackBar: MatSnackBar
  ) {
    this.filteredDash8s = this.dash8Ctrl.valueChanges.pipe(
        startWith(''),
        map((_dash8: string | null) => _dash8 ? this._filter(_dash8, 'dash8') : this.allDash8s.slice()));
    
    this.filteredEoNumbers = this.eoNumberCtrl.valueChanges.pipe(
      startWith(''),
      map((_eoNumber: string | null) => _eoNumber ? this._filter(_eoNumber, 'eo') : this.allEoNumbers.slice()));
  }

  ngOnInit() {
    this.ecoplanners$ = this.eoReportService.getECOStationPlanners();
    this.datasource$ = this.eoReportService.getEcoStationDataSource();

    this.eoReportService.getFilteredDash8s()
      .subscribe(data => { 
        data.forEach(x => {
          this.allDash8s.push(x)
        });
      });
    
    this.filteredDash8s = this.dash8Ctrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, 'dash8'))
    );

    
    this.eoReportService.getFilteredEoNumbers()
      .subscribe(data => { 
        data.forEach(x => {
          this.allEoNumbers.push(x)
        });
      });
    
    this.filteredEoNumbers = this.eoNumberCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, 'eo'))
    );
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
      case 'ecoplanner':
        this.allEcoPlannerSelected.selectAll();
        break;
      case 'datasource':
        this.allEcoDataSourceSelected.selectAll();
        break;
     }
  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'ecoplanner':
        this.allEcoPlannerSelected.deselectAll();
        break;
      case 'datasource':
        this.allEcoDataSourceSelected.deselectAll();
        break;
     }
  }

  autoSearch(value, type: string) {
    switch (type) {
      case "eo":
        if (value.target.value.length > 4) {
          this.filteredEcoEo$ = this.eoReportService.autoSearchEcoStationReadiness(value.target.value, type);
          this.hideEcoEoNumber = true;
        }
        else {
          this.hideEcoEoNumber = false;
        }
        break;
      case "dash8":
        if (value.target.value.length > 11) {
          this.filteredEcoDash8$ = this.eoReportService.autoSearchEcoStationReadiness(value.target.value, type);
          this.hideEcoDash8 = true;
        }
        else {
          this.hideEcoDash8 = false;
        }
        break;
    }
  }

  getSelectedEcoPlanner(selectedVal) { 
    this.selectedEcoPlanners = [];
      selectedVal.forEach(element => {
        this.selectedEcoPlanners.push(element._text.nativeElement.innerText)
      });
  }

  getSelectedDataSource(selectedVal) { 
    this.selectedEcoDataSource = [];
      selectedVal.forEach(element => {
        this.selectedEcoDataSource.push(element._text.nativeElement.innerText)
      });
  }

  generateReport() {
    // this.openPPAMMaintSnackBar();
    this.hideEcoSpinner = false;
    this.getSelectedEcoPlanner(this.allEcoPlannerSelected.selectedOptions.selected);
    this.getSelectedDataSource(this.allEcoDataSourceSelected.selectedOptions.selected);
    const _ecodash8 = this.chiplistDash8s; 
    const _ecoeonumber = this.chiplistEoNumbers;
    this.selectedEcoDash8 = _ecodash8;
    this.selectedEcoEoNumber = _ecoeonumber;
    
    this.eoReportEcoStationReadinessReq = new EoReportEcoStationReadinessReq();
    this.eoReportEcoStationReadinessReq.selectedEcoPlanners = this.selectedEcoPlanners;
    this.eoReportEcoStationReadinessReq.selectedEcoDataSource = this.selectedEcoDataSource;
    this.eoReportEcoStationReadinessReq.selectedEcoDash8 = this.selectedEcoDash8;
    this.eoReportEcoStationReadinessReq.selectedEcoEoNumber = this.selectedEcoEoNumber;

    this.eoReportService.downloadReportEcoStationReadiness(this.eoReportEcoStationReadinessReq)
      .subscribe(result => {
        this.hideEcoSpinner = true;
        this.hideEcoBtn = true;
        return this.resp = result;
      });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblEcoStationReadinessResult'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.hideEcoBtn = !this.hideEcoBtn
  }

  add(event: MatChipInputEvent, type: string): void {
    switch (type) { 
      case 'dash8':
        // Add dash8 only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matAutocompleteDash8.isOpen) {
          const input = event.input;
          const value = event.value;

          // Add our DASH_8
          if ((value || '').trim()) {
            this.chiplistDash8s.push(value.trim());
          }

          // Reset the input value
          if (input) {
            input.value = '';
          }

          this.dash8Ctrl.setValue(null);
        }
        break;
      case 'eo':
        // Add EO_NUMBER only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matAutocompleteEoNumber.isOpen) {
          const input = event.input;
          const value = event.value;

          // Add our EO_NUMBER
          if ((value || '').trim()) {
            this.chiplistEoNumbers.push(value.trim());
          }

          // Reset the input value
          if (input) {
            input.value = '';
          }

          this.eoNumberCtrl.setValue(null);
        }
        break;      
    }
  }
  
  remove(_val: string, type: string): void {
    switch (type) { 
      case 'dash8':
        const dash8_index = this.chiplistDash8s.indexOf(_val);

        if (dash8_index >= 0) {
          this.chiplistDash8s.splice(dash8_index, 1);
        }
        break;
      case 'eo':
        const eo_numberindex = this.chiplistEoNumbers.indexOf(_val);

        if (eo_numberindex >= 0) {
          this.chiplistEoNumbers.splice(eo_numberindex, 1);
        }
        break;
    }
  }

  selected(event: MatAutocompleteSelectedEvent, type: string): void {
    switch (type) { 
      case 'dash8':
        this.chiplistDash8s.push(event.option.viewValue);
        this.dash8Input.nativeElement.value = '';
        this.dash8Ctrl.setValue(null);        
        break;
      case 'eo':
        this.chiplistEoNumbers.push(event.option.viewValue);
        this.eoNumberInput.nativeElement.value = '';
        this.eoNumberCtrl.setValue(null);
        break;
    }
  }

  private _filter(value: string, type: string): string[] {
    if (value != null && value != ""){
      const filterValue = value.toString().toLowerCase();
      switch (type) {
        case 'dash8':
          return this.allDash8s.filter(_dash8 => _dash8["DASH_8"].toLowerCase().indexOf(filterValue) === 0);
        case 'eo':
          return this.allEoNumbers.filter(_eoNumber => _eoNumber["EO_NUMBER"].toLowerCase().indexOf(filterValue) === 0)
      }      
    }
  }
}
