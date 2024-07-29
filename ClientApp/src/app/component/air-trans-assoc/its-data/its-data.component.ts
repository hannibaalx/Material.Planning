import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ItsDetail } from 'src/app/models/its-detail';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PartService } from 'src/app/service/part.service';
import { switchMap } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-its-data',
  templateUrl: './its-data.component.html',
  styleUrls: ['./its-data.component.css']
})
export class ItsDataComponent implements OnInit {
  public itsDetail$: Observable<ItsDetail[]>;
  public its_displayedColumns: string[] = ['TRACKING_NUMBER', 'SERIAL_NUMBER', 'FROM_STA', 'TO_STA', 'ACTIVITY_DATE', 'COMPNT_TRACK_LOC_TXT', 'TRANSFER_TYPE'];
  public datasource: MatTableDataSource<any>;
  public itsId: string;
  public itsStation: string;

  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Stock Data Detail - ' + this.currentDate + '.xlsx';

  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private route: ActivatedRoute,
    private partService: PartService
  ) { }

  ngOnInit() {
    this.itsDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.itsId = params.get('id'),
          this.itsStation = params.get('station'),
          this.partService.getItsDetails(params.get('id'), params.get('station'))
        )
      )
    );

  this.itsDetail$.subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
    });
  }

  sortItsDetail(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.partService.getItsDetails(this.itsId, this.itsStation, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
    });
  }
}
