import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { Observable, timer, Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from 'src/app/service/planner.service';
import { OutStationBalancingAlert } from '../../../../models/out-station-balancing-alert';
import { CommentReq } from 'src/app/models/comment-req';
import { UpdatePqMasterReq } from 'src/app/models/update-pq-master-req';
import { UnderStationBalancingAlert } from 'src/app/models/under-station-balancing-alert';
import { UserService } from './../../../../service/user.service';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentHistoryComponent } from '../../comment-history/comment-history.component';
import { User } from 'src/app/models/user';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;

@Component({
  selector: 'app-out-station-balancing-alert',
  templateUrl: './out-station-balancing-alert.component.html',
  styleUrls: ['./out-station-balancing-alert.component.css']
})
export class OutStationBalancingAlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public outmainst$: Observable<OutStationBalancingAlert[]>;
  public aoutmainst: OutStationBalancingAlert[];
  public understations$: Observable<OutStationBalancingAlert[]>;
  public underst$: Observable<UnderStationBalancingAlert[]>;
  public aundermainst: UnderStationBalancingAlert[];
  public meRule = new MeNumberRule();
  public keyword: string;
  resp: any;
  plannerName: string = "";
  disableDropOff: boolean = false;
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
    this.disableDropOff = false;

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
              if(data.Rule == "OutStation Balancing")
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
      // console.log('queues returned:' + result.length);
      this.revReasonQueues$ = result;
    });
    this.plannerService.getReviewReasonAlertsByMeNumber(data.ME_PART_NUMBER)
        .subscribe(result => { 
          // console.log('alerts returned:' + result.length);
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
    this.outmainst$ = this.plannerService.getPQOutStationBalancingAlertByME(this.meRule.ME_PART_NUMBER);
    this.underst$ = this.plannerService.getPQUnderStationBalancingAlertByME(this.meRule.ME_PART_NUMBER);

    this.outmainst$.subscribe(x => {
      this.aoutmainst = x;
      x.forEach(y => {
        this.keyword = y.KEYWORD_DESCRIPTION;
        if (y.COMM == 'YES')
          yesCount += 1;
      });
    });

    this.underst$.subscribe(x => {
      this.aundermainst = x;
      x.forEach(y => {
        if (y.COMM == 'YES')
          yesCount += 1;
      });
      
      if ((this.aundermainst.length + this.aoutmainst.length) == yesCount)
        this.disableDropOff = false;
      else
        this.disableDropOff = true;
    });
    this.getNotifications(valObj);
   }

  onSubmit(form: NgForm) {
    //console.log(form.value);

    let stations: string[] = [];
    let underStations: string[] = [];
    
    this.aoutmainst.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        stations.push(x.CHKKEY);
      }
    });

    //console.log(stations);
    let outStockStationAlertReq = new CommentReq();
    outStockStationAlertReq.PLANNER_NAME = this.user.display_name; 
    outStockStationAlertReq.Comment = form.controls.txtComment.value;
    outStockStationAlertReq.MENumber = this.meRule.ME_PART_NUMBER;
    outStockStationAlertReq.REVIEW_REASON = "Outstation Balancing";
    outStockStationAlertReq.STATIONS = stations;

    this.aundermainst.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        underStations.push(x.CHKKEY);
      }
    });

    let underStockStationAlertReq = new CommentReq();
    underStockStationAlertReq.PLANNER_NAME = this.user.display_name; 
    underStockStationAlertReq.Comment = form.controls.txtComment.value;
    underStockStationAlertReq.MENumber = this.meRule.ME_PART_NUMBER;
    underStockStationAlertReq.REVIEW_REASON = "Outstation Balancing";
    underStockStationAlertReq.STATIONS = underStations;

    if (form.controls.txtComment.value.length) { 
      if (stations.length > 0)
        this.plannerService.insertPQAlert(outStockStationAlertReq)
          .subscribe(result => { 
            return this.resp = result;
          });
      
      if (underStations.length > 0)
        this.plannerService.insertPQAlert(underStockStationAlertReq)
        .subscribe(result => { 
          return this.resp = result;
        });
    }
  
      // if (form.controls.chkDrop.value) {
      //   this.plannerService.dropOffPQOutStockStationReqAlert(outStockStationAlertReq.MENumber)
      //     .subscribe(result => {
      //     return this.resp = result;
      //     });
        
      //     this.plannerService.dropOffPQUnderStockStationReqAlert(underStockStationAlertReq.MENumber)
      //     .subscribe(result => {
      //     return this.resp = result;
      //     });
        
      //     let updatepqmasterreq = new UpdatePqMasterReq();
      //     updatepqmasterreq.MENumber = this.meRule.ME_PART_NUMBER;
      //     updatepqmasterreq.REVIEW_REASON = outStockStationAlertReq.REVIEW_REASON
      //     this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
      //       return this.resp = result;
      //     });
      //     //let updatepqmasterreq = new UpdatePqMasterReq();
      //     updatepqmasterreq.MENumber = this.meRule.ME_PART_NUMBER;
      //     updatepqmasterreq.REVIEW_REASON = underStockStationAlertReq.REVIEW_REASON
      //     this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
      //       return this.resp = result;
      //     });
      // }
    
      const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
      pauseCounter.subscribe(n => {
        // this.showHideComments();
          form.controls.txtComment.reset("");
          this.outmainst$ = null;
          this.underst$ = null;
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

  openHistory(menumber: string, station: string, type: string, reviewReason: string) { 

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, station: station, type: type, reviewReason: reviewReason }

    let dialogRef = this.dialog.open(
      CommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      // console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.setMeRule(this.meRule);
      this.dialogValue = result.data;
    });
  }
  
dropMENumber(menumber: string) {
  if (menumber) { 
    this.plannerService.dropOffPQOutStockStationReqAlert(menumber).subscribe(result => {
      return this.resp = result;
    });

    let updatepqmasterreq = new UpdatePqMasterReq();
    updatepqmasterreq.MENumber = menumber;
    updatepqmasterreq.REVIEW_REASON = "OutStation Balancing";
    this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
      // this.showHideComments();
      this.dropOffNotify(menumber);
      this.outmainst$ = null;
      this.underst$ = null;
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
