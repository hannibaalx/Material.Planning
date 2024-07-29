import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ReviewReasonNotification } from './../../../models/review-reason-notification';
import { PlannerService } from 'src/app/service/planner.service';

@Component({
  selector: 'app-ata-pq-sticky-footer',
  templateUrl: './ata-pq-sticky-footer.component.html',
  styleUrls: ['./ata-pq-sticky-footer.component.css']
})
export class AtaPqStickyFooterComponent implements  OnInit, OnDestroy {
  private searchMEnumber = new Subject<string>();
  //public revReasonNot$: Observable<ReviewReasonNotification[]>;
  public revReasonQueues$: ReviewReasonNotification[];
  public revReasonAlerts$: ReviewReasonNotification[];
  public notification: ReviewReasonNotification[] = [];
  public hideReviewNotification = true;
  public meNumber: string;

  constructor(private plannerService: PlannerService) { }

  ngOnInit() {
    this.plannerService.getMeNumber().subscribe(x => { 
      if (x.ME_PART_NUMBER.length == 14) {    
        this.searchMEnumber.next(x.ME_PART_NUMBER);
        this.hideReviewNotification = false;
        this.plannerService.getReviewReasonQueuesByMeNumber(x.ME_PART_NUMBER.trim())
          .subscribe(result => { 
            console.log('queues returned:' + result.length);
            this.revReasonQueues$ = result;
          });
        this.plannerService.getReviewReasonAlertsByMeNumber(x.ME_PART_NUMBER.trim())
          .subscribe(result => { 
            console.log('alerts returned:' + result.length);
          this.revReasonAlerts$ = result;
        });
      }
      else{
        this.hideReviewNotification = true;
      }
    });
  }

  ngOnDestroy() { 
  }

}
