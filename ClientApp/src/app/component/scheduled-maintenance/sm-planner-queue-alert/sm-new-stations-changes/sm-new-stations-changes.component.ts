import { UserService } from './../../../../service/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';
import { SmQueueRule } from 'src/app/models/sm-queue-rule';
import * as moment from 'moment';
import { timer } from 'rxjs';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sm-new-stations-changes',
  templateUrl: './sm-new-stations-changes.component.html',
  styleUrls: ['./sm-new-stations-changes.component.css']
})
export class SmNewStationsChangesComponent implements OnInit {
  newStationsChanges_displayedColumns: string[] = ['DASH_8', 'DASH8_DESC', 'WORK_NUMBER', 'CURRENT_STATION_REQUIREMENT', 'STATION_ADDED', 'STATION_DELETED', 'REVISION_DATE', 'DAYSINQUEUE'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM hh:mm');
  fileName = 'NEW STATIONS CHANGES - ' + this.currentDate;
  public currentSmObj = new SmQueueRule();
  public fleetReq: string = "";
  currentUser: string;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  hideLoading: boolean = true;

  constructor(
    private smPlannerQueueService: SmPlannerQueueService,
    //private userService: UserService
  ) {
    
   }

  ngOnInit() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    this.currentUser = this.user.display_name;

    this.smPlannerQueueService.refreshNeeded$
      .subscribe(() =>
        this.getNewStationsChangesByFleet()
    )
    this.getNewStationsChangesByFleet();
  }

  private getNewStationsChangesByFleet() {
    const fleetCode = document.getElementById('fleetCode') as HTMLFormElement;
    let ruleObj = new SmQueueRule();
    ruleObj.FLEET = fleetCode.value;
    ruleObj.RULE = 'NEW STATIONS CHANGES';

    this.currentSmObj = ruleObj;
      if (this.currentSmObj.RULE === undefined) {
        this.getNewStationsChangesByFleet();
      }
      else {
        this.hideLoading = false;  
        this.smPlannerQueueService.getNewStationsChangesByFleet(ruleObj.FLEET) 
          .subscribe(data => { 
            this.datasource = new MatTableDataSource(data);
            this.hideLoading = true;
          }); 
      }
  }

  sortNewStationsChanges(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;
    this.hideLoading = false;
    this.smPlannerQueueService.getNewStationsChangesByFleet(this.currentSmObj.FLEET, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.hideLoading = true;
    });
  }

  sendSMDetails(value: string) {
    if (value) {
      // this.smPlannerQueueService.clearSmQueueRule();
      this.currentSmObj.DASH_8 = value;
      this.currentSmObj.FLEET = this.currentSmObj.FLEET;
      this.currentSmObj.RULE = "NEW STATIONS CHANGES";
      this.currentSmObj.PLANNER = this.currentUser;
      this.currentSmObj.SHOWCOMMENTSECTION = true;
      this.smPlannerQueueService.setSmQueueRule(this.currentSmObj);
    }
  }
}
