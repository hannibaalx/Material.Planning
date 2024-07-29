import { PlannerSupervisor } from './../../models/planner-supervisor';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { PlannerType } from './../../models/planner-type';
import { PlannerService } from 'src/app/service/planner.service';
import { MeNumberRule } from './../../models/me-number-rule';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { RefreshTime } from 'src/app/models/refresh-time';
import { QARuleCount } from 'src/app/models/q-a-rule-count';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-planner-queue',
  templateUrl: './planner-queue.component.html',
  styleUrls: ['./planner-queue.component.css']
})
export class PlannerQueueComponent implements OnInit {
  planners$: Observable<PlannerType[]>;
  q_a_CountList$: Observable<QARuleCount[]>;
  q_a_CountList: QARuleCount[] = [];
  zsCount: number;
  smbsCount: number;
  odCount: number;
  tesCount: number;
  psfkCount: number;
  ksbpCount: number;
  repohCount: number;
  sopCount: number;
  srrsCount: number;
  slsCount: number;
  oprCount: number;
  aosCount: number;
  catexCount: number;
  vwoaCount: number;
  onaCount: number;
  unaCount: number;
  msbCount: number;
  osbCount: number;
  amnosCount: number;
  nmsCount: number;
  scpCount: number;

  planner: string = "";
  filteredPlanners$: Observable<string[]>;
  filteredPlanners: string[] = [];
  plannerControl = new FormControl();
  plannerSupervisor: PlannerSupervisor[] = [];
  plannersForSupervisor: string = "";

  selectedRule: string = "";
  lastRuleSelected = "";
  lastPlannerSelected = "";
  ruleHeader: string = "";
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = ' - ' + this.currentDate + '.xlsx';
  hideBtn: boolean = false;
  hideFsSpinner: boolean = true;
  currentRefreshTime: string = "";
  refreshtime$: Observable<RefreshTime[]>;
  showComments: boolean = false;
  isLoadingComplete: boolean = false;
  receivedMeRule: MeNumberRule; //from the dynamic queue/alerts list components
  meRuleToSend: MeNumberRule; //sent to planner-comment component
  
  @Input() newMeRule: MeNumberRule; 

  qaRuleList = [
    {"REVIEW_REASON":"OutStation Balancing"},
    {"REVIEW_REASON":"Overdue PO or RO"},
    {"REVIEW_REASON":"Zero Stock"},
    {"REVIEW_REASON":"Ownership No Allocation"},
    {"REVIEW_REASON":"Usage and No Allocation"},
    {"REVIEW_REASON":"SO Pending Review" },
    {"REVIEW_REASON":"Scheduled ROT REP Shortage"},
    {"REVIEW_REASON":"AOS Review"},
    {"REVIEW_REASON":"Parts Shortage for Kit"},
    {"REVIEW_REASON":"TES Critical"},
    {"REVIEW_REASON":"Repairable OH to AQ Review"},
    {"REVIEW_REASON":"Baseline Station Shortage"},
    {"REVIEW_REASON":"Vendor WO Assignment"},
    {"REVIEW_REASON":"Kit Shortage by Parts"},
    {"REVIEW_REASON":"Catalog Expiration"},
    {"REVIEW_REASON":"Open Discrepancy"},
    {"REVIEW_REASON":"SM Baseline Station Shortage"},
    {"REVIEW_REASON":"Main Station Balancing"},
    {"REVIEW_REASON": "System Low Stock" },
    { "REVIEW_REASON": "Associated ME No Stock" },
    { "REVIEW_REASON": "New ME Setup or Changes" },
    { "REVIEW_REASON": "Scraps" }
  ];

  constructor(
    private plannerService: PlannerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // this.form = this.fb.group({
    //   plannerControl: this.fb.array([
    //   ])
    // })
  }

  ngOnInit() {
    //this.planners$ = this.plannerService.getPlannerNames();
    this.isLoadingComplete = false;
    this.plannerService.getFilteredPlanners()
      .subscribe(data => { 
        data.forEach(x => {
          this.filteredPlanners.push(x);
          //console.log(x);
        });        
        this.isLoadingComplete = true;
      });
    
    this.filteredPlanners$ = this.plannerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    // this.plannerService.getPlannerSupervisor()
    //   .subscribe(data => {
    //     this.plannerSupervisor = data; 
    //   });
  }

  private _filter(value: string): string[] {
    if (value.length > 2) {
      const filterValue = value.toLowerCase();
      var temp = this.filteredPlanners.filter(option => option["PLANNER_NAME"].toLowerCase().includes(filterValue));
      console.log(temp);
      return temp;
    }
  }

  receiveMeRule($event: MeNumberRule) {
    this.receivedMeRule = $event;
    this.meRuleToSend = this.receivedMeRule;
  }
  
  getRuleCountsForPlanner(planner: string) {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    planner = plannerName.value.toString();

    this.zsCount = null;
    this.smbsCount = null;
    this.odCount = null;
    this.tesCount = null;
    this.psfkCount = null;
    this.ksbpCount = null;
    this.repohCount = null;
    this.sopCount = null;
    this.srrsCount = null;
    this.slsCount = null;
    this.oprCount = null;
    this.aosCount = null;
    this.catexCount = null;
    this.vwoaCount = null;
    this.onaCount = null;
    this.unaCount = null;
    this.msbCount = null;
    this.osbCount = null;
    this.amnosCount = null;
    this.nmsCount = null;
    this.scpCount = null;
    
    if (!this.plannerService.refreshPlannerCountNeeded$.isStopped) {
      if (this.lastPlannerSelected == planner) {
        this.lastRuleSelected = this.selectedRule;
        this.plannerService.refreshNeeded$;
      }
      else if (this.lastRuleSelected != this.selectedRule || this.lastPlannerSelected != planner) {
        this.plannerService.setAtaPlannerName(planner);
        this.lastPlannerSelected = planner;
        this.lastRuleSelected = this.selectedRule;
        this.selectedRule = "";
      }

      this.plannerService.refreshPlannerCountNeeded$
        .subscribe(() => {
          //this.getRuleCountsForPlanner(planner);
          // this.plannersForSupervisor = "";
          // this.plannerSupervisor.forEach(obj => 
          // {
          //   if(obj.SUPERVISOR == planner)
          //     this.plannersForSupervisor += obj.PLANNER + "|";
          // });
        
          // if(this.plannersForSupervisor.length > 0){
          //   this.plannerService.setAtaPlannerName(this.plannersForSupervisor.substring(0, this.plannersForSupervisor.length-1));
          //   this.getRuleCountsForPlanner(this.plannersForSupervisor.substring(0, this.plannersForSupervisor.length - 1));
          // }
          // else {
            this.plannerService.setAtaPlannerName(planner);
            this.getRuleCountsForPlanner(planner);
          // }
        }
      )
    }

    this.q_a_CountList = [];
    this.qaRuleList.forEach(x => {
      let _tmp = new QARuleCount();
      _tmp.REVIEW_REASON = x.REVIEW_REASON;
      _tmp.COUNT = 0;
      this.q_a_CountList.push(_tmp)
    });
    
    // this.plannersForSupervisor = "";
    // this.plannerSupervisor.forEach(obj => 
    //   {
    //     if(obj.SUPERVISOR == planner)
    //       this.plannersForSupervisor += obj.PLANNER + "-";
    //   });
    
    // if(this.plannersForSupervisor.length > 0){
    //   this.plannerService.setAtaPlannerName(this.plannersForSupervisor.substring(0, this.plannersForSupervisor.length-1));
    //   planner = this.plannersForSupervisor.substring(0, this.plannersForSupervisor.length-1);
    // }

    this.plannerService.getRuleCountForPlanner(planner)
      .subscribe(data => {
        
        data.forEach(x => {
          this.q_a_CountList.find(y => (y.REVIEW_REASON.toLowerCase().trim() == x.REVIEW_REASON.toLowerCase().trim())).COUNT = x.COUNT;
        });
        //console.log(this.q_a_CountList);
        if (planner != null || planner !== undefined) {
          this.planner = planner;
          this.zsCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Zero Stock").COUNT;
          this.smbsCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "SM Baseline Station Shortage").COUNT;
          this.odCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Open Discrepancy").COUNT;
          this.tesCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "TES Critical").COUNT;
          this.psfkCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Parts Shortage for Kit").COUNT;
          this.ksbpCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Kit Shortage by Parts").COUNT;
          this.repohCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Repairable OH to AQ Review").COUNT;
          this.sopCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "SO Pending Review").COUNT;
          this.srrsCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Scheduled ROT REP Shortage").COUNT;
          this.slsCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "System Low Stock").COUNT;
          this.oprCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Overdue PO or RO").COUNT;
          this.aosCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "AOS Review").COUNT;
          this.catexCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Catalog Expiration").COUNT;
          this.vwoaCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Vendor WO Assignment").COUNT;
          this.onaCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Ownership No Allocation").COUNT;
          this.unaCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Usage and No Allocation").COUNT;
          this.msbCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Main Station Balancing").COUNT;
          this.osbCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "OutStation Balancing").COUNT;
          this.amnosCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Associated ME No Stock").COUNT;
          this.nmsCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "New ME Setup or Changes").COUNT;
          this.scpCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Scraps").COUNT;
        }
        this.isLoadingComplete = true; // needs to be true
      })
  }

  setRule(rule2set: string) {
    if (this.planner == "")
      return;
    this.selectedRule = rule2set; 
    this.lastRuleSelected = this.selectedRule;
    this.fileName = rule2set + ' - ' + this.currentDate + '.xlsx';
    this.ruleHeader = rule2set;
    this.receivedMeRule = null;
    this.refreshtime$ = this.plannerService.getAtaPlannerRefreshTime(rule2set);
    this.plannerService.setAtaPlannerComments(false);
    //this.plannerService.setAtaPlannerName(this.planner);
    // if(this.plannersForSupervisor.length > 0)
    //   this.plannerService.setAtaPlannerName(this.plannersForSupervisor.substring(0, this.plannersForSupervisor.length-1));
    // else
      this.plannerService.setAtaPlannerName(this.planner);
  }

  changeRule(newMeRule: MeNumberRule) { 
    this.selectedRule = newMeRule.Rule;
    this.ruleHeader = newMeRule.Rule;
    this.refreshtime$ = this.plannerService.getAtaPlannerRefreshTime(newMeRule.Rule);
  }

  exportReport(): void {
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
}

