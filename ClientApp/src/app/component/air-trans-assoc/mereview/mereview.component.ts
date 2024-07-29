import { ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
// import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-mereview',
  templateUrl: './mereview.component.html',
  styleUrls: ['./mereview.component.css']
})
  
export class MereviewComponent implements OnInit {
  fromDialog: string;
  menumber: string;
  arrmenumber: MatTableDataSource<any>;
  displayedColumns = ['menumber', 'comments'];

  @ViewChild('closebtn') closeBtn: MatButton;

  constructor(
    public dialogRef: MatDialogRef<MereviewComponent>,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
) { }

ngOnInit() {
  this.menumber = this.data.value;
  this.arrmenumber = new MatTableDataSource(this.data.value);
    // .data(this.data.value);
}
  
  ngAfterViewInit() { 
    this.closeBtn.focus();
    this.cd.detectChanges();
  }

  savecomment(value: string) {
    this.snackBar.open('Comment saved for part number ' + value, 'Close', {
      duration: 3000
    });
  }
  
  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }
}


