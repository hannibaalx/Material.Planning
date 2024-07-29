import { ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';

@Component({
  selector: 'app-sm-next-due-date-detail',
  templateUrl: './sm-next-due-date-detail.component.html',
  styleUrls: ['./sm-next-due-date-detail.component.css']
})
export class SmNextDueDateDetailComponent implements OnInit {
  datasource: MatTableDataSource<any>;
  fromDialog: string;
  next_due_date_detail_displayedColumns = ['STATION', 'SCHDLD_DATE', 'AC'];
  
  @ViewChild('closebtn') closeBtn: MatButton;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private smPlannerQueueService: SmPlannerQueueService,
    public dialogRef: MatDialogRef<SmNextDueDateDetailComponent>,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.smPlannerQueueService.getScheduleDetail(this.data.dash8)
    .subscribe(results => {
      //console.log(results.toString());
      this.datasource = new MatTableDataSource(results);      
    });
  }

  ngAfterViewInit() { 
    this.closeBtn.focus();
    this.cd.detectChanges();
  }

  sortNextDueDataDetail(event: Sort) { 
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.smPlannerQueueService.getScheduleDetail(this.data.dash8, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
    });
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
