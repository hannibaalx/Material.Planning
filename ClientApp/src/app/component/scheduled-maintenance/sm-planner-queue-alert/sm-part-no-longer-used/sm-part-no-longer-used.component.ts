import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';
import { SmQueueRule } from 'src/app/models/sm-queue-rule';
import * as moment from 'moment';
import { SmNumberRule } from 'src/app/models/sm-number-rule';
import { timer } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sm-part-no-longer-used',
  templateUrl: './sm-part-no-longer-used.component.html',
  styleUrls: ['./sm-part-no-longer-used.component.css']
})
export class SmPartNoLongerUsedComponent implements OnInit {
  partNoLongerUsed_displayedColumns: string[] = ['ME_PART_NUMBER_USED', 'COUNT_SCHDLD_S', 'KEYWORD_DESCRIPTION', 'COUNTOFDASH_8', 'DAYSINQUEUE_MAX'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM hh:mm');
  fileName = 'PART NO LONGER USED - ' + this.currentDate;
  public currentSmObj = new SmQueueRule();
  public fleetReq: string = "";
  currentUser: string;
  public newSmObj = new SmQueueRule();
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role: ""  };
  hideLoading: boolean = true;

  constructor(
    private smPlannerQueueService: SmPlannerQueueService,
    private userService: UserService
  ) { }

  ngOnInit() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    // const pauseCounter = timer(2000);
    // pauseCounter.subscribe(n => {
    this.currentUser = this.user.display_name;
    // });
    
    this.smPlannerQueueService.refreshNeeded$
      .subscribe(() =>
        this.getPartNoLongerUsedByFleet()
      )

    this.getPartNoLongerUsedByFleet();
  }
  
  getPartNoLongerUsedByFleet() {
    const fleetCode = document.getElementById('fleetCode') as HTMLFormElement;
    let ruleObj = new SmQueueRule();
    ruleObj.FLEET = fleetCode.value;
    ruleObj.RULE = 'PART NO LONGER USED';
    
    this.currentSmObj = ruleObj;
    if (this.currentSmObj.RULE === undefined) {
      this.getPartNoLongerUsedByFleet();
    }
    else {
      this.hideLoading = false;
      this.smPlannerQueueService.getPartNoLongerUsedByFleet(ruleObj.FLEET)
        .subscribe(data => {
          this.datasource = new MatTableDataSource(data);
          this.hideLoading = true;
        });
    }
  }

  sortPartNoLongerUsed(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.hideLoading = false;
    this.smPlannerQueueService.getPartNoLongerUsedByFleet(this.currentSmObj.FLEET, orderby, sorttype)
      .subscribe(data => {
        this.datasource = new MatTableDataSource(data);
        this.datasource.sort = this.sort;
        this.hideLoading = true;
      });
  }

  sendSMDetails(value: string) {
    let valObj = new SmNumberRule();
    this.currentSmObj.DASH_8 = value;
    this.currentSmObj.FLEET = this.currentSmObj.FLEET;
    this.currentSmObj.RULE = "PART NO LONGER USED";
    this.currentSmObj.PLANNER = this.currentUser;
    this.currentSmObj.SHOWCOMMENTSECTION = true;
    this.smPlannerQueueService.setSmQueueRule(this.currentSmObj);

    this.smPlannerQueueService.getSmQueueRule()
      .subscribe(data => {
        if (data) {
          this.newSmObj.DASH_8 = data.DASH_8;
          this.newSmObj.FLEET = data.FLEET;
          this.newSmObj.RULE = data.RULE;
          this.newSmObj.PLANNER = data.PLANNER;
          this.newSmObj.SHOWCOMMENTSECTION = data.SHOWCOMMENTSECTION;
          this.newSmObj.ME_PART_NUMBER_USED = data.ME_PART_NUMBER_USED;
        }
      });
  }
}
