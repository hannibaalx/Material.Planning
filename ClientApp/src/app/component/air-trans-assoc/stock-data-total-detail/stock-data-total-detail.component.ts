import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable} from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PartService } from '../../../service/part.service';
import { StockDetail } from '../../../models/stock-detail';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-data-total-detail',
  templateUrl: './stock-data-total-detail.component.html',
  styleUrls: ['./stock-data-total-detail.component.css']
})
export class StockDataTotalDetailComponent implements OnInit {
  public stockDetailTotal$: Observable<StockDetail[]>;
  public id: string;
  public id2: StockDetail[] = [];
  public _id: StockDetail[] = [];
  public detailType: string;
  public reqpostatus: string;
  public so_total_displayedColumns: string[] = ['STATION', 'SHIP_FROM_STATION', 'ORDER_DATE', 'ORDER_QTY', 'QUANTITY_FILLED', 'CATEGORY', 'ORDER_STATUS', 'CREATE_USER'];
  public po_total_displayedColumns: string[] = ['ORDER_NUMBER', 'STATION','SUPPLIER_NAME', 'ORDER_DATE', 'ORDER_QTY', 'RECEIVED_QTY', 'TYPESTATUS', 'ORDER_STATUS', 'Responsibility', 'ANALYST_RELEASE_DATE', 'COMMITTED_DELIVER_DATE','AWB', 'LEAD_TIME', 'STATUS', 'DAYS_LATE', 'CREATE_USER'];
  public po_total_displayedColumns2: string[] = ['ME_PART_NUMBER'];
  public ro_total_displayedColumns: string[] = ['ORDER_NUMBER', 'STATION', 'SHIP_FROM_STATION', 'VENDOR_NAME', 'ORDER_DATE', 'ORDER_QTY', 'RECEIVED_QTY', 'CATEGORY', 'ORDER_STATUS', 'RO_REQUIRED_DATE', 'STATUS', 'DAYS_LATE'];
  public datasource: MatTableDataSource<any>;
  public datasource2: MatTableDataSource<any>;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName: string;
  // fileName = 'Stock Data Total Detail - ' + this.currentDate + '.xlsx';
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partService: PartService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this._id[0] = this.route.snapshot.params['id'];
    this.id2[0] = this.route.snapshot.params['id'];
    this.detailType = this.route.snapshot.params['otype'];
    this.reqpostatus = this.route.snapshot.params['reqpostatus'];
    this.fileName = this.id + " - " + this.detailType + " detail"

    this.stockDetailTotal$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => 
          this.partService.getStockTotalDetails(params.get('id'), params.get('otype'), params.get('reqpostatus'))
        )
      );
    this.stockDetailTotal$.subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      // this.datasource2 = new MatTableDataSource(data);
      // this.datasource.data.slice(1);

      // this.datasource.data.shift();
      // this.datasource._updateChangeSubscription();
    });
  }

  sortTotalDetail(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.partService.getStockTotalDetails(this.id, this.detailType, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
    });
  }
}
