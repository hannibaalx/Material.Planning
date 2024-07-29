import { TesCriticalComponent } from './../tes-critical/tes-critical.component';
import { UserService } from './../../../../service/user.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { PlannerService } from 'src/app/service/planner.service';
import { TesCriticalComments } from './../../../../models/tes-critical-comments';
import { CommentReq } from './../../../../models/comment-req';
import { UpdatePqMasterReq } from './../../../../models/update-pq-master-req';
import { User } from 'src/app/models/user';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentHistoryComponent } from '../../comment-history/comment-history.component';
import { ActivatedRoute, Params } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;
@Component({
  selector: 'app-tes-critical-comments',
  templateUrl: './tes-critical-comments.component.html',
  styleUrls: ['./tes-critical-comments.component.css']
})
export class TesCriticalCommentsComponent implements OnInit, OnDestroy {
  public tescrit$: Observable<TesCriticalComments[]>;
  public aatescrit: TesCriticalComments[];
  public meRule = new MeNumberRule();
  public keyword: string;
  public meNumber: string;
  resp: any;
  public plannerName: string = "";
  public plannerObj: User;
  disableDropOff: boolean = true;
  allBtnStatus: boolean = false;
  hideLoading: boolean = true;

  // blnShowHideComment: boolean = true;
  public revReasonQueues$: ReviewReasonNotification[];
  public revReasonAlerts$: ReviewReasonNotification[];
  eoDash8History: string;
  currentChkkey: string;
  dialogValue: string;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };

  @Output() newMeRule = new EventEmitter<MeNumberRule>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private plannerService: PlannerService,
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
    this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.meRule.ME_PART_NUMBER = params['id'];
          this.setMeRule(this.meRule);
        }
        else {
          this.plannerService.clearMeNumber();
          this.plannerService.getMeNumber().subscribe(data => {
            this.meRule = data;
            if (data !== undefined)
              if(data.Rule == "TES Critical")
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
    
    // this.plannerService.sendReviewReasonNotification(data.ME_PART_NUMBER);
   }

   selectAllChkkey() {
    $('input[type="checkbox"]').prop('checked', this.allBtnStatus).click();
    this.allBtnStatus = !this.allBtnStatus;
  }

  setMeRule(valObj: MeNumberRule) {
    let yesCount = 0;
    this.meRule = valObj;
    this.hideLoading = false;
    this.tescrit$ = this.plannerService.getPQTesCriticalCommentByME(this.meRule.ME_PART_NUMBER)
    
    this.tescrit$.subscribe(x => {
      this.aatescrit = x;
      x.forEach(y => {
        this.keyword = y.KEYWORD_DESCRIPTION;
        if (y.COMM == 'YES')
          yesCount += 1;
      })
      if (this.aatescrit.length == yesCount)
        this.disableDropOff = false;
      else
        this.disableDropOff = true;
    });
   this.getNotifications(valObj);
  }

  onSubmit(form: NgForm) { 
    let stations: string[] = [];
    
    this.aatescrit.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        stations.push(x.CHKKEY);
      }
    });

    let tesCritReq = new CommentReq();
    tesCritReq.PLANNER_NAME = this.user.display_name;
    tesCritReq.Comment = form.controls.txtComment.value;
    tesCritReq.MENumber = this.meRule.ME_PART_NUMBER;
    tesCritReq.REVIEW_REASON = "TES Critical";
    tesCritReq.TOGGLESTATUS = [];
    tesCritReq.REVIEWDATE = [];
    tesCritReq.STATIONS = stations;

    if (form.controls.txtComment.value.length)
      this.plannerService.insertPQTESCriticalComments(tesCritReq)
        .subscribe(result => {
          // this.blnShowHideComment = !this.blnShowHideComment;
          return this.resp = result;
        });
    
    // if (form.controls.chkDrop.value) {
    //   this.plannerService.dropOffPQTESCritical(tesCritReq.MENumber)
    //     .subscribe(result => {
    //     return this.resp = result;
    //     });
      
    //     let updatepqmasterreq = new UpdatePqMasterReq();
    //     updatepqmasterreq.MENumber = this.meRule.ME_PART_NUMBER;
    //     updatepqmasterreq.REVIEW_REASON = tesCritReq.REVIEW_REASON
    //   this.plannerService.updatePQMaster(updatepqmasterreq)
    //     .subscribe(result => {
    //       return this.resp = result;
    //     });
      
    //   }

    const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
    pauseCounter.subscribe(n => {
        // this.showHideComments();
        form.controls.txtComment.reset("");
        this.tescrit$ = null;
        this.keyword = "";
        this.setMeRule(this.meRule);
    });
  }

  // showHideComments() {
  //   this.blnShowHideComment = !this.blnShowHideComment;
  // }

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
  
  openHistory(menumber: string, reviewReason: string) { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, reviewReason: reviewReason }

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
      this.plannerService.dropOffPQTESCritical(menumber).subscribe(result => { //, zStockReq.REVIEW_REASON, zStockReq.STATIONS
        return this.resp = result;
      });
  
      let updatepqmasterreq = new UpdatePqMasterReq();
      updatepqmasterreq.MENumber = menumber;
      updatepqmasterreq.REVIEW_REASON = "TES Critical";
      this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
        // this.showHideComments();
        this.dropOffNotify(menumber);
        this.tescrit$ = null;
        this.meRule.ME_PART_NUMBER = '';
        this.keyword = '';
        this.plannerService.refreshPlannerCountNeeded$;
        const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
        //let x = new TesCriticalComponent(this.plannerService);
        //x.getAllTESCriticalByPlanner(plannerName);
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
    // //console.log('TES Critical destroyed');
    this.revReasonQueues$ = [];
    this.revReasonAlerts$ = [];
  }
}
