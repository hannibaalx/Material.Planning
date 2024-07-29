import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SmMinScheduledDate } from 'src/app/models/sm-min-scheduled-date';
import { SchedmaintService } from 'src/app/service/schedmaint.service';

@Component({
  selector: 'app-sm-min-scheduled-date',
  templateUrl: './sm-min-scheduled-date.component.html',
  styleUrls: ['./sm-min-scheduled-date.component.css']
})
export class SmMinScheduledDateComponent implements OnInit {
  public msd_displayedColumns: string[] = ['SCHDLD_DATE', 'AC', 'STATION'];
  public datasource: MatTableDataSource<any>;
  _today: Date = new Date();
  contentData: SmMinScheduledDate = { SCHDLD_DATE: this._today, AC: '', STATION: '' };
  fromDialog: string;

  constructor(
    private schedMaintService: SchedmaintService,
    public dialogRef: MatDialogRef<SmMinScheduledDateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.schedMaintService.getMinScheduledDate(this.data.dash8)
      .subscribe(data => { 
        // console.log(data);
        return this.datasource = new MatTableDataSource(data);
      }); 
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }
}
