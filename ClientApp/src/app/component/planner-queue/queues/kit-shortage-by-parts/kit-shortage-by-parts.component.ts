import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { KitShortagePart } from '../../../../models/kit-shortage-part';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-kit-shortage-by-parts',
  templateUrl: './kit-shortage-by-parts.component.html',
  styleUrls: ['./kit-shortage-by-parts.component.css']
})
export class KitShortageByPartsComponent implements OnInit {
  kitshortagepart$: Observable<KitShortagePart[]>;
  kitShortageByParts_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'BUILD_STATION_SHORTAGE_COUNT', 'TOTAL_KIT_WO_QTY', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  kitShortageByPartsDetail_displayedColumns: string[] = ['KIT', 'ME_KIT_DESCRIPTION', 'BUILD_STATION_SHORTAGE_COUNT', 'TOTAL_KIT_WO_QTY',  'STA_BUILD', 'STA_FOR', 'STA_KIT_WO_QTY', 'ME_PART_NUMBER_IN_KIT', 'KEYWORD_IN_KIT', 'QTY_PER_KIT', 'BUILD_STA_TTL_REQ', 'BUILD_STA_TTL_OHB', 'ALL_STA_TTL_QTY', 'ALL_STA_TTL_OHB', 'DaysInQueue', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Kit Shortage by Parts - ' + this.currentDate + '.xlsx';
  hideLoading: boolean = true;

  @Output() setMeRule = new EventEmitter<MeNumberRule>();

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("Kit shortage by parts - Planner names from Planner service : " +plannerName);

    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllKitShortagePartByPlanner(plannerName)
    )
    this.getAllKitShortagePartByPlanner(plannerName);
    this.getAllKitShortagePartDetailByPlanner(plannerName);
}

  private getAllKitShortagePartByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getKitShortagePartByPlanner(plannerName)    
      .subscribe(data => { 
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
    });
  }
  
  private getAllKitShortagePartDetailByPlanner(plannerName) { 
    this.plannerService.getAllKitShortagePartDetailByPlanner(plannerName)    
      .subscribe(data => { 
        this.detaildatasource = new MatTableDataSource(data);
      });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Kit Shortage by Parts";
    this.plannerService.setMeNumber(valObj);
  }
  
  sortKitShortageByParts(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getKitShortagePartByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
