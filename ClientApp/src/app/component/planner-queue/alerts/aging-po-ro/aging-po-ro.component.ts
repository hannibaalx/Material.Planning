import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { AgingPoRo } from './../../../../models/aging-po-ro';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-aging-po-ro',
  templateUrl: './aging-po-ro.component.html',
  styleUrls: ['./aging-po-ro.component.css']
})
export class AgingPoRoComponent implements OnInit {
  agingporo$: Observable<AgingPoRo[]>;
  overduePoRo_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'OVERDUE_PO_QTY', 'OVERDUE_RO_QTY', 'COMMENTS', 'LAST_UPDATES'];
  overduePoRoDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'OVERDUE_PO_QTY', 'OVERDUE_RO_QTY', 'ORDER_TYPE', 'ORDER_NUMBER', 'ORDER_STATUS', 'ORDER_DATE', 'STATION', 'ORDER_QTY','VENDOR_NUMBER', 'VENDOR_NAME', 'RECEIVED_QTY', 'OPEN_QTY', 'LEAD_TIME', 'DAYS_LATE', 'ME_SERIAL_NUMBER', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'Overdue PO or RO - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.refreshNeeded$
      .subscribe(() =>
      this.getAllAgingPoRoByPlanner(plannerName)
    )
    this.getAllAgingPoRoByPlanner(plannerName);
    this.getAllAgingPoRoDetailByPlanner(plannerName);
  }

  private getAllAgingPoRoByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getAgingPoRoByPlanner(plannerName.value)    
      .subscribe(data => { 
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
      });
  }

  private getAllAgingPoRoDetailByPlanner(plannerName) { 
    this.plannerService.getAllAgingPoRoDetailByPlanner(plannerName.value)    
      .subscribe(data => { 
        this.detaildatasource = new MatTableDataSource(data);
      });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Overdue PO or RO";
    this.plannerService.setMeNumber(valObj);
  }

  sortOverduePoRo(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.getAgingPoRoByPlanner(plannerName.value, orderby, sorttype)
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
