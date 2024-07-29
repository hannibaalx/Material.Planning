import { Component, OnInit, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { EoReportList } from 'src/app/models/eo-report-list';
import { EoReportBomInventoryReq } from 'src/app/models/eo-report-bom-inventory-req';
import { EoReportService } from 'src/app/service/eo-report.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-eo-bom-inventory',
  templateUrl: './eo-bom-inventory.component.html',
  styleUrls: ['./eo-bom-inventory.component.css']
})
export class EoBomInventoryComponent implements OnInit {
  @ViewChild('allBomPlannerSelected', { static: true }) private allBomPlannerSelected: MatSelectionList;
  @ViewChild('allBomPartRequirementSelected', { static: true }) private allBomPartRequirementSelected: MatSelectionList;
  @ViewChild('allBomPartTypeSelected', { static: true }) private allBomPartTypeSelected: MatSelectionList;

  planners$: Observable<EoReportList[]>;
  partRequirement$: Observable<EoReportList[]>;
  filteredBomEo$: Observable<string[]>;
  filteredBomDash8$: Observable<string[]>;
  filteredBomMT$: Observable<string[]>;
  filteredBomME$: Observable<string[]>;
  filteredBomMPN$: Observable<string[]>;

  hideBomEoNumber: boolean = true;
  hideBomDash8: boolean = true;
  hideBomMT: boolean = true;
  hideBomME: boolean = true;
  hideBomMPN: boolean = true;
  selectedPlanners: string[] = [];
  selectedDateRanges: string[] = [];
  selectedPartRequirment: string[] = [];
  selectedPartType: string[] = [];
  selectedBomEoNumber: string = "";
  selectedBomDash8: string = "";
  selectedBomMt: string = "";
  selectedBomMe: string = "";
  selectedBomMpn: string = "";
  bomAdIndVal: string = "";
  eoReportBomInventoryReq: EoReportBomInventoryReq;
  resp: any;
  currentDate = moment().format('YYYY-MM-DD hh:mm');
  fileName = 'BOM Inventory Report - ' + this.currentDate + '.xlsx';
  hideBomBtn: boolean = false;
  hideBomPsSpinner: boolean = true;

  partType = [
    { id: 1, partType: 'Expendable -3' },
    { id: 2, partType: 'Repairables -4' },
    { id: 3, partType: 'Rotable -9' },
    { id: 4, partType: 'Tooling -0' }
  ];

  constructor(
    private eoReportService: EoReportService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.planners$ = this.eoReportService.getBOMInventoryPlanners();
    this.partRequirement$ = this.eoReportService.getBOMInventoryRequirement();
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
          // this.filteredEo$ = this.eoReportService.getAutoSearch(value.target.value, type);
          this.filteredBomEo$ = this.eoReportService.autoSearchBOMInventory(value.target.value, type);
          this.hideBomEoNumber = true;
        }
        else { 
          this.hideBomEoNumber = false;
        }
        break;
      case "dash8":
        if (value.target.value.length > 11) {
          this.filteredBomDash8$ = this.eoReportService.autoSearchBOMInventory(value.target.value, type);
          this.hideBomDash8 = true;
        }
        else { 
          this.hideBomDash8 = false;
        }
        break;
      case "mt":
        if (value.target.value.length >= 1) {
          this.filteredBomMT$ = this.eoReportService.autoSearchBOMInventory(value.target.value, type);
          this.hideBomMT = true;
        }
        else { 
          this.hideBomMT = false;
        }
        break;
      case "me":
        if (value.target.value.length >= 1) {
          this.filteredBomME$ = this.eoReportService.autoSearchBOMInventory(value.target.value, type);
          this.hideBomME = true;
        }
        else { 
          this.hideBomME = false;
        }
        break;
      case "mpn":
        if (value.target.value.length > 1) {
          this.filteredBomMPN$ = this.eoReportService.autoSearchBOMInventory(value.target.value, type);
          this.hideBomMPN = true;
        }
        else { 
          this.hideBomMPN = false;
        }
        break;
    }
  }

  generateReport() {
    // this.openPPAMMaintSnackBar();
    this.hideBomPsSpinner = false;
    this.getSelectedPlanner(this.allBomPlannerSelected.selectedOptions.selected);
    this.getSelectedPartRequirment(this.allBomPartRequirementSelected.selectedOptions.selected);
    this.getSelectedPartType(this.allBomPartTypeSelected.selectedOptions.selected);
    const bomAdInd = document.getElementById('chkBomADIND') as HTMLFormElement;
    const _eonumber = document.getElementById('searchBomEO') as HTMLFormElement;
    const _dash8 = document.getElementById('searchBomDash8') as HTMLFormElement;
    const _mt = document.getElementById('searchBomMT') as HTMLFormElement;
    const _me = document.getElementById('searchBomME') as HTMLFormElement;
    const _mpn = document.getElementById('searchBomMPN') as HTMLFormElement;
    
    this.selectedBomEoNumber = _eonumber.value;
    this.selectedBomDash8 = _dash8.value;
    this.selectedBomMt = _mt.value;
    this.selectedBomMe = _me.value;
    this.selectedBomMpn = _mpn.value;
    
    this.bomAdIndVal = (bomAdInd.classList[3] == 'mat-checkbox-checked') ? 'Y' : '';

    this.eoReportBomInventoryReq = new EoReportBomInventoryReq();
    this.eoReportBomInventoryReq.selectedBomPlanners = this.selectedPlanners;
    this.eoReportBomInventoryReq.selectedBomPartRequirement = this.selectedPartRequirment;
    this.eoReportBomInventoryReq.selectedBomPartType = this.selectedPartType;
    this.eoReportBomInventoryReq.selectedBomMe = this.selectedBomMe;
    this.eoReportBomInventoryReq.selectedBomMpn = this.selectedBomMpn;
    this.eoReportBomInventoryReq.selectedBomMt = this.selectedBomMt;
    this.eoReportBomInventoryReq.selectedBomDash8 = this.selectedBomDash8;
    this.eoReportBomInventoryReq.selectedBomEoNumber = this.selectedBomEoNumber;
    this.eoReportBomInventoryReq.bomAdInd = this.bomAdIndVal;

    this.eoReportService.downloadReportBOMInventory(this.eoReportBomInventoryReq)
      .subscribe(result => {
        this.hideBomPsSpinner = true;
        this.hideBomBtn = true;
          return this.resp = result;
        });
  }

  exportReport(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('tblBomPSResult'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.hideBomBtn = !this.hideBomBtn
  }

  getSelectedPlanner(selectedVal) { 
    //this.allBomPlannerSelected.selectedOptions.selected[0]._text.nativeElement.innerText
    this.selectedPlanners = [];

    if (selectedVal.selected) {
      selectedVal.forEach(element => {
        this.selectedPlanners.push(element.toString());  //element._text.nativeElement.innerText
      });
    }
  }

  getSelectedPartRequirment(selectedVal) { 
    this.selectedPartRequirment = [];
    if (selectedVal.length > 0) {
      selectedVal.forEach(element => {
        this.selectedPartRequirment.push(element.toString()); //element._text.nativeElement.innerText
      });
    }
  }

  getSelectedPartType(selectedVal) { 
    this.selectedPartType = [];
    if (selectedVal.length > 0) {
      selectedVal.forEach(element => {
        this.selectedPartType.push(element.toString()); //  element._text.nativeElement.innerText
      });
    }
  }

  selectAll(listName: string) { 
    switch (listName) {
      case 'planner':
        this.allBomPlannerSelected.selectAll();
        break;
      case 'partreq':
        this.allBomPartRequirementSelected.selectAll();
        break;
      case 'parttype':
        this.allBomPartTypeSelected.selectAll();
        break;
     }
  }

  deselectAll(listName: string) { 
    switch (listName) {
      case 'planner':
        this.allBomPlannerSelected.deselectAll();
        break;
      case 'partreq':
        this.allBomPartRequirementSelected.deselectAll();
        break;
      case 'parttype':
        this.allBomPartTypeSelected.deselectAll();
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

}
