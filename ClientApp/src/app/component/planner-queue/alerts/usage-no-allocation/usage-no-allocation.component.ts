import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { UsageNoAllocation } from './../../../../models/usage-no-allocation';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-usage-no-allocation',
  templateUrl: './usage-no-allocation.component.html',
  styleUrls: ['./usage-no-allocation.component.css']
})
export class UsageNoAllocationComponent implements OnInit {
  usagenoall$: Observable<UsageNoAllocation[]>;
  
  usageNoAllocation_displayedColumns: string[] = ['ME_PART_NUMBER', 'STATION', 'ME_TRANSACTION_CODE', 'COMMENTS', 'LAST_UPDATES'];
  usageNoAllocationdetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'SEND_TO_STATION', 'ME_TRANSACTION_CODE', 'ME_TRANSACTION_DATE', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'Usage No Allocation - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

ngOnInit() {
  //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
  const plannerName = this.plannerService.getAtaPlannerName();
  console.log("Usage no allocation - Planner names from Planner service : " +plannerName);

  this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllUsageNoAllocationByPlanner(plannerName)
    )
    this.getAllUsageNoAllocationByPlanner(plannerName);
    this.getAllUsageNoAllocationDetailByPlanner(plannerName);
  }

  private getAllUsageNoAllocationByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getUsageNoAllocationByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

 private getAllUsageNoAllocationDetailByPlanner(plannerName) { 
    this.plannerService.getAllUsageNoAllocationDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string, sta: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Station = sta;
    valObj.Rule = "Usage and No Allocation";
    this.plannerService.setMeNumber(valObj);
    this.plannerService.setAtaPlannerComments(true);
  }

  sortUsageNoAllocation(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    
    this.hideLoading = false;
    this.plannerService.getUsageNoAllocationByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
