import { EoReportPartShortageReq } from './../../../../../models/eo-report-part-shortage-req';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { Observable } from 'rxjs';
import { EoReportList } from 'src/app/models/eo-report-list';
import { EoReportService } from 'src/app/service/eo-report.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-part-shortage',
  templateUrl: './part-shortage.component.html',
  styleUrls: ['./part-shortage.component.css']
})
export class PartShortageComponent implements OnInit, OnDestroy {
  @ViewChild('allPlannerSelected', { static: true }) private allPlannerSelected: MatSelectionList;
  @ViewChild('allDateRangeSelected', { static: true }) private allDateRangeSelected: MatSelectionList;
  @ViewChild('allPartRequirementSelected', { static: true }) private allPartRequirementSelected: MatSelectionList;
  @ViewChild('allPartTypeSelected', { static: true }) private allPartTypeSelected: MatSelectionList;
  @ViewChild('allKitIndSelected', { static: true }) private allKitIndSelected: MatSelectionList;

  currentUser: string;
  planners$: Observable<EoReportList[]>;
  partRequirement$: Observable<EoReportList[]>;
  filteredEo$: Observable<string[]>;
  filteredDash8$: Observable<string[]>;
  filteredMT$: Observable<string[]>;
  filteredMPN$: Observable<string[]>;
  filteredMEU$: Observable<string[]>;
  hideEoNumber: boolean = true;
  hideDash8: boolean = true;
  hideMT: boolean = true;
  hideMEU: boolean = true;
  hideMPN: boolean = true;
  selectedPlanners: string[] = [];
  selectedDateRanges: string[] = [];
  selectedPartRequirment: string[] = [];
  selectedPartType: string[] = [];
  selectedKitInd: string[] = [];
  selectedEoNumber: string = "";
  selectedDash8: string = "";
  selectedMt: string = "";
  selectedMpn: string = "";
  selectedMeu: string = "";
  adIndVal: string = "";
  eoReportPartShortageReq: EoReportPartShortageReq;
  resp: any;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Part Shortage Report - ' + this.currentDate + '.xlsx';
  hideBtn: boolean = false;
  hidePsSpinner: boolean = true;
  
  dateRange = [
    { id: 1, name: '30 Days' },
    { id: 2, name: '60 Days' },
    { id: 3, name: '90 Days' },
    { id: 4, name: '120 Days' },
    { id: 5, name: '180 Days' },
    { id: 6, name: '180+ Days'},
  ];
  selectedDateRange = [];

  // partRequirement = [
  //   { id: 1, name: 'Required' },
  //   { id: 2, name: 'As Required' },
  // ];
  selectedPartRequirement = [];

  partType = [
    { id: 1, partType: 'Expendable -3' },
    { id: 2, partType: 'Repairables -4' },
    { id: 3, partType: 'Rotable -9' },
    { id: 4, partType: 'Tooling -0' }
  ];
 
  kitInd = [
    { id: "Yes", value: 'Yes' },
    { id: "No", value: 'No' },
  ]

  //selectedKitInd = [];

  constructor(
    private eoReportService: EoReportService
  ) { }

  ngOnInit() {
    this.planners$ = this.eoReportService.getPartShortagePlanners();
    this.partRequirement$ = this.eoReportService.getPartShortageRequirement();
  }

  ngOnDestroy() {
  }

  autoSearch(value, type: string) {
    switch (type) {
      case "eo":
        if (value.target.value.length > 4) {
          // this.filteredEo$ = this.eoReportService.getAutoSearch(value.target.value, type);
          this.filteredEo$ = this.eoReportService.autoSearchPartShortage(value.target.value, type);
          this.hideEoNumber = true;
        }
        else { 
          this.hideEoNumber = false;
        }
        break;
      case "dash8":
        if (value.target.value.length > 11) {
          this.filteredDash8$ = this.eoReportService.autoSearchPartShortage(value.target.value, type);
          this.hideDash8 = true;
        }
        else { 
          this.hideDash8 = false;
        }
        break;
      case "mt":
        if (value.target.value.length >= 1) {
          this.filteredMT$ = this.eoReportService.autoSearchPartShortage(value.target.value, type);
          this.hideMT = true;
        }
        else { 
          this.hideMT = false;
        }
        break;
      case "mpn":
        if (value.target.value.length > 1) {
          this.filteredMPN$ = this.eoReportService.autoSearchPartShortage(value.target.value, type);
          this.hideMPN = true;
        }
        else { 
          this.hideMPN = false;
        }
        break;
      case "meu":
        if (value.target.value.length > 1) {
          this.filteredMEU$ = this.eoReportService.autoSearchPartShortage(value.target.value, type);
          this.hideMEU = true;
        }
        else { 
          this.hideMEU = false;
        }
        break;
    }
  }

  generateReport() { 
    this.hidePsSpinner = false;
    this.getSelectedPlanner(this.allPlannerSelected.selectedOptions.selected);
    this.getSelectedDateRange(this.allDateRangeSelected.selectedOptions.selected);
    this.getSelectedPartRequirment(this.allPartRequirementSelected.selectedOptions.selected);
    this.getSelectedPartType(this.allPartTypeSelected.selectedOptions.selected);
    this.getSelectedKitInd(this.allKitIndSelected.selectedOptions.selected);
    const adInd = document.getElementById('chkADIND') as HTMLFormElement;
    const _eonumber = document.getElementById('searchEO') as HTMLFormElement;
    const _dash8 = document.getElementById('searchDash8') as HTMLFormElement;
    const _mt = document.getElementById('searchMT') as HTMLFormElement;
    const _mpn = document.getElementById('searchMPN') as HTMLFormElement;
    const _meu = document.getElementById('searchMEU') as HTMLFormElement;
    this.selectedEoNumber = _eonumber.value;
    this.selectedDash8 = _dash8.value;
    this.selectedMt = _mt.value;
    this.selectedMpn = _mpn.value;
    this.selectedMeu = _meu.value;
    this.adIndVal = (adInd.classList[3] == 'mat-checkbox-checked') ? 'Y' : '';

    this.eoReportPartShortageReq = new EoReportPartShortageReq();
    this.eoReportPartShortageReq.selectedPlanners = this.selectedPlanners;
    this.eoReportPartShortageReq.selectedDateRange = this.selectedDateRanges;
    this.eoReportPartShortageReq.selectedPartRequirement = this.selectedPartRequirment;
    this.eoReportPartShortageReq.selectedPartType = this.selectedPartType;
    this.eoReportPartShortageReq.selectedKitInd = this.selectedKitInd;
    this.eoReportPartShortageReq.selectedMeu = this.selectedMeu;
    this.eoReportPartShortageReq.selectedMpn = this.selectedMpn;
    this.eoReportPartShortageReq.selectedMt = this.selectedMt;
    this.eoReportPartShortageReq.selectedDash8 = this.selectedDash8;
    this.eoReportPartShortageReq.selectedEoNumber = this.selectedEoNumber;
    
    this.eoReportPartShortageReq.adInd = this.adIndVal;

    this.eoReportService.downloadReportPartShortage(this.eoReportPartShortageReq)
      .subscribe(result => {
        this.hidePsSpinner = true;
        this.hideBtn = true;
          return this.resp = result;
        });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblPSResult'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.hideBtn = !this.hideBtn
  }

  getSelectedPlanner(selectedVal) { 
    //this.allPlannerSelected.selectedOptions.selected[0]._text.nativeElement.innerText
    this.selectedPlanners = [];
    if (selectedVal != null) {
      selectedVal.forEach(element => {
        this.selectedPlanners.push(element._text.nativeElement.innerText)
      });
    }
  }

  getSelectedDateRange(selectedVal) { 
    this.selectedDateRanges = [];
    if (selectedVal != null) {
      selectedVal.forEach(element => {
        this.selectedDateRanges.push(element._text.nativeElement.innerText)
      });
    }
  }

  getSelectedPartRequirment(selectedVal) { 
    this.selectedPartRequirment = [];
    if (selectedVal != null) {
      selectedVal.forEach(element => {
        this.selectedPartRequirment.push(element._text.nativeElement.innerText)
      });
    }
  }

  getSelectedPartType(selectedVal) { 
    this.selectedPartType = [];
    if (selectedVal != null) {
      selectedVal.forEach(element => {
        this.selectedPartType.push(element._text.nativeElement.innerText)
      });
    }
  }

  getSelectedKitInd(selectedVal) { 
    this.selectedKitInd = [];
    if (selectedVal != null) {
      selectedVal.forEach(element => {
        this.selectedKitInd.push(element._text.nativeElement.innerText)
      });
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
      case 'partreq':
        this.allPartRequirementSelected.selectAll();
        break;
      case 'parttype':
        this.allPartTypeSelected.selectAll();
        break;
      // case 'carrier':
      //   this.allCarrierSelected.selectAll();
      //   break;
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
      case 'partreq':
        this.allPartRequirementSelected.deselectAll();
        break;
      case 'parttype':
        this.allPartTypeSelected.deselectAll();
        break;
      // case 'carrier':
      //   this.allCarrierSelected.deselectAll();
      //   break;
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

  getValues() {
    //console.log(this.selected);
  }

}
