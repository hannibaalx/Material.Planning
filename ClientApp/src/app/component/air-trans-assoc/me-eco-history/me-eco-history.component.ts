import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { MeEcoComments } from 'src/app/models/me-eco-comments';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { PlannerService } from 'src/app/service/planner.service';
import { UserService } from 'src/app/service/user.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-me-eco-history',
  templateUrl: './me-eco-history.component.html',
  styleUrls: ['./me-eco-history.component.css']
})
export class MeEcoHistoryComponent implements OnInit {
  commentsData$: Observable<MeEcoComments[]>;
  _commentsData: MeEcoComments[];
  tabindex: number;
  blnEditCard: boolean[] = [];
  blnHideEdit: boolean[] = [];
  blnHideOK: boolean[] = [];
  cardLabel: number[] = [];
  contentId: string[] = [];
  cardContent: string[] = [];
  btnOk: string[] = [];
  btnEdit: string[] = [];
  btnDelete: string[] = [];
  cards: FormArray;
  form: FormGroup;
  fromDialog: string;
  plannerName: string;
  resp: any;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  
  contentData: MeEcoComments = {
    ID: 0, ME_PART_NUMBER: '', PLANNER_NAME: '', COMMENTS: '', UPDATE_TIME: null, COMMENT_TYPE: '',
    OPTIMAL_OWNERSHIP: 0
  };
  contentDataType: string = "";
  
  constructor(
    private plannerService: PlannerService,
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MeEcoHistoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any    
  ) {
    this.form = this.fb.group({
      cardsContent: this.fb.array([
      ])
    });
   }

  ngOnInit() {
    this.getData();
  }

  getData() { 
    // const pauseCounter = timer(2000);
    // pauseCounter.subscribe(n => {
    //   this.plannerName = this.userService.getUser().displayName;
    // });
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    this.plannerName = this.user.display_name;
    
    switch (this.data.historytype) {
      case "ME":
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getMeCommentByMeNumberData(this.data.menumber)
          )
        this.getMeCommentByMeNumberData(this.data.menumber);     
        break;
      case "ECO":
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getEcoCommentByEcoNumberData(this.data.menumber)
          )
        this.getEcoCommentByEcoNumberData(this.data.menumber);             
        break;
      default:
        this.cards = this.form.get('cardsContent') as FormArray;
        this.cards.reset();
        this.commentsData$ = null;
        break;
     }
  }

  private getMeCommentByMeNumberData(menumber) { 
    this.plannerService.getMeCommentByMeNumber(menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getMeCommentByMeNumber(menumber);
  }

  private getEcoCommentByEcoNumberData(menumber) { 
    this.plannerService.getEcoCommentByEcoNumber(menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getEcoCommentByEcoNumber(menumber)
  }

  addcardsContent(data: MeEcoComments) {
    this.cards = this.form.get('cardsContent') as FormArray;
      this.cardsContent.push(this.fb.group({
        //cardLabel: data.COMM,
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

  get cardsContent(): FormArray {
    return this.form.get("cardsContent") as FormArray
  }

  removeCardContent(cardObj: any, i: number) {
    let req = new MeEcoComments();
    req.ID = cardObj.contentId;
    req.COMMENT_TYPE = this.data.historytype;

    // console.log('deleting id --> ' + cardObj.contentId);
    
    this.plannerService.deleteMeEcoComment(req)
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
      //this.commentsData$ = null;
    });
  }

  editCardContent(index: number) {
    this.blnHideEdit[index] = true;
    this.blnHideOK[index] = false;
    this.blnEditCard[index] = false;
  }

  testOO(comment: string) {
    console.log("comment passed --> " + comment);
    return !comment?.toString()?.includes("Optimal Ownership");
   }
  
  saveCard(cardObj: any, index: number) {
    this.blnHideEdit[index] = false;
    this.blnHideOK[index] = true;
    this.blnEditCard[index] = true;

    let req = new MeEcoComments();
    req.ID = cardObj.contentId;
    req.ME_PART_NUMBER = this.data.menumber;
    req.PLANNER_NAME = this.data.plannerName;
    req.COMMENTS = cardObj.cardContent;
    req.UPDATE_TIME = new Date();
    req.COMMENT_TYPE = this.data.historytype;

    // console.log('saving id ' + cardObj.contentId);
    // console.log('planner name --> ' + this.data.plannerName)
    // console.log('entered notes --> ' + cardObj.cardContent);

    this.plannerService.updateMeEcoComment(req)
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
    
    this.closeDialog();
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
