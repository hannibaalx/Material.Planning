import { Component, OnInit, ViewChild } from '@angular/core';
import { SchedmaintService } from 'src/app/service/schedmaint.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SmRoDetail } from 'src/app/models/sm-ro-detail';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sm-ro-detail',
  templateUrl: './sm-ro-detail.component.html',
  styleUrls: ['./sm-ro-detail.component.css']
})
export class SmRoDetailComponent implements OnInit {
  smRoDetail$: Observable<SmRoDetail[]>;
  public datasource: MatTableDataSource<any>;
  public smRoDetail_displayedColumns: string[] = ['RO_NUMBER', 'ORDER_STATUS', 'ME_PART_NUMBER', 'ME_SERIAL_NUMBER', 'SHIP_STATION', 'RO_REQUEST_DATE', 'RO_RECEIVED_QTY', 'TAT', 'DATE_REMOVED', 'REMOVED_AIRCRAFT_NUMBER', 'REMOVED_ALPHA_STATION', 'DAYLATE', 'RO_OPEN_QTY', 'RO_RECEIVING_ALPHA_STATION'];
  @ViewChild(MatSort) sort: MatSort;
  public id: string;

  constructor(
    private schedMaintService: SchedmaintService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
      this.schedMaintService.getSmRoDetails(params['id'])
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

        this.schedMaintService.getSmRoDetails(this.id, orderby, sorttype)
          .subscribe(data => {
            this.datasource = new MatTableDataSource(data);
            this.datasource.sort = this.sort;
          });
  }
}
