import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { SmSoDetail } from 'src/app/models/sm-so-detail';
import { SchedmaintService } from 'src/app/service/schedmaint.service';

@Component({
  selector: 'app-sm-so-sta-detail',
  templateUrl: './sm-so-sta-detail.component.html',
  styleUrls: ['./sm-so-sta-detail.component.css']
})
export class SmSoStaDetailComponent implements OnInit {
  smRoDetail$: Observable<SmSoDetail[]>;
  public datasource: MatTableDataSource<any>;
  smSoStaDetail_displayedColumns: string[] = ['ME_PART_NUMBER', 'SHIP_FROM_STA', 'STATION', 'DATE_ORDERED', 'QUANTITY_ORDERED', 'ORDER_STATUS', 'QTY_FILLED', 'STA_SO_OPEN_QTY']
  dash8id: string;
  menumberid: string;

  constructor(
    private schedMaintService: SchedmaintService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.dash8id = params['dash8'].trim(),
        this.menumberid = params['id'].trim(),
        this.schedMaintService.getSmSoStationDetails(params['id'].trim(), params['station'].trim())
          .subscribe(data => { 
            return this.datasource = new MatTableDataSource(data);
          })
    })
  }

}
