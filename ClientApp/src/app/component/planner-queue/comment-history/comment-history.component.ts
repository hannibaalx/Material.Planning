import { MeNumber } from './../../../models/me-number';
import { CommentHistory } from './../../../models/comment-history';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl, FormArray, FormBuilder  } from '@angular/forms';
import { PlannerService } from 'src/app/service/planner.service';
import { UserService } from 'src/app/service/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, timer } from 'rxjs';
import {MatFormFieldControl} from '@angular/material/form-field'

@Component({
  selector: 'app-comment-history',
  templateUrl: './comment-history.component.html',
  styleUrls: ['./comment-history.component.css']
})
export class CommentHistoryComponent implements OnInit {
  commentsData$: Observable<CommentHistory[]>;
  _commentsData: CommentHistory[];
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
  contentData: CommentHistory = { ID: 0, PLANNER_NAME: '', UPDATE_TIME: null, COMM: ''};
  contentDataType: string = "";
  plannerObj: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  fromPage: string;
  fromDialog: string;
  resp: any;
  plannerName: string;
  
  constructor(
    private plannerService: PlannerService,
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CommentHistoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.fromPage = data.pageValue;
    // console.log("plannerName --> " + data.plannerName);
    // console.log("meNumber --> " + data.menumber);
    //console.log("Station --> " + data.station);
    this.form = this.fb.group({
      cardsContent: this.fb.array([
      ])
    });
   }

  ngOnInit() {
    //this.commentsData$ = this.plannerService.getCommentHistoryByMeNumSta(this.data.menumber, this.data.station)
    this.getData();    
  }

  getData() {
    // this.plannerName = this.userService.getUser().displayName;

    switch (this.data.reviewReason) { 
      case 'Zero Stock':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getZeroStockCommentData(this.data.menumber, this.data.station)
          )
        this.getZeroStockCommentData(this.data.menumber, this.data.station);        
        break;
      case 'OutStation Balancing':
        switch (this.data.type) { 
          case 'over':
            this.plannerService.refreshNeeded$
              .subscribe(() =>
                this.getCommentHistoryByMeNumStaOutStationBalancing(this.data.menumber, this.data.station)
              )
            this.getCommentHistoryByMeNumStaOutStationBalancing(this.data.menumber, this.data.station);
            break;
          case 'under':
            this.plannerService.refreshNeeded$
            .subscribe(() =>
              this.getCommentHistoryByMeNumStaUnderStationBalancing(this.data.menumber, this.data.station)
            )
            this.getCommentHistoryByMeNumStaUnderStationBalancing(this.data.menumber, this.data.station);           
            break;
        }
        break;
      case 'Overdue PO or RO':
        this.plannerService.refreshNeeded$
        .subscribe(() =>
          this.getCommentHistoryByMeNumStaAgingPoRo(this.data.menumber, this.data.ordernumber)
        )
        this.getCommentHistoryByMeNumStaAgingPoRo(this.data.menumber, this.data.ordernumber);
        break;
      case 'Ownership No Allocation':
          this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumStaOwnerNoAlloc(this.data.menumber)
          )
          this.getCommentHistoryByMeNumStaOwnerNoAlloc(this.data.menumber);          
        break;
      case 'Usage and No Allocation':
        //plannerName: this.plannerName, menumber: menumber, station: station, transcode: transcode, reviewReason: reviewReason
        this.plannerService.refreshNeeded$
        .subscribe(() =>
          this.getCommentHistoryByMeNumStaUsageNoAlloc(this.data.menumber, this.data.station, this.data.transcode, this.data.transdate)
        )
        this.getCommentHistoryByMeNumStaUsageNoAlloc(this.data.menumber, this.data.station, this.data.transcode, this.data.transdate);
        break;
      case 'SO Pending Review':
        // plannerName: this.plannerName, menumber: menumber, fromStation: fromStation, toStation: toStation, requestor: requestor, reviewReason: reviewReason
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumStaSOPendingReview(this.data.menumber, this.data.fromStation, this.data.toStation, this.data.requestor)
          )
          this.getCommentHistoryByMeNumStaSOPendingReview(this.data.menumber, this.data.fromStation, this.data.toStation, this.data.requestor);
        break;
        case 'Scheduled ROT REP Shortage':
          // plannerName: this.userService.getUser().displayName, menumber: menumber, station: station, reviewReason: reviewReason
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumScheduledRotRepShortage(this.data.menumber)
            )
        this.getCommentHistoryByMeNumScheduledRotRepShortage(this.data.menumber);
          break;
      case 'AOS Review':
        //plannerName: this.plannerName, menumber: menumber, station: station, aogOrderId: aogOrderId, reviewReason: reviewReason
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumStaAosReview(this.data.menumber, this.data.station, this.data.aogorderid)
        )
        this.getCommentHistoryByMeNumStaAosReview(this.data.menumber, this.data.station, this.data.aogorderid);
        break;
      case 'Associated ME No Stock':
        //plannerName: this.plannerName, menumber: menumber, station: station, aogOrderId: aogOrderId, reviewReason: reviewReason
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByAssociatedMENoStock(this.data.menumber, this.data.chkkey)
        )
        this.getCommentHistoryByAssociatedMENoStock(this.data.menumber, this.data.chkkey);
        break;
        case 'New ME Setup or Changes':
          //plannerName: this.plannerName, menumber: menumber, station: station, aogOrderId: aogOrderId, reviewReason: reviewReason
          this.plannerService.refreshNeeded$
            .subscribe(() =>
              this.getCommentHistoryByNewMESetuporChanges(this.data.menumber, this.data.chkkey)
          )
          this.getCommentHistoryByNewMESetuporChanges(this.data.menumber, this.data.chkkey);
        break;
        case 'Scraps':
          //plannerName: this.plannerName, menumber: menumber, station: station, aogOrderId: aogOrderId, reviewReason: reviewReason
          this.plannerService.refreshNeeded$
            .subscribe(() =>
              this.getCommentHistoryByMeScraps(this.data.menumber, this.data.chkkey)
          )
          this.getCommentHistoryByMeScraps(this.data.menumber, this.data.chkkey);
          break;
      case 'Parts Shortage for Kit':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
          //plannerName: this.plannerName, menumberInKit: menumberInKit, buildStation: buildStation, forStation: forStation, menumber: menumber, reviewReason: reviewReason
          this.getCommentHistoryByMeNumStaPartShortageKit(this.data.menumberInKit, this.data.buildStation, this.data.forStation, this.data.menumber)
        )
        this.getCommentHistoryByMeNumStaPartShortageKit(this.data.menumberInKit, this.data.buildStation, this.data.forStation, this.data.menumber);
        break;
      case 'TES Critical':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumStaTes(this.data.menumber)
          )
        this.getCommentHistoryByMeNumStaTes(this.data.menumber);
        break;
      case 'Repairable OH to AQ Review':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumStaRepOhAQ(this.data.menumber, this.data.station)
          )
          this.getCommentHistoryByMeNumStaRepOhAQ(this.data.menumber, this.data.station);
        break;
      case 'Baseline Station Shortage':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumStaBaseline(this.data.menumber, this.data.station, this.data.dash8, this.data.nose, this.data.iag_schd)
          )
          this.getCommentHistoryByMeNumStaBaseline(this.data.menumber, this.data.station, this.data.dash8, this.data.nose, this.data.iag_schd);
        break;
      case 'SM Baseline Station Shortage':
          this.plannerService.refreshNeeded$
            .subscribe(() =>
              this.getCommentHistoryByMeNumSMStaBaseline(this.data.menumber, this.data.requirement, this.data.station, this.data.capablestation)
            )
            this.getCommentHistoryByMeNumSMStaBaseline(this.data.menumber, this.data.requirement, this.data.station, this.data.capablestation);
          break;
      case 'Vendor WO Assignment':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
          this.getCommentHistoryByMeNumStaVendorWoAssignment(this.data.menumber, this.data.station, this.data.workorder)
        )
        this.getCommentHistoryByMeNumStaVendorWoAssignment(this.data.menumber, this.data.station, this.data.workorder);        
        break;
      case 'Kit Shortage by Parts':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
          this.getCommentHistoryByMeNumStaKitShortageByParts(this.data.menumber, this.data.buildStation, this.data.forStation, this.data.menumberInKit)
          )
          this.getCommentHistoryByMeNumStaKitShortageByParts(this.data.menumber, this.data.buildStation, this.data.forStation, this.data.menumberInKit);
          break;
      case 'Catalog Expiration':
        this.plannerService.refreshNeeded$
        .subscribe(() =>
          this.getCommentHistoryByMeNumStaCatalogExpiration(this.data.menumber)
        )
        this.getCommentHistoryByMeNumStaCatalogExpiration(this.data.menumber);

        break;
      case 'Open Discrepancy':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumOpenDiscrepancy(this.data.menumber, this.data.tail, this.data.logPage)
          )
        this.getCommentHistoryByMeNumOpenDiscrepancy(this.data.menumber, this.data.tail, this.data.logPage);          
        break;
      case 'Main Station Balancing':
        this.plannerService.refreshNeeded$
        .subscribe(() =>
          this.getCommentHistoryByMeNumStaMainStationBal(this.data.menumber, this.data.station)
        )
        this.getCommentHistoryByMeNumStaMainStationBal(this.data.menumber, this.data.station);         
        break;
      case 'System Low Stock':
        this.plannerService.refreshNeeded$
          .subscribe(() =>
            this.getCommentHistoryByMeNumStaLowSystem(this.data.menumber)
          )
          this.getCommentHistoryByMeNumStaLowSystem(this.data.menumber);
        break;
      default:
        this.cards = this.form.get('cardsContent') as FormArray;
        this.cards.reset();
        this.commentsData$ = null;
        break;
    }
   }

  private getZeroStockCommentData(menumber, station) { 
    this.plannerService.getCommentHistoryByMeNumSta(menumber, station)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumSta(menumber, station)
  }

  private getCommentHistoryByMeNumStaBaseline(menumber, station, dash8, nose, iag_schd) { 
    this.plannerService.getCommentHistoryByMeNumStaBaseline(menumber, station, dash8, nose, iag_schd)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaBaseline(menumber, station, dash8, nose, iag_schd);
  }

  private getCommentHistoryByMeNumSMStaBaseline(menumber, requirement, station, capablestation) { 
    this.plannerService.getCommentHistoryByMeNumSMStaBaseline(menumber, requirement, station, capablestation)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumSMStaBaseline(menumber, requirement, station, capablestation);
  }

  private getCommentHistoryByMeNumOpenDiscrepancy(menumber: string, tail: string, logPage: string) {
    this.plannerService.getCommentHistoryByMeNumStaOpenDiscrepency(menumber, tail, logPage)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaOpenDiscrepency(menumber, tail, logPage);
  }

  private getCommentHistoryByMeNumStaTes(menumber: string) { 
    this.plannerService.getCommentHistoryByMeNumStaTes(menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaTes(menumber);
  }

  private getCommentHistoryByMeNumStaPartShortageKit(menumberInKit: string, buildStation: string, forStation: string, menumber: string) { 
    this.plannerService.getCommentHistoryByMeNumStaPartShortageKit(menumberInKit, buildStation, forStation, menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaPartShortageKit(menumberInKit, buildStation, forStation, menumber);
  }

  private getCommentHistoryByMeNumStaKitShortageByParts(menumberInKit: string, buildStation: string, forStation: string, menumber: string) { 
    this.plannerService.getCommentHistoryByMeNumStaKitShortageByParts(menumberInKit, buildStation, forStation, menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaKitShortageByParts(menumberInKit, buildStation, forStation, menumber);
  }

  private getCommentHistoryByMeNumStaRepOhAQ(menumber, station) { 
    this.plannerService.getCommentHistoryByMeNumStaRepOhAQ(menumber, station)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaRepOhAQ(menumber, station);
  }

  private getCommentHistoryByMeNumStaSOPendingReview(menumber, fromStation, toStation, requestor) { 
    this.plannerService.getCommentHistoryByMeNumStaSOPendingReview(menumber, fromStation, toStation, requestor)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaSOPendingReview(menumber, fromStation, toStation, requestor);
  }

  private getCommentHistoryByMeNumScheduledRotRepShortage(menumber) { 
    this.plannerService.getCommentHistoryByMeNumScheduledRotRepShortage(menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumScheduledRotRepShortage(menumber);
  }

  private getCommentHistoryByAssociatedMENoStock(menumber, chkkey) { 
    this.plannerService.getCommentHistoryByAssociatedMENoStock(menumber, chkkey)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByAssociatedMENoStock(menumber, chkkey);
  }

  private getCommentHistoryByNewMESetuporChanges(menumber, chkkey) { 
    this.plannerService.getCommentHistoryByNewMESetuporChanges(menumber, chkkey)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByNewMESetuporChanges(menumber, chkkey);
  }

  private getCommentHistoryByMeScraps(menumber, chkkey) {
    this.plannerService.getCommentHistoryByMeScraps(menumber, chkkey)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeScraps(menumber, chkkey);
  }

  private getCommentHistoryByMeNumStaLowSystem(menumber) { 
    this.plannerService.getCommentHistoryByMeNumStaLowSystem(menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaLowSystem(menumber);
  }
  
  private getCommentHistoryByMeNumStaAgingPoRo(menumber, ordernumber) { 
    this.plannerService.getCommentHistoryByMeNumStaAgingPoRo(menumber, ordernumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaAgingPoRo(menumber, ordernumber);
  }

  private getCommentHistoryByMeNumStaAosReview(menumber: string, station: string, aogorderid: number ) {
    this.plannerService.getCommentHistoryByMeNumStaAosReview(menumber, station, aogorderid)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaAosReview(menumber, station, aogorderid);
  }
  
  private getCommentHistoryByMeNumStaCatalogExpiration(menumber: string) {
    this.plannerService.getCommentHistoryByMeNumStaCatalogExpiration(menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaCatalogExpiration(menumber);
   }

   private getCommentHistoryByMeNumStaVendorWoAssignment(menumber: string, station: string, workorder: number) {
    this.plannerService.getCommentHistoryByMeNumStaVendorWoAssignment(menumber, station, workorder)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaVendorWoAssignment(menumber, station, workorder);
   }
  
   private getCommentHistoryByMeNumStaOwnerNoAlloc(menumber: string) {
    this.plannerService.getCommentHistoryByMeNumStaOwnerNoAlloc(menumber)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaOwnerNoAlloc(menumber);
   }
  
   private getCommentHistoryByMeNumStaUsageNoAlloc(menumber: string, station: string, transcode: string, transdate: string) {
    this.plannerService.getCommentHistoryByMeNumStaUsageNoAlloc(menumber, station, transcode, transdate)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaUsageNoAlloc(menumber, station, transcode, transdate);
   }
  
  private getCommentHistoryByMeNumStaMainStationBal(menumber: string, station: string) {
    this.plannerService.getCommentHistoryByMeNumStaMainStationBal(menumber, station)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaMainStationBal(menumber, station);
  }
  
  private getCommentHistoryByMeNumStaOutStationBalancing(menumber: string, station: string) {
    this.plannerService.getCommentHistoryByMeNumStaOutStationBalancing(menumber, station)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaOutStationBalancing(menumber, station);
  }
  
  private getCommentHistoryByMeNumStaUnderStationBalancing(menumber, station) {
    this.plannerService.getCommentHistoryByMeNumStaUnderStationBalancing(menumber, station)
    .subscribe(data => { 
      data.forEach(x => {
        this.addcardsContent(x);
       });
    });
    this.commentsData$ = this.plannerService.getCommentHistoryByMeNumStaUnderStationBalancing(menumber, station);    
   }
  
  get cardsContent(): FormArray {
    return this.form.get("cardsContent") as FormArray
  }
  
  addcardsContent(data: CommentHistory) {
    this.cards = this.form.get('cardsContent') as FormArray;
      this.cardsContent.push(this.fb.group({
        cardLabel: data.ID,
        cardContent: data.COMM,
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
    let req = new CommentHistory();
    req.ID = cardObj.contentId;

    // console.log('deleting id --> ' + cardObj.contentId);
    
    this.plannerService.deletePlannerQueueComment(req)
      .subscribe(result => {
        this.cardsContent.removeAt(i);
        this.cardLabel.splice(i,1);
        this.contentId.splice(i,1);
        this.cardContent.splice(i,1);
        this.btnOk.splice(i,1);
        this.btnEdit.splice(i,1);
        this.btnDelete.splice(i,1);
        this.closeDialog();
        this.data.reviewReason = "";
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

    let req = new CommentHistory();
    req.ID = cardObj.contentId;
    req.PLANNER_NAME = this.data.plannerName;
    req.COMM = cardObj.cardContent;
    req.UPDATE_TIME = new Date();

    // console.log('saving id ' + cardObj.contentId);
    // console.log('planner name --> ' + this.data.plannerName)
    // console.log('entered notes --> ' + cardObj.cardContent);

    this.closeDialog();
    this.plannerService.updatePlannerQueueComment(req)
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
