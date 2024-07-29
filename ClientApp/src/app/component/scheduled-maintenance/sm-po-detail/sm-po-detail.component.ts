import { Component, OnInit, ViewChild } from '@angular/core';
import { SchedmaintService } from 'src/app/service/schedmaint.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SmPoDetail } from 'src/app/models/sm-po-detail';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sm-po-detail',
  templateUrl: './sm-po-detail.component.html',
  styleUrls: ['./sm-po-detail.component.css']
})
export class SmPoDetailComponent implements OnInit {
  smPoDetail$: Observable<SmPoDetail[]>;
  public datasource: MatTableDataSource<any>;
  public smPoDetail_displayedColumns: string[] = ['ME_PART_NUMBER','MFG_PART_NUMBER', 'PO_NUMBER', 'ORDER_STATUS_IND_DESC','ORDER_DATE','RECEIVED_DATE','REQUIRED_DATE','UNIT_COST','VENDOR_NAME','BUYER_CODE','BUYER_EMPLOYEE_NUMBER','PO_REQSTER','PO_REQSTER_LAST_NAME','PO_REQSTER_FIRST_NAME','STATION','PURCHASE_QTY_ON_ORDER','TOTAL_QTY_RECEIVED','OPEN_QTY','COMMENT_LINE'];
  @ViewChild(MatSort) sort: MatSort;
  public id: string;
 
  constructor(
    private schedMaintService: SchedmaintService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.schedMaintService.getSmPoDetails(params['id'])
        .subscribe(data => {
          this.id = params['id'];
          return this.datasource = new MatTableDataSource(data);
        })
    })
  }

  sortTable(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

        this.schedMaintService.getSmPoDetails(this.id, orderby, sorttype)
          .subscribe(data => {
            this.datasource = new MatTableDataSource(data);
            this.datasource.sort = this.sort;
          });
  }
}
