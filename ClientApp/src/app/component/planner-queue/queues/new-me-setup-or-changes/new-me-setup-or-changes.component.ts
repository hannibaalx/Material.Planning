import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { PlannerService } from 'src/app/service/planner.service';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-new-me-setup-or-changes',
  templateUrl: './new-me-setup-or-changes.component.html',
  styleUrls: ['./new-me-setup-or-changes.component.css']
})
export class NewMeSetupOrChangesComponent implements OnInit {

  constructor(
    private plannerService: PlannerService
  ) { }

  newmesetuporchanges_displayedColumns: string[] = ['TO_ME', 'KEYWORD_DESCRIPTION', 'MFG_PART_NUMBER', 'SYSTEM_ALLOCATION', 'SYSTEM_ON_HAND', 'COUNT_OF_TRNSMT', 'DAYSINQUEUE', 'LAST_UPDATES', 'COMMENTS'];
  newmesetuporchangesdetail_displayedColumns: string[] = ['TO_ME', 'KEYWORD_DESCRIPTION', 'MFG_PART_NUMBER', 'SYSTEM_ALLOCATION', 'SYSTEM_ON_HAND', 'COUNT_OF_TRNSMT', 'DAYSINQUEUE', 'LAST_UPDATES', 'COMMENTS', 'FROM_ME', 'TRNSMT_ID', 'TRNSMT_STATUS_NM', 'TRNSMT_CREATE_TMS', 'TRNSMT_STEP_NM', 'K2_URL'];
  datasource: MatTableDataSource<any>;
  datasourcedetail: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'New ME Setup or Changes - ' + this.currentDate + '.xlsx';
  hideLoading: boolean = true;

  @Output() setMeRule = new EventEmitter<MeNumberRule>();

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("New M&E setup or changes - Planner names from Planner service : " +plannerName);

    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllNewMeSetupOrChangesByPlanner(plannerName)
    )
    this.getAllNewMeSetupOrChangesByPlanner(plannerName);
    this.getAllNewMeSetupOrChangesDetailByPlanner(plannerName);
  }

  private getAllNewMeSetupOrChangesByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getAllNewMeSetupOrChangesByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getAllNewMeSetupOrChangesDetailByPlanner(plannerName) { 
    this.plannerService.getAllNewMeSetupOrChangesDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasourcedetail = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "New ME Setup or Changes";
    this.plannerService.setMeNumber(valObj);
  }

  sortNewMeSetupOrChanges(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getAllNewMeSetupOrChangesByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
