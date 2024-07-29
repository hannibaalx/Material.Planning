import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';
import { MeNumberRule } from 'src/app/models/me-number-rule';

@Component({
  selector: 'app-sched-rot-rep-shortage',
  templateUrl: './sched-rot-rep-shortage.component.html',
  styleUrls: ['./sched-rot-rep-shortage.component.css']
})
export class SchedRotRepShortageComponent implements OnInit {

  scheduledROTREPShortage_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'TOTAL_ALLOCATION', 'SERVICEABLE_ONHAND', 'MIN_ALERT_DATE', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  scheduledROTREPShortageDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'TOTAL_ALLOCATION', 'SERVICEABLE_ONHAND', 'MIN_ALERT_DATE', 'DAYSINQUEUE', 'VISIT_DTE', 'TYPE', 'DETAILS', 'DASH8_DESCRIPTION', 'QUANTITY', 'AC', 'EFF_TAT', 'CATALOG_LEAD_TIME', 'RUNNING_OHB', 'ALERT_DATE', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  hideLoading: boolean = true;

  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Scheduled ROT REP Shortage - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("Scheduled ROT Rep Shortage - Planner names from Planner service : " +plannerName);

    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getScheduledRotRepShortageByPlanner(plannerName)
    )
    this.getScheduledRotRepShortageByPlanner(plannerName);
    this.getScheduledRotRepShortageDetailByPlanner(plannerName);
  }

  private getScheduledRotRepShortageByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getScheduledRotRepShortageByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getScheduledRotRepShortageDetailByPlanner(plannerName) { 
    this.plannerService.getScheduledRotRepShortageDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Scheduled ROT REP Shortage";
    this.plannerService.setMeNumber(valObj);
  }

  sortScheduledROTREPShortage(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getScheduledRotRepShortageByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
