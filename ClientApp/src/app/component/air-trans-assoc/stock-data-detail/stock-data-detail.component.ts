import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap} from 'rxjs/operators';
import { PartService } from '../../../service/part.service';
import { StockDetail } from '../../../models/stock-detail';
import { StockTotal } from '../../../models/stock-total';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-data-detail',
  templateUrl: './stock-data-detail.component.html',
  styleUrls: ['./stock-data-detail.component.css']
})
export class StockDataDetailComponent implements OnInit {
  public stockDetail$: Observable<StockDetail[]>;
  public detailType: string;
  public reqpostatus: string;
  public so_displayedColumns: string[] = ['STATION', 'SHIP_FROM_STATION', 'ORDER_DATE', 'ORDER_QTY', 'QUANTITY_FILLED', 'CATEGORY', 'ORDER_STATUS', 'CREATE_USER'];
  public po_displayedColumns: string[] = ['ORDER_NUMBER', 'STATION', 'SUPPLIER_NAME', 'ORDER_DATE', 'ORDER_QTY', 'RECEIVED_QTY', 'TYPESTATUS', 'ORDER_STATUS', 'Responsibility', 'ANALYST_RELEASE_DATE', 'COMMITTED_DELIVER_DATE','AWB', 'LEAD_TIME', 'STATUS', 'DAYS_LATE', 'CREATE_USER'];
  public ro_displayedColumns: string[] = ['ORDER_NUMBER', 'STATION', 'SHIP_FROM_STATION', 'VENDOR_NAME', 'ORDER_DATE', 'ORDER_QTY', 'RECEIVED_QTY', 'CATEGORY', 'ORDER_STATUS', 'RO_REQUIRED_DATE', 'STATUS', 'DAYS_LATE'];
  public datasource: MatTableDataSource<any>;
  public id: string;
  public station: string;
  public type: string;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Stock Data Detail - ' + this.currentDate + '.xlsx';
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private route: ActivatedRoute,
    private partService: PartService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.station = this.route.snapshot.params['station'];
    this.detailType = this.route.snapshot.params['otype'];
    this.reqpostatus = this.route.snapshot.params['reqpostatus'];
    
    this.stockDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => 
          this.partService.getStockDetails(params.get('id'), params.get('station'), params.get('otype'), params.get('reqpostatus'))
      )
    );

    this.stockDetail$.subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
    });
  }

  sortDetail(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.partService.getStockDetails(this.id, this.station, this.detailType, this.reqpostatus, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
    });
  }
}
