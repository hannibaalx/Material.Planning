import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from 'src/app/service/planner.service';
import { UserService } from 'src/app/service/user.service';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { SoPendingReviewComment } from '../../../../models/so-pending-review-comment'
import { CommentReq } from '../../../../models/comment-req';
import { UpdatePqMasterReq } from './../../../../models/update-pq-master-req';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentHistoryComponent } from '../../comment-history/comment-history.component';
import { User } from 'src/app/models/user';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;
@Component({
  selector: 'app-so-pending-review-comments',
  templateUrl: './so-pending-review-comments.component.html',
  styleUrls: ['./so-pending-review-comments.component.css']
})
export class SoPendingReviewCommentsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public pendso$: Observable<SoPendingReviewComment[]>;
  public apendso: SoPendingReviewComment[];
  public meRule = new MeNumberRule();
  public keyword: string;
  public meNumber: string;
  resp: any;
  plannerName: string = "";
  disableDropOff: boolean = true;
  allBtnStatus: boolean = false;

  blnShowHideComment: boolean = true;
  public revReasonQueues$: ReviewReasonNotification[];
  public revReasonAlerts$: ReviewReasonNotification[];
  eoDash8History: string;
  currentChkkey: string;
  dialogValue: string;
  hideLoading: boolean = true;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };

  //@Output() newMeRule = new EventEmitter<MeNumberRule>();

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
              if(data.Rule == "SO Pending Review")
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
    this.pendso$ = this.plannerService.getPQSOPendingReviewCommentByME(this.meRule.ME_PART_NUMBER);
    
    this.pendso$.subscribe(x => {
      this.apendso = x;
      x.forEach(y => {
        this.keyword = y.ME_DESC;
        if (y.COMM == 'YES')
          yesCount += 1;
      })
      if (this.apendso.length == yesCount)
        this.disableDropOff = false;
      else
        this.disableDropOff = true;
    });
    this.getNotifications(valObj);
  }

  onSubmit(form: NgForm) { 
    let stations: string[] = [];
    
    this.apendso.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        stations.push(x.CHKKEY);
      }
    });

    let soPendingReviewReq = new CommentReq();
    soPendingReviewReq.PLANNER_NAME = this.user.display_name;
    soPendingReviewReq.Comment = form.controls.txtComment.value;
    soPendingReviewReq.MENumber = this.meRule.ME_PART_NUMBER;
    soPendingReviewReq.REVIEW_REASON = "SO Pending Review";
    soPendingReviewReq.STATIONS = stations;

    if (form.controls.txtComment.value.length)
      this.plannerService.insertPQSOPendingReviewComments(soPendingReviewReq)
        .subscribe(result => { 
          this.showHideComments();
          return this.resp = result;
        });
    
    // if (form.controls.chkDrop.value) {
    //   this.plannerService.dropOffSOPendingReviewComment(soPendingReviewReq.MENumber).subscribe(result => { //, zStockReq.REVIEW_REASON, zStockReq.STATIONS
    //     return this.resp = result;
    //   });

    //   let updatepqmasterreq = new UpdatePqMasterReq();
    //   updatepqmasterreq.MENumber = this.meRule.ME_PART_NUMBER;
    //   updatepqmasterreq.REVIEW_REASON = soPendingReviewReq.REVIEW_REASON
    //   this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
    //     return this.resp = result;
    //   });
    // }
    
    const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
    pauseCounter.subscribe(n => {
      this.showHideComments();
      form.controls.txtComment.reset("");
      this.pendso$ = null;
      this.keyword = "";
      this.setMeRule(this.meRule);
    });
  }

  // sendCrossQueueMeDetails(value: string, rule: string) {
  //   let valObj = new MeNumberRule();
  //   valObj.ME_PART_NUMBER = value;
  //   valObj.Rule = rule;
  //   this.plannerService.setMeNumber(valObj);

  //   this.newMeRule.emit(valObj);
  // }

  setEoDash8HistoryModal(comment: string, val: string) { 
    this.eoDash8History = comment;
    //this.currentDash8Number = val;
    this.currentChkkey = val;
  }

  showHideComments() {
    this.blnShowHideComment = !this.blnShowHideComment;
  }

  openHistory(menumber: string, fromStation: string, toStation: string, requestor: string, reviewReason: string) { 

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, fromStation: fromStation, toStation: toStation, requestor: requestor, reviewReason: reviewReason }

    let dialogRef = this.dialog.open(
      CommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.setMeRule(this.meRule);
      this.dialogValue = result.data;
    });
  }
  
dropMENumber(menumber: string) {
  if (menumber) { 
    this.plannerService.dropOffSOPendingReviewComment(menumber).subscribe(result => { //, zStockReq.REVIEW_REASON, zStockReq.STATIONS
      return this.resp = result;
    });

      let updatepqmasterreq = new UpdatePqMasterReq();
      updatepqmasterreq.MENumber = menumber;
      updatepqmasterreq.REVIEW_REASON = "SO Pending Review";
    this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
        //this.showHideComments();
        this.dropOffNotify(menumber);
        this.pendso$ = null;
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
