import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';
import { SmQueueRule } from 'src/app/models/sm-queue-rule';
import * as moment from 'moment';
import { SmNumberRule } from 'src/app/models/sm-number-rule';
import { User } from 'src/app/models/user';
import { SmDeferralReviewCommentsComponent } from '../sm-deferral-review-comments/sm-deferral-review-comments.component';

@Component({
  selector: 'app-sm-deferral-review',
  templateUrl: './sm-deferral-review.component.html',
  styleUrls: ['./sm-deferral-review.component.css']
})
export class SmDeferralReviewComponent implements OnInit {
  deferralreview_displayedColumns: string[] = ['DASH_8', 'TASKNUMBER', 'TASKTYPE', 'TASKDESCRIPTION', 'BOWTYPE', 'STATION', 'AIRCRAFT', 'SCHEDULEDDATE', 'DAYSINQUEUE'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM hh:mm');
  fileName = 'DEFERRAL REVIEW - ' + this.currentDate;
  public currentSmObj = new SmQueueRule();
  public fleetReq: string = "";
  currentUser: string;
  public newSmObj = new SmQueueRule();
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  hideLoading: boolean = true;

  constructor(
    private smPlannerQueueService: SmPlannerQueueService
  ) { }

  ngOnInit() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    this.currentUser = this.user.display_name;

    this.smPlannerQueueService.refreshNeeded$
      .subscribe(() =>
      this.getDeferralReviewByFleet()
    )

  this.getDeferralReviewByFleet();
  }

  getDeferralReviewByFleet() {
    const fleetCode = document.getElementById('fleetCode') as HTMLFormElement;
    let ruleObj = new SmQueueRule();
    ruleObj.FLEET = fleetCode.value;
    ruleObj.RULE = 'DEFERRAL REVIEW';
    
    this.currentSmObj = ruleObj;
    if (this.currentSmObj.RULE === undefined) {
      this.getDeferralReviewByFleet();
    }
    else {
      this.hideLoading = false;
      this.smPlannerQueueService.getDeferralReviewByFleet(ruleObj.FLEET)
        .subscribe(data => {
          this.datasource = new MatTableDataSource(data);
          this.hideLoading = true;
        });
    }
  }

  sortDeferralReview(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;
    this.hideLoading = false;

    this.smPlannerQueueService.getDeferralReviewByFleet(this.currentSmObj.FLEET, orderby, sorttype)
      .subscribe(data => {
        this.datasource = new MatTableDataSource(data);
        this.datasource.sort = this.sort;
        this.hideLoading = true;
      });
  }

  sendSMDetails(dash8: string, station: string, aircraft: string, reqpartnum: string) {
    this.currentSmObj.DASH_8 = dash8;
    this.currentSmObj.REQ_PART_NUMBER = reqpartnum;
    this.currentSmObj.FLEET = this.currentSmObj.FLEET;
    this.currentSmObj.RULE = "DEFERRAL REVIEW";
    this.currentSmObj.PLANNER = this.currentUser;
    this.currentSmObj.SHOWCOMMENTSECTION = true;
    this.currentSmObj.STATION = station;
    this.currentSmObj.AIRCRAFT = aircraft;
    this.smPlannerQueueService.setSmQueueRule(this.currentSmObj); 
  }
}
