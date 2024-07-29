import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PlannerService } from 'src/app/service/planner.service';

@Component({
  selector: 'app-sm-dash8-comment-details',
  templateUrl: './sm-dash8-comment-details.component.html',
  styleUrls: ['./sm-dash8-comment-details.component.css']
})
export class SmDash8CommentDetailsComponent implements OnInit {
  public dash8commentdetails_displayedColumns: string[] = ['DASH8', 'DASH8_DESC', 'NOSE', 'STATION', 'MIN_DATE','IAG_SCHD', 'REQUIRED_IND', 'QUANTITY_REQUIRED'];
  datasource: MatTableDataSource<any>;
  fromDialog: string;

  constructor(
    private plannerService: PlannerService,
    public dialogRef: MatDialogRef<SmDash8CommentDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.plannerService.getPQSMBaselineStationShortageSchduleByME(this.data.menumber, this.data.requirement, this.data.station)
        .subscribe(data => {
          return this.datasource = new MatTableDataSource(data);
        });
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
