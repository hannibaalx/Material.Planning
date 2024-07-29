import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, timer, Subscription  } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from 'src/app/service/planner.service';
import { UserService } from 'src/app/service/user.service';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { SmBaselineStationShortageComment } from 'src/app/models/sm-baseline-station-shortage-comment';
import { NgForm } from '@angular/forms';
import { CommentReq } from '../../../../models/comment-req';
import { UpdatePqMasterReq } from './../../../../models/update-pq-master-req';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentHistoryComponent } from '../../comment-history/comment-history.component';
import { SmDash8CommentDetailsComponent } from 'src/app/component/planner-queue/queues/sm-dash8-comment-details/sm-dash8-comment-details.component';
import { User } from 'src/app/models/user';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;
@Component({
  selector: 'app-sm-baseline-station-shortage-comments',
  templateUrl: './sm-baseline-station-shortage-comments.component.html',
  styleUrls: ['./sm-baseline-station-shortage-comments.component.css']
})
export class SmBaselineStationShortageCommentsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public pqbasesta$: Observable<SmBaselineStationShortageComment[]>;
  public abasesta: SmBaselineStationShortageComment[];
  public meRule = new MeNumberRule();
  keyword: string;
  resp: any;
  disableDropOff: boolean = true;
  allBtnStatus: boolean = false;
  plannerName: string = "";
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  hideLoading: boolean = true;

  // blnShowHideComment: boolean = true;
  public revReasonQueues$: ReviewReasonNotification[];
  public revReasonAlerts$: ReviewReasonNotification[];
  eoDash8History: string;
  currentChkkey: string;
  dialogValue: string;

  @Output() newMeRule = new EventEmitter<MeNumberRule>();  

  constructor(
    private route: ActivatedRoute,
    private plannerService: PlannerService,
    private userService: UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    // this.disableDropOff = false;

    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.meRule.ME_PART_NUMBER = params['id'];
          this.setMeRule(this.meRule);
          this.getNotifications(this.meRule);
        }
        else {
          this.plannerService.clearMeNumber();
          this.plannerService.getMeNumber().subscribe(data => {
            this.meRule = data;
            if (data !== undefined)
              if(data.Rule == "SM Baseline Station Shortage")
                this.setMeRule(data);
          })
        }
      })
  }

  getNotifications(data: MeNumberRule) {
    this.revReasonQueues$ = [];
    this.revReasonAlerts$ = [];
    
    this.plannerService.getReviewReasonQueuesByMeNumber(data.ME_PART_NUMBER)
    .subscribe(result => { 
      //console.log('queues returned:' + result.length);
      this.revReasonQueues$ = result;
  });
    this.plannerService.getReviewReasonAlertsByMeNumber(data.ME_PART_NUMBER)
        .subscribe(result => { 
          //console.log('alerts returned:' + result.length);
          this.revReasonAlerts$ = result;
          this.hideLoading = true;
    });
  }
  
  selectAllChkkey() {
    $('input[type="checkbox"]').prop('checked', this.allBtnStatus).click();
    this.allBtnStatus = !this.allBtnStatus;
  }

  setMeRule(valObj: MeNumberRule) {
    let yesCount = 0;
    this.meRule = valObj;
    this.hideLoading = false;
    this.pqbasesta$ = this.plannerService.getPQSMBaselineStationShortageCommentByME(this.meRule.ME_PART_NUMBER)
    
    this.pqbasesta$.subscribe(x => {
      this.abasesta = x;
      x.forEach(y => {
        this.keyword = y.KEYWORD_DESCRIPTION;
        if (y.COMM == 'YES')
          yesCount += 1;
      })
      if (this.abasesta.length == yesCount)
        this.disableDropOff = false;
      else
        this.disableDropOff = true;
    });
    this.getNotifications(valObj);
  };

  onSubmit(form: NgForm) {
    let stations: string[] = [];
    // {{ME_PART_NUMBER}}-{{STATION}}-{{DASH8}}-{{NOSE}}-{{IAG-SCHD}}
    this.abasesta.forEach(x => {
      if (form.controls[x.CHKKEY].value == true) {
        stations.push(x.CHKKEY);
      }
    });

    let smBaselineStationShortageReq = new CommentReq();
    smBaselineStationShortageReq.PLANNER_NAME = this.user.display_name;
    smBaselineStationShortageReq.Comment = form.controls.txtComment.value;
    smBaselineStationShortageReq.MENumber = this.meRule.ME_PART_NUMBER;
    smBaselineStationShortageReq.REVIEW_REASON = "SM Baseline Station Shortage";
    smBaselineStationShortageReq.STATIONS = stations;

    if (form.value.txtComment.length)
      this.plannerService.insertPQSMBaselineStationShortageComments(smBaselineStationShortageReq)
        .subscribe(result => {
          // this.showHideComments();
          return this.resp = result;
        });
    
    // if (form.controls.chkDrop.value) {
    //   this.plannerService.dropOffPQBaselineStationShortage(baselineStationShortageReq.MENumber)
    //     .subscribe(result => {
    //       return this.resp = result;
    //   });
      
    //   let updatepqmasterreq = new UpdatePqMasterReq();
    //   updatepqmasterreq.MENumber = this.meRule.ME_PART_NUMBER;
    //   updatepqmasterreq.REVIEW_REASON = baselineStationShortageReq.REVIEW_REASON
    //   this.plannerService.updatePQMaster(updatepqmasterreq)
    //     .subscribe(result => {
    //       return this.resp = result;
    //   });
    // }

    const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
    pauseCounter.subscribe(n => {
      // this.showHideComments();
      form.controls.txtComment.reset("");
      this.pqbasesta$ = null;
      this.keyword = "";
      this.setMeRule(this.meRule);
    });
  }

  setEoDash8HistoryModal(comment: string, val: string) { 
    this.eoDash8History = comment;
    //this.currentDash8Number = val;
    this.currentChkkey = val;
  }

  // showHideComments() {
  //   this.blnShowHideComment = !this.blnShowHideComment;
  // }

  openHistory(menumber: string, requirement: string, station: string, capablestation: string, reviewReason: string) { 

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, requirement: requirement, station: station, capablestation: capablestation, reviewReason: reviewReason  }

    let dialogRef = this.dialog.open(
      CommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.setMeRule(this.meRule);
      this.dialogValue = result.data;
    });
  }

  openDash8Details(menumber: string, requiredind: string, station: string) { 

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '1025px';
    dialogConfig.maxWidth = '1025px';
    // let requiredindval = requiredind.trim() == "As Required" ? true : false;
    // dialogConfig.data = { menumber: menumber, requiredind: requiredindval, station: station }
    // if (requiredind.trim() == "As Required")
    //   dialogConfig.data = { menumber: menumber, requiredind: requiredind.trim(), station: station }
    // if (requiredind.trim() == "Required")
    //   dialogConfig.data = { menumber: menumber, requiredind: true, station: station }
    
    dialogConfig.data = { menumber: menumber, requirement: requiredind.trim(), station: station }

    let dialogRef = this.dialog.open(
      SmDash8CommentDetailsComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      //this.setMeRule(this.meRule);
      this.dialogValue = result.data;
    });
  }

  dropMENumber(menumber: string) {
    if (menumber) { 
      this.plannerService.dropOffPQSMBaselineStationShortage(menumber).subscribe(result => { //, zStockReq.REVIEW_REASON, zStockReq.STATIONS
        return this.resp = result;
      });
  
      let updatepqmasterreq = new UpdatePqMasterReq();
      updatepqmasterreq.MENumber = menumber;
      updatepqmasterreq.REVIEW_REASON = "SM Baseline Station Shortage";
      this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
        // this.showHideComments();
        this.dropOffNotify(menumber);
        this.pqbasesta$ = null;
        this.meRule.ME_PART_NUMBER = '';
        this.keyword = '';
        this.plannerService.refreshPlannerCountNeeded$;
        return this.resp = result;
      });
    }
  }

  dropOffNotify(menumber) {
    this.snackBar.open(menumber + ' was dropped successfully.', 'Close', {
      duration: 3000
    });
  }

  ngOnDestroy() { 
    //this.subscription?.unsubscribe();
    this.revReasonQueues$ = [];
    this.revReasonAlerts$ = [];    
  }

}
