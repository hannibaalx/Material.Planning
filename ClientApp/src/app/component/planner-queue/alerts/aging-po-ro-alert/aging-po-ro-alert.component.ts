import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { NgForm } from '@angular/forms';
import { AgingPoRoAlert } from '../../../../models/aging-po-ro-alert';
import { ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from '../../../../service/planner.service';
import { CommentReq } from '../../../../models/comment-req';
import { UpdatePqMasterReq } from 'src/app/models/update-pq-master-req';
import { UserService } from './../../../../service/user.service';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentHistoryComponent } from '../../comment-history/comment-history.component';
import { User } from 'src/app/models/user';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;
@Component({
  selector: 'app-aging-po-ro-alert',
  templateUrl: './aging-po-ro-alert.component.html',
  styleUrls: ['./aging-po-ro-alert.component.css']
})
export class AgingPoRoAlertComponent implements OnInit, OnDestroy {
  public agingporo$: Observable<AgingPoRoAlert[]>;
  public aagingporo: AgingPoRoAlert[];
  public meRule: MeNumberRule;
  public keyword: string;
  resp: any;
  plannerName: string = "";
  disableDropOff: boolean = true;
  allBtnStatus: boolean = false;
  subscription: Subscription;

  // blnShowHideComment: boolean = true;
  public revReasonQueues$: ReviewReasonNotification[];
  public revReasonAlerts$: ReviewReasonNotification[];
  eoDash8History: string;
  currentChkkey: string;
  dialogValue: string;
  hideLoading: boolean = true;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };

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
    this.meRule = new MeNumberRule();
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
              if(data.Rule == "Overdue PO or RO")
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
    this.agingporo$ = this.plannerService.getPQAgingPoRoAlertByME(this.meRule.ME_PART_NUMBER);
    
    this.agingporo$.subscribe(x => {
      this.aagingporo = x;
      x.forEach(y => {
        this.keyword = y.KEYWORD_DESCRIPTION;
        if (y.COMM == 'YES')
          yesCount += 1;
      });
      
      if (this.aagingporo.length == yesCount)
        this.disableDropOff = false;
      else
        this.disableDropOff = true;
    });
    this.getNotifications(valObj);
   }

   onSubmit(form: NgForm) {
    let stations: string[] = [];
    
    this.aagingporo.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        stations.push(x.CHKKEY);
      }
    });

    let agingPoRoAlertReq = new CommentReq();
    agingPoRoAlertReq.PLANNER_NAME = this.user.display_name;
    agingPoRoAlertReq.Comment = form.controls.txtComment.value;
    agingPoRoAlertReq.MENumber = this.meRule.ME_PART_NUMBER;
    agingPoRoAlertReq.REVIEW_REASON = "Overdue PO or RO";
    agingPoRoAlertReq.STATIONS = stations;

    if (form.controls.txtComment.value.length)
      this.plannerService.insertPQAlert(agingPoRoAlertReq)
        .subscribe(result => { 
          return this.resp = result;
        });
  
      // if (form.controls.chkDrop.value) {
      //   this.plannerService.dropOffPQAgingPoRoAlert(agingPoRoAlertReq.MENumber)
      //     .subscribe(result => {
      //     return this.resp = result;
      //     });
        
      //     let updatepqmasterreq = new UpdatePqMasterReq();
      //     updatepqmasterreq.MENumber = this.meRule.ME_PART_NUMBER;
      //     updatepqmasterreq.REVIEW_REASON = agingPoRoAlertReq.REVIEW_REASON
      //     this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
      //       return this.resp = result;
      //     });
      // }
    
      const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
      pauseCounter.subscribe(n => {
        // this.showHideComments();
        form.controls.txtComment.reset("");
        this.agingporo$ = null;
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

  // showHideComments() {
  //   this.blnShowHideComment = !this.blnShowHideComment;
  // }

  openHistory(menumber: string, ordernumber: string, reviewReason: string) { 

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, ordernumber: ordernumber, reviewReason: reviewReason }

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
    this.plannerService.dropOffPQAgingPoRoAlert(menumber).subscribe(result => {
      return this.resp = result;
    });

    let updatepqmasterreq = new UpdatePqMasterReq();
    updatepqmasterreq.MENumber = menumber;
    updatepqmasterreq.REVIEW_REASON = "Overdue PO or RO";
    this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
        // this.showHideComments();
      this.dropOffNotify(menumber);
        this.agingporo$ = null;
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
