import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timer, Observable } from 'rxjs';
import { PartService } from 'src/app/service/part.service';
import { SaCommentHistory } from 'src/app/models/sa-comment-history';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-spare-analysis-comment-history',
  templateUrl: './spare-analysis-comment-history.component.html',
  styleUrls: ['./spare-analysis-comment-history.component.css']
})
export class SpareAnalysisCommentHistoryComponent implements OnInit {
  commentsData$: Observable<SaCommentHistory[]>;
  _commentsData: SaCommentHistory[];
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
  fromDialog: string;
  plannerName: string;
  resp: any;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:"" };

  constructor(
    private partService: PartService,
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SpareAnalysisCommentHistoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      cardsContent: this.fb.array([])
    });
   }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.plannerName = this.user.display_name;

    this.partService.refreshNeeded$
          .subscribe(() =>
            this.getSpareAnalysisCommentData(this.data.menumber)
          )
        this.getSpareAnalysisCommentData(this.data.menumber);
  }

  private getSpareAnalysisCommentData(menumber) { 
    this.partService.getSpareAnalysisCommentHistoryByMeNum(menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.partService.getSpareAnalysisCommentHistoryByMeNum(menumber)
  }

  get cardsContent(): FormArray {
    return this.form.get("cardsContent") as FormArray
  }
  
  addcardsContent(data: SaCommentHistory) {
    this.cards = this.form.get('cardsContent') as FormArray;
      this.cardsContent.push(this.fb.group({
        cardLabel: data.ID,
        cardContent: data.COMMENTS,
        cardPlanner: data.PLANNER_NAME,
        cardUpdateTime: data.UPDATE_TIME,
        contentId: data.ID,
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
    let req = new SaCommentHistory();
    req.ID = cardObj.contentId;

    // console.log('deleting id --> ' + cardObj.contentId);
    
    this.partService.deleteSpareAnalysisComment(req)
      .subscribe(result => {
        this.cardsContent.removeAt(i);
        this.cardLabel.splice(i,1);
        this.contentId.splice(i,1);
        this.cardContent.splice(i,1);
        this.btnOk.splice(i,1);
        this.btnEdit.splice(i,1);
        this.btnDelete.splice(i,1);
        this.closeDialog();
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

    let req = new SaCommentHistory();
    req.ID = cardObj.contentId;
    req.PLANNER_NAME = cardObj.cardPlanner;
    req.COMMENTS = cardObj.cardContent;
    req.UPDATE_TIME = new Date();

    // console.log('saving id ' + cardObj.contentId);
    // console.log('planner name --> ' + this.data.plannerName)
    // console.log('entered notes --> ' + cardObj.cardContent);

    this.closeDialog();
    this.partService.updateSpareAnalysisCommentHistory(req)
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

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
