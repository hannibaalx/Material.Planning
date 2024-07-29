import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { PartShortageKit } from '../../../../models/part-shortage-kit';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { RefreshTime } from 'src/app/models/refresh-time';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-parts-shortage-for-kit',
  templateUrl: './parts-shortage-for-kit.component.html',
  styleUrls: ['./parts-shortage-for-kit.component.css']
})
export class PartsShortageForKitComponent implements OnInit {
  psk$: Observable<PartShortageKit[]>;
  refreshtime$: Observable<RefreshTime[]>;
  
  parts_shortage_for_kit_displayedColumns: string[] = ['ME_PART_NUMBER_IN_KIT', 'BUILD_STATION_SHORTAGE_COUNT', 'TOTAL_QTY_SHORTAGE', 'DaysInQueue2', 'COMMENTS', 'LAST_UPDATES'];
  parts_shortage_for_kit_detail_displayedColumns: string[] = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_IN_KIT', 'BUILD_STATION_SHORTAGE_COUNT', 'TOTAL_QTY_SHORTAGE', 'TO_BUILD_KIT', 'ME_KIT_DESCRIPTION', 'STA_BUILD', 'STA_FOR', 'STA_KIT_WO_QTY', 'QTY_IN_KIT', 'STA_BUILD_TTL_QTY_REQ', 'STA_BUILD_QTY_REQ_OH', 'STA_ALL_OH',  'DaysInQueue2', 'LAST_UPDATES', 'COMMENTS']
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Parts Shortage for Kit - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
  //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
  const plannerName = this.plannerService.getAtaPlannerName();
  console.log("Parts shortage for kits - Planner names from Planner service : " +plannerName);

  this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllPartShortageKitByPlanner(plannerName)
    )
    this.getAllPartShortageKitByPlanner(plannerName);
    this.getAllPartShortageKitDetailByPlanner(plannerName);
}

  private getAllPartShortageKitByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getPartShortageKitByPlanner(this.plannerService.getAtaPlannerName())    
      .subscribe(data => { 
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
  });
  }
  
  private getAllPartShortageKitDetailByPlanner(plannerName) { 
    this.plannerService.getAllPartShortageKitDetailByPlanner(plannerName)
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Parts Shortage for Kit";
    this.plannerService.setMeNumber(valObj);
  }

  sortPartsShortageForKit(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getPartShortageKitByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
