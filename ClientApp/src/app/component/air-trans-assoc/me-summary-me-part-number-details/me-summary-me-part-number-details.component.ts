import { PartNumber } from './../../../models/partnumber';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatList, MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PartService } from 'src/app/service/part.service';

@Component({ 
  selector: 'app-me-summary-me-part-number-details',
  templateUrl: './me-summary-me-part-number-details.component.html',
  styleUrls: ['./me-summary-me-part-number-details.component.css']
})
export class MeSummaryMePartNumberDetailsComponent implements OnInit {
  @ViewChild('mePartNumberSelected', { static: true }) private mePartNumberSelected: MatSelectionList;
  mePartNumberlist$: Observable<PartNumber[]>;
  fromDialog: string;

  constructor(
    private partService: PartService,
    public dialogRef: MatDialogRef<MeSummaryMePartNumberDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    // this.mePartNumberSelected.selectedOptions = new SelectionModel<MatListOption>(false);
    this.mePartNumberSelected.selectionChange.subscribe((selectedOption: MatSelectionListChange) => {          

      this.mePartNumberSelected.deselectAll();
      selectedOption.option.selected = true;
      // console.log(selectedOption.option._text.nativeElement.innerHTML);
      this.fromDialog = selectedOption.option._text.nativeElement.innerHTML;
  });

    this.mePartNumberlist$ = this.partService.searchMeByMPN(this.data.mpn)
        // .subscribe(data => {
        //   return this.datasource = new MatTableDataSource(data);
        // });
  }

  closeDialog() {
    // console.log(this.fromDialog);
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }


}
