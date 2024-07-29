import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { OpenDiscrepancy } from '../../../../models/open-discrepancy';
import { MeNumberRule } from '../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-open-discrepancy',
  templateUrl: './open-discrepancy.component.html',
  styleUrls: ['./open-discrepancy.component.css']
})
export class OpenDiscrepancyComponent implements OnInit {
  opendisc$: Observable<OpenDiscrepancy[]>;
  
  open_discrepancy_displayedColumns: string[] = ['ME_PART_NUMBER', 'MFG_PART_NUMBER', 'MEL_LOG_PAGE', 'MEL_DROP_DEAD_DATE', 'DaysInQueue', 'COMMENTS', 'LAST_UPDATES'];
  open_discrepancy_detail_displayedColumns: string[] = ['ME_PART_NUMBER', 'MFG_PART_NUMBER', 'MEL_LOG_PAGE', 'MEL_DROP_DEAD_DATE', 'ME_DESC', 'MEL_RESPONSIBILITY', 'AC_TAIL', 'MEL_SCHED_STA', 'MEL_DAYS_OPEN', 'MEL_FCST_DATE', 'MEL_SCHED_DATE', 'MEL_TYPE', 'MEL_QTY_OPEN', 'MEL_QTY_REQ_TODAY', 'ME_OH', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Open Discrepancy - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllOpenDiscrepancyByPlanner(plannerName)
    )
    this.getAllOpenDiscrepancyByPlanner(plannerName);
    this.getAllOpenDiscrepancyDetailByPlanner(plannerName);
  }

  private getAllOpenDiscrepancyByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getOpenDiscrepancyByPlanner(plannerName.value)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }
  
  private getAllOpenDiscrepancyDetailByPlanner(plannerName) {
  this.plannerService.getAllOpenDiscrepancyDetailByPlanner(plannerName.value)    
  .subscribe(data => { 
    this.detaildatasource = new MatTableDataSource(data);
  });
}

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Open Discrepancy";
    this.plannerService.setMeNumber(valObj);
  }

  sortOpenDiscrepancy(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getOpenDiscrepancyByPlanner(plannerName.value, orderby, sorttype)
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
