import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { BaseStaShort } from '../../../../models/base-sta-short';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-baseline-station-shortage',
  templateUrl: './baseline-station-shortage.component.html',
  styleUrls: ['./baseline-station-shortage.component.css']
})
export class BaselineStationShortageComponent implements OnInit {
  basestashort$: Observable<BaseStaShort[]>;
  baselineStationShortage_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'BASELINE_STATION_SHORTAGE_COUNT', 'MIN_DASH8_DUE_IN', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Baseline Station Shortage - ' + this.currentDate + '.xlsx';
  hideLoading: boolean = true;

  @Output() setMeRule = new EventEmitter<MeNumberRule>();

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllBaselineStationShortageByPlanner(plannerName)
    )
    this.getAllBaselineStationShortageByPlanner(plannerName);
  }

  private getAllBaselineStationShortageByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getBaselineStationShortageByPlanner(plannerName.value)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Baseline Station Shortage";
    this.plannerService.setMeNumber(valObj);
  }

  sortBaselineStationShortage(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.getBaselineStationShortageByPlanner(plannerName.value, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
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
