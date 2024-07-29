import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable, timer, Subscription  } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from 'src/app/service/planner.service';
import { UserService } from 'src/app/service/user.service';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { NgForm, FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CommentReq } from '../../../../models/comment-req';
import { UpdatePqMasterReq } from './../../../../models/update-pq-master-req';
import { ReviewReasonNotification } from 'src/app/models/review-reason-notification';
import { MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/button-toggle';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CommentHistoryComponent } from '../../comment-history/comment-history.component';
import { ScrapsPqComments } from 'src/app/models/scraps-pq-comments';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'src/app/component/planner-queue/date-formats/date-formats.component';
import * as moment from 'moment';
import { User } from 'src/app/models/user';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $: any;

@Component({
  selector: 'app-scraps-comments',
  templateUrl: './scraps-comments.component.html',
  styleUrls: ['./scraps-comments.component.css'],
})
  

export class ScrapsCommentsComponent implements OnInit, OnDestroy {
  
  private subscription: Subscription;
  public scraps$: Observable<ScrapsPqComments[]>;
  public scraps: ScrapsPqComments[];
  public scrapslength: ScrapsPqComments[];
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
  scrapControls: FormGroup;
  _scrapRadio: FormArray;
  scrapjsonarray: Array<{ id: number, status: string }> = [];
  finalscrapjsonarray: Array<{ id: number, status: string }> = [];
  scrapjsonStr = '{"scrapvalues":[]}';
  reviewDateValue: Array<{ id: number, reviewdate: string }> = [];
  finalReviewDateValue: Array<{ id: number, reviewdate: string }> = [];
  reviewDatejsonStr = "";
  disableSave: boolean = true;
  updatedVal: ScrapsPqComments;
  hideLoading: boolean = true;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };

  reviewDate = new FormControl({ value: moment().format('YYYY-MM-DD') });
  minDate = moment().add(-30, 'days');
  maxDate = moment().add(30, 'days');

  //@ViewChild('f', null) f: NgForm;
  
  constructor(
    private route: ActivatedRoute,
    private plannerService: PlannerService,
    private userService: UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<any>
    // private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.fetchData();
  }


  fetchData() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    this.scraps$ = null;
    this.scrapjsonarray = [];
    this.reviewDateValue = [];
    this.disableDropOff = true;
    // this.scrapControls = new FormGroup({
    //   reviewDate: new FormControl()
    // });

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
              if (data.Rule == "Scraps")
                this.setMeRule(data);
          })
        }
      })
  }

  get def() {
    return this.scrapControls.controls;
  }

  get fcebds() {
    return this.def.scrapstatus as FormArray;
  }

  toggleGroupChanged(rec: number, statusval: string) {
    let scrapModelData = { "id": rec, "status": statusval };
    if (this.scrapjsonarray.find(x => x.id == rec) !== undefined) {
      let index = this.scrapjsonarray.findIndex(((obj => obj.id == rec)));
      this.scrapjsonarray[index] = { id: rec, status: statusval };
    }
    else {
      scrapModelData.toString().replace('id', '"id"').replace('status', '"status"');
      this.scrapjsonarray.push(scrapModelData);
    }

    if (this.scrapjsonarray.every(x => x.status === "PO Placed" || x.status === "Opted Not To Replace"))
      this.disableDropOff = false;
    else
      this.disableDropOff = true;

    // if (this.scrapjsonarray.length > 0)
    //   this.disableSave = false;
    // else
    //   this.disableSave = true;
    
    // if (this.scrapjsonarray.some(x => x.status === "PO Placed" || x.status === "Opted Not To Replace"))
    //   this.disableDropOff = false;
    // else
    //   this.disableDropOff = true;
  }

  // reviewDateChanged(recordid: number, event: any) {
  //   let reviewDateModelData = { "id": recordid, "reviewdate": moment(event.target.value).format("YYYY-MM-DD") };
  //   if (this.reviewDateValue.find(x => x.id == recordid) !== undefined) {
  //     let index = this.reviewDateValue.findIndex(((obj => obj.id == recordid)));
  //     reviewDateModelData.toString().replace('id', '"id"').replace('reviewdate', '"reviewdate"');
  //     this.reviewDateValue[index] = { "id": recordid, "reviewdate": moment(event.target.value).format("YYYY-MM-DD") };        
  //   }
  //   else {
  //     reviewDateModelData.toString().replace('id', '"id"').replace('reviewdate', '"reviewdate"');
  //     this.reviewDateValue.push(reviewDateModelData);
  //   }
  //   if (this.reviewDateValue.length > 0)
  //     this.disableSave = false;
  //   else
  //     this.disableSave = true;
  // }

  setMeRule(valObj: MeNumberRule) {
    let yesCount = 0;
    this.meRule = valObj;
    this.disableDropOff = this.meRule.DisableStatus;
    this.scrapjsonarray = [];

    this.hideLoading = false;
    this.scraps$ = this.plannerService.getAllScrapsByMEComments(this.meRule.ME_PART_NUMBER);

    this.plannerService.setAtaPlannerComments(true);  
      
    this.scraps$.subscribe(x => {
      this.scraps = x;
      this.scrapslength = x;
      
      x.forEach(y => {
        this.scrapjsonarray.push({ id: + y.RecordID, status: (y.STATUS) ? y.STATUS.toString() : "" })
        //this.reviewDateValue.push({"id": + y.RecordID, "reviewdate": y.Review_Date ? y.Review_Date.toString() : ""})
        // let index = 0;
        // if (index == 0) {
        //   if (this.scrapjsonarray.some(x => x.status === "PO Placed" || x.status === "Opted Not To Replace"))
        //     this.disableDropOff = false;
        //   else
        //     this.disableDropOff = true;
        //   index++;
        // }

        if (this.scrapjsonarray.every(x => x.status === "PO Placed" || x.status === "Opted Not To Replace"))
          this.disableDropOff = false;
        else
          this.disableDropOff = true;
        
        this.keyword = y.KEYWORD_DESCRIPTION;
        if (y.COMM == 'YES')
          yesCount += 1;
      });
    });

    this.getNotifications(valObj);
    this.blnShowPlannerComment = this.plannerService.getAtaPlannerComments();
  }

  selectAllChkkey() {
    $('input[type="checkbox"]').prop('checked', this.allBtnStatus).click();
    this.allBtnStatus = !this.allBtnStatus;
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

  onSubmit(form: NgForm) {
    let stations: string[] = [];
    
    this.scraps.forEach(x => { 
      if (form.controls[x.CHKKEY].value == true) { 
        stations.push(x.CHKKEY);
      }
    });

    let scrapsReq = new CommentReq();
    scrapsReq.PLANNER_NAME = this.user.display_name;
    scrapsReq.Comment = form.controls.txtComment.value;
    scrapsReq.MENumber = this.meRule.ME_PART_NUMBER;
    scrapsReq.REVIEW_REASON = "Scraps";
    scrapsReq.STATIONS = stations;
    scrapsReq.TOGGLESTATUS = this.scrapjsonarray;
    scrapsReq.TOGGLESTATUS.forEach(x => {
      if (x.status != "") {
        this.finalscrapjsonarray.push(x);
      }
    });
    scrapsReq.TOGGLESTATUS = this.finalscrapjsonarray;
    scrapsReq.REVIEWDATE = this.reviewDateValue;

    scrapsReq.REVIEWDATE.forEach(x => {
      if (x.reviewdate != "")
        this.finalReviewDateValue.push(x);
    });
    scrapsReq.REVIEWDATE = this.finalReviewDateValue;
    this.plannerService.insertPQAlert(scrapsReq)
      .subscribe(result => { 
        return this.resp = result;
      });
     
    const pauseCounter = timer(3000);  //todo catch errors and show saving overlay
    pauseCounter.subscribe(n => {
      this.showHideComments();
      form.controls.txtComment.reset("");
      this.scraps$ = null;
      this.scrapjsonarray = [];
      this.reviewDateValue = [];
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
      this.plannerService.dropOffPQScrapsReqAlert(menumber).subscribe(result => {
        return this.resp = result;
      });

      let updatepqmasterreq = new UpdatePqMasterReq();
      updatepqmasterreq.MENumber = menumber;
      updatepqmasterreq.REVIEW_REASON = "Scraps";
      this.plannerService.updatePQMaster(updatepqmasterreq).subscribe(result => {
        this.showHideComments();
        this.dropOffNotify(menumber);
        this.meRule.ME_PART_NUMBER = '';
        this.keyword = '';
        this.plannerService.refreshPlannerCountNeeded$;
        this.plannerService.refreshNeeded$;
        this.scrapjsonarray = [];
        let yesCount = 0;
        this.scraps$ = this.plannerService.getAllScrapsByMEComments(this.meRule.ME_PART_NUMBER);
     
        this.scraps$.subscribe(x => {
          this.scraps = x;

          x.forEach(y => {
            this.scrapjsonarray.push({ id: + y.RecordID, status: (y.STATUS) ? y.STATUS.toString() : "" })
            let index = 0;
            if (index == 0) {
              if (this.scrapjsonarray.some(x => x.status === "PO Placed" || x.status === "Opted Not To Replace"))
                this.disableDropOff = false;
              else
                this.disableDropOff = true;
              index++;
            }
         
            this.keyword = y.KEYWORD_DESCRIPTION;
            if (y.COMM == 'YES')
              yesCount += 1;
          });
          this.blnShowPlannerComment = false;
          return this.resp = result;
        });
      }
      )
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
