import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { OutingStationBalancing } from './../../../../models/outing-station-balancing';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-out-station-balancing',
  templateUrl: './out-station-balancing.component.html',
  styleUrls: ['./out-station-balancing.component.css']
})
export class OutStationBalancingComponent implements OnInit {
  OutStationBalancing_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'STATION_OVERSTOCK_COUNT', 'STATION_UNDERSTOCK_COUNT', 'COMMENTS', 'LAST_UPDATES'];
  OutStationBalancingDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'STATION_OVERSTOCK_COUNT', 'STATION_UNDERSTOCK_COUNT', 'STA_OVERSTOCK', 'STA_OVERSTOCK_AQ', 'STA_OVERSTOCK_OH', 'STA_OVERSTOCK_QTY', 'STA_UNDERSTOCK', 'STA_UNDERSTOCK_AQ', 'STA_UNDERSTOCK_OH', 'STA_UNDERSTOCK_QTY', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'Out Station Balancing - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.refreshNeeded$
      .subscribe(() =>
        this.getAllOutingStationBalancingByPlanner(plannerName)
      )
    this.getAllOutingStationBalancingByPlanner(plannerName);
    this.getAllOutingStationBalancingDetailByPlanner(plannerName);
  }

  private getAllOutingStationBalancingByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getOutingStationBalancingByPlanner(plannerName.value)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getAllOutingStationBalancingDetailByPlanner(plannerName) { 
    this.plannerService.getAllOutingStationBalancingDetailByPlanner(plannerName.value)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "OutStation Balancing";
    this.plannerService.setMeNumber(valObj);
  }

  sortOutStationBalancing(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getOutingStationBalancingByPlanner(plannerName.value, orderby, sorttype)
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
