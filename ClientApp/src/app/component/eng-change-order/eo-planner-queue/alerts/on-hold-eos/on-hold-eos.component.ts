import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { EoOnHoldEos } from 'src/app/models/eo-on-hold-eos';

@Component({
  selector: 'app-on-hold-eos',
  templateUrl: './on-hold-eos.component.html',
  styleUrls: ['./on-hold-eos.component.css']
})
export class OnHoldEosComponent implements OnInit {
  OnHoldEos_displayedColumns: string[] = ['DASH_8', 'EO_NUMBER', 'MFG_PART_NUMBER', 'NO_OF_ACCOMPLISHMENTS', 'REVISION_DATE', 'OPERATION_STEP'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'On Hold Eos - ' + this.currentDate + '.xlsx';
  bomDetails$: Observable<EoOnHoldEos[]>;
  currentDash8: string;
  ruleType: string = "On Hold Eos";
  previousDash8: string;
  currentUser: string;
  hideLoading: boolean = true;

  constructor(
    private eoplannerService: eoPlannerService
  ) { }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    //console.log("Planner names from EoPlanner service : " +this.eoplannerService.getEoPlannerName());
    const plannerName = this.eoplannerService.getEoPlannerName();
    this.eoplannerService.refreshNeeded$
    .subscribe(() =>
      this.getOnHoldEosByPlanner(plannerName)
    )
    this.getOnHoldEosByPlanner(plannerName);
  }

  private getOnHoldEosByPlanner(plannerName) { 
    this.eoplannerService.getOnHoldEosByPlanner(plannerName)    
      .subscribe(data => {
        this.hideLoading = false;
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
    });
  }

  sortOnHoldEos(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.eoplannerService.getOnHoldEosByPlanner(this.eoplannerService.getEoPlannerName(), orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;
    });
  }

  sendBOMDetails(dash8: string) { 
    this.currentDash8 = dash8.trim();
    if (this.currentDash8 == this.previousDash8) { 
      this.bomDetails$ = null;
      this.previousDash8 = "";
      this.eoplannerService.clearEoNumberRule;
    }
    else {
      this.previousDash8 = this.currentDash8;
      let _value = new EoNumberRule();
      const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
      _value.PLANNER = plannerName.value.trim();
      _value.DASH_8 = this.currentDash8.trim();
      _value.EO_NUMBER = null;
      _value.RULE = this.ruleType;
      this.eoplannerService.setEoNumberRule(_value);
    }
  }
}
