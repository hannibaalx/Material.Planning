import { OwnerNoAllocation } from './../../../../models/owner-no-allocation';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-ownership-no-allocation',
  templateUrl: './ownership-no-allocation.component.html',
  styleUrls: ['./ownership-no-allocation.component.css']
})
export class OwnershipNoAllocationComponent implements OnInit {
  ownnoall$: Observable<OwnerNoAllocation[]>;
  
  ownershipNoAllocation_displayedColumns: string[] = ['ME_PART_NUMBER', 'ME_OWNERSHIP', 'ME_RO_OPEN_QTY', 'ME_PO_OPEN_QTY', 'ME_OH', 'COMMENTS', 'LAST_UPDATES'];
  ownershipNoAllocationDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'ME_OWNERSHIP', 'ME_OH', 'ME_RO_OPEN_QTY', 'ME_PO_OPEN_QTY', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'Ownership No Allocation - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    const plannerName = this.plannerService.getAtaPlannerName();
    console.log("Ownership no allocation - Planner names from Planner service : " +plannerName);
  
    this.plannerService.refreshNeeded$
    .subscribe(() =>
      this.getAllOwnershipNoAllocationByPlanner(plannerName)
    )
    this.getAllOwnershipNoAllocationByPlanner(plannerName);
    this.getAllOwnershipNoAllocationDetailByPlanner(plannerName);
}

  private getAllOwnershipNoAllocationByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getOwnershipNoAllocationByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  private getAllOwnershipNoAllocationDetailByPlanner(plannerName) { 
    this.plannerService.getAllOwnershipNoAllocationDetailByPlanner(plannerName)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Ownership No Allocation";
    this.plannerService.setMeNumber(valObj);
  }

  sortOwnershipNoAllocation(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.getOwnershipNoAllocationByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
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
