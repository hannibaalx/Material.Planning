import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { SmBaseStaShort } from '../../../../models/sm-base-sta-short';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-sm-baseline-station-shortage',
  templateUrl: './sm-baseline-station-shortage.component.html',
  styleUrls: ['./sm-baseline-station-shortage.component.css']
})
export class SmBaselineStationShortageComponent implements OnInit {
  basestashort$: Observable<SmBaseStaShort[]>;
  smBaselineStationShortage_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'BASELINE_STATION_SHORTAGE_COUNT', 'MIN_DASH8_DUE_IN', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  smBaselineStationShortageDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'BASELINE_STATION_SHORTAGE_COUNT', 'MIN_DASH8_DUE_IN', 'STATION_NEEDED', 'ONHAND', 'CAPABLE_STATION', 'THRESHOLD', 'REQUIREMENT', 'ALTERNATIVE_ME', 'MIN_DATE', 'COUNT_DASH8', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Baseline Station Shortage - ' + this.currentDate + '.xlsx';
  hideLoading: boolean = true;

  @Output() setMeRule = new EventEmitter<MeNumberRule>();


  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("Baseline - Planner names from Planner service : " +plannerName);
    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getSMBaselineStationShortageByPlanner(plannerName)
    )
    this.getSMBaselineStationShortageByPlanner(plannerName);
    this.getAllSMBaselineStationShortageDetailByPlanner(plannerName);
  }

  public getSMBaselineStationShortageByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getSMBaselineStationShortageByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  getAllSMBaselineStationShortageDetailByPlanner(plannerName) {
    this.plannerService.getSMBaselineStationShortageDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "SM Baseline Station Shortage";
    this.plannerService.setMeNumber(valObj);
  }

  sortBaselineStationShortage(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.getSMBaselineStationShortageByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
