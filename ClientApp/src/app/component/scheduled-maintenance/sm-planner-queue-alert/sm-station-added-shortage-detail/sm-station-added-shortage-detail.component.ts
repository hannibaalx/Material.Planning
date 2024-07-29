import { ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';

@Component({
  selector: 'app-sm-station-added-shortage-detail',
  templateUrl: './sm-station-added-shortage-detail.component.html',
  styleUrls: ['./sm-station-added-shortage-detail.component.css']
})
export class SmStationAddedShortageDetailComponent implements OnInit {
  datasource: MatTableDataSource<any>;
  fromDialog: string;
  station_added_shortage_detail_displayedColumns = ['ME_PART_NUMBER_USED', 'STATION', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'THREHOLD'];
  
  @ViewChild('closebtn') closeBtn: MatButton;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private smPlannerQueueService: SmPlannerQueueService,
    public dialogRef: MatDialogRef<SmStationAddedShortageDetailComponent>,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.smPlannerQueueService.getStationsAddedShortageDetails(this.data.dash8, this.data.mepartnumberused)
      .subscribe(results => {
        // console.log(results.toString());
        this.datasource = new MatTableDataSource(results);      
    });
  }

  ngAfterViewInit() { 
    this.closeBtn.focus();
    this.cd.detectChanges();
  }

  sortStationAddedShortageDetail(event: Sort) { 
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.smPlannerQueueService.getStationsAddedShortageDetails(this.data.dash8, this.data.mepartnumberused, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
    });
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
