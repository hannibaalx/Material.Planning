import { Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { CatalogExpiration } from './../../../../models/catalog-expiration';
import { MeNumberRule } from './../../../../models/me-number-rule';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-catalog-expiration',
  templateUrl: './catalog-expiration.component.html',
  styleUrls: ['./catalog-expiration.component.css']
})
export class CatalogExpirationComponent implements OnInit {
  cataexp$: Observable<CatalogExpiration[]>;
  catalogExpiration_displayedColumns: string[] = ['ME_PART_NUMBER', 'ME_KIT_DESC', 'ME_CATALOG_EXPIRE', 'COMMENTS', 'LAST_UPDATES'];
  catalogExpirationDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'ME_KIT_DESC', 'ME_CATALOG_EXPIRE', 'ME_SHELF_LIFE_MONTHS', 'ME_CATALOG_PRICE', 'ME_AWU', 'LAST_UPDATES', 'COMMENTS'];
  datasource: MatTableDataSource<any>;
  detaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName = 'AOS Review - ' + this.currentDate + '.xlsx';
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  hideLoading: boolean = true;

  constructor(
    private plannerService: PlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.refreshNeeded$
      .subscribe(() =>
        this.getAllCatalogExpirationByPlanner(plannerName)
      )
    this.getAllCatalogExpirationByPlanner(plannerName);
    this.getAllCatalogExpirationDetailByPlanner(plannerName);
    }

  private getAllCatalogExpirationByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getCatalogExpirationByPlanner(plannerName.value)    
      .subscribe(data => { 
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
    });
  }

  private getAllCatalogExpirationDetailByPlanner(plannerName) { 
    this.plannerService.getAllCatalogExpirationDetailByPlanner(plannerName.value)    
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
}

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Catalog Expiration";
    this.plannerService.setMeNumber(valObj);
  }

  sortCatalogExpiration(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.plannerService.getCatalogExpirationByPlanner(plannerName.value, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
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
