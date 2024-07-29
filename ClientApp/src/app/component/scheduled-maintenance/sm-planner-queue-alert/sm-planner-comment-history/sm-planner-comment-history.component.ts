import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Observable, timer } from 'rxjs';
import { SmPlannerCommentHistory } from 'src/app/models/sm-planner-comment-history';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import * as moment from 'moment';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';

@Component({
  selector: 'app-sm-planner-comment-history',
  templateUrl: './sm-planner-comment-history.component.html',
  styleUrls: ['./sm-planner-comment-history.component.css']
})
export class SmPlannerCommentHistoryComponent implements OnInit, AfterViewInit {
  smPlannerCommentsData$: Observable<SmPlannerCommentHistory[]>;
  blnEditCard: boolean[] = [];
  blnHideEdit: boolean[] = [];
  blnHideOK: boolean[] = [];
  cardLabel: number[] = [];
  contentId: string[] = [];
  cardContent: string[] = [];
  btnOk: string[] = [];
  btnEdit: string[] = [];
  btnDelete: string[] = [];
  tabindex: number;
  cards: FormArray;
  form: FormGroup;
  contentData: SmPlannerCommentHistory = { ID: 0, PLANNER_NAME: '', DASH_8: '', ME_PART_NUMBER_USED: '', STATION: '', AIRCRAFT: '', UPDATE_TIME: null, COMMENTS: '', COMMENTTYPE: '' };
  contentDataType: string = "";
  plannerObj: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  fromPage: string;
  fromDialog: string;
  resp: any;
  plannerName: string;

  @ViewChild('closebtn') closeBtn: MatButton;

  constructor(
    private smPlannerQueueService: SmPlannerQueueService,
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SmPlannerCommentHistoryComponent>,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
     this.form = this.fb.group({
      cardsContent: this.fb.array([
      ]),
       newComment: new FormGroup({
         addComment: new FormControl('')
       })
    });
   }
  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() { 
    this.closeBtn.focus();
    this.cd.detectChanges();
  }

  getData() {   
    this.smPlannerQueueService.refreshNeeded$
      .subscribe(() => {
        //plannerName, reviewReason, type, dash8, mepartnumberused, chkkey        
        this.getSmPlannerCommentHistoryByType(this.data.type, this.data.dash8, this.data.mepartnumberused, this.data.station, this.data.aircraft)
      })
    this.getSmPlannerCommentHistoryByType(this.data.type, this.data.dash8, this.data.mepartnumberused, this.data.station, this.data.aircraft);      
  }

  private getSmPlannerCommentHistoryByType(type, dash8, mepartnumberused, station, aircraft) { 
    this.smPlannerQueueService.getSmPlannerCommentHistoryByType(type, dash8, mepartnumberused, station, aircraft)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.smPlannerCommentsData$ = this.smPlannerQueueService.getSmPlannerCommentHistoryByType(type, dash8, mepartnumberused, station, aircraft)
  }

  get cardsContent(): FormArray {
    return this.form.get("cardsContent") as FormArray
  }

  addcardsContent(data: SmPlannerCommentHistory) {
    this.cards = this.cardsContent;
    this.cardsContent.push(this.fb.group({
      cardLabel: data.ID,
      cardContent: data.COMMENTS,
      cardPlanner: data.PLANNER_NAME,
      cardUpdateTime: data.UPDATE_TIME,
      contentId: data.ID
    }));

    this.blnEditCard.push(true);
    this.blnHideEdit.push(false);
    this.blnHideOK.push(true);
    this.cardLabel.push(data.ID);
    this.contentId.push('contentId' + data.ID);
    this.cardContent.push('cardContent' + data.ID);
    this.btnOk.push('btnOk' + data.ID);
    this.btnEdit.push('btnEdit' + data.ID);
    this.btnDelete.push('btnDelete' + data.ID);

    return this.cardsContent;
  }

  removeCardContent(cardObj: any, i: number) {
    let req = new SmPlannerCommentHistory();
    req.ID = cardObj.contentId;
    //req.COMMENTTYPE = this.data.type;
    //req.UPDATE_TIME = new Date(moment().format());
    // switch (this.data.type) { 
    //   case 'DASH_8':
    //     req.DASH_8 = this.data.value;
    //     break;
    //   case 'ME_PART_NUMBER_USED':
    //     req.ME_PART_NUMBER_USED = this.data.value;
    //     break;
    // }
    // console.log('deleting id --> ' + cardObj.contentId);
    
    this.smPlannerQueueService.deletePlannerQueueAlertComment(req)
      .subscribe(result => {
        this.cardsContent.removeAt(i);
        this.cardLabel.splice(i,1);
        this.contentId.splice(i,1);
        this.cardContent.splice(i,1);
        this.btnOk.splice(i,1);
        this.btnEdit.splice(i,1);
        this.btnDelete.splice(i,1);
        this.closeDialog();
        this.data.type = "";
        return this.resp = result;
      });
    const pauseCounter = timer(2000);  
    pauseCounter.subscribe(n => {
      this.getData();
    });
  }

  editCardContent(index: number) {
    this.blnHideEdit[index] = true;
    this.blnHideOK[index] = false;
    this.blnEditCard[index] = false;
  }

  saveCard(cardObj: any, index: number) {
    this.blnHideEdit[index] = false;
    this.blnHideOK[index] = true;
    this.blnEditCard[index] = true;

    let req = new SmPlannerCommentHistory();
    req.ID = cardObj.contentId;
    req.PLANNER_NAME = this.data.plannerName;
    req.COMMENTS = cardObj.cardContent;
    req.UPDATE_TIME = new Date(moment().format());
    req.COMMENTTYPE = this.data.type;
    switch (req.COMMENTTYPE) {
      case "PART NO LONGER USED":
        req.DASH_8 = this.data.dash8;
        req.ME_PART_NUMBER_USED = this.data.mepartnumberused;
        break;
      case "NEW STATIONS CHANGES":
        req.DASH_8 = this.data.dash8;
        //req.ME_PART_NUMBER_USED = this.data.mepartnumberused;
        //req.ME_PART_NUMBER_USED = this.data.value;
        break;
      case "SCHEDULED ROTABLE BOM":
        //req.DASH_8 = this.data.dash8;
        req.ME_PART_NUMBER_USED = this.data.mepartnumberused;
        //req.ME_PART_NUMBER_USED = this.data.value;
        break;
      case "DEFERRAL REVIEW":
        req.DASH_8 = this.data.dash8;
        req.STATION = this.data.station;
        req.AIRCRAFT = this.data.aircraft;
        //req.ME_PART_NUMBER_USED = this.data.mepartnumberused + this.data.station + this.data.aircraft;
        break;
     }

    // console.log('saving id ' + cardObj.contentId);
    // console.log('planner name --> ' + this.data.plannerName)
    // console.log('entered notes --> ' + cardObj.cardContent);

    this.closeDialog();
    this.smPlannerQueueService.updatePlannerQueueAlertComment(req)
      .subscribe(result => {
        this.cards = this.form.get('cardsContent') as FormArray;
        this.cards.reset();
        this.cardLabel = [];
        this.contentId = [];
        this.cardContent = [];
        this.btnOk = [];
        this.btnEdit = [];
        this.btnDelete = [];
        return this.resp = result;
    });
  }

  saveNewComment(newComment: any) { 
    // console.log(newComment.value.addComment);
    // console.log(this.data.type);
    let smReq = new SmPlannerCommentHistory();
    smReq.COMMENTTYPE = this.data.type;
    smReq.COMMENTS = newComment.value.addComment;
    smReq.PLANNER_NAME = this.data.plannerName;
    smReq.UPDATE_TIME = new Date(moment().format());
    switch (smReq.COMMENTTYPE) { 
      case "DASH_8":
        smReq.DASH_8 = this.data.value;
        break;
      case "ME_PART_NUMBER_USED":
        smReq.ME_PART_NUMBER_USED = this.data.value;
        break;
    }
    // console.log(smReq);

    this.closeDialog();
    this.smPlannerQueueService.insertSmPlannerQueueAlertComment(smReq)
      .subscribe(result => { 
        this.cards = this.form.get('cardsContent') as FormArray;
        this.cards.reset();
        this.cardLabel = [];
        this.contentId = [];
        this.cardContent = [];
        this.btnOk = [];
        this.btnEdit = [];
        this.btnDelete = [];
        return this.resp = result;
      })
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
