import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EcoService } from 'src/app/service/eco.service';
import { SchedmaintService } from 'src/app/service/schedmaint.service';

@Component({
  selector: 'app-sm-po-sta-detail',
  templateUrl: './sm-po-sta-detail.component.html',
  styleUrls: ['./sm-po-sta-detail.component.css']
})
export class SmPoStaDetailComponent implements OnInit {
  dash8id: string;
  menumberid: string;
  public datasource: MatTableDataSource<any>;
  smPoStaDetail_displayedColumns: string[] = ['ME_PART_NUMBER','MFG_PART_NUMBER', 'PO_NUMBER', 'ORDER_STATUS_IND_DESC','ORDER_DATE','RECEIVED_DATE','REQUIRED_DATE','UNIT_COST','VENDOR_NAME','BUYER_CODE','BUYER_EMPLOYEE_NUMBER','PO_REQSTER','PO_REQSTER_LAST_NAME','PO_REQSTER_FIRST_NAME','STATION','PURCHASE_QTY_ON_ORDER','TOTAL_QTY_RECEIVED','OPEN_QTY','COMMENT_LINE'];

  constructor(
    private schedMaintService: SchedmaintService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.dash8id = params['dash8'].trim(),
      this.menumberid = params['id'].trim(),
      this.schedMaintService.getSmPoStationDetails(params['id'].trim(), params['station'].trim())
        .subscribe(data => { 
          return this.datasource = new MatTableDataSource(data);
        })
    })
  }

}
