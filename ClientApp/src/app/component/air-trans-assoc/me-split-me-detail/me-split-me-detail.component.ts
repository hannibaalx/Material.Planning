import { ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { PartService } from 'src/app/service/part.service';

@Component({
  selector: 'app-me-split-me-detail',
  templateUrl: './me-split-me-detail.component.html',
  styleUrls: ['./me-split-me-detail.component.css']
})
export class MeSplitMeDetailComponent implements OnInit {
  datasource: MatTableDataSource<any>;
  fromDialog: string;
  splitme_displayedColumns = ['VALUE'];

  @ViewChild('closebtn') closeBtn: MatButton;

  constructor(
    private partService: PartService,
    public dialogRef: MatDialogRef<MeSplitMeDetailComponent>,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.datasource = new MatTableDataSource(this.data);
    // this.partService.getSplitMEDetail(this.data.value)
    // .subscribe(results => {
    //   //console.log(results.toString());
    //   this.datasource = new MatTableDataSource(results);      
    // });
  }

  ngAfterViewInit() { 
    this.closeBtn.focus();
    this.cd.detectChanges();
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
