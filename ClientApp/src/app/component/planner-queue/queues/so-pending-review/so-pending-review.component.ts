import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { SoPendingReview } from '../../../../models/so-pending-review';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';
@Component({
  selector: 'app-so-pending-review',
  templateUrl: './so-pending-review.component.html',
  styleUrls: ['./so-pending-review.component.css']
})
export class SoPendingReviewComponent implements OnInit {
  sopend$: Observable<SoPendingReview[]>;
  
  soPendingReview_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'SO_TO_STA', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  soPendingReviewDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'PENDING_SO_COUNT', 'SO_FROM_STA', 'SO_TO_STA', 'ME_SO_DATE', 'SO_ORDER_QTY', 'SO_REQUESTOR', 'FROM_STA_OH', 'TO_STA_ZERO_STOCK', 'PENDING_TYPE', 'DAYSINQUEUE', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'SO Pending Review - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("SO pending review - Planner names from Planner service : " +plannerName);

    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllSoPendingReviewByPlanner(plannerName)
    )
    this.getAllSoPendingReviewByPlanner(plannerName);
    this.getAllSoPendingReviewDetailByPlanner(plannerName);
  }

  private getAllSoPendingReviewByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getSoPendingReviewByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getAllSoPendingReviewDetailByPlanner(plannerName) { 
    this.plannerService.getAllSoPendingReviewDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "SO Pending Review";
    this.plannerService.setMeNumber(valObj);
  }

  sortSoPendingReview(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getSoPendingReviewByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;
    });
  }

  loadPlannerComment(menumber: string, rule: string) {
    let _value = new MeNumberRule();
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    _value.PlannerName = plannerName.value;
    _value.ME_PART_NUMBER = menumber;
    _value.Rule = rule;
    this.setMeRule.emit(_value);
  }
}
