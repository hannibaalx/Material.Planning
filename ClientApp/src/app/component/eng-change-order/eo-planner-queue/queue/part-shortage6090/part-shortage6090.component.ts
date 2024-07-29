import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { EoPartsShortage6090 } from 'src/app/models/eo-parts-shortage6090';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-part-shortage6090',
  templateUrl: './part-shortage6090.component.html',
  styleUrls: ['./part-shortage6090.component.css']
})
export class PartShortage6090Component implements OnInit {
  partShort6090$: Observable<EoPartsShortage6090[]>;
  partShort6090_displayedColumns: string[] = ['EO_NUMBER', 'ME_TYPE', 'AD_IND', 'DASH_8', 'EO_DESC', 'DAYSINQUEUE'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = '60-90 Days System Shortage - ' + this.currentDate + '.xlsx';
  bomDetail$: Observable<EoBomDetail[]>;
  currentDash8: string;
  ruleType: string = "60 Or 90 Days Parts Shortage";
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
      this.getPartShortage6090ByPlanner(plannerName)
    )
    this.getPartShortage6090ByPlanner(plannerName);
  }

  private getPartShortage6090ByPlanner(plannerName) { 
    this.hideLoading = false;
    this.eoplannerService.getPartShortage6090ByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sortPartShortage6090(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.hideLoading = false;
    this.eoplannerService.getPartShortage6090ByPlanner(this.eoplannerService.getEoPlannerName(), orderby, sorttype)
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


