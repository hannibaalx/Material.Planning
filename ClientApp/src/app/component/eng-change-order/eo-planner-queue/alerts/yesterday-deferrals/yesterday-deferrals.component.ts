import { EoYesterdayDeferrals } from './../../../../../models/eo-yesterday-deferrals';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomYesterdayDeferrals } from 'src/app/models/eo-bom-yesterday-deferrals';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-yesterday-deferrals',
  templateUrl: './yesterday-deferrals.component.html',
  styleUrls: ['./yesterday-deferrals.component.css']
})
export class YesterdayDeferralsComponent implements OnInit {
  YesterdayDeferrals_displayedColumns: string[] = ['STATION', 'NOSE', 'SUBFLEET', 'DASH_8', 'EO_NUMBER', 'TASK_DESC', 'CARRIER', 'REASON'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Yesterday Deferrals - ' + this.currentDate + '.xlsx';
  bomDetails$: Observable<EoYesterdayDeferrals[]>;
  yesterdayDeferralsDetail$: Observable<EoBomYesterdayDeferrals[]>;  //USE THIS FOR PART 3, CREATE EoPartDiscrepancyDetail
  currentDash8: string;
  ruleType: string = "Yesterday Deferrals";
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
    //this.bomDetails$ = this.eoplannerService.getYesterdayDeferralsByPlanner(plannerName.value);
    this.eoplannerService.refreshNeeded$
    .subscribe(() =>
      this.getYesterdayDeferralsByPlanner(plannerName)
    )
    this.getYesterdayDeferralsByPlanner(plannerName);
  }

  private getYesterdayDeferralsByPlanner(plannerName) { 
    this.hideLoading = false;
    this.eoplannerService.getYesterdayDeferralsByPlanner(plannerName)    
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  sortYesterdayDeferrals(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    // const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.eoplannerService.getYesterdayDeferralsByPlanner(this.eoplannerService.getEoPlannerName(), orderby, sorttype)
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
      // const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
      const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
      _value.PLANNER = plannerName.value.trim();
      _value.DASH_8 = this.currentDash8.trim();
      _value.EO_NUMBER = null;
      _value.RULE = this.ruleType;
      //_value.DESCRIPTION
      this.eoplannerService.setEoNumberRule(_value);
    }
  }
}
