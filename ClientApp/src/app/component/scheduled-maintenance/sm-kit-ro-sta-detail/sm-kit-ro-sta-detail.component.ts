import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SmRoDetail } from 'src/app/models/sm-ro-detail';
import { SchedmaintService } from 'src/app/service/schedmaint.service';

@Component({
  selector: 'app-sm-kit-ro-sta-detail',
  templateUrl: './sm-kit-ro-sta-detail.component.html',
  styleUrls: ['./sm-kit-ro-sta-detail.component.css']
})
export class SmKitRoStaDetailComponent implements OnInit {
  smRoDetail$: Observable<SmRoDetail[]>;
  public datasource: MatTableDataSource<any>;
  public smKitRoDetail_displayedColumns: string[] = ['RO_NUMBER', 'ORDER_STATUS', 'ME_PART_NUMBER', 'ME_SERIAL_NUMBER', 'SHIP_STATION', 'RO_REQUEST_DATE', 'RO_RECEIVED_QTY', 'TAT', 'DATE_REMOVED', 'REMOVED_AIRCRAFT_NUMBER', 'REMOVED_ALPHA_STATION', 'DAYLATE', 'RO_OPEN_QTY', 'RO_RECEIVING_ALPHA_STATION'];
  public mePartNumberUsed: string;

  constructor(
    private schedMaintService: SchedmaintService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mePartNumberUsed = params['id'];
      this.schedMaintService.getSmRoDetails(params['id'])
        .subscribe(data => {
          return this.datasource = new MatTableDataSource(data);
        })
    })
  }

}
