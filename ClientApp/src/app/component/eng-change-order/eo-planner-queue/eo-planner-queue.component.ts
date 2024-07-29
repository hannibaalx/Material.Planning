import { EoStationShortageComponent } from './queue/eo-station-shortage/eo-station-shortage.component';
import { Eo6090DayKitDetail } from './../../../models/eo-6090-day-kit-detail';
import { UserService } from './../../../service/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { Observable, Subscription, timer } from 'rxjs';
import { RuleCount } from 'src/app/models/rule-count';
import { EoPlanner } from 'src/app/models/eo-planner';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { NgForm, FormControl } from '@angular/forms';
import { EoPqCommentReq } from 'src/app/models/eo-pq-comment-req';
import { UpdateEoPqMasterReq } from 'src/app/models/update-eo-pq-master-req';
import { DropEoPqDash8Req } from 'src/app/models/drop-eo-pq-dash8-req';
//import { DomSanitizer } from '@angular/platform-browser';
import { EoAdPartsShortageKitDetails } from 'src/app/models/eo-ad-parts-shortage-kit-details';
import { Eo30DayKitDetail } from 'src/app/models/eo-30-day-kit-detail';
import { Eo60DayKitDetail } from 'src/app/models/eo-60-day-kit-detail';
import { Eo90DayKitDetail } from 'src/app/models/eo-90-day-kit-detail';
import { Eo120DayKitDetail } from 'src/app/models/eo-120-day-kit-detail';
import { Eo180DayKitDetail } from 'src/app/models/eo-180-day-kit-detail';
import { Eo180PlusDayKitDetail } from 'src/app/models/eo-180-plus-day-kit-detail';
import { EoPartInDiscrepancyDetail } from 'src/app/models/eo-part-in-discrepancy-detail';
import { EoOverduePosRosDetail } from 'src/app/models/eo-overdue-pos-ros-detail';
import { EoOverdueKitWorkOrderDetail } from 'src/app/models/eo-overdue-kit-work-order-detail';
import { EoNewStationsChangesKitDetails } from 'src/app/models/eo-new-stations-changes-kit-details';
import { map, startWith } from 'rxjs/operators';
import { EoYesterdayDeferrals } from 'src/app/models/eo-yesterday-deferrals';
import { EoYesterdayDeferralsDetail } from 'src/app/models/eo-yesterday-deferrals-detail';
import { EoYesterdayDeferralsKitDetails } from 'src/app/models/eo-yesterday-deferrals-kit-details';
import { Eo120180DayKitDetail } from 'src/app/models/eo-120180-day-kit-detail';
import { EoCapableStationShortageKitDetails } from 'src/app/models/eo-capable-station-shortage-kit-details';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { QARuleCount } from 'src/app/models/q-a-rule-count';
import { CapableStationShortageComponent } from './queue/capable-station-shortage/capable-station-shortage.component';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { PlannerSupervisor } from 'src/app/models/planner-supervisor';
import { MatSpinner } from '@angular/material/progress-spinner';
// import { switchMap, concatMap } from 'rxjs/operators';
// import { EoAdPartsShortage } from 'src/app/models/eo-ad-parts-shortage';
// import { EoNewStationsChanges } from 'src/app/models/eo-new-stations-changes';

declare var $: any;

@Component({
  selector: 'app-eo-planner-queue',
  templateUrl: './eo-planner-queue.component.html',
  styleUrls: ['./eo-planner-queue.component.css'],
  providers: [
  // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
  // `MatMomentDateModule` in your applications root module. We provide it at the component level
  // here, due to limitations of our example generation script.
  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
]
})
export class EoPlannerQueueComponent implements OnInit, OnDestroy {
  planner: string;
  ruleHeader: string;
  selectedRule: string;
  filteredPlanners$: Observable<string[]>;
  filteredPlanners: string[] = [];
  plannerControl = new FormControl();
  q_a_CountList: QARuleCount[] = [];
  oekwoCount: number;
  nscCount: number;
  pds180Count: number;
  pds30Count: number;
  oprCount: number;
  ndnbCount: number;
  ydCount: number;
  oheosCount: number;
  cssCount: number;
  md12Count: number;
  apsCount: number;
  dps120180Count: number;
  dps6090Count: number;
  subscription: Subscription;
  dropoffSubscription: Subscription;
  planners$: Observable<EoPlanner[]>;
  bomDetails$: Observable<EoBomDetail[]>;
  kitDetails$: Observable<any>;
  kitAdPartsShortageDetails$: Observable<EoAdPartsShortageKitDetails[]>;
  kitYesterdayDeferralsDetails$: Observable<EoYesterdayDeferralsKitDetails[]>;
  kitCapableStationShortageDetails$: Observable<EoCapableStationShortageKitDetails[]>
  kit30DayDetails$: Observable<Eo30DayKitDetail[]>;
  // kit60DayDetails$: Observable<Eo60DayKitDetail[]>;
  // kit90DayDetails$: Observable<Eo90DayKitDetail[]>;
  kit6090DayDetails$: Observable<Eo6090DayKitDetail[]>;
  kit120180DayDetails$: Observable<Eo120180DayKitDetail[]>;
  // kit120DayDetails$: Observable<Eo120DayKitDetail[]>;
  kit180DayDetails$: Observable<Eo180DayKitDetail[]>;
  kit180PlusDayDetails$: Observable<Eo180PlusDayKitDetail[]>;
  eoPartsInDiscrepancy$: Observable<EoPartInDiscrepancyDetail[]>;
  eoYesterdayDeferrals$: Observable<EoYesterdayDeferralsDetail[]>;
  eoOverdueKitWorkOrderDetail$: Observable<EoOverdueKitWorkOrderDetail[]>;
  eoOverduePosRosDetail$: Observable<EoOverduePosRosDetail[]>;
  kitNewStationsChangesDetails$: Observable<EoNewStationsChangesKitDetails[]>;
  //kitCapableStationsShortageDetails$: Observable<CapableStationShortageKitDetails[]>
  ad_parts_shortage$: Observable<RuleCount[]>;
  parts_shortage_30$: Observable<RuleCount[]>;
  // parts_shortage_60$: Observable<RuleCount[]>;
  // parts_shortage_90$: Observable<RuleCount[]>;
  // parts_shortage_120$: Observable<RuleCount[]>;
  // parts_shortage_180$: Observable<RuleCount[]>;
  parts_shortage_6090$: Observable<RuleCount[]>;
  parts_shortage_120180$: Observable<RuleCount[]>;
  parts_shortage_p180$: Observable<RuleCount[]>;
  new_dash8_with_no_bom$: Observable<RuleCount[]>;
  new_sta_add$: Observable<RuleCount[]>;
  parts_in_desc$: Observable<RuleCount[]>;
  yesterday_deferrals$: Observable<RuleCount[]>;
  ekcdo$: Observable<RuleCount[]>;
  overdue_po_ro$: Observable<RuleCount[]>;
  new_stations_change$: Observable<RuleCount[]>;
  capable_stations_shortage$: Observable<RuleCount[]>;
  dash8id: string;
  dayType: string;
  menumberusedid: string;
  showSaveval: boolean = false;
  eoDash8History: string;
  currentDash8Number: string;
  currentChkkey: string;
  dropOffStatus: boolean = true;
  currentUser: string;
  overdueEoKitWorkOrderDesc: string;
  dialogValue: string;
  nextReviewDate = new FormControl({ value: moment().add(14, 'days').format('YYYY-MM-DD'), disabled: this.dropOffStatus});
  minDate = moment().add(1, 'days');
  maxDate = moment().add(90, 'days');
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  eoPlannerSupervisor: PlannerSupervisor[] = [];
  eoPlannersForSelectedSupervisor: string = "";
  hideLoading: boolean = true;
  hideLoadingbottom: boolean = true;

  //public commentsFound: number = 0;
  //orangebackgroundcolor: string = "background-color: orange;";
  isLoadingComplete: boolean = true;
  resp: any;
  
  public NewEoDash8Obj: EoNumberRule; //from the dynamic queue/alerts list components
  //@Input() receivedEORule: EoNumberRule; //from the dynamic queue/alerts list components
  eoDash8ToSend: EoNumberRule; //sent to planner-comment component

  EOQARuleList = [
    { "REVIEW_REASON": "Overdue EO Kit Work Order" },
    { "REVIEW_REASON": "New Stations Changes" },
    { "REVIEW_REASON": "180 Plus Days Parts Shortage" },
    { "REVIEW_REASON": "30 Days Parts Shortage" },
    { "REVIEW_REASON": "Overdue POs and ROs" },
    { "REVIEW_REASON": "New Dash 8 With No BOM" },
    { "REVIEW_REASON": "Yesterday Deferrals" },
    { "REVIEW_REASON": "On Hold Eos" },
    { "REVIEW_REASON": "Capable Station Shortage" },
    { "REVIEW_REASON": "Last 12 Months Deferrals History" },
    { "REVIEW_REASON": "AD Parts Shortage" },
    { "REVIEW_REASON": "120 Or 180 Days Parts Shortage" },
    { "REVIEW_REASON": "60 Or 90 Days Parts Shortage" }
  ];

  constructor(
    private eoPlannerService: eoPlannerService,
    private userService: UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route2: Router,
    //protected sanitizer: DomSanitizer
  ) {
    //sanitizer.bypassSecurityTrustStyle(this.orangebackgroundcolor);
    
    this.subscription = this.eoPlannerService.getEoNumberRule().subscribe(eoNumberRuleObj => { 
      // this.hideLoading = false;
       this.hideLoadingbottom = true;
      if (eoNumberRuleObj) {
        this.NewEoDash8Obj = eoNumberRuleObj;
        this.dash8id = this.NewEoDash8Obj.DASH_8;
        this.kitDetails$ = null;
        this.getBOMDetails();    
      }
      else { 
        this.NewEoDash8Obj = new EoNumberRule;
        this.dash8id = "";
      }
      // this.hideLoading = true;
      this.hideLoadingbottom = true;
    });
   }

  ngOnInit() {
    $("*").tooltip('dispose'); //had to add this because bootstrap doesn't hide/destroy tooltip if you navigate to another page

    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    this.isLoadingComplete = false;
    this.hideLoading = false;
    this.hideLoadingbottom = true;
    this.eoPlannerService.getPlannerNames()
      .subscribe(data => { 
        data.forEach(x => {
          console.log('planner - ' + x);
          this.filteredPlanners.push(x);
        });
        this.isLoadingComplete = true;
        this.hideLoading = true;
        this.hideLoadingbottom = true;
      });
    
    this.filteredPlanners$ = this.plannerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.hideLoading = false;
    this.hideLoadingbottom = true;
    // this.eoPlannerService.getEoPlannerSupervisor()
    //   .subscribe(data => {
    //     this.eoPlannerSupervisor = data;
    //     this.hideLoading = true;
    //     this.hideLoadingbottom = true;
    //   });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    var temp = this.filteredPlanners.filter(option => option["PLANNER_NAME"].toLowerCase().includes(filterValue));
    this.hideLoadingbottom = true;
    return temp;
  }

  ngOnDestroy() {
    //this.subscription?.unsubscribe();
    //this.dropoffSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
    this.hideLoadingbottom = true;
    // $('[data-toggle="popover"]').popover();
    // $('.toast').toast();
  }
  
  getRuleCountsForPlanner(planner: string) {
    this.oekwoCount = null;
    this.nscCount = null;
    this.pds180Count = null;
    this.pds30Count = null;
    this.oprCount = null;
    this.ndnbCount = null;
    this.ydCount = null;
    this.oheosCount = null;
    this.cssCount = null;
    this.md12Count = null;
    this.apsCount = null;
    this.dps120180Count = null;
    this.dps6090Count = null;
    if (!this.eoPlannerService.refreshEoPlannerCountNeeded$.isStopped) {
      this.eoPlannerService.refreshEoPlannerCountNeeded$
        .subscribe(() =>
          //this.getRuleCountsForPlanner(planner)
          {
            this.eoPlannersForSelectedSupervisor = "";
            // this.eoPlannerSupervisor.forEach(obj => 
            // {
            //   if(obj.SUPERVISOR == planner)
            //     this.eoPlannersForSelectedSupervisor += obj.PLANNER + "-";
            // });
          
          this.isLoadingComplete = false;
          this.hideLoading = false;
          this.hideLoadingbottom = true;
            if(this.eoPlannersForSelectedSupervisor.length > 0){
              this.eoPlannerService.setEoPlannerName(this.eoPlannersForSelectedSupervisor.substring(0, this.eoPlannersForSelectedSupervisor.length-1));
              this.getRuleCountsForPlanner(this.eoPlannersForSelectedSupervisor.substring(0, this.eoPlannersForSelectedSupervisor.length-1));
            }
            else {
              this.eoPlannerService.setEoPlannerName(planner);
              this.getRuleCountsForPlanner(planner);
          }
          this.isLoadingComplete = false;
          this.hideLoading = true;
          this.hideLoadingbottom = true;
          }
        )
    }

    //this.eoPlannerService.setEoPlannerName(planner.trim());
    //this.planner = planner.trim();
    this.ruleHeader = "";    
    this.q_a_CountList = [];
    this.EOQARuleList.forEach(x => {
      let _tmp = new QARuleCount();
      _tmp.REVIEW_REASON = x.REVIEW_REASON;
      _tmp.COUNT = 0;
      this.q_a_CountList.push(_tmp);
    });

    this.eoPlannersForSelectedSupervisor = "";
    // this.eoPlannerSupervisor.forEach(obj => 
    //   {
    //     if(obj.SUPERVISOR == planner)
    //       this.eoPlannersForSelectedSupervisor += obj.PLANNER + "-";
    //   });
    
    this.isLoadingComplete = false;
    this.hideLoading = false;
    this.hideLoadingbottom = true;
    if(this.eoPlannersForSelectedSupervisor.length > 0){
      this.eoPlannerService.setEoPlannerName(this.eoPlannersForSelectedSupervisor.substring(0, this.eoPlannersForSelectedSupervisor.length-1));
      planner = this.eoPlannersForSelectedSupervisor.substring(0, this.eoPlannersForSelectedSupervisor.length-1);
    }

    this.eoPlannerService.getEOPlannerRuleCount(planner)
      .subscribe(data => {
        data.forEach(x => {
          this.q_a_CountList.find(y => (y.REVIEW_REASON?.toLowerCase().trim() == x.REVIEW_REASON?.toLowerCase().trim())).COUNT = x.COUNT;
        });
        //console.log(this.q_a_CountList);

        if (planner != null || planner !== undefined) {
          this.planner = planner;
          this.oekwoCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Overdue EO Kit Work Order").COUNT;
          this.nscCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "New Stations Changes").COUNT;
          this.pds180Count = this.q_a_CountList.find(x => x.REVIEW_REASON == "180 Plus Days Parts Shortage").COUNT;
          this.pds30Count = this.q_a_CountList.find(x => x.REVIEW_REASON == "30 Days Parts Shortage").COUNT;
          this.oprCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Overdue POs and ROs").COUNT;
          this.ndnbCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "New Dash 8 With No BOM").COUNT;
          this.ydCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Yesterday Deferrals").COUNT;
          this.oheosCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "On Hold Eos").COUNT;
          this.cssCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "Capable Station Shortage").COUNT;
          this.md12Count = this.q_a_CountList.find(x => x.REVIEW_REASON == "Last 12 Months Deferrals History").COUNT;
          this.apsCount = this.q_a_CountList.find(x => x.REVIEW_REASON == "AD Parts Shortage").COUNT;
          this.dps120180Count = this.q_a_CountList.find(x => x.REVIEW_REASON == "120 Or 180 Days Parts Shortage").COUNT;
          this.dps6090Count = this.q_a_CountList.find(x => x.REVIEW_REASON == "60 Or 90 Days Parts Shortage").COUNT;
        }
        this.isLoadingComplete = true; // needs to be true
        this.hideLoading = true;
      });
  }

  setRule(rule2set: string) {
      if (this.planner == "")
        return;
            
    this.NewEoDash8Obj = new EoNumberRule;
    this.NewEoDash8Obj.RULE = rule2set.trim();
    this.selectedRule = rule2set.trim();
    this.ruleHeader = rule2set.trim();
    //this.eoPlannerService.setEoPlannerName(this.planner);
    if(this.eoPlannersForSelectedSupervisor.length > 0)
      this.eoPlannerService.setEoPlannerName(this.eoPlannersForSelectedSupervisor.substring(0, this.eoPlannersForSelectedSupervisor.length-1));
    else
      this.eoPlannerService.setEoPlannerName(this.planner);
  }

  getBOMDetails() {
    this.hideLoading = true;
    this.hideLoadingbottom = true;
    this.nextReviewDate = new FormControl(moment().add(14, 'days').format('YYYY-MM-DD'));
    this.dropOffStatus = true;
    switch (this.NewEoDash8Obj.RULE) {
      case "AD Parts Shortage":
        this.bomDetails$ = this.eoPlannerService.getBOMAdPartsShortageDetailById(this.NewEoDash8Obj.DASH_8)
        // this.bomDetails$.subscribe(data => {
        //   this.setDropBtnStatus(data, "AD Parts Shortage");
        // });
        .pipe( data =>
          this.setDropBtnStatus(data, "AD Parts Shortage"),
        );
        this.hideLoadingbottom = true;
        //this.dayType = "30";
        this.kitAdPartsShortageDetails$ = null;
        break;
      case "30 Days Parts Shortage":
        this.bomDetails$ = this.eoPlannerService.getBOM30DayDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "30 Days Parts Shortage")
        );
        this.hideLoadingbottom = true;
        this.dayType = "30";
        this.kit30DayDetails$ = null;
        break;
      // case "60 Days Parts Shortage":
      //   this.bomDetails$ = this.eoPlannerService.getBOM60DayDetailById(this.NewEoDash8Obj.DASH_8)
      //   .pipe( data =>
      //     this.setDropBtnStatus(data)
      //   );      
      //   this.dayType = "60";
      //   this.kit60DayDetails$ = null;
      //   break;
      // case "90 Days Parts Shortage":
      //   this.bomDetails$ = this.eoPlannerService.getBOM90DayDetailById(this.NewEoDash8Obj.DASH_8)
      //   .pipe( data =>
      //     this.setDropBtnStatus(data)
      //   );      
      //   this.dayType = "90";
      //   this.kit90DayDetails$ = null;
      //   break;
      case "60 Or 90 Days Parts Shortage":
        this.bomDetails$ = this.eoPlannerService.getBOM6090DayDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "60 Or 90 Days Parts Shortage")
        );
        this.hideLoadingbottom = true;
        this.dayType = "6090";
        // this.kit60DayDetails$ = null;
        this.kit6090DayDetails$ = null;
        break;      
      // case "120 Days Parts Shortage":
      //   this.bomDetails$ = this.eoPlannerService.getBOM120DayDetailById(this.NewEoDash8Obj.DASH_8)
      //   .pipe( data =>
      //     this.setDropBtnStatus(data)
      //   );
      //   this.dayType = "120";
      //   this.kit120DayDetails$ = null;
      //   break;
      // case "180 Days Parts Shortage":
      //   this.bomDetails$ = this.eoPlannerService.getBOM180DayDetailById(this.NewEoDash8Obj.DASH_8)
      //   .pipe( data =>
      //     this.setDropBtnStatus(data)
      //   );      
      //   this.dayType = "180";
      //   this.kit180DayDetails$ = null;
      //   break;
      case "120 Or 180 Days Parts Shortage":
        this.bomDetails$ = this.eoPlannerService.getBOM120180DayDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "120 Or 180 Days Parts Shortage")
        );
        this.hideLoadingbottom = true;
        this.dayType = "120180";
        this.kit120180DayDetails$ = null;
        break;
      case "180 Plus Days Parts Shortage":
        this.bomDetails$ = this.eoPlannerService.getBOM180PlusDayDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "180 Plus Days Parts Shortage")
        );
        this.hideLoadingbottom = true;
        this.dayType = "180+";
        this.kit180PlusDayDetails$ = null;
        break;
      case "New Dash 8 With No BOM":
        this.bomDetails$ = this.eoPlannerService.getNewDash8WithNoBOMDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "New Dash 8 With No BOM")
        );
        this.hideLoadingbottom = true;
        //this.dayType = "180+";
        break;
      case "Parts in Discrepancy":
        this.bomDetails$ = this.eoPlannerService.getBOMPartsInDiscrepancyDetailById(this.NewEoDash8Obj.DASH_8, this.NewEoDash8Obj.EO_NUMBER)
        .pipe( data =>
          this.setDropBtnStatus(data, "Parts in Discrepancy")
        );
        this.hideLoadingbottom = true;
        //this.dayType = "";
        this.eoPartsInDiscrepancy$ = null;
        break;
      case "Yesterday Deferrals":
        this.bomDetails$ = this.eoPlannerService.getBOMYesterdayDeferralsDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "Yesterday Deferrals")
        );
        this.hideLoadingbottom = true;
        //this.dayType = "";
        this.eoYesterdayDeferrals$ = null;
        break;
      case "Overdue EO Kit Work Order":
        this.bomDetails$ = this.eoPlannerService.getBOMOverdueEoKitWorkOrderDetailById(this.NewEoDash8Obj.DASH_8, this.NewEoDash8Obj.EO_NUMBER)
        .pipe( data =>
          this.setDropBtnStatus(data, "Overdue EO Kit Work Order")
        );
        this.hideLoadingbottom = true;
        //this.dayType = "";

        this.bomDetails$.forEach(element => {
          if ((element[0].KEYWORD_DESCRIPTION != null))
            this.overdueEoKitWorkOrderDesc = element[0].KEYWORD_DESCRIPTION;
        });
        this.hideLoadingbottom = true;
        this.eoOverdueKitWorkOrderDetail$ = null;
        break;
      case "Overdue POs and ROs":
        //let result: Observable<EoBomDetail[]>;
        this.bomDetails$ = this.eoPlannerService.getBOMOverduePosRosDetailById(this.NewEoDash8Obj.DASH_8, this.NewEoDash8Obj.EO_NUMBER)
          .pipe( data =>
            this.setDropBtnStatus(data, "Overdue POs and ROs")
        );
        this.hideLoadingbottom = true;
        //this.dayType = "";
        this.eoOverduePosRosDetail$ = null;
        break;
      case "New Stations Changes":
          this.bomDetails$ = this.eoPlannerService.getBOMNewStationsChangesDetailById(this.NewEoDash8Obj.DASH_8)
          .pipe( data =>
            this.setDropBtnStatus(data, "New Stations Changes")
        );
        this.hideLoadingbottom = true;
        //this.dayType = "";
        this.kitNewStationsChangesDetails$ = null;                                                                                                    
        break;
      case "Capable Station Shortage":
        this.bomDetails$ = this.eoPlannerService.getCapableStationShortageDetailById(this.NewEoDash8Obj.DASH_8)
          .pipe( data =>
            this.setDropBtnStatus(data,"Capable Station Shortage")
        );
        this.hideLoadingbottom = true;
        //this.dayType = "";
        //this.kitCapableStationsShortageDetails$ = null;   
        break;
      case "On Hold Eos":
        this.bomDetails$ = this.eoPlannerService.getOnHoldEosDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "On Hold Eos")
        );
        this.hideLoadingbottom = true;
        //this.dayType = "";
        //this.eoYesterdayDeferrals$ = null;
        break;
    }  
    // this.hideLoading = true;
    this.hideLoadingbottom = true;
   }

  hideSave() { 
    this.showSaveval = false;
  }

  showSave() { 
    this.showSaveval = true;
  }

  setEoDash8HistoryModal(comment: string, val: string) { 
    this.eoDash8History = comment;
    //this.currentDash8Number = val;
    this.currentChkkey = val?.trim();
  }

  onSubmit(form: NgForm, commentType: string, selNumber: string) {
    // let now = new Date().getTime();
    // while (new Date().getTime() < now + 3000) { }
    this.hideLoading = false;
    this.hideLoadingbottom = false;
    switch (commentType) {
    // case "eonumber":
    //   if (form.controls.EoNumberComment === undefined) return null;
    //   let eonumberCommentReq = new EonumberCommentReq();
    //   eonumberCommentReq.EO_NUMBER = selNumber.trim();
    //   eonumberCommentReq.Comments_History = this.plannerName + " - " + form.controls.EoNumberComment.value;
    //   //eonumberCommentReq.AD_IND = adind.checked;
    //   this.ecoService.insertEoNumberComment(eonumberCommentReq)
    //     .subscribe(result => {
    //       return this.resp = result;
    //     });
    //   form.controls.EoNumberComment.setValue("");
    //   break;
    case "dash8":
      if (form.controls.Dash8Comment === undefined) return null;
        let eoPqCommentReq = new EoPqCommentReq();
        eoPqCommentReq.CHKKEY = selNumber.trim();
        eoPqCommentReq.COMMENT = form.controls.Dash8Comment.value;
        eoPqCommentReq.PLANNER = this.NewEoDash8Obj.PLANNER;
        eoPqCommentReq.CURRENT_USER = this.user.display_name;
        eoPqCommentReq.REVIEW_REASON = this.NewEoDash8Obj.RULE;
        this.eoPlannerService.insertEoDash8Comment(eoPqCommentReq)
          .subscribe(result => {
            form.controls.Dash8Comment.setValue("");
            // this.getRuleCountsForPlanner(this.NewEoDash8Obj.PLANNER);
            // let now = new Date().getTime();
            // while (new Date().getTime() < now + 3000) { }
            $('#dash8history').modal('hide');
            this.getBOMDetails();
          return this.resp = result;
        });
        
      break;
    }
    this.hideLoading = true;
    this.hideLoadingbottom = true;
  }

  setDropBtnStatus(bomDetail: Observable<EoBomDetail[]>, reviewReason: string) {
    this.bomDetails$ = null;
    setTimeout(() => { console.log("waiting for db to update"); }, 3000);
    let index: number = 0;
    let values = [];
    let commentsFound: number = 0;
    let eleLength: number = 0;
    let doffs: boolean = true; 
    
    switch (reviewReason) {
      case "New Stations Changes":
      case "Capable Station Shortage":
        this.dropoffSubscription = bomDetail.subscribe((val: EoBomDetail[]) =>
        this.dropOffStatus = val.find(y => y.COMM != null) ? false : true);        
        break;
      default:
        this.dropoffSubscription = bomDetail.subscribe((val: EoBomDetail[]) =>
        this.dropOffStatus = val.find(y => y.COMM == null) ? true : false);
        break;
    }
    this.hideLoadingbottom = true;
    return bomDetail;
  }

  dropDash8() { 
    this.hideLoading = false;
    this.hideLoadingbottom = false;
    let dropEoPqDash8Req = new DropEoPqDash8Req();
    dropEoPqDash8Req.NEXT_REVIEW_DATE = this.nextReviewDate.value == null? moment(): this.nextReviewDate.value;
    dropEoPqDash8Req.DASH_8 = this.NewEoDash8Obj.DASH_8;
    dropEoPqDash8Req.PLANNER = this.NewEoDash8Obj.PLANNER;
    dropEoPqDash8Req.REVIEW_REASON = this.NewEoDash8Obj.RULE;
    this.eoPlannerService.dropOffEOPQDash8(dropEoPqDash8Req)
      .subscribe(result => {
        var updateeopqmasterreq = new UpdateEoPqMasterReq();
        updateeopqmasterreq.DASH_8 = this.NewEoDash8Obj.DASH_8;
        updateeopqmasterreq.REVIEW_REASON = this.NewEoDash8Obj.RULE;
        updateeopqmasterreq.PLANNER = this.NewEoDash8Obj.PLANNER;
        this.eoPlannerService.updateEOPQMaster(updateeopqmasterreq)
          .subscribe(result => {
            this.dropOffNotify(this.NewEoDash8Obj.DASH_8);
            this.getRuleCountsForPlanner(this.NewEoDash8Obj.PLANNER);
            this.hideLoading = true;
            this.hideLoadingbottom = true;
            this.selectedRule = "";
            // this.selectedRule = this.NewEoDash8Obj.RULE;
            // this.bomDetails$ = null;
            // this.setRule(this.NewEoDash8Obj.RULE);
            //this.ruleHeader = this.selectedRule;
            this.getBOMDetails();
          });
            return this.resp = result;
      });
      this.hideLoading = true;
  }

  getKit30DayDetail(dash8, menumberused, ind) {
    this.hideLoading = false;
    if (ind == 'Y') {
      this.menumberusedid = menumberused;
      this.kit30DayDetails$ = this.eoPlannerService.getKit30DayDetail(dash8.trim(), menumberused.trim())
    }
    else { 
      this.menumberusedid = '';
      this.kit30DayDetails$ = null;
    }
    this.kitDetails$ = this.kit30DayDetails$;
    this.hideLoading = true;
  }

  // getKit60DayDetail(dash8, menumberused, ind) {
  //   if (ind == 'Y') {
  //     this.menumberusedid = menumberused;
  //     this.kit60DayDetails$ = this.eoPlannerService.getKit60DayDetail(dash8.trim(), menumberused.trim())
  //   }
  //   else { 
  //     this.menumberusedid = '';
  //     this.kit60DayDetails$ = null;
  //   }
  //   this.kitDetails$ = this.kit60DayDetails$;
  // }

  // getKit90DayDetail(dash8, menumberused, ind) {
  //   if (ind == 'Y') {
  //     this.menumberusedid = menumberused;
  //     this.kit90DayDetails$ = this.eoPlannerService.getKit90DayDetail(dash8.trim(), menumberused.trim())
  //   }
  //   else { 
  //     this.menumberusedid = '';
  //     this.kit90DayDetails$ = null;
  //   }
  //   this.kitDetails$ = this.kit90DayDetails$;
  // }

  getKit6090DayDetailById(dash8, menumberused, ind) {
    this.hideLoading = false;
    if (ind == 'Y') {
      this.menumberusedid = menumberused;
      this.kit6090DayDetails$ = this.eoPlannerService.getKit6090DayDetailById(dash8.trim(), menumberused.trim())
    }
    else { 
      this.menumberusedid = '';
      this.kit6090DayDetails$ = null;
    }
    this.kitDetails$ = this.kit6090DayDetails$;
    this.hideLoading = true;
  }
  
  // getKit120DayDetail(dash8, menumberused, ind) {
  //   if (ind == 'Y') {
  //     this.menumberusedid = menumberused;
  //     this.kit120DayDetails$ = this.eoPlannerService.getKit120DayDetail(dash8.trim(), menumberused.trim())
  //   }
  //   else { 
  //     this.menumberusedid = '';
  //     this.kit120DayDetails$ = null;
  //   }
  //   this.kitDetails$ = this.kit120DayDetails$;
  // }

  // getKit180DayDetail(dash8, menumberused, ind) {
  //   if (ind == 'Y') {
  //     this.menumberusedid = menumberused;
  //     this.kit180DayDetails$ = this.eoPlannerService.getKit180DayDetail(dash8.trim(), menumberused.trim())
  //   }
  //   else { 
  //     this.menumberusedid = '';
  //     this.kit180DayDetails$ = null;
  //   }
  //   this.kitDetails$ = this.kit180DayDetails$;
  // }

  getKit120180DayDetail(dash8, menumberused, ind) {
    this.hideLoading = false;
    if (ind == 'Y') {
      this.menumberusedid = menumberused;
      this.kit120180DayDetails$ = this.eoPlannerService.getKit120180DayDetail(dash8.trim(), menumberused.trim())
    }
    else { 
      this.menumberusedid = '';
      this.kit120180DayDetails$ = null;
    }
    this.kitDetails$ = this.kit120180DayDetails$;
    this.hideLoading = true;
  }  
      
  getKit180PlusDayDetail(dash8, menumberused, ind) {
    this.hideLoading = false;
    if (ind == 'Y') {
      this.menumberusedid = menumberused;
      this.kit180PlusDayDetails$ = this.eoPlannerService.getKit180PlusDayDetail(dash8.trim(), menumberused.trim())
    }
    else { 
      this.menumberusedid = '';
      this.kit180PlusDayDetails$ = null;
    }
    this.kitDetails$ = this.kit180PlusDayDetails$;
    this.hideLoading = true;
  }

  getKitAdPartsShortageDetail(dash8, menumberused, ind) {
    this.hideLoading = false;
    if (ind == 'Y') {
      this.menumberusedid = menumberused;
      this.kitAdPartsShortageDetails$ = this.eoPlannerService.getAdPartsKitDetailById(dash8.trim(), menumberused.trim())
    }
    else { 
      this.menumberusedid = '';
      this.kitAdPartsShortageDetails$ = null;
    }
    this.kitDetails$ = this.kitAdPartsShortageDetails$;
    this.hideLoading = true;
  }

  getKitNewStationsChangesDetail(dash8, menumberused, ind) {
    this.hideLoading = false;
    if (ind == 'Y') {
      this.menumberusedid = menumberused;
      this.kitAdPartsShortageDetails$ = this.eoPlannerService.getNewStationsChangesKitDetailById(dash8.trim(), menumberused.trim())
    }
    else { 
      this.menumberusedid = '';
      this.kitAdPartsShortageDetails$ = null;
    }
    this.kitDetails$ = this.kitAdPartsShortageDetails$;
    this.hideLoading = true;
  }

  getYesterdayDeferralsKitDetailById(dash8, menumberused, ind) {
    this.hideLoading = false;
    if (ind == 'Y') {
      this.menumberusedid = menumberused;
      this.kitYesterdayDeferralsDetails$ = this.eoPlannerService.getYesterdayDeferralsKitDetailById(dash8.trim(), menumberused.trim())
    }
    else { 
      this.menumberusedid = '';
      this.kitYesterdayDeferralsDetails$ = null;
    }
    this.kitDetails$ = this.kitYesterdayDeferralsDetails$;
    this.hideLoading = true;
  }

  getCapableStationShortageKitDetailById(dash8, menumberused, ind) {
    this.hideLoading = false;
    if (ind == 'Y') {
      this.menumberusedid = menumberused;
      //this.kitYesterdayDeferralsDetails$ = this.eoPlannerService.getYesterdayDeferralsKitDetailById(dash8.trim(), menumberused.trim())
      this.kitCapableStationShortageDetails$ = this.eoPlannerService.getCapableStationShortageKitDetailById(dash8.trim(), menumberused.trim())
    }
    else { 
      this.menumberusedid = '';
      this.kitCapableStationShortageDetails$ = null;
    }
    this.kitDetails$ = this.kitCapableStationShortageDetails$;
    this.hideLoading = true;
  }
  
  // getBOMPartsInDiscrepancyDetailById(dash8) {
  //   this.eoPartsInDiscrepancy$ = this.eoPlannerService.getBOMPartsInDiscrepancyDetailById(dash8.trim());
  // }

  // getBOMOverdueEoKitWorkOrderDetailById(menumber) { 
  //   this.eoOverdueKitWorkOrderDetail$ = this.eoPlannerService.getBOMOverdueEoKitWorkOrderDetailById(menumber);
  // }

  // getBOMOverduePosRosDetailById(menumber) { 
  //   this.eoOverduePosRosDetail$ = this.eoPlannerService.getBOMOverduePosRosDetailById(menumber)
  // }

  openStationShortageModal(mepartnumberused: string) { 

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { mePartNumberUsed: mepartnumberused}

    let dialogRef = this.dialog.open(
      EoStationShortageComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      
      this.dialogValue = result.data;
    });
  }

  dropOffNotify(dash8) {
    this.snackBar.open(dash8 + ' was dropped successfully.', 'Close', {
      duration: 3000
    });
  }
}
