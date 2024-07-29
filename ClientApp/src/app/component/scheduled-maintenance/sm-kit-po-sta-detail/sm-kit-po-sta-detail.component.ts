import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SmPoDetail } from 'src/app/models/sm-po-detail';
import { SchedmaintService } from 'src/app/service/schedmaint.service';

@Component({
  selector: 'app-sm-kit-po-sta-detail',
  templateUrl: './sm-kit-po-sta-detail.component.html',
  styleUrls: ['./sm-kit-po-sta-detail.component.css']
})
export class SmKitPoStaDetailComponent implements OnInit {
  smPoDetail$: Observable<SmPoDetail[]>;
  public datasource: MatTableDataSource<any>;
  public smKitPoDetail_displayedColumns: string[] = ['ME_PART_NUMBER','MFG_PART_NUMBER', 'PO_NUMBER', 'ORDER_STATUS_IND_DESC','ORDER_DATE','RECEIVED_DATE','REQUIRED_DATE','UNIT_COST','VENDOR_NAME','BUYER_CODE','BUYER_EMPLOYEE_NUMBER','PO_REQSTER','PO_REQSTER_LAST_NAME','PO_REQSTER_FIRST_NAME','STATION','PURCHASE_QTY_ON_ORDER','TOTAL_QTY_RECEIVED','OPEN_QTY','COMMENT_LINE'];
  public mePartNumberUsed: string= "";

  constructor(
    private schedMaintService: SchedmaintService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mePartNumberUsed = params['id'];
      this.schedMaintService.getSmPoDetails(params['id'])
        .subscribe(data => {
          return this.datasource = new MatTableDataSource(data);
        })
    })
  }

}
