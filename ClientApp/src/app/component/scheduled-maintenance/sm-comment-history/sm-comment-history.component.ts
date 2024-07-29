import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Observable, timer } from 'rxjs';
import { SmCommentHistory } from 'src/app/models/sm-comment-history';
import { User } from 'src/app/models/user';
import { SchedmaintService } from 'src/app/service/schedmaint.service';
import { UserService } from 'src/app/service/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sm-comment-history',
  templateUrl: './sm-comment-history.component.html',
  styleUrls: ['./sm-comment-history.component.css']
})
export class SmCommentHistoryComponent implements OnInit, AfterViewInit {
  smCommentsData$: Observable<SmCommentHistory[]>;
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
  contentData: SmCommentHistory = { ID: 0, PLANNER_NAME: '', DASH_8: '', TSX_WCNUM: '', UPDATE_TIME: null, COMMENTS: '', COMMENTTYPE: '' };
  contentDataType: string = "";
  //plannerObj: User = { DOMAIN: "", prsnel_id: "", FIRST_NAME: "", LAST_NAME: "", DISPLAY_NAME: "", EMAIL_ADDR_TXT: "", roles: [], PHONE: "", LAST_LOGGED_IN: "" };
  plannerObj: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  fromPage: string;
  fromDialog: string;
  resp: any;
  plannerName: string;

  @ViewChild('closebtn') closeBtn: MatButton;

  constructor(
    private schedMaintService: SchedmaintService,
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SmCommentHistoryComponent>,
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
    // this.getData('tsx_wcnum');
  }

  ngAfterViewInit() { 
    this.closeBtn.focus();
    this.cd.detectChanges();
  }

  getData() {   
    this.schedMaintService.refreshNeeded$
      .subscribe(() => { 
        this.getSmCommentData(this.data.type, this.data.value)
      })
    this.getSmCommentData(this.data.type, this.data.value);      
  }

  private getSmCommentData(type, value ) { 
    this.schedMaintService.getSmCommentHistoryByType(type, value)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.smCommentsData$ = this.schedMaintService.getSmCommentHistoryByType(type, value)
  }

  get cardsContent(): FormArray {
    return this.form.get("cardsContent") as FormArray
  }

  addcardsContent(data: SmCommentHistory) {
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
    let req = new SmCommentHistory();
    req.ID = cardObj.contentId;
    req.COMMENTTYPE = this.data.type;
    req.UPDATE_TIME = new Date(moment().format());
    switch (this.data.type) { 
      case 'DASH_8':
        req.DASH_8 = this.data.value;
        break;
      case 'TSX_WCNUM':
        req.TSX_WCNUM = this.data.value;
        break;
    }
    // console.log('deleting id --> ' + cardObj.contentId);
    
    this.schedMaintService.deleteSchedMaintComment(req)
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

    let req = new SmCommentHistory();
    req.ID = cardObj.contentId;
    req.PLANNER_NAME = this.data.plannerName;
    req.COMMENTS = cardObj.cardContent;
    req.UPDATE_TIME = new Date(moment().format());
    req.COMMENTTYPE = this.data.type;
    switch (req.COMMENTTYPE) {
      case "DASH_8":
        req.DASH_8 = this.data.value;
        break;
      case "TSX_WCNUM":
      case "TSX_ALTNUM":
        req.TSX_WCNUM = this.data.value;
        break;
     }

    // console.log('saving id ' + cardObj.contentId);
    // console.log('planner name --> ' + this.data.plannerName)
    // console.log('entered notes --> ' + cardObj.cardContent);

    this.closeDialog();
    this.schedMaintService.updateSchedMaintComment(req)
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
    let smReq = new SmCommentHistory();
    smReq.COMMENTTYPE = this.data.type;
    smReq.COMMENTS = newComment.value.addComment;
    smReq.PLANNER_NAME = this.data.plannerName;
    smReq.UPDATE_TIME = new Date(moment().format());
    switch (smReq.COMMENTTYPE) { 
      case "DASH_8":
        smReq.DASH_8 = this.data.value;
        break;
      case "TSX_WCNUM":
      case "TSX_ALTNUM":
        smReq.TSX_WCNUM = this.data.value;
        break;
    }
    // console.log(smReq);

    this.closeDialog();
    this.schedMaintService.insertSchedMaintComment(smReq)
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
