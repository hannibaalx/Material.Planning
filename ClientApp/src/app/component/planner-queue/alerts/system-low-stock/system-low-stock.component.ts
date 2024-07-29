import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { SystemLowStock } from '../../../../models/system-low-stock';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-system-low-stock',
  templateUrl: './system-low-stock.component.html',
  styleUrls: ['./system-low-stock.component.css']
})
export class SystemLowStockComponent implements OnInit {
  syslowstock$: Observable<SystemLowStock[]>;
  systemLowStock_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'SUM_ALLOCATION', 'SUM_ONHAND', 'STOCK_RATE', 'COMMENTS', 'LAST_UPDATES'];
  systemLowStockdetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'SUM_ALLOCATION', 'SUM_ONHAND', 'STOCK_RATE', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'System Low Stock - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

ngOnInit() {
  //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
  console.log("Planner names from Planner service : " +this.plannerService.getAtaPlannerName());
    const plannerName = this.plannerService.getAtaPlannerName();
  this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllSystemLowStockByPlanner(plannerName)
    )
  this.getAllSystemLowStockByPlanner(plannerName);
  this.getAllSystemLowStockDetailByPlanner(plannerName);
}

  private getAllSystemLowStockByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getSystemLowStockByPlanner(plannerName)    
      .subscribe(data => { 
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
    });
  }

  private getAllSystemLowStockDetailByPlanner(plannerName) { 
    this.plannerService.getAllSystemLowStockDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "System Low Stock";
    this.plannerService.setMeNumber(valObj);
  }

  sortSystemLowStock(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getSystemLowStockByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
