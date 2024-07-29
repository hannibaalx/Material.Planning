import { CommentHistory } from './../../../../models/comment-history';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { PqZeroStock } from '../../../../models/pq-zero-stock';
import { MeNumberRule } from '../../../../models/me-number-rule';
import { ZeroStockComment } from '../../../../models/zero-stock-comment';
import { CommentReq } from '../../../../models/comment-req';
import { UpdatePqMasterReq } from './../../../../models/update-pq-master-req';
import { UserService } from 'src/app/service/user.service';
import { PlannerService } from 'src/app/service/planner.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { CommentHistoryComponent } from 'src/app/component/planner-queue/comment-history/comment-history.component';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;
@Component({
  selector: 'app-zero-stock-comments',
  templateUrl: './zero-stock-comments.component.html',
  styleUrls: ['./zero-stock-comments.component.css']
})
export class ZeroStockCommentsComponent implements OnInit, OnDestroy {
  public pqzerostock$: Observable<ZeroStockComment[]>;
  public aazerostock: ZeroStockComment[];
  public revReasonQueues$: ReviewReasonNotification[];
  public revReasonAlerts$: ReviewReasonNotification[];
  public meRule = new MeNumberRule();
  public nonAllocSta: string;
  public overstocksta: string;
  public availstockdc: string;
  public keyword: string;
  public meNumber: string;
  resp: any;
  plannerName: string = "";
  userFirstName: string = "";
  userLastName: string = "";
  disableDropOff: boolean = false;

  showSaveval: boolean = false;
  eoDash8History: string;
  currentDash8Number: string;
  currentChkkey: string;
  dropOffStatus: boolean = true;
  allBtnStatus: boolean = false;
  hideLoading: boolean = true;

  blnShowHideComment: boolean = true;

  public tabindex: number;
  public cardContent1: string;
  public cardContent2: string;
  public blnEditCard: boolean[] = [true, true];
  public blnHideEdit: boolean[] = [false, false];
  public blnHideOK: boolean[] = [true, true];
  
  plannerObj: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  public commentHistory: CommentHistory[] = [];
  dialogValue: string;
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
    //console.log('this is the user object in fetchData --> ' + this.user);

    this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.meRule.ME_PART_NUMBER = params['id'];
          this.setMeRule(this.meRule);
        }
        else {
          this.plannerService.getMeNumber().subscribe(data => {
            this.meRule = data;
            if (data !== undefined)
              if(data.Rule == "Zero Stock")
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
    this.pqzerostock$ = this.plannerService.getPQZeroStockCommentByME(this.meRule.ME_PART_NUMBER);
      
    this.pqzerostock$.subscribe(x => {
      this.aazerostock = x;
      x.forEach(y => {
        this.keyword = y.KEYWORD
        this.overstocksta = y.Overstock_Station
        this.nonAllocSta = y.NonAllocation_Station
        this.availstockdc = y.AvailableStockInDC
        if (y.COMM == 'YES')
          yesCount += 1;
      });
      if (this.aazerostock.length == yesCount)
        this.disableDropOff = false;
      else
        this.disableDropOff = true;
    });
    this.getNotifications(valObj);
  }

  hideSave() { 
    this.showSaveval = false;
  }

  showSave() { 
    this.showSaveval = true;
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
  //  }

  onSubmit(form: NgForm) { 
    let stations: string[] = [];
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    console.log('this is the user object in onSubmit --> ' + this.user);
    
    //this is the chkkey for all the queues/alerts - this IS different per queue/alert
    //chkkey is always stored in station - menumber + <queue/alert specific key>
    this.aazerostock.forEach(x => { 
      if (form.controls[x.ZERO_STOCK_STATION].value) { 
        stations.push(x.ZERO_STOCK_STATION);
      }
    });

    let zStockReq = new CommentReq();
    zStockReq.PLANNER_NAME = this.user.display_name;
    zStockReq.Comment = form.value.txtComment; //form.controls.txtComment.value;
    zStockReq.MENumber = this.meRule.ME_PART_NUMBER;
    zStockReq.REVIEW_REASON = "Zero Stock";
    zStockReq.STATIONS = stations;

    //if (form.controls.txtComment.value.length)
    if (form.value.txtComment.length)
      this.plannerService.insertPQZeroStockComments(zStockReq)
        .subscribe(result => {
          this.blnShowHideComment = !this.blnShowHideComment;
          return this.resp = result;
        });
    
    const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
    pauseCounter.subscribe(n => {
      //form.controls.txtComment.reset("");
      // this.showHideComments();
      form.value.Dash8Comment = "";
      this.pqzerostock$ = null;
      //this.meRule.ME_PART_NUMBER = "";
      this.keyword = "";
      this.availstockdc = "";
      this.nonAllocSta = "";
      this.overstocksta = "";
      this.setMeRule(this.meRule);
    });
  }

  dropMENumber(menumber: string) {
      if (menumber) { 
        this.plannerService.dropOffPQZeroStock(menumber).subscribe(result => { //, zStockReq.REVIEW_REASON, zStockReq.STATIONS
          return this.resp = result;
        });
        this.dropOffNotify(menumber);
        let updatepqmasterreq = new UpdatePqMasterReq();
        updatepqmasterreq.MENumber = menumber;
        updatepqmasterreq.REVIEW_REASON = "Zero Stock";
        this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
          // this.showHideComments();

          this.pqzerostock$ = null;
          this.meRule.ME_PART_NUMBER = '';
          this.keyword = '';
          this.plannerService.refreshPlannerCountNeeded$;
          return this.resp = result;
        });
      }
   }

  openHistory(station: string, reviewReason: string) { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: this.meRule.ME_PART_NUMBER, station: station, reviewReason: reviewReason }

    let dialogRef = this.dialog.open(
      CommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.setMeRule(this.meRule);
      this.dialogValue = result.data;
    });
  }

  ngOnDestroy() { 
    this.revReasonQueues$ = [];
    this.revReasonAlerts$ = [];
  }

  dropOffNotify(menumber) {
    this.snackBar.open(menumber + ' was dropped successfully.', 'Close', {
      duration: 3000
    });
  }
}

// function jQuery(arg0: string): HTMLInputElement[] {
//   throw new Error('Function not implemented.');
// }
