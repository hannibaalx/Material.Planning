import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { OverdueEoKitWorkOrder } from 'src/app/models/overdue-eo-kit-work-order';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-overdue-eo-kit-work-order',
  templateUrl: './overdue-eo-kit-work-order.component.html',
  styleUrls: ['./overdue-eo-kit-work-order.component.css']
})
export class OverdueEoKitWorkOrderComponent implements OnInit {
  overDueKit$: Observable<OverdueEoKitWorkOrder[]>;
  overDueDetail$: Observable<EoBomDetail[]>; //USE THIS FOR PART 3, CREATE EoOverdueEOKitWorkOrderDetail
  overdueEOKitWorkOrder_displayedColumns: string[] = ['PO_NUMBER', 'ORDER_STATUS_IND_DESC', 'ME_PART_NUMBER', 'MFG_PART_NUMBER', 'ORDER_DATE', 'REQUIRED_DATE', 'OPEN_QTY', 'MATL_STS_ALL'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Overdue EO Kit Work Order - ' + this.currentDate + '.xlsx';
  currentDash8: string;
  ruleType: string = "Overdue EO Kit Work Order";
  previousDash8: string;
  currentUser: string;
  hideLoading: boolean = true;

  constructor(
    private eoplannerService: eoPlannerService
  ) { }

  ngOnInit() {
    //console.log("Planner names from EoPlanner service : " +this.eoplannerService.getEoPlannerName());
    const plannerName = this.eoplannerService.getEoPlannerName();
    //this.overDueKit$ = this.eoplannerService.getOverdueEOKitWorkOrderByPlanner(plannerName.value);
    this.eoplannerService.refreshNeeded$
    .subscribe(() =>
      this.getOverdueEOKitWorkOrderByPlanner(plannerName)
    )
    this.getOverdueEOKitWorkOrderByPlanner(plannerName);
  }

  private getOverdueEOKitWorkOrderByPlanner(plannerName) {
    this.hideLoading = false;
    this.eoplannerService.getOverdueEOKitWorkOrderByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sortOverdueEOKitWorkOrder(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    // const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.eoplannerService.getOverdueEOKitWorkOrderByPlanner(this.eoplannerService.getEoPlannerName(), orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;
    });
  }

  sendBOMDetails(dash8: string, ponumber: string) { 
    this.currentDash8 = dash8.trim();
    if (this.currentDash8 == this.previousDash8) { 
      this.overDueDetail$ = null;
      this.previousDash8 = "";
      this.eoplannerService.clearEoNumberRule;
    }
    else {
      this.previousDash8 = this.currentDash8;
      let _value = new EoNumberRule();
      // const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
      const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
      _value.PLANNER = plannerName.value.trim();
      _value.DASH_8 = this.currentDash8.trim();
      _value.EO_NUMBER = ponumber.trim();
      _value.RULE = this.ruleType;
      //_value.DESCRIPTION
      this.eoplannerService.setEoNumberRule(_value);
    }
  }
}
