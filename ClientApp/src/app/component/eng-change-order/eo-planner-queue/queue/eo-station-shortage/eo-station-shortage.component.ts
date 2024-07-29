import { Observable } from 'rxjs';
import { EoStationShortage } from 'src/app/models/eo-station-shortage';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-eo-station-shortage',
  templateUrl: './eo-station-shortage.component.html',
  styleUrls: ['./eo-station-shortage.component.css']
})
export class EoStationShortageComponent implements OnInit {
  stationShortageData$: Observable<EoStationShortage[]>;
  fromDialog: string;

  constructor(
    private EoPlannerService: eoPlannerService,
    public dialogRef: MatDialogRef<EoStationShortageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.stationShortageData$ = this.EoPlannerService.getStationShortageByMePartNumberUsed(this.data.mePartNumberUsed)
  }

  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

}
