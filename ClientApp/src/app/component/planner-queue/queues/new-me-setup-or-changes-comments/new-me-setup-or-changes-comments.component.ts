import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { Observable, timer, Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from 'src/app/service/planner.service';
import { UpdatePqMasterReq } from 'src/app/models/update-pq-master-req';
import { CommentReq } from 'src/app/models/comment-req';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentHistoryComponent } from '../../comment-history/comment-history.component';
import { NewMeSetupOrChangesComments } from 'src/app/models/new-me-setup-or-changes-comments'
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;

@Component({
  selector: 'app-new-me-setup-or-changes-comments',
  templateUrl: './new-me-setup-or-changes-comments.component.html',
  styleUrls: ['./new-me-setup-or-changes-comments.component.css']
})
export class NewMeSetupOrChangesCommentsComponent implements OnInit {
  private subscription: Subscription;
  public usageall$: Observable<NewMeSetupOrChangesComments[]>;
  public ausageall: NewMeSetupOrChangesComments[];
  public meRule = new MeNumberRule();
  public keyword: string;
  resp: any;
  plannerName: string = "";
  disableDropOff: boolean = true;
  allBtnStatus: boolean = false;

  blnShowHideComment: boolean = true;
  blnShowPlannerComment: boolean = false;
  public revReasonQueues$: ReviewReasonNotification[];
  public revReasonAlerts$: ReviewReasonNotification[];
  eoDash8History: string;
  currentChkkey: string;
  dialogValue: string;
  hideLoading: boolean = true;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  baseUrl: string = '/ata';

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
    this.usageall$ = null;

    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.meRule.ME_PART_NUMBER = params['id'];
          this.setMeRule(this.meRule);
        }
        else {
          this.plannerService.getMeNumber().subscribe(data => {
            this.meRule = data;
            if (data !== undefined)
              if (data.Rule == "New ME Setup or Changes")
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
    this.usageall$ = this.plannerService.getAllNewMeSetupOrChangesByME(this.meRule.ME_PART_NUMBER);

    this.plannerService.setAtaPlannerComments(true);  
      
    this.usageall$.subscribe(x => {
      this.ausageall = x;

      x.forEach(y => {
        this.keyword = y.KEYWORD_DESCRIPTION;
        if (y.COMM == 'YES')
          yesCount += 1;
      });

      if (this.ausageall.length == yesCount)
        this.disableDropOff = false;
      else
        this.disableDropOff = true;
    });
    this.getNotifications(valObj);

    this.blnShowPlannerComment = this.plannerService.getAtaPlannerComments();
  }
  
  onSubmit(form: NgForm) {
    let stations: string[] = [];
    
    this.ausageall.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        stations.push(x.CHKKEY);
      }
    });

    let newmesetuporchangesReq = new CommentReq();
    newmesetuporchangesReq.PLANNER_NAME = this.user.display_name;
    newmesetuporchangesReq.Comment = form.controls.txtComment.value;
    newmesetuporchangesReq.MENumber = this.meRule.ME_PART_NUMBER;
    newmesetuporchangesReq.REVIEW_REASON = "New ME Setup or Changes";
    newmesetuporchangesReq.TOGGLESTATUS = [];
    newmesetuporchangesReq.REVIEWDATE = [];
    newmesetuporchangesReq.STATIONS = stations;

    if (form.controls.txtComment.value.length)
      this.plannerService.insertPQAlert(newmesetuporchangesReq)
        .subscribe(result => { 
          return this.resp = result;
        });
     
    const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
    pauseCounter.subscribe(n => {
      this.showHideComments();
      form.controls.txtComment.reset("");
      this.usageall$ = null;
      this.keyword = "";
      this.setMeRule(this.meRule);
    });
  }

  setEoDash8HistoryModal(comment: string, val: string) { 
    this.eoDash8History = comment;
    this.currentChkkey = val;
  }

  showHideComments() {
    this.blnShowHideComment = !this.blnShowHideComment;
  }

  openHistory(menumber: string, reviewReason: string, chkkey: string) { 

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, reviewReason: reviewReason, chkkey: chkkey }

    let dialogRef = this.dialog.open(
      CommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      this.setMeRule(this.meRule);
      this.dialogValue = result.data;
    });
  }
  
dropMENumber(menumber: string) {
  if (menumber) { 
    this.plannerService.dropOffPQNewMeSetupOrChangesReqAlert(menumber).subscribe(result => {
      return this.resp = result;
    });

    let updatepqmasterreq = new UpdatePqMasterReq();
    updatepqmasterreq.MENumber = menumber;
    updatepqmasterreq.REVIEW_REASON = "New ME Setup or Changes";
    this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
      this.showHideComments();
      this.dropOffNotify(menumber);
      this.usageall$ = null;
      this.meRule.ME_PART_NUMBER = '';
      this.keyword = '';
      this.plannerService.refreshPlannerCountNeeded$;
      this.plannerService.refreshNeeded$;
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
