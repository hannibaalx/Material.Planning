import { Component, OnInit, OnDestroy } from '@angular/core';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { UserService } from 'src/app/service/user.service';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';
import { Eo120180DayKitDetail } from 'src/app/models/eo-120180-day-kit-detail';
import { Eo180DayKitDetail } from 'src/app/models/eo-180-day-kit-detail';
import { Eo180PlusDayKitDetail } from 'src/app/models/eo-180-plus-day-kit-detail';
import { Eo30DayKitDetail } from 'src/app/models/eo-30-day-kit-detail';
import { Eo6090DayKitDetail } from 'src/app/models/eo-6090-day-kit-detail';
import { EoAdPartsShortageKitDetails } from 'src/app/models/eo-ad-parts-shortage-kit-details';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoCapableStationShortageKitDetails } from 'src/app/models/eo-capable-station-shortage-kit-details';
import { EoNewStationsChangesKitDetails } from 'src/app/models/eo-new-stations-changes-kit-details';
import { EoOverdueKitWorkOrderDetail } from 'src/app/models/eo-overdue-kit-work-order-detail';
import { EoOverduePosRosDetail } from 'src/app/models/eo-overdue-pos-ros-detail';
import { EoPartInDiscrepancyDetail } from 'src/app/models/eo-part-in-discrepancy-detail';
import { EoYesterdayDeferralsDetail } from 'src/app/models/eo-yesterday-deferrals-detail';
import { EoYesterdayDeferralsKitDetails } from 'src/app/models/eo-yesterday-deferrals-kit-details';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { EoPlanner } from 'src/app/models/eo-planner';
import * as moment from 'moment';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { EoPqCommentReq } from 'src/app/models/eo-pq-comment-req';
import { DropEoPqDash8Req } from 'src/app/models/drop-eo-pq-dash8-req';
import { UpdateEoPqMasterReq } from 'src/app/models/update-eo-pq-master-req';
import { EoStationShortageComponent } from '../queue/eo-station-shortage/eo-station-shortage.component';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { User } from 'src/app/models/user';

declare var $: any;

@Component({
  selector: 'app-eo-bom-kit-details',
  templateUrl: './eo-bom-kit-details.component.html',
  styleUrls: ['./eo-bom-kit-details.component.css'],
  providers: [
  // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
  // `MatMomentDateModule` in your applications root module. We provide it at the component level
  // here, due to limitations of our example generation script.
  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
]
})
export class EoBomKitDetailsComponent implements OnInit, OnDestroy {
  planner: string;
  ruleHeader: string;
  selectedRule: string;
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
  nextReviewDate = new FormControl(moment().add(14, 'days').format('YYYY-MM-DD'));
  minDate = moment().add(1, 'days');
  maxDate = moment().add(90, 'days');
  resp: any;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  hideLoading: boolean = true;
  
  public NewEoDash8Obj = new EoNumberRule(); //from the dynamic queue/alerts list components
  //@Input() receivedEORule: EoNumberRule; //from the dynamic queue/alerts list components
  eoDash8ToSend: EoNumberRule; //sent to planner-comment component

  constructor(
    private eoPlannerService: eoPlannerService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog
  ) {
    //   this.subscription = this.eoPlannerService.getDash8Rule().subscribe(eoNumberRuleObj => { 
    //   if (eoNumberRuleObj) {
    //     this.NewEoDash8Obj = eoNumberRuleObj;
    //     this.dash8id = this.NewEoDash8Obj.DASH_8;
    //     this.NewEoDash8Obj.RULE = eoNumberRuleObj.RULE;
    //     this.ruleHeader = eoNumberRuleObj.RULE;
    //     this.kitDetails$ = null;
    //     this.getBOMDetails();    
    //   }
    //   else { 
    //     this.NewEoDash8Obj = new EoNumberRule;
    //     this.dash8id = "";
    //   }
    // });   

   }

  ngOnInit() {

    //this.currentUser = this.userService.getUser().displayName;
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.hideLoading = false;
    let searchEoType = this.router.parseUrl(this.router.url);
    this.dash8id = searchEoType.root.children.primary.segments[3].path;
    this.planner = searchEoType.root.children.primary.segments[5].path
    switch (searchEoType.root.children.primary.segments[4].path) {
      case 'ad':
        this.ruleHeader = 'AD Parts Shortage';
        break;
      case '30':
        this.ruleHeader = '30 Days Parts Shortage';
        break;
      case '6090':
        this.ruleHeader = '60 Or 90 Days Parts Shortage';
        break;
      case '120180':
        this.ruleHeader = '120 Or 180 Days Parts Shortage';
        break;
      case '180p':
        this.ruleHeader = '180 Plus Days Parts Shortage';
        break;
      case 'nd8nb':
        this.ruleHeader = 'New Dash 8 With No BOM';
        break;
      case 'nsc':
        this.ruleHeader = 'New Stations Changes';
        break;
      case 'css':
        this.ruleHeader = 'Capable Station Shortage';
        break;
      case 'oekwo':
        this.ruleHeader = 'Overdue EO Kit Work Order';
        break;
      case 'opr':
        this.ruleHeader = 'Overdue POs and ROs';
        break;
      case 'pid':
        this.ruleHeader = 'Parts in Discrepancy';
        break;
      case 'yd':
        this.ruleHeader = 'Yesterday Deferrals';
        break;
    }
    this.NewEoDash8Obj.DASH_8 = this.dash8id;
    this.NewEoDash8Obj.RULE = this.ruleHeader;
    this.NewEoDash8Obj.PLANNER = this.planner;
    
    this.kitDetails$ = null;
    this.getBOMDetails();    
    this.hideLoading = true;
  }

  getBOMDetails() {
    this.nextReviewDate = new FormControl(moment().add(14, 'days').format('YYYY-MM-DD'));
    this.dropOffStatus = true;
    switch (this.NewEoDash8Obj.RULE) {
      case "AD Parts Shortage":
        this.bomDetails$ = this.eoPlannerService.getBOMAdPartsShortageDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "AD Parts Shortage")
        );      
        //this.dayType = "30";
        this.kitAdPartsShortageDetails$ = null;
        break;
      case "30 Days Parts Shortage":
        this.bomDetails$ = this.eoPlannerService.getBOM30DayDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "30 Days Parts Shortage")
        );      
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
        this.dayType = "120180";
        this.kit120180DayDetails$ = null;
        break;
      case "180 Plus Days Parts Shortage":
        this.bomDetails$ = this.eoPlannerService.getBOM180PlusDayDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "180 Plus Days Parts Shortage")
        );      
        this.dayType = "180+";
        this.kit180PlusDayDetails$ = null;
        break;
      case "New Dash 8 With No BOM":
        this.bomDetails$ = this.eoPlannerService.getNewDash8WithNoBOMDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "New Dash 8 With No BOM")
        );      
        //this.dayType = "180+";
        break;
      case "Parts in Discrepancy":
        this.bomDetails$ = this.eoPlannerService.getBOMPartsInDiscrepancyDetailById(this.NewEoDash8Obj.DASH_8, this.NewEoDash8Obj.EO_NUMBER)
        .pipe( data =>
          this.setDropBtnStatus(data, "Parts in Discrepancy")
        );      
        //this.dayType = "";
        this.eoPartsInDiscrepancy$ = null;
        break;
      case "Yesterday Deferrals":
        this.bomDetails$ = this.eoPlannerService.getBOMYesterdayDeferralsDetailById(this.NewEoDash8Obj.DASH_8)
        .pipe( data =>
          this.setDropBtnStatus(data, "Yesterday Deferrals")
        );      
        //this.dayType = "";
        this.eoYesterdayDeferrals$ = null;
        break;
      case "Overdue EO Kit Work Order":
        this.bomDetails$ = this.eoPlannerService.getBOMOverdueEoKitWorkOrderDetailById(this.NewEoDash8Obj.DASH_8, this.NewEoDash8Obj.EO_NUMBER)
        .pipe( data =>
          this.setDropBtnStatus(data, "Overdue EO Kit Work Order")
        );      
        //this.dayType = "";

        this.bomDetails$.forEach(element => {
          if ((element[0].KEYWORD_DESCRIPTION != null))
            this.overdueEoKitWorkOrderDesc = element[0].KEYWORD_DESCRIPTION;
        });
        this.eoOverdueKitWorkOrderDetail$ = null;
        break;
      case "Overdue POs and ROs":
        //let result: Observable<EoBomDetail[]>;
        this.bomDetails$ = this.eoPlannerService.getBOMOverduePosRosDetailById(this.NewEoDash8Obj.DASH_8, this.NewEoDash8Obj.EO_NUMBER)
          .pipe( data =>
            this.setDropBtnStatus(data, "Overdue POs and ROs")
          );      
        //this.dayType = "";
        this.eoOverduePosRosDetail$ = null;
        break;
      case "New Stations Changes":
          this.bomDetails$ = this.eoPlannerService.getBOMNewStationsChangesDetailById(this.NewEoDash8Obj.DASH_8)
          .pipe( data =>
            this.setDropBtnStatus(data, "New Stations Changes")
          );      
        //this.dayType = "";
        this.kitNewStationsChangesDetails$ = null;                                                                                                    
        break;
      case "Capable Station Shortage":
        this.bomDetails$ = this.eoPlannerService.getCapableStationShortageDetailById(this.NewEoDash8Obj.DASH_8)
          .pipe( data =>
            this.setDropBtnStatus(data,"Capable Station Shortage")
          );      
        //this.dayType = "";
        //this.kitCapableStationsShortageDetails$ = null;   
        break;  
    }  
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

    return bomDetail;
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
    this.currentChkkey = val;
  }

  onSubmit(form: NgForm, commentType: string, selNumber: string) {
    // let now = new Date().getTime();
    // while (new Date().getTime() < now + 3000) { }
    this.hideLoading = false;
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
        eoPqCommentReq.CHKKEY = selNumber;
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
  }

  dropDash8() { 
    let dropEoPqDash8Req = new DropEoPqDash8Req();
    dropEoPqDash8Req.NEXT_REVIEW_DATE = this.nextReviewDate.value == null? moment(): this.nextReviewDate.value;
    dropEoPqDash8Req.DASH_8 = this.NewEoDash8Obj.DASH_8;
    dropEoPqDash8Req.PLANNER = this.NewEoDash8Obj.PLANNER;
    dropEoPqDash8Req.REVIEW_REASON = this.NewEoDash8Obj.RULE;
    this.eoPlannerService.dropOffEOPQDash8(dropEoPqDash8Req)
      .subscribe(result => {
        let updateeopqmasterreq = new UpdateEoPqMasterReq();
        updateeopqmasterreq.DASH_8 = this.NewEoDash8Obj.DASH_8;
        updateeopqmasterreq.REVIEW_REASON = this.NewEoDash8Obj.RULE;
        updateeopqmasterreq.PLANNER = this.NewEoDash8Obj.PLANNER;
        this.eoPlannerService.updateEOPQMaster(updateeopqmasterreq)
          .subscribe(result => {
            //this.getRuleCountsForPlanner(this.NewEoDash8Obj.PLANNER);
            this.getBOMDetails();
            return this.resp = result;
          });
            return this.resp = result;
        }); 
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
  
  ngOnDestroy() {
    this.dropoffSubscription?.unsubscribe();
    this.subscription?.unsubscribe();
    this.dropoffSubscription?.unsubscribe();
  }

}
