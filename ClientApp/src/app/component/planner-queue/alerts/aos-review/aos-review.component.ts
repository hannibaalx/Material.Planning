import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { AosReview } from './../../../../models/aos-review';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-aos-review',
  templateUrl: './aos-review.component.html',
  styleUrls: ['./aos-review.component.css']
})
export class AosReviewComponent implements OnInit {
  aosr$: Observable<AosReview[]>;  
  aosReview_displayedColumns: string[] = ['ME_PART_NUMBER', 'ME_DESC', 'STA_Count', 'COMMENTS', 'LAST_UPDATES'];
  aosReviewDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD','STA_COUNT', 'AOG_ORDER_ID', 'STA', 'AOG_STATUS', 'AOG_REASON', 'AOG_RESOLVE', 'AOG_QTY_NEED', 'AOG_OPEN_DATE', 'AC_TAIL_FLEET', 'AOG_INCIDENTS_PY', 'AOG_QTY_PY', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'AOS Review - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.refreshNeeded$
      .subscribe(() =>
      this.getAllAOSReviewByPlanner(plannerName)
    )
    this.getAllAOSReviewByPlanner(plannerName);
    this.getAllAOSReviewDetailByPlanner(plannerName);
  }

  private getAllAOSReviewByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getAOSReviewByPlanner(plannerName.value)    
      .subscribe(data => { 
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
      });
  }

  private getAllAOSReviewDetailByPlanner(plannerName) { 
    this.plannerService.getAllAOSReviewDetailByPlanner(plannerName.value)    
      .subscribe(data => { 
        this.detaildatasource = new MatTableDataSource(data);
      });
  }


  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "AOS Review";
    this.plannerService.setMeNumber(valObj);
  }

  sortAosReview(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getAOSReviewByPlanner(plannerName.value, orderby, sorttype)
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
