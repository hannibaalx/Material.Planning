import { Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as moment from 'moment';
//import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { UserService } from 'src/app/service/user.service';
import { map, startWith } from 'rxjs/operators';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';
import { SmQueueRule } from 'src/app/models/sm-queue-rule';
import { RuleCount } from 'src/app/models/rule-count';
import { SmQueueRuleReq } from 'src/app/models/sm-queue-rule-req';
import { RefreshTime } from 'src/app/models/refresh-time';
import { SmNumberRule } from 'src/app/models/sm-number-rule';
import { QARuleCount } from 'src/app/models/q-a-rule-count';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sm-planner-queue-alert',
  templateUrl: './sm-planner-queue-alert.component.html',
  styleUrls: ['./sm-planner-queue-alert.component.css']
})
export class SmPlannerQueueAlertComponent implements OnInit {
  @ViewChild('fleetInput') fleetInput: ElementRef<HTMLInputElement>;
  //@ViewChild('autoFleet', { static: false }) matAutocompleteFleet: MatAutocomplete;

  currentUser: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chiplistFleets: string[] = [];
  _chiplistFleets: string;
  fleetCode = new FormControl();
  _fleetCode: string = "";
  pnluCount: number;
  tsxCount: number;
  drCount: number;
  srbCount: number;
  nscCount: number;
  filteredFleets$: Observable<string[]>;
  filteredFleets: string[] = [];
  filteredEoNumbers: Observable<string[]>;
  fleets: string[] = [];
  allFleets: string[] = [];
  newSmObj = new SmQueueRule();
  selectedRule: string = "";
  ruleHeader: string = "";
  q_a_CountList: QARuleCount[] = [];
  parts_no_longer_used$: Observable<RuleCount[]>;
  tsx_compare$: Observable<RuleCount[]>;
  deferral_review$: Observable<RuleCount[]>;
  scheduled_rotable_bom$: Observable<RuleCount[]>;
  new_station_changes$: Observable<RuleCount[]>;
  receivedSmRule: SmQueueRule; //from the dynamic queue/alerts list components
  smRuleToSend: SmQueueRule; //sent to planner-comment component
  currentRefreshTime: string = "";
  refreshtime$: Observable<RefreshTime[]>;
  blnShowQueuesOk: boolean = false;
  blnShowQueueDetails: boolean = false;
  isLoadingComplete: boolean = false;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
 
  resp: any;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');

  qaRuleList = [
    {"REVIEW_REASON":"PART NO LONGER USED"},
    {"REVIEW_REASON":"TSX COMPARE"},
    {"REVIEW_REASON":"DEFERRAL REVIEW"},
    {"REVIEW_REASON":"SCHEDULED ROTABLE BOM"},
    {"REVIEW_REASON":"NEW STATIONS CHANGES"},
  ];

  @Input() newSmRule: SmQueueRule; 

  constructor(
    private userService: UserService,
    private smPlannerQueueService: SmPlannerQueueService,
    private snackBar: MatSnackBar,
    private route2: Router,
  ) {
    //this.currentUser = this.userService.getUser().displayName;
    this.newSmObj.DASH_8 = "";
    this.newSmObj.FLEET = "";
    this.newSmObj.ME_PART_NUMBER_USED = "";
    this.newSmObj.PLANNER = "";
    this.newSmObj.RULE = "";
    this.newSmObj.SHOWCOMMENTSECTION = false;
    this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
   }

  ngOnInit() { 
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    
    this.smPlannerQueueService.getFilteredFleets()
      .subscribe(data => {
        this.isLoadingComplete = false;
        data.forEach(x => {
          this.filteredFleets.push(x);
        });
        this.isLoadingComplete = true;
      });
    
    this.smPlannerQueueService.refreshCountNeeded$
      .subscribe(() =>
        this.getRuleCountsForPlanner(this.fleetCode.value)
      );
    
    this.filteredFleets$ = this.fleetCode.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  clearCount() {
    this.parts_no_longer_used$ = null;
    this.tsx_compare$ = null;
    this.deferral_review$ = null;
    this.scheduled_rotable_bom$ = null;
    this.new_station_changes$ = null;
    this.selectedRule = '';
  }

  setRule(rule2set: string) {
    if (this.user.display_name == '' || this.user.display_name === 'undefined')
      return;
       
    this.newSmObj.RULE = rule2set;
    this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
    this.smPlannerQueueService.setSmPlannerName(this.user.display_name);
    this.selectedRule = rule2set;
    this.ruleHeader = rule2set;
    this.blnShowQueuesOk = true;
    this.blnShowQueueDetails = true;
    //this.smPlannerQueueService.setChiplist(this.chiplistFleets.toString());   
  }

  receiveSmRule($event: SmQueueRule) { 
    this.receivedSmRule = $event;
    this.smRuleToSend = this.receivedSmRule;
  }

  getRuleCountsForPlanner(fc: string) {
    this.pnluCount = null;
    this.tsxCount = null;
    this.drCount = null;
    this.srbCount = null;
    this.nscCount = null;
    this.smPlannerQueueService.setSmPlannerName(this.user.display_name);
    this.ruleHeader = "";
    // this.selectedRule = "";
    this.blnShowQueueDetails = false;
    this.q_a_CountList = [];
    this.qaRuleList.forEach(x => {
      let _tmp = new QARuleCount();
      _tmp.REVIEW_REASON = x.REVIEW_REASON;
      _tmp.COUNT = 0;
      this.q_a_CountList.push(_tmp)
    });

    this.isLoadingComplete = false;
    this.smPlannerQueueService.getSMQueueRuleCount(fc)
      .subscribe(data => {
        data.forEach(x => {
          this.q_a_CountList.find(y => (y.REVIEW_REASON.toLowerCase().trim() == x.REVIEW_REASON.toLowerCase().trim())).COUNT = x.COUNT;
        });

        if (fc != null || fc !== undefined) {
          this._fleetCode = fc;
          this.pnluCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "PART NO LONGER USED").COUNT;
          this.tsxCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "TSX COMPARE").COUNT;
          this.drCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "DEFERRAL REVIEW").COUNT;
          this.srbCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "SCHEDULED ROTABLE BOM").COUNT;
          this.nscCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "NEW STATIONS CHANGES").COUNT;
        }
        this.isLoadingComplete = true; // needs to be true
      });
  }

  changeRule(newSmRule: SmNumberRule) { 
    this.selectedRule = newSmRule.RULE;
    this.ruleHeader = newSmRule.RULE;
    this.refreshtime$ = this.smPlannerQueueService.getSmRefreshTime(newSmRule.RULE);
  }

  private _filter(value: string): string[] {
    if (value != null && value != ""){
      const filterValue = value.toString().toLowerCase();
          return this.filteredFleets.filter(_fleet => _fleet["FLEET_CODE"].toLowerCase().includes(filterValue));
      }      
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
