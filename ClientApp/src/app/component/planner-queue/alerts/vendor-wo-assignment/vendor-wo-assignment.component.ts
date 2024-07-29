import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { VendorWoAssignment } from './../../../../models/vendor-wo-assignment';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-vendor-wo-assignment',
  templateUrl: './vendor-wo-assignment.component.html',
  styleUrls: ['./vendor-wo-assignment.component.css']
})
export class VendorWoAssignmentComponent implements OnInit {
  vendorworow$: Observable<VendorWoAssignment[]>;
  vendorWOAssignment_displayedColumns: string[] = ['ME_PART_NUMBER', 'WORK_ORDER', 'STA_BUILD', 'STA_FOR', 'COMMENTS', 'LAST_UPDATES'];
  vendorWOAssignmentdetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'WORK_ORDER', 'STA_BUILD', 'STA_FOR', 'WORK_ORDER_QTY', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'Vendor WO Assignment - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllVendorWoAssignmentByPlanner(plannerName)
    )
    this.getAllVendorWoAssignmentByPlanner(plannerName);
    this.getAllVendorWoAssignmentDetailByPlanner(plannerName);
  }

  private getAllVendorWoAssignmentByPlanner(plannerName) { 
    this.hideLoading = false;
    this.plannerService.getVendorWoAssignmentByPlanner(plannerName.value)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getAllVendorWoAssignmentDetailByPlanner(plannerName) { 
    this.plannerService.getAllVendorWoAssignmentDetailByPlanner(plannerName.value)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Vendor WO Assignment";
    this.plannerService.setMeNumber(valObj);
  }

  sortVendorWOAssignment(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getVendorWoAssignmentByPlanner(plannerName.value, orderby, sorttype)
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
