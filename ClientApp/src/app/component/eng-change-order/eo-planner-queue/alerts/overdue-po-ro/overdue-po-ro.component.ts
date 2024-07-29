import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { OverduePoRo } from 'src/app/models/overdue-po-ro';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-overdue-po-ro',
  templateUrl: './overdue-po-ro.component.html',
  styleUrls: ['./overdue-po-ro.component.css']
})
export class OverduePoRoComponent implements OnInit {

  overduePoRo$: Observable<OverduePoRo[]>;
  oprDetail$: Observable<EoBomDetail[]>;  //USE THIS FOR PART 3, CREATE EoOverduePoRoDetail
  overduePOsandROs_displayedColumns: string[] = ['TYPE', 'ORDER_NBR', 'ORDER_STATUS', 'ME_PART_NUMBER', 'MFG_PART_NUMBER', 'LEADTIME' ,'ORDER_DATE', 'OPEN_QTY', 'MATL_STS_ALL'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Overdue POs and ROs - ' + this.currentDate + '.xlsx';
  currentDash8: string;
  ruleType: string = "Overdue POs and ROs";
  previousDash8: string;
  currentUser: string;
  hideLoading: boolean = true;

  constructor(
    private eoplannerService: eoPlannerService
  ) { }

  ngOnInit() {
    // const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    //console.log("Planner names from EoPlanner service : " +this.eoplannerService.getEoPlannerName());
    const plannerName = this.eoplannerService.getEoPlannerName();
    //this.overduePoRo$ = this.eoplannerService.getOverduePoRoByPlanner(plannerName.value);
    this.eoplannerService.refreshNeeded$
    .subscribe(() =>
      this.getOverduePoRoByPlanner(plannerName)
    )
    this.getOverduePoRoByPlanner(plannerName);
  }

  private getOverduePoRoByPlanner(plannerName) { 
    this.hideLoading = false;
    this.eoplannerService.getOverduePoRoByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sortOverduePOsandROs(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    // const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.eoplannerService.getOverduePoRoByPlanner(this.eoplannerService.getEoPlannerName(), orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;
    });
  }

  sendOPRDetails(dash8: string, orderNumber: string) { 
    this.currentDash8 = dash8.trim();
    if (this.currentDash8 == this.previousDash8) { 
      this.oprDetail$ = null;
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
      _value.EO_NUMBER = orderNumber.trim();
      _value.RULE = this.ruleType;
      //_value.DESCRIPTION
      this.eoplannerService.setEoNumberRule(_value);
    }
  }
}
