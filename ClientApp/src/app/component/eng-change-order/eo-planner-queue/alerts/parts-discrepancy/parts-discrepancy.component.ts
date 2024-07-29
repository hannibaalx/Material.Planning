import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { EoPartsInDiscrepancy } from 'src/app/models/eo-parts-in-discrepancy';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-parts-discrepancy',
  templateUrl: './parts-discrepancy.component.html',
  styleUrls: ['./parts-discrepancy.component.css']
})
export class PartsDiscrepancyComponent implements OnInit {
  //partdisc$: Observable<EoPartsInDiscrepancy[]>;
  partsInDiscrepancy_displayedColumns: string[] = ['ASSIGNEDTO', 'MPN', 'LOGPAGE', 'WORK_NUMBER', 'TAIL', 'EQUIPMENT_TYPE', 'CODE2', 'SCHEDDATE'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Parts in Discrepancy - ' + this.currentDate + '.xlsx';
  bomDetails$: Observable<EoPartsInDiscrepancy[]>;
  partdiscDetail$: Observable<EoBomDetail[]>;  //USE THIS FOR PART 3, CREATE EoPartDiscrepancyDetail
  currentDash8: string;
  ruleType: string = "Parts in Discrepancy";
  previousDash8: string;
  currentUser: string;
  hideLoading: boolean = true;

  constructor(
    private eoplannerService: eoPlannerService
  ) { }

  ngOnInit() {
    // const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    //this.bomDetails$ = this.eoplannerService.getPartsDiscrepancyByPlanner(plannerName.value);
    this.eoplannerService.refreshNeeded$
    .subscribe(() =>
      this.getPartsDiscrepancyByPlanner(plannerName.value)
    )
    this.getPartsDiscrepancyByPlanner(plannerName.value);
  }

  private getPartsDiscrepancyByPlanner(plannerName) {
    this.hideLoading = false;
    this.eoplannerService.getPartsDiscrepancyByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sortPartsInDiscrepancy(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    // const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    this.hideLoading = false;
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.eoplannerService.getPartsDiscrepancyByPlanner(plannerName.value, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;
    });
  }  

  sendBOMDetails(dash8: string, tail: string) { 
    this.currentDash8 = dash8.trim();
    if (this.currentDash8 == this.previousDash8) { 
      this.bomDetails$ = null;
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
      _value.EO_NUMBER = tail.trim();
      _value.RULE = this.ruleType;
      //_value.DESCRIPTION
      this.eoplannerService.setEoNumberRule(_value);
    }
  }
}
