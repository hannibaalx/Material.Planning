
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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

declare var $: any;
@Component({
  selector: 'app-sm-part-longer-used-comments',
  templateUrl: './sm-part-longer-used-comments.component.html',
  styleUrls: ['./sm-part-longer-used-comments.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class SmPartLongerUsedCommentsComponent implements OnInit {
  public newSmObj = new SmQueueRule();
  comment_detail_displayedColumns: string[] = ['DASH_8', 'DASH8_KEYWORD', 'WCNUM', 'WCTITLE', 'QUANTITY_REQUIRED', 'UNIT_OF_ISSUE', 'REQUIRED_IND', 'DELETED_IND_DESC', 'MATERIAL_TYPE', 'FLEET', 'EXCLUDE_ME', 'CORRECT_ME', 'MPN_FOR_CARD', 'CHEKEY', 'CHKKEY'];
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
  disableDropOff: boolean = false;
  allBtnStatus: boolean = false;
  smRule: string;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  hideLoading: boolean = true;
  
  constructor(
    private fb: FormBuilder,
    private smPlannerQueueService: SmPlannerQueueService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      taComment: new FormControl(''),
      nextReviewDate: new FormControl({ value: '', disabled: false })
    });
  }

  ngOnInit() {
    this.fetchData();   
  }

  fetchData() { 
    this.disableDropOff = false;
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;

    this.smPlannerQueueService.getSmQueueRule()
      .subscribe(data => {
        if (data) { 
          this.newSmObj.DASH_8 = data.DASH_8;
          this.newSmObj.FLEET = data.FLEET;
          this.newSmObj.RULE = data.RULE;
          this.newSmObj.PLANNER = this.user.display_name;
          this.newSmObj.SHOWCOMMENTSECTION = data.SHOWCOMMENTSECTION;
          this.newSmObj.ME_PART_NUMBER_USED = data.ME_PART_NUMBER_USED;
          
          this.smPlannerQueueService.refreshNeeded$
            .subscribe(() =>
              this.getPartNoLongerUsedDetailById(data.DASH_8, data.FLEET))
          
          this.getPartNoLongerUsedDetailById(data.DASH_8, data.FLEET);          
        }        
      });  
  }

  setSmRule(valObj: SmQueueRule) {
    this.smRule = valObj.RULE;
    this.smPlannerQueueService.getPartNoLongerUsedDetailById(valObj.DASH_8, valObj.FLEET)
      .subscribe(data => { 
        this.datasource = new MatTableDataSource(data);
        //this.datasource.sort = this.sort;
    });
   }

  private getPartNoLongerUsedDetailById(dash8: string, fleet: string, orderby?: string, sorttype?: string) {
    this.hideLoading = false;
    this.datasource = null;
    this.smPlannerQueueService.getPartNoLongerUsedDetailById(dash8, fleet) 
      .subscribe(data => {
        data.forEach(x => {
          if (x.CHKKEY == null)
            this.dropBtnStatus = true;
        })  
        this.datasource = new MatTableDataSource(data);
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

    this.smPlannerQueueService.getPartNoLongerUsedDetailById(this.newSmObj.DASH_8, this.newSmObj.FLEET, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;

    });
  }

  saveComment() { 
    if (this.form.value.taComment.trim().length == 0)
      return;
    
      // let stations: string[] = [];
    
      // this.asyslowstock.forEach(x => { 
      //   if (form.controls[x.CHKKEY].value == true) { 
      //     stations.push(x.CHKKEY);
      //   }
      // });
    
    if (this.selectedMeNumUsed.toString().length > 0) {
      let req = new SmQueueCommentReq();
      req.CHKKEY = this.selectedMeNumUsed.toString().trim();
      req.COMMENT = this.form.value.taComment;
      req.CURRENT_USER = this.user.display_name;
      req.PLANNER = this.user.display_name;
      req.REVIEW_REASON = this.newSmObj.RULE;
      req.NEXTREVIEWDATE = this.nextReviewDate.value;

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

  dropSelectedMenused(mepartnumberused: string) {
    if (mepartnumberused) { 
      let req = new DropSmMeNumberUsedReq();
      req.DASH_8 = mepartnumberused;
      req.NEXT_REVIEW_DATE = this.nextReviewDate.value;
      req.REVIEW_REASON = this.newSmObj.RULE;

      this.hideLoading = false;
      this.smPlannerQueueService.dropOffSMPQDash8(req).subscribe(result => {
        this.hideLoading = true;
        return this.resp = result;
      });
  
      let updatepqmasterreq = new UpdateSmPqMasterReq();
      updatepqmasterreq.ME_PART_NUMBER_USED = mepartnumberused;
      updatepqmasterreq.REVIEW_REASON = "PART NO LONGER USED";
      this.hideLoading = false;
      this.smPlannerQueueService.updateSMPQMaster(updatepqmasterreq)
        .subscribe(result => {
          console.log('updating ' + updatepqmasterreq.ME_PART_NUMBER_USED + ' -' + result);
          this.dropOffNotify(mepartnumberused);
          this.datasource = null;
          this.newSmObj.DASH_8 = "";
          // this.getPartNoLongerUsedDetailById('');
          this.smPlannerQueueService.getPartNoLongerUsedDetailById(mepartnumberused, this.newSmObj.FLEET)
            .subscribe(data => { 
              this.datasource = new MatTableDataSource(data);
              this.hideLoading = true;
              //this.datasource.sort = this.sort;
          });
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
    dialogConfig.data = { plannerName: this.user.display_name, type: this.newSmObj.RULE, dash8: chkkey.substring(0, 14), mepartnumberused: chkkey.substring(14), chkkey: chkkey, station: '', aircraft: '' };

    let dialogRef = this.dialog.open(
      SmPlannerCommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
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
