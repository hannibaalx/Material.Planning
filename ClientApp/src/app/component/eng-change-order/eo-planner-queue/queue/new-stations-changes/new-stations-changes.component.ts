import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { EoNewStationsChanges } from 'src/app/models/eo-new-stations-changes';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-new-stations-changes',
  templateUrl: './new-stations-changes.component.html',
  styleUrls: ['./new-stations-changes.component.css']
})
export class NewStationsChangesComponent implements OnInit {
  newStationsChanges$: Observable<EoNewStationsChanges[]>;
  newStationsChanges_displayedColumns: string[] = ['EO_NUMBER', 'AD_IND', 'DASH_8', 'EO_DESC', 'SCHEDULING_STATUS', 'PREVIOUS_STATION_REQUIREMENT', 'CURRENT_STATION_REQUIREMENT', 'STATION_DELETED', 'STATION_ADDED', 'REVISION_DATE', 'DAYSINQUEUE'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'New Stations Changes - ' + this.currentDate + '.xlsx';
  bomDetail$: Observable<EoBomDetail[]>;
  currentDash8: string;
  ruleType: string = "New Stations Changes";
  previousDash8: string;
  currentUser: string;
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
      this.getNewStationsChangesByPlanner(plannerName)
    )
    this.getNewStationsChangesByPlanner(plannerName);
  }

  private getNewStationsChangesByPlanner(plannerName) {
    this.hideLoading = false;
    this.eoplannerService.getNewStationsChangesByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sortNewStationsChanges(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.hideLoading = false;
    this.eoplannerService.getNewStationsChangesByPlanner(this.eoplannerService.getEoPlannerName(), orderby, sorttype)
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
