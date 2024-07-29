import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { PlannerService } from 'src/app/service/planner.service';
import { MeNumberRule } from 'src/app/models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-scraps',
  templateUrl: './scraps.component.html',
  styleUrls: ['./scraps.component.css']
})
export class ScrapsComponent implements OnInit {

  constructor(
    private plannerService: PlannerService
  ) { }

  scraps_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'TOTAL_ROs', 'SCRAPPED_QTY', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  scrapsdetail_displayedColumns: string[] = ['RO_NUMBER', 'ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'ME_SERIAL_NUMBER', 'RO_REQUEST_ALPHA_STATION', 'AUDIT_DATE', 'SCRAPPED_QTY', 'ORDER_SEQUENCE', 'SCRAPPED_DATE', 'PLANNER', 'SUPERVISOR', 'REVIEW_REASON', 'UPDATED_DATETIME', 'DROP_OFF', 'DaysInQueue', 'STATUS'];
  datasource: MatTableDataSource<any>;
  datasourcedetail: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Scraps - ' + this.currentDate + '.xlsx';
  selectedRule = "";
  hideLoading: boolean = true;

  @Output() setMeRule = new EventEmitter<MeNumberRule>();

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("Scraps - Planner names from Planner service : " +plannerName);

    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllScrapsByPlanner(plannerName)
    )
    this.getAllScrapsByPlanner(plannerName);
    this.getAllScrapsDetailByPlanner(plannerName);
  }

  private getAllScrapsByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getAllScrapsByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getAllScrapsDetailByPlanner(plannerName) { 
    this.plannerService.getAllScrapsDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasourcedetail = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    this.selectedRule = "";
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Scraps";
    valObj.DisableStatus = true;

    this.selectedRule = valObj.Rule;
    this.plannerService.setMeNumber(valObj);
  }

  sortScraps(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getAllScrapsByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
