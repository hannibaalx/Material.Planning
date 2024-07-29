
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { Observable, timer, Subscription } from 'rxjs';
import { UsageNoAllocationAlert } from '../../../../models/usage-no-allocation-alert';
import { ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from 'src/app/service/planner.service';
import { UpdatePqMasterReq } from 'src/app/models/update-pq-master-req';
import { CommentReq } from 'src/app/models/comment-req';
import { UserService } from './../../../../service/user.service';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentHistoryComponent } from '../../comment-history/comment-history.component';
import { User } from 'src/app/models/user';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;
@Component({
  selector: 'app-usage-no-allocation-alert',
  templateUrl: './usage-no-allocation-alert.component.html',
  styleUrls: ['./usage-no-allocation-alert.component.css']
})
export class UsageNoAllocationAlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public usageall$: Observable<UsageNoAllocationAlert[]>;
  public ausageall: UsageNoAllocationAlert[];
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
        if (params['id'] && params['sta']) {
          this.meRule.ME_PART_NUMBER = params['id'];
          this.meRule.Station = params['sta'];
          this.setMeRule(this.meRule);
        }
        else {
          if (params['id']) {
            this.meRule.ME_PART_NUMBER = params['id'];
            this.meRule.Rule = "Usage and No Allocation";
            this.setMeRule(this.meRule);
          }
          else {
            this.plannerService.getMeNumber().subscribe(data => {
              this.meRule = data;
              if (data !== undefined)
                if(data.Rule == "Usage and No Allocation")
                  this.setMeRule(data);
            })
          }
        }
      })
    // this.subscription = this.route.params.subscribe(
    //   (params: Params) => {
    //     if (params['id'] && params['sta']) {
    //       this.meRule.ME_PART_NUMBER = params['id'];
    //       this.meRule.Station = params['sta'];
    //       this.setMeRule(this.meRule);
    //       this.getNotifications(this.meRule);
    //     }
    //     else {
    //       //this.plannerService.clearMeNumber();
    //       this.plannerService.getMeNumber().subscribe(data => {
    //         this.meRule = data;
    //         if (data !== undefined) {
    //           if (data.Rule == "Usage and No Allocation") {
    //             if (params['sta'] !== undefined)
    //               data.Station = null;
    //             this.setMeRule(data);
    //           }
    //         }
    //       });
    //       if (this.meRule != null) {
    //         let val = new MeNumberRule();
    //         val.Rule = "Usage and No Allocation";
    //         val.ME_PART_NUMBER = params['id'];
    //         this.setMeRule(val);
    //       }          
    //     }
    //   })
  }

  getNotifications(data: MeNumberRule) {
    this.revReasonQueues$ = [];
    this.revReasonAlerts$ = [];
    this.hideLoading = false;
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
    if (this.meRule.Station)
      this.usageall$ = this.plannerService.getPQUsageNoAllocAlertByME(this.meRule.ME_PART_NUMBER, this.meRule.Station);
    else 
      this.usageall$ = this.plannerService.getPQUsageNoAllocAlertByME(this.meRule.ME_PART_NUMBER, '');

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
    this.hideLoading = true;
    this.getNotifications(valObj);
    // this.plannerService.getAtaPlannerComments()
    //   .subscribe(data => {
    //     console.log(data);
    //     this.blnShowPlannerComment = true;
    // })
    
    //this.blnShowPlannerComment = true;
    this.blnShowPlannerComment = this.plannerService.getAtaPlannerComments();
   }

  onSubmit(form: NgForm) {
    let stations: string[] = [];
    
    this.ausageall.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        stations.push(x.CHKKEY);
      }
    });

    let usageNoAllocationAlertReq = new CommentReq();
    usageNoAllocationAlertReq.PLANNER_NAME = this.user.display_name;
    usageNoAllocationAlertReq.Comment = form.controls.txtComment.value;
    usageNoAllocationAlertReq.MENumber = this.meRule.ME_PART_NUMBER;
    usageNoAllocationAlertReq.REVIEW_REASON = "Usage and No Allocation";
    usageNoAllocationAlertReq.TOGGLESTATUS = [];
    usageNoAllocationAlertReq.REVIEWDATE = [];
    usageNoAllocationAlertReq.STATIONS = stations;

    if (form.controls.txtComment.value.length)
      this.plannerService.insertPQAlert(usageNoAllocationAlertReq)
        .subscribe(result => { 
          return this.resp = result;
        });
  
      // if (form.controls.chkDrop.value) {
      //   this.plannerService.dropOffPQUsageNoAllocReqAlert(usageNoAllocationAlertReq.MENumber)
      //     .subscribe(result => {
      //     return this.resp = result;
      //     });
        
      //     let updatepqmasterreq = new UpdatePqMasterReq();
      //     updatepqmasterreq.MENumber = this.meRule.ME_PART_NUMBER;
      //     updatepqmasterreq.REVIEW_REASON = usageNoAllocationAlertReq.REVIEW_REASON
      //     this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
      //       return this.resp = result;
      //     });
      // }
    
    const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
    pauseCounter.subscribe(n => {
      this.showHideComments();
      form.controls.txtComment.reset("");
      this.usageall$ = null;
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

  openHistory(menumber: string, station: string, transcode: string, transdate: string, reviewReason: string) { 

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, station: station, transcode: transcode, transdate: transdate.toString().replace('/', '-').substring(0, 10), reviewReason: reviewReason }

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
    this.plannerService.dropOffPQUsageNoAllocReqAlert(menumber).subscribe(result => {
      return this.resp = result;
    });

    let updatepqmasterreq = new UpdatePqMasterReq();
    updatepqmasterreq.MENumber = menumber;
    updatepqmasterreq.REVIEW_REASON = "Usage and No Allocation";
    this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
      this.showHideComments();
      this.dropOffNotify(menumber);
      this.usageall$ = null;
      this.usageall$ = this.plannerService.getPQUsageNoAllocAlertByME(this.meRule.ME_PART_NUMBER, this.meRule.Station);
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

