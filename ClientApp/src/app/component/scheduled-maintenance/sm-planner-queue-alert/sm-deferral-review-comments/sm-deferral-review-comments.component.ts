import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';
import { SmQueueRule } from 'src/app/models/sm-queue-rule';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { UpdateSmPqMasterReq } from 'src/app/models/update-sm-pq-master-req';
import { DropSmMeNumberUsedReq } from 'src/app/models/drop-sm-me-number-used-req';
import { SmPlannerCommentHistoryComponent } from '../sm-planner-comment-history/sm-planner-comment-history.component';
import { SmQueueCommentReq } from 'src/app/models/sm-queue-comment-req';
import { User } from 'src/app/models/user';
import { SmDeferralReviewComments } from 'src/app/models/sm-deferral-review-comments';

declare var $: any;
@Component({
  selector: 'app-sm-deferral-review-comments',
  templateUrl: './sm-deferral-review-comments.component.html',
  styleUrls: ['./sm-deferral-review-comments.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class SmDeferralReviewCommentsComponent implements OnInit {
  public newSmObj = new SmQueueRule();
  comment_detail_displayedColumns: string[] = ['WCNUMBER', 'REQ_PART_NUMBER', 'PART_DESC', 'QTY', 'REQ_IND', 'DEFREASON', 'ROOT_CAUSE_ASSIGNED', 'MODDATE', 'STATUS', 'CHEKEY', 'CHKKEY'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  color = 'primary';
  newComment: string = "";
  form: FormGroup;
  btnOk: string = "SAVE";
  btnDrop: string = "DROP";
  selectedMeNumUsed: string[] = [];
  dropBtnStatus: boolean = false;
  nextReviewDate = new FormControl(moment().add(14, 'days').format('YYYY-MM-DD'));
  minDate = moment().add(1, 'days');
  maxDate = moment().add(90, 'days');
  dialogValue: string;
  resp: any;
  allBtnStatus: boolean = false;
  smRule: string;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "" , role:"" };
  // deferralData: SmDeferralReviewComments[] = [{ "WCNUMBER": "", "PART_DESC": "", "QTY": 0, "REQ_IND": "", "REVIEWED_DEFERRAL_CODE": "", "MODDATE": "", STATUS: "", "CHEKEY": "", "CHKKEY": "", "ROOT_CAUSE_ASSIGNED": "", "DEFREASON": "" }];
  hideLoading: boolean = true;
  deferralDash8: string = "";

  constructor(
    private fb: FormBuilder,
    private smPlannerQueueService: SmPlannerQueueService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      taComment: new FormControl('')
    });
  }

  ngOnInit() {
    this.fetchData(); 
  }

  fetchData() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;

    this.smPlannerQueueService.getSmQueueRule()
      .subscribe(data => {
        if (data) {
          this.newSmObj.DASH_8 = data.DASH_8;
          this.newSmObj.REQ_PART_NUMBER = data.REQ_PART_NUMBER;
          this.newSmObj.FLEET = data.FLEET;
          this.newSmObj.RULE = data.RULE;
          this.newSmObj.PLANNER = this.user.display_name;
          this.newSmObj.SHOWCOMMENTSECTION = data.SHOWCOMMENTSECTION;
          this.newSmObj.ME_PART_NUMBER_USED = data.ME_PART_NUMBER_USED;
          this.newSmObj.STATION = data.STATION;
          this.newSmObj.AIRCRAFT = data.AIRCRAFT;
          
          this.smPlannerQueueService.refreshNeeded$
            .subscribe(() =>
              this.getDeferralReviewDetailById(data.DASH_8, data.STATION, data.AIRCRAFT));
          
          this.getDeferralReviewDetailById(data.DASH_8, data.STATION, data.AIRCRAFT);          
        }        
      });  
  }

  setSmRule(valObj: SmQueueRule) {
    this.smRule = valObj.RULE;
    this.newSmObj.DASH_8 = valObj.DASH_8;
    this.smPlannerQueueService.getDeferralReviewDetailById(valObj.DASH_8, valObj.STATION, valObj.AIRCRAFT)
      .subscribe(data => {
        this.datasource = new MatTableDataSource(data);
        //this.datasource.sort = this.sort;
    });
  }
  
  private getDeferralReviewDetailById(dash8: string, station: string, aircraft: string, orderby?: string, sorttype?: string) {
    this.hideLoading = false;
    this.datasource = null;
    this.smPlannerQueueService.getDeferralReviewDetailById(dash8, station, aircraft) 
      .subscribe(data => {
        data.forEach(x => {
          if (x.CHKKEY == null) {
            this.dropBtnStatus = true;
          }
          else { 
            this.dropBtnStatus = false;
          }
          x.CHKKEY = dash8; //set dash8 on all results
          this.deferralDash8 = dash8 + ",";
          this.newSmObj.DASH_8 = dash8;
          //this.deferralData.push({ CHEKEY: x.CHEKEY, CHKKEY: x.CHKKEY, DEFREASON: x.DEFREASON, MODDATE: x.MODDATE, PART_DESC: x.PART_DESC, QTY: x.QTY, REQ_IND: x.REQ_IND, REVIEWED_DEFERRAL_CODE: x.REVIEWED_DEFERRAL_CODE, ROOT_CAUSE_ASSIGNED: x.ROOT_CAUSE_ASSIGNED, STATUS: x.STATUS, WCNUMBER: x.WCNUMBER });
        });
        let temp: MatTableDataSource<any>; 
        temp = new MatTableDataSource(data);
        this.datasource = temp;
        this.hideLoading = true;
    });
  }

  updateSelected(chkeyVal, value) {
    switch (value.checked) {
      case true:
        this.selectedMeNumUsed.push(chkeyVal);
        break;
      case false:
        this.selectedMeNumUsed.splice(this.selectedMeNumUsed.indexOf(chkeyVal), 1);
        break;
     }
    // console.log(this.selectedMeNumUsed.toString());
  }

  sortCommentSection(event: Sort) { 
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.smPlannerQueueService.getDeferralReviewDetailById(this.newSmObj.DASH_8, this.newSmObj.STATION, this.newSmObj.AIRCRAFT, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
    });
  }

  saveComment() { 
    if (this.form.value.taComment.trim().length == 0)
      return;
    
    if (this.selectedMeNumUsed.toString().length > 0) {
      let req = new SmQueueCommentReq();
      req.CHKKEY = this.newSmObj.DASH_8;
      req.COMMENT = this.form.value.taComment;
      req.CURRENT_USER = this.user.display_name;
      req.PLANNER = this.user.display_name;
      req.REVIEW_REASON = this.newSmObj.RULE;
      //req.NEXTREVIEWDATE = this.nextReviewDate.value;
      this.hideLoading = false;

      this.smPlannerQueueService.insertSMPQComments(req)
        .subscribe(result => {
          this.nextReviewDate.reset;
          this.form.controls.taComment.setValue("");
          this.selectedMeNumUsed = [];
          this.dropBtnStatus = false;
          this.smPlannerQueueService.refreshNeeded$;
          this.hideLoading = true;
          return this.resp = result;
        });
    }
  }

  saveDeferralComment() { 
    if (this.form.value.taComment.trim().length == 0)
      return;
    if (this.selectedMeNumUsed.toString().length > 0) {
      let req = new SmQueueCommentReq();
      req.CHKKEY = this.deferralDash8.substring(0, this.deferralDash8.length - 1);
      req.COMMENT = this.form.value.taComment;
      req.CURRENT_USER = this.user.display_name;
      req.PLANNER = this.user.display_name;
      req.REVIEW_REASON = this.newSmObj.RULE;

      this.hideLoading = false;
      this.smPlannerQueueService.insertSMDeferralPQComments(req)
        .subscribe(result => {
          this.nextReviewDate.reset;
          this.form.controls.taComment.setValue("");
          this.selectedMeNumUsed = [];
          this.dropBtnStatus = false;
          this.smPlannerQueueService.refreshNeeded$;
          this.hideLoading = true;
          return this.resp = result;
        });
      }
  }

  dropSelectedMenused(mepartnumberused: string) {
    if (mepartnumberused) { 
      let req = new DropSmMeNumberUsedReq();
      req.DASH_8 = mepartnumberused;
      req.NEXT_REVIEW_DATE = this.nextReviewDate.value;
      req.REVIEW_REASON = this.newSmObj.RULE;
      req.STATION = this.newSmObj.STATION;
      req.AIRCRAFT = this.newSmObj.AIRCRAFT;

      this.hideLoading = false;
      this.smPlannerQueueService.dropOffSMPQDash8(req).subscribe(result => {
        this.hideLoading = true;
        return this.resp = result;
      });
  
      let updatepqmasterreq = new UpdateSmPqMasterReq();
      updatepqmasterreq.ME_PART_NUMBER_USED = mepartnumberused;
      updatepqmasterreq.REVIEW_REASON = "DEFERRAL REVIEW";
      updatepqmasterreq.REQ_PART_NUMBER = this.newSmObj.REQ_PART_NUMBER;
      updatepqmasterreq.STATION = this.newSmObj.STATION;
      updatepqmasterreq.AIRCRAFT = this.newSmObj.AIRCRAFT;
      
      // this.hideLoading = false;
      this.smPlannerQueueService.updateSMPQMaster(updatepqmasterreq)
        .subscribe(result => {
          this.dropOffNotify(mepartnumberused);
          this.datasource = null;
          this.dropBtnStatus = false;
          this.newSmObj.DASH_8 = "";
          // this.smPlannerQueueService.getDeferralReviewDetailById(mepartnumberused, this.newSmObj.STATION, this.newSmObj.AIRCRAFT)
          //   .subscribe(data => { 
          //     this.datasource = new MatTableDataSource(data);
          //     this.hideLoading = true;
          //     //this.datasource.sort = this.sort;
          //   });
          // this.meRule.ME_PART_NUMBER = '';
          // this.keyword = '';
          this.smPlannerQueueService.refreshCountNeeded$;
          this.smPlannerQueueService.refreshNeeded$;
          return this.resp = result;
        });
    }
  }

  openHistory(chkkey: string) { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, type: this.newSmObj.RULE, dash8: chkkey.substr(0, 14), mepartnumberused: chkkey.substr(14, 14), chkkey: chkkey, station: this.newSmObj.STATION, aircraft: this.newSmObj.AIRCRAFT };

    let dialogRef = this.dialog.open(
      SmPlannerCommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      //this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
      this.dialogValue = result.data;
    });
  }

  selectAllChkkey() {
    $('input[type="checkbox"]').prop('checked', this.allBtnStatus).click();
    this.allBtnStatus = !this.allBtnStatus;
  }

  dropOffNotify(mepartnumberused) {
    this.snackBar.open(mepartnumberused + ' was dropped successfully.', 'Close', {
      duration: 3000
    });
  }   

}
