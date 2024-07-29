import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EoPartsShortage120180 } from 'src/app/models/eo-parts-shortage120180';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-part-shortage120180',
  templateUrl: './part-shortage120180.component.html',
  styleUrls: ['./part-shortage120180.component.css']
})
export class PartShortage120180Component implements OnInit {
  partShort120180$: Observable<EoPartsShortage120180[]>;
  partShort120180_displayedColumns: string[] = ['EO_NUMBER', 'ME_TYPE', 'AD_IND', 'DASH_8', 'EO_DESC', 'DAYSINQUEUE'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = '120-180 Days System Shortage - ' + this.currentDate + '.xlsx';
  bomDetail$: Observable<EoBomDetail[]>;
  currentDash8: string;
  ruleType: string = "120 Or 180 Days Parts Shortage";
  previousDash8: string;
  planner: string;
  hideLoading: boolean = false;

  constructor(
    private eoplannerService: eoPlannerService
  ) { }

  ngOnInit() {
    console.log("Planner names from EoPlanner service : " +this.eoplannerService.getEoPlannerName());
    const plannerName = this.eoplannerService.getEoPlannerName();
    this.eoplannerService.refreshNeeded$
    .subscribe(() =>
      this.getPartShortage120180ByPlanner(plannerName)
    )
    this.getPartShortage120180ByPlanner(plannerName);
  }

  private getPartShortage120180ByPlanner(plannerName) {
    this.hideLoading = false;
    this.eoplannerService.getPartShortage120180ByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sortPartShortage120180(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.hideLoading = false;
    this.eoplannerService.getPartShortage120180ByPlanner(this.eoplannerService.getEoPlannerName(), orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;
    });
  }

  sendBOMDetails(dash8: string, eonumber: string) { 
    this.currentDash8 = dash8.trim();
    if (this.currentDash8 == this.previousDash8) { 
      this.bomDetail$ = null;
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
      _value.EO_NUMBER = eonumber.trim();
      _value.RULE = this.ruleType;
      //_value.DESCRIPTION
      this.eoplannerService.setEoNumberRule(_value);
    }
  }
}
