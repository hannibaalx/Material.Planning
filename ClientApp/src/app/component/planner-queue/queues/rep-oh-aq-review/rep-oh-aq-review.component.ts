import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { RepOhAq } from '../../../../models/rep-oh-aq';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { RefreshTime } from 'src/app/models/refresh-time';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-rep-oh-aq-review',
  templateUrl: './rep-oh-aq-review.component.html',
  styleUrls: ['./rep-oh-aq-review.component.css']
})
export class RepOhAqReviewComponent implements OnInit {
  repohaq$: Observable<RepOhAq[]>;
  refreshtime$: Observable<RefreshTime[]>;
  
  repOhToAQReview_displayedColumns: string[] = ['PART_TYPE', 'ME_PART_NUMBER', 'ME_DESC', 'STA_COUNT', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  repOhToAQReviewDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'STA_COUNT', 'STATION', 'ALLOCATION', 'ON_HAND', 'REPL_STATION', 'DAYSINQUEUE',  'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'ROT REP Below 50% Allocation - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("ROT REP Below 50% Allocation - Planner names from Planner service : " +plannerName);

    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllRepOhtoAQByPlanner(plannerName)
    )
    this.getAllRepOhtoAQByPlanner(plannerName);
    this.getAllRepOhtoAQDetailByPlanner(plannerName);
  }

  private getAllRepOhtoAQByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getRepOhtoAQByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getAllRepOhtoAQDetailByPlanner(plannerName) { 
    this.plannerService.getAllRepOhtoAQDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Repairable OH to AQ Review";
    this.plannerService.setMeNumber(valObj);
  }

  sortRepOhToAQReview(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getRepOhtoAQByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
