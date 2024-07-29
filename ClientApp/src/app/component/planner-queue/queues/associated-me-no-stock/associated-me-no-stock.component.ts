import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { PlannerService } from 'src/app/service/planner.service';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-associated-me-no-stock',
  templateUrl: './associated-me-no-stock.component.html',
  styleUrls: ['./associated-me-no-stock.component.css']
})
export class AssociatedMeNoStockComponent implements OnInit {
  
  constructor(
    private plannerService: PlannerService
  ) { }

  associatedmenostock_displayedColumns: string[] = ['ASSOCIATED_ME_PART_NUMBER', 'ASSOCIATED_KEYWORD', 'ASSOCIATED_MATERIAL_TYPE', 'ASSOCIATED_BUY_IND', 'ZERO_STOCK_STATION_COUNT', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Associated ME No Stock - ' + this.currentDate + '.xlsx';
  hideLoading: boolean = true;

  @Output() setMeRule = new EventEmitter<MeNumberRule>();

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("Associate ME no stock - Planner names from Planner service : " +plannerName);
    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllAssociatedMeNoStockByPlanner(plannerName)
    )
    this.getAllAssociatedMeNoStockByPlanner(plannerName);
  }

  private getAllAssociatedMeNoStockByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getAllAssociatedMeNoStockByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Associated ME No Stock";
    this.plannerService.setMeNumber(valObj);
  }

  sortAssociatedMENoStockStationShortage(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getAllAssociatedMeNoStockByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
