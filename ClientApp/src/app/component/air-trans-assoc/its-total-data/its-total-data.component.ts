
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ItsTotalDetail } from 'src/app/models/its-total-detail';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { PartService } from 'src/app/service/part.service';
import { switchMap } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-its-total-data',
  templateUrl: './its-total-data.component.html',
  styleUrls: ['./its-total-data.component.css']
})
export class ItsTotalDataComponent implements OnInit {
  public itsTotalDetail$: Observable<ItsTotalDetail[]>;
  public its_total_displayedColumns: string[] = ['TRACKING_NUMBER', 'SERIAL_NUMBER', 'FROM_STA', 'TO_STA', 'ACTIVITY_DATE', 'COMPNT_TRACK_LOC_TXT', 'TRANSFER_TYPE'];
  public datasource: MatTableDataSource<any>;
  public itsId: string;

  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Stock Data Detail - ' + this.currentDate + '.xlsx';

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private partService: PartService
  ) { }

  ngOnInit() {
    this.itsTotalDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.itsId = params.get('id'),
          this.partService.getItsTotalDetails(params.get('id'))
        )
      )
    );

    this.itsTotalDetail$.subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
    });
  }

  sortItsTotalDetail(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.partService.getItsTotalDetails(this.itsId, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
    });
  }
}
