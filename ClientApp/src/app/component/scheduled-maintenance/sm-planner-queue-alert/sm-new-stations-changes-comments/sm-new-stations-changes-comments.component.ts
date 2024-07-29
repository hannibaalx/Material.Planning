import { SmQueueCommentReq } from './../../../../models/sm-queue-comment-req';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { Observable, Subject, timer, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { SmNumberRule } from 'src/app/models/sm-number-rule';
import { ActivatedRoute, Params } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';
import { SmQueueRule } from 'src/app/models/sm-queue-rule';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { UpdateSmPqMasterReq } from 'src/app/models/update-sm-pq-master-req';
import { DropSmMeNumberUsedReq } from 'src/app/models/drop-sm-me-number-used-req';
import { SmPlannerCommentHistoryComponent } from '../sm-planner-comment-history/sm-planner-comment-history.component';
import { SmStationAddedShortageDetailComponent } from '../sm-station-added-shortage-detail/sm-station-added-shortage-detail.component';
import { User } from 'src/app/models/user';

declare var $: any;
@Component({
  selector: 'app-sm-new-stations-changes-comments',
  templateUrl: './sm-new-stations-changes-comments.component.html',
  styleUrls: ['./sm-new-stations-changes-comments.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class SmNewStationsChangesCommentsComponent implements OnInit, OnDestroy {
  public newSmObj = new SmQueueRule();
  comment_detail_displayedColumns: string[] = ['ME_PART_NUMBER_USED', 'KEYWORD_DESCRIPTION', 'AIRCRAFT_COUNT', 'QTY_REQ', 'REQD_IND', 'KIT_IND', 'TTL_OH', 'TTL_PO', 'TTL_RO', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TTL_REQ_90_DAY', 'TTL_REQ_120_DAY', 'TTL_REQ_180_DAY', 'TTL_REQ_365_DAY', 'MATL_STS_ALL', 'CHEKEY', 'CHKKEY']; //'STATION_ADDED_SHORT',
  comment_detail_download_displayedColumns: string[] = ['ME_PART_NUMBER_USED', 'KEYWORD_DESCRIPTION', 'AIRCRAFT_COUNT', 'QTY_REQ', 'REQD_IND', 'KIT_IND', 'TTL_OH', 'TTL_PO', 'TTL_RO', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TTL_REQ_90_DAY', 'TTL_REQ_120_DAY', 'TTL_REQ_180_DAY', 'TTL_REQ_365_DAY','MATL_STS_ALL'];
  datasource: MatTableDataSource<any>;
  datasource_download: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  color = 'primary';
  newComment: string = "";
  form: FormGroup;
  btnOk: string = "SAVE";
  btnDrop: string = "DROP";
  selectedMeNumUsed: string[] = [];
  dropBtnStatus: boolean = false;
  allBtnStatus: boolean = false;
  //nextReviewDate = new FormControl(moment().add(14, 'days').format('YYYY-MM-DD'));
  minDate = moment().add(1, 'days');
  maxDate = moment().add(90, 'days');
  dialogValue: string;
  resp: any;
  subscription: Subscription;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  hideLoading: boolean = true;
  currentDate = moment().format('YYYY-DD-MM hh:mm');
  //filename: string = "";
  filename_download: string = "";

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private smPlannerQueueService: SmPlannerQueueService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      taComment: new FormControl('')
    });

    this.subscription = this.smPlannerQueueService.getSmQueueRule()
      .subscribe(data => {
        if (data) {
          let temp = JSON.parse(localStorage.getItem('userInfo'));
          this.user = temp;
          this.newSmObj.DASH_8 = data.DASH_8;
          this.newSmObj.FLEET = data.FLEET;
          this.newSmObj.RULE = data.RULE;
          this.newSmObj.PLANNER = this.user.display_name;
          this.newSmObj.SHOWCOMMENTSECTION = data.SHOWCOMMENTSECTION;
          this.newSmObj.ME_PART_NUMBER_USED = data.ME_PART_NUMBER_USED;
          this.getNewStationsChangesDetailById(data.DASH_8);
        }
      })  
   }

  ngOnInit() {
    this.newSmObj.RULE = "";
    this.newSmObj.FLEET = "";
    this.newSmObj.DASH_8 = "";

    this.smPlannerQueueService.getSmQueueRule()
      .subscribe(data => {
        if (data) { 
          this.newSmObj.DASH_8 = data.DASH_8;
          this.newSmObj.FLEET = data.FLEET;
          this.newSmObj.RULE = data.RULE;
          //this.newSmObj.PLANNER = data.PLANNER;
          this.newSmObj.SHOWCOMMENTSECTION = data.SHOWCOMMENTSECTION;
          this.newSmObj.ME_PART_NUMBER_USED = data.ME_PART_NUMBER_USED;
          // this.getPartNoLongerUsedDetailById(data.DASH_8);
        }

        this.smPlannerQueueService.refreshNeeded$
          .subscribe(() =>
            this.getNewStationsChangesDetailById(data.DASH_8));
        
        this.getNewStationsChangesDetailById(data.DASH_8);
        
      });
  }


  private getNewStationsChangesDetailById(dash8: string, orderby?: string, sorttype?: string) {
    this.hideLoading = false;
    this.datasource = null;
    this.datasource_download = null;
    this.smPlannerQueueService.getNewStationsChangesDetailById(dash8) 
      .subscribe(data => {
        data.forEach(x => {
          if (x.CHKKEY == null)
            this.dropBtnStatus = true;
        })  
        this.datasource = new MatTableDataSource(data);
        this.datasource_download = new MatTableDataSource(data);
        //this.filename = 'NEW STATIONS CHANGES - ' + this.newSmObj.DASH_8 + ' - ' + this.currentDate;
        this.filename_download = 'NEW STATIONS CHANGES Download Data - ' + this.newSmObj.DASH_8 + ' - ' + this.currentDate;
        console.log(this.filename_download);
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

    this.hideLoading = false;
    this.smPlannerQueueService.getNewStationsChangesDetailById(this.newSmObj.DASH_8, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;
    });
  }

  saveComment() { 
    if (this.form.value.taComment.trim().length == 0)
      return;
    
    if (this.selectedMeNumUsed.toString().length > 0) {
      let req = new SmQueueCommentReq();
      //req.CHKKEY = this.selectedMeNumUsed.toString().trim();
      req.CHKKEY = this.newSmObj.DASH_8;
      req.COMMENT = this.form.value.taComment;
      req.CURRENT_USER = this.user.display_name;
      req.PLANNER = this.user.display_name;
      req.REVIEW_REASON = this.newSmObj.RULE;
      this.hideLoading = false;

      this.smPlannerQueueService.insertSMPQComments(req)
        .subscribe(result => {
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
      req.REVIEW_REASON = this.newSmObj.RULE;
      this.hideLoading = false;

      this.smPlannerQueueService.dropOffSMPQDash8(req).subscribe(result => {
        this.hideLoading = true;
        return this.resp = result;
      });
  
      let updatepqmasterreq = new UpdateSmPqMasterReq();
      updatepqmasterreq.ME_PART_NUMBER_USED = mepartnumberused;
      updatepqmasterreq.REVIEW_REASON = "NEW STATIONS CHANGES";
      this.hideLoading = false;
      this.smPlannerQueueService.updateSMPQMaster(updatepqmasterreq)
        .subscribe(result => {
          this.dropOffNotify(mepartnumberused);
          this.datasource = null;
          this.newSmObj.DASH_8 = "";
          this.smPlannerQueueService.getNewStationsChangesDetailById(this.newSmObj.DASH_8)
          .subscribe(data => { 
            this.datasource = new MatTableDataSource(data);
            this.datasource.sort = this.sort;
          });
          // this.meRule.ME_PART_NUMBER = '';
          // this.keyword = '';
          this.smPlannerQueueService.refreshCountNeeded$;
          this.smPlannerQueueService.refreshNeeded$;
          this.hideLoading = false;
          return this.resp = result;
        });
    }
  }

  openHistory(chkkey: string) { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    // dialogConfig.data = { plannerName: this.user.displayName, type: this.newSmObj.RULE, dash8: this.newSmObj.DASH_8, mepartnumberused: chkkey.substring(14), chkkey: chkkey };
    // This queue is different from the other queues, this queue has the chkkey as the DASH_8 only
    dialogConfig.data = { plannerName: this.user.display_name, type: this.newSmObj.RULE, dash8: this.newSmObj.DASH_8, mepartnumberused: chkkey, chkkey: chkkey };

    let dialogRef = this.dialog.open(
      SmPlannerCommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
      this.dialogValue = result.data;
    });
  }

  openStationAddedShortModal(dash8: string, mepartnumberused: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '850px';
    dialogConfig.maxWidth = '850px';
    dialogConfig.data = { dash8: dash8, mepartnumberused: mepartnumberused };

    let dialogRef = this.dialog.open(
      SmStationAddedShortageDetailComponent, dialogConfig  
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

  ngOnDestroy() { 
    //this.subscription?.unsubscribe();
  }
}
