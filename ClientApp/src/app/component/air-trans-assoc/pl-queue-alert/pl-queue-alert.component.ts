import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, toArray } from 'rxjs/operators';
import { ReviewReasonNotification } from './../../../models/review-reason-notification';
import { PlannerService } from 'src/app/service/planner.service';
import { MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { UserService } from 'src/app/service/user.service';
import { MeEcoHistoryComponent } from '../me-eco-history/me-eco-history.component';
import { MeEcoComments } from 'src/app/models/me-eco-comments';
import { MeEcoInsertHistoryComponent } from '../me-eco-insert-history/me-eco-insert-history.component';
import { ActivatedRoute, Params } from '@angular/router';
import { PartService } from 'src/app/service/part.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-pl-queue-alert',
  templateUrl: './pl-queue-alert.component.html',
  styleUrls: ['./pl-queue-alert.component.css']
})
export class PlQueueAlertComponent implements OnInit, OnDestroy {
  private searchMEnumber = new Subject<string>();
  private subscription = new Subscription();
  public revReasonQueues: ReviewReasonNotification[];
  public revReasonAlerts: ReviewReasonNotification[];
  public notification: ReviewReasonNotification[] = [];
  public hideReviewNotification = true;
  public meNumber: string;
  public plannerName: string;
  public dialogValue: string;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  
  public latestEcoComment: MeEcoComments[];
  public latestMeComment: MeEcoComments[];
  public optimalOwnershipMessage: string = "";
  public previousOptimalOwnership: string = "";
    
  @ViewChild('tabRef') tabRef: MatTabGroup;
  @ViewChild('commentTabs', { static: false }) commentTabs;

  constructor(
    private route: ActivatedRoute,
    private plannerService: PlannerService,
    private partService: PartService,
    private userService: UserService,
    public dialog: MatDialog
  ) { }
  
  ngOnInit() {
    // this.revReasonNot$ = this.searchMEnumber.pipe(
    //   debounceTime(300), // wait 300ms after each keystroke before considering the term
    //   distinctUntilChanged(), // ignore new term if same as previous term
    //   switchMap((newMenumber: string) => this.plannerService.getReviewReasonByMeNumber(newMenumber.trim())
    //   ) // switch to new search observable each time the newMenumber changes
    // );
    /*
    this.revReasonQueues$ = this.searchMEnumber.pipe(
      debounceTime(300), // wait 300ms after each keystroke before considering the term
      distinctUntilChanged(), // ignore new term if same as previous term
      switchMap((newMenumber: string) => this.plannerService.getReviewReasonQueuesByMeNumber(newMenumber.trim()) // switch to new search observable each time the newMenumber changes
      )
    );

    this.revReasonAlerts$ = this.searchMEnumber.pipe(
      debounceTime(300), // wait 300ms after each keystroke before considering the term
      distinctUntilChanged(), // ignore new term if same as previous term
      switchMap((newMenumber: string) =>
        this.plannerService.getReviewReasonAlertsByMeNumber(newMenumber.trim()))
        
    )
    */
    // switch to new search observable each time the newMenumber changes
    //console.log(this.revReasonAlerts$);

    this.hideReviewNotification = true;

    this.partService.getCurrentMeNumber().subscribe(value => {
      if(value.length == 14 && value != this.meNumber){
        this.meNumber = value; //Assigned for validation on search button click and window load to avoid duplicate API requests.

        this.plannerService.getReviewReasonQueuesByMeNumber(value)
          .subscribe((data) => {
            this.revReasonQueues= [];
            data.forEach(reviewReasonQueue => {this.revReasonQueues.push(reviewReasonQueue)})
        });

        this.plannerService.getReviewReasonAlertsByMeNumber(value)
          .subscribe((data) => {
            this.revReasonAlerts= [];
            data.forEach(reviewReasonAlert => {this.revReasonAlerts.push(reviewReasonAlert)})
        });
        
        this.plannerService.getLatestMeComment(value)
          .subscribe((data) => {
            this.latestMeComment = [];
            data.forEach(meComment => {this.latestMeComment.push(meComment)})
        });

        this.plannerService.getLatestEcoComment(value)
          .subscribe((data) => {
            this.latestEcoComment= [];
            data.forEach(ecoComment => {this.latestEcoComment.push(ecoComment)})
        });

        this.hideReviewNotification = false;
      }
    });      

    let _temp = JSON.parse(localStorage.getItem('userInfo'));
    if (_temp !== null)
      this.user = _temp;
    // const meInput = document.getElementById('part-search-input') as HTMLFormElement;
    const meInput = document.getElementById('currentMeNumber-input') as HTMLFormElement;
    let btnSearch = document.getElementById("btnSearch") as HTMLButtonElement;

    const subSearch = fromEvent(btnSearch, 'click')
            .subscribe((e: Event) => {
              var val : string = meInput.value;
              if (val.length == 14 && val != this.meNumber) {
                this.meNumber = val;
                this.searchMEnumber.next(val);

                this.plannerService.getReviewReasonQueuesByMeNumber(val)
                  .subscribe((data) => {
                    this.revReasonQueues= [];
                    data.forEach(reviewReasonQueue => {this.revReasonQueues.push(reviewReasonQueue)})
                });

                this.plannerService.getReviewReasonAlertsByMeNumber(val)
                  .subscribe((data) => {
                    this.revReasonAlerts= [];
                    data.forEach(reviewReasonAlert => {this.revReasonAlerts.push(reviewReasonAlert)})
                });

                this.plannerService.getLatestMeComment(val)
                  .subscribe((data) => {
                    this.latestMeComment= [];
                    data.forEach(meComment => {this.latestMeComment.push(meComment)})
                });

                this.plannerService.getLatestEcoComment(val)
                  .subscribe((data) => {
                    this.latestEcoComment= [];
                    data.forEach(ecoComment => {this.latestEcoComment.push(ecoComment)})
                });

                this.tabRef.realignInkBar();
                this.hideReviewNotification = false;
              }
            });    
    
    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          const subLoad = fromEvent(window, 'load')
            .subscribe((e: Event) => {
                meInput.value = params['id'];
                if (meInput.value.length == 14 && meInput.value != this.meNumber) {
                  this.meNumber = meInput.value;
                  this.searchMEnumber.next(meInput.value);
                 
                  this.plannerService.getReviewReasonQueuesByMeNumber(this.meNumber)
                    .subscribe((data) => {
                      this.revReasonQueues= [];
                      data.forEach(reviewReasonQueue => {this.revReasonQueues.push(reviewReasonQueue)})
                  });

                  this.plannerService.getReviewReasonAlertsByMeNumber(this.meNumber)
                    .subscribe((data) => {
                      this.revReasonAlerts= [];
                      data.forEach(reviewReasonAlert => {this.revReasonAlerts.push(reviewReasonAlert)})
                  });
                  
                  this.plannerService.getLatestMeComment(this.meNumber)
                        .subscribe((data) => {
                          this.latestMeComment = [];
                          data.forEach(meComment => {this.latestMeComment.push(meComment)})
                        });

                  this.plannerService.getLatestEcoComment(this.meNumber)
                    .subscribe((data) => {
                      this.latestEcoComment= [];
                      data.forEach(ecoComment => {this.latestEcoComment.push(ecoComment)})
                    });


                  this.tabRef.realignInkBar();
                  this.hideReviewNotification = false;
                }
            });
        }
      }
    );

  }

  openHistory(menumber: string, historytype: string) { 

  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.width = '590px';
  dialogConfig.maxWidth = '590px';
  dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, historytype: historytype  }

  let dialogRef = this.dialog.open(
    MeEcoHistoryComponent, dialogConfig  
  );
    
  dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      // this.setMeRule(this.meRule);

      this.plannerService.getReviewReasonQueuesByMeNumber(this.meNumber)
        .subscribe((data) => {
          this.revReasonQueues= [];
          data.forEach(reviewReasonQueue => {this.revReasonQueues.push(reviewReasonQueue)})
      });

      this.plannerService.getReviewReasonAlertsByMeNumber(this.meNumber)
        .subscribe((data) => {
          this.revReasonAlerts= [];
          data.forEach(reviewReasonAlert => {this.revReasonAlerts.push(reviewReasonAlert)})
      });

      this.plannerService.getLatestMeComment(this.meNumber)
        .subscribe((data) => {
          this.latestMeComment = [];
          data.forEach(meComment => {this.latestMeComment.push(meComment)})
      });

      this.plannerService.getLatestEcoComment(this.meNumber)
        .subscribe((data) => {
          this.latestEcoComment = [];
          data.forEach(ecoComment => {this.latestEcoComment.push(ecoComment)})
      });

      this.dialogValue = result.data;
    });
  }

  insertHistory(menumber: string, historytype: string) {
    // let _temp = JSON.parse(localStorage.getItem('userInfo'));
    // if (_temp !== null)
    //   this.user = _temp;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { plannerName: this.user.display_name, menumber: menumber, historytype: historytype }

    let dialogRef = this.dialog.open(
      MeEcoInsertHistoryComponent, dialogConfig
    );

      dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      // this.setMeRule(this.meRule);
      this.plannerService.getReviewReasonQueuesByMeNumber(this.meNumber)
        .subscribe((data) => {
          this.revReasonQueues= [];
          data.forEach(reviewReasonQueue => {this.revReasonQueues.push(reviewReasonQueue)})
      });

      this.plannerService.getReviewReasonAlertsByMeNumber(this.meNumber)
        .subscribe((data) => {
          this.revReasonAlerts= [];
          data.forEach(reviewReasonAlert => {this.revReasonAlerts.push(reviewReasonAlert)})
      });

      this.plannerService.getLatestMeComment(this.meNumber)
      .subscribe((data) => {
          this.latestMeComment = [];
          data.forEach(meComment => { this.latestMeComment.push(meComment) });

          this.plannerService.getLatestMeComment(data[0].ME_PART_NUMBER)
          .subscribe(data => {
            this.previousOptimalOwnership = data[0]?.OPTIMAL_OWNERSHIP?.toString();
            this.plannerService.getMeCommentByMeNumber(data[0].ME_PART_NUMBER)
              .subscribe(data => {
                this.optimalOwnershipMessage = "Optimal Ownership changed to: " + data[0].OPTIMAL_OWNERSHIP + ".";
                this.optimalOwnershipMessage += "  Previous Optimal Ownership value is: " + this.previousOptimalOwnership;
                result.data.COMMENTS = this.optimalOwnershipMessage;
                });
          });

        });

      this.plannerService.getLatestEcoComment(this.meNumber)
        .subscribe((data) => {
          this.latestEcoComment = [];
          data.forEach(ecoComment => {this.latestEcoComment.push(ecoComment)})
        });

      this.dialogValue = result.data;
    });
  }

  // getReviewReasonNotification() { 
  //   const serviceMeNumber = this.plannerService.getCurrentMeNumber();
  //   if (serviceMeNumber.length > 0) { 
      
  //   }

    // const meInput = document.getElementById('part-search-input') as HTMLFormElement;
    // const subscription = fromEvent(meInput, 'change')
    //   .subscribe((e: Event) => {
    //     if (meInput.value.length == 14) {
    //       this.plannerService.getReviewReasonByMeNumber(meInput.value).subscribe(result => {
    //         this.notification = result;

    //       }, error => console.error(error));
    //       //this.searchTerms.next(meInput.value);
    //       console.log('alerts are back' + this.notification);
    //       this.hideReviewNotification = false;
    //     }
    //     else {
    //       this.hideReviewNotification = true;
    //       this.notification = null;
    //     }
    //     if (this.notification !== null)
    //       console.log(this.notification.values);
    //   })

  //}
  
  ngOnDestroy() { 
    //this.subscription?.unsubscribe();
  }

}
