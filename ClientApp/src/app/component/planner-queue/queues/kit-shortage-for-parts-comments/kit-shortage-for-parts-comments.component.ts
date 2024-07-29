import { UserService } from './../../../../service/user.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from 'src/app/service/planner.service';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { KitShortageByPartsComment } from '../../../../models/kit-shortage-by-parts-comment';
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
  selector: 'app-kit-shortage-for-parts-comments',
  templateUrl: './kit-shortage-for-parts-comments.component.html',
  styleUrls: ['./kit-shortage-for-parts-comments.component.css']
})
export class KitShortageForPartsCommentsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public kitshortparts$: Observable<KitShortageByPartsComment[]>;
  public akitshortparts: KitShortageByPartsComment[];
  public meRule = new MeNumberRule();
  public keyword: string;
  public meNumber: string;
  index: number;
  resp: any;
  plannerName: string = "";
  disableDropOff: boolean = true;
  allBtnStatus: boolean = false;

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
    // this.disableDropOff = false;
    this.index = 0;

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
              if(data.Rule == "Kit Shortage by Parts")
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
    this.kitshortparts$ = this.plannerService.getPQKitShortageByPartsCommentByME(this.meRule.ME_PART_NUMBER)
    
    this.kitshortparts$.subscribe(x => {
      this.akitshortparts = x;
      x.forEach(y => {
        this.keyword = y.ME_KIT_DESCRIPTION;
        if (y.COMM == 'YES')
          yesCount += 1;
      });

      if (this.akitshortparts.length == yesCount)
        this.disableDropOff = false;
      else
        this.disableDropOff = true;
    });
    this.getNotifications(valObj);
  }

  onSubmit(form: NgForm) {
    let stations: string[] = [];
    
    this.akitshortparts.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        stations.push(x.CHKKEY);
      }
    });

    let KitShortageByPartsReq = new CommentReq();
    KitShortageByPartsReq.PLANNER_NAME = this.user.display_name;  //*** LOGGED IN PERSON WORKING ON THIS PART ****
    KitShortageByPartsReq.Comment = form.controls.txtComment.value;
    KitShortageByPartsReq.MENumber = this.meRule.ME_PART_NUMBER;
    KitShortageByPartsReq.REVIEW_REASON = "Kit Shortage by Parts";
    KitShortageByPartsReq.TOGGLESTATUS = [];
    KitShortageByPartsReq.REVIEWDATE = [];
    KitShortageByPartsReq.STATIONS = stations;

    if (form.controls.txtComment.value.length)
      this.plannerService.insertPQKitShortageForPartsComments(KitShortageByPartsReq)
        .subscribe(result => {
          // this.showHideComments();
          return this.resp = result;
        });
    
    // if (form.controls.chkDrop.value) {
    //   this.plannerService.dropOffPQKitShortageForParts(KitShortageByPartsReq.MENumber)
    //     .subscribe(result => { //, zStockReq.REVIEW_REASON, zStockReq.STATIONS
    //       return this.resp = result;
    //   });
    
    //   let updatepqmasterreq = new UpdatePqMasterReq();
    //   updatepqmasterreq.MENumber = this.meRule.ME_PART_NUMBER;
    //   updatepqmasterreq.REVIEW_REASON = KitShortageByPartsReq.REVIEW_REASON
    //   this.plannerService.updatePQMaster(updatepqmasterreq)
    //     .subscribe(result => {
    //       return this.resp = result;
    //   });
    // }
        
    const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
    pauseCounter.subscribe(n => {
      // this.showHideComments();
      form.controls.txtComment.reset("");
      this.kitshortparts$ = null;
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

  //meRule.ME_PART_NUMBER, ksp.STA_BUILD, ksp.STA_FOR, ksp.ME_PART_NUMBER_IN_KIT, 'Kit Shortage by Parts'
  openHistory(menumber: string, buildStation: string, forStation: string, menumberInKit: string, reviewReason: string) { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, buildStation: buildStation, forStation: forStation, menumberInKit: menumberInKit, reviewReason: reviewReason }

    let dialogRef = this.dialog.open(
      CommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.setMeRule(this.meRule);
      this.dialogValue = result.data;
    });
  }

  // showHideComments() {
  //   this.blnShowHideComment = !this.blnShowHideComment;
  // }

  dropMENumber(menumber: string) {
    if (menumber) { 
      this.plannerService.dropOffPQPartShortageForKit(menumber).subscribe(result => {
        return this.resp = result;
      });
  
      let updatepqmasterreq = new UpdatePqMasterReq();
      updatepqmasterreq.MENumber = menumber;
      updatepqmasterreq.REVIEW_REASON = "Kit Shortage by Parts";
      this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
        // this.showHideComments();
        this.dropOffNotify(menumber);
        this.kitshortparts$ = null;
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
