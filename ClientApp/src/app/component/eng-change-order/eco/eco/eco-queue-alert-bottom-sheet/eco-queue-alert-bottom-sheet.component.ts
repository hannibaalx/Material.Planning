import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Observable} from 'rxjs';
import { EcoReviewReasonNotification } from 'src/app/models/eco-review-reason-notification';
import { EcoService } from 'src/app/service/eco.service';

@Component({
  selector: 'app-eco-queue-alert-bottom-sheet',
  templateUrl: './eco-queue-alert-bottom-sheet.component.html',
  styleUrls: ['./eco-queue-alert-bottom-sheet.component.css']
})
export class EcoQueueAlertBottomSheetComponent implements OnInit {
  public ecoRevReasonQueues$: Observable<EcoReviewReasonNotification[]>;
  public ecoRevReasonAlerts$: Observable<EcoReviewReasonNotification[]>;
  public notification: EcoReviewReasonNotification[] = [];
  public hideReviewNotification = true;

  constructor(
    private ecoService: EcoService,
    private _bottomSheetRef: MatBottomSheetRef<EcoQueueAlertBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  ngOnInit() {
    this.ecoRevReasonQueues$ = this.ecoService.getReviewReasonQueuesByDash8(this.data.dash8, this.data.planner);
    this.ecoRevReasonAlerts$ = this.ecoService.getReviewReasonAlertsByDash8(this.data.dash8, this.data.planner);
    this.hideReviewNotification = false;
    this
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
