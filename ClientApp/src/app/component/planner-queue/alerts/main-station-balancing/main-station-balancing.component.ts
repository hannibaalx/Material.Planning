import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { MainStationBalancing } from './../../../../models/main-station-balancing';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-main-station-balancing',
  templateUrl: './main-station-balancing.component.html',
  styleUrls: ['./main-station-balancing.component.css']
})
export class MainStationBalancingComponent implements OnInit {
  mainstabal$: Observable<MainStationBalancing[]>;
  
  mainStationBalancing_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'MAIN_STA_SHORTAGE_COUNT', 'COMMENTS', 'LAST_UPDATES'];
  mainStationBalancingDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'MAIN_STA_SHORTAGE_COUNT', 'STA', 'ME_STA_REPAIRABLE_AQ', 'ME_STA_OH', 'ME_SO_CURRENT_QTY', 'ME_CLT_AQ', 'ME_CLT_OH', 'ME_PHX_AQ', 'ME_PHX_OH', 'ME_TUL_AQ', 'ME_TUL_OH', 'ME_D00_AQ', 'ME_D00_OH', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'Main Station Balancing - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllMainStationBalancingByPlanner(plannerName)
    )
    this.getAllMainStationBalancingByPlanner(plannerName);
    this.getAllMainStationBalancingDetailPlanner(plannerName);
  }

  private getAllMainStationBalancingByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getMainStationBalancingByPlanner(plannerName.value)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getAllMainStationBalancingDetailPlanner(plannerName) { 
    this.plannerService.getAllMainStationBalancingDetailPlanner(plannerName.value)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Main Station Balancing";
    this.plannerService.setMeNumber(valObj);
  }

  sortMainStationBalancing(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getMainStationBalancingByPlanner(plannerName.value, orderby, sorttype)
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
