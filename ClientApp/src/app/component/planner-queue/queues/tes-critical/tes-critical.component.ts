import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { TesCritical } from '../../../../models/tes-critical';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-tes-critical',
  templateUrl: './tes-critical.component.html',
  styleUrls: ['./tes-critical.component.css']
})
export class TesCriticalComponent implements OnInit {
  tesstock$: Observable<TesCritical[]>;

  tes_critical_displayedColumns: string[] = ['ME_PART_NUMBER', 'SCHEDULED', 'ECO', 'UNSCHEDULED', 'DaysToOrder', 'DaysInQueue', 'COMMENTS', 'LAST_UPDATES'];
  tes_critical_detail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'Scheduled', 'ECO', 'Unscheduled', 'In_Kit', 'Open_PO', 'Leadtime', 'ZeroStockDate', 'OrderDate', 'DaysToOrder', 'DaysInQueue', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'TES Critical - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  plannerName: string;
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("Tes Critical - Planner names from Planner service : " +plannerName);

    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllTESCriticalByPlanner(plannerName)
    )
    this.getAllTESCriticalByPlanner(plannerName);
    this.getAllTESCriticalDetailByPlanner(plannerName);
}

  private getAllTESCriticalByPlanner(plannerName) {
    this.hideLoading = false;
    //this.plannerService.getTESCriticalByPlanner(plannerName.value)  
    this.plannerService.getAllTESCriticalDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }
  
  private getAllTESCriticalDetailByPlanner(plannerName) { 
    this.plannerService.getAllTESCriticalDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "TES Critical";
    this.plannerService.setMeNumber(valObj);
  }

  sortTesCritical(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getTESCriticalByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
