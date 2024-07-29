import { ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { PartService } from 'src/app/service/part.service';

@Component({
  selector: 'app-me-imq-hpf-detail',
  templateUrl: './me-imq-hpf-detail.component.html',
  styleUrls: ['./me-imq-hpf-detail.component.css']
})
export class MeImqHpfDetailComponent implements OnInit {
  datasource1: MatTableDataSource<any>;
  datasource2: MatTableDataSource<any>;
  fromDialog: string;
  imq_comment_displayedColumns = ['IMQ_COMMENT'];
  hpf_comment_displayedColumns = ['HPF_COMMENT'];
  
  @ViewChild('closebtn') closeBtn: MatButton;
  // @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    //private smPlannerQueueService: SmPlannerQueueService,
    private partService: PartService,
    public dialogRef: MatDialogRef<MeImqHpfDetailComponent>,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.partService.getImqHpfDetail(this.data.value, "IMQ")
    .subscribe(results => {
      //console.log(results.toString());
      this.datasource1 = new MatTableDataSource(results);      
    });

    this.partService.getImqHpfDetail(this.data.value, "HPF")
    .subscribe(results => {
      //console.log(results.toString());
      this.datasource2 = new MatTableDataSource(results);      
    });
  }

  ngAfterViewInit() { 
    this.closeBtn.focus();
    this.cd.detectChanges();
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
