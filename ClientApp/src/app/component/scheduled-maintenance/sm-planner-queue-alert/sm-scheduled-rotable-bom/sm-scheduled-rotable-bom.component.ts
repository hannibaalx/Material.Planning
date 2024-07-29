import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatChipInput } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { SmPlannerQueueService } from 'src/app/service/sm-planner-queue.service';
import { SmQueueRule } from 'src/app/models/sm-queue-rule';
import * as moment from 'moment';

import { SmNumberRule } from 'src/app/models/sm-number-rule';
import { timer } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { SmNextDueDateDetailComponent } from '../sm-next-due-date-detail/sm-next-due-date-detail.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sm-scheduled-rotable-bom',
  templateUrl: './sm-scheduled-rotable-bom.component.html',
  styleUrls: ['./sm-scheduled-rotable-bom.component.css']
})
export class SmScheduledRotableBomComponent implements OnInit {
  scheduledRotableBom_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD_DESCRIPTION', 'NEXT_DUE_DATE', 'DAYSINQUEUE'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  currentDate = moment().format('YYYY-DD-MM hh:mm');
  fileName = 'SCHEDULED ROTABLE BOM - ' + this.currentDate;
  public currentSmObj = new SmQueueRule();
  public fleetReq: string = "";
  currentUser: string;
  public newSmObj = new SmQueueRule();
  dialogValue: string;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  hideLoading: boolean = true;

  constructor(
    private smPlannerQueueService: SmPlannerQueueService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    this.currentUser = this.user.display_name;

    this.smPlannerQueueService.refreshNeeded$
    .subscribe(() =>
      this.getScheduledRotableBomByFleet()
    )

  this.getScheduledRotableBomByFleet();
  }

  getScheduledRotableBomByFleet() {
    const fleetCode = document.getElementById('fleetCode') as HTMLFormElement;
    let ruleObj = new SmQueueRule();
    ruleObj.FLEET = fleetCode.value;
    ruleObj.RULE = 'SCHEDULED ROTABLE BOM';
    
    this.currentSmObj = ruleObj;
    if (this.currentSmObj.RULE === undefined) {
      this.getScheduledRotableBomByFleet();
    }
    else {
      this.hideLoading = false;
      this.smPlannerQueueService.getScheduledRotableBomByFleet(ruleObj.FLEET)
        .subscribe(data => {
          this.datasource = new MatTableDataSource(data);
          this.hideLoading = true;
        });
    }
  }

  sortScheduledRotableBom(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    this.hideLoading = false;
    this.smPlannerQueueService.getScheduledRotableBomByFleet(this.currentSmObj.FLEET, orderby, sorttype)
      .subscribe(data => {
        this.datasource = new MatTableDataSource(data);
        this.datasource.sort = this.sort;
        this.hideLoading = true;
      });
  }

  sendSMDetails(value: string) {
    this.currentSmObj.ME_PART_NUMBER = value;
    this.currentSmObj.FLEET = this.currentSmObj.FLEET;
    this.currentSmObj.RULE = "SCHEDULED ROTABLE BOM";
    this.currentSmObj.PLANNER = this.currentUser;
    this.currentSmObj.SHOWCOMMENTSECTION = true;
    this.smPlannerQueueService.setSmQueueRule(this.currentSmObj);

    this.smPlannerQueueService.getSmQueueRule()
      .subscribe(data => {
        if (data) {
          this.newSmObj.ME_PART_NUMBER = data.ME_PART_NUMBER;
          this.newSmObj.FLEET = data.FLEET;
          this.newSmObj.RULE = data.RULE;
          this.newSmObj.PLANNER = data.PLANNER;
          this.newSmObj.SHOWCOMMENTSECTION = data.SHOWCOMMENTSECTION;
          //this.newSmObj.ME_PART_NUMBER_USED = data.ME_PART_NUMBER_USED;
        }
      });
  }

  openNextDueDateDetailModal(dash8: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.maxWidth = '600px';
    dialogConfig.data = { dash8: dash8 };

    let dialogRef = this.dialog.open(
      SmNextDueDateDetailComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      //this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
      this.dialogValue = result.data;
    });
   }
}
