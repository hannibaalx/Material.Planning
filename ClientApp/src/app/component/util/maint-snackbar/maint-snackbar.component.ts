import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-maint-snackbar',
  templateUrl: './maint-snackbar.component.html',
  styleUrls: ['./maint-snackbar.component.css']
})
export class MaintSnackbarComponent implements OnInit {
  
  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    var currentTime = moment.utc();
    if (!moment().isDST()) {
      var warnStartTime = moment.utc("17:45", "HH:mm");
      var warnEndTime = moment.utc("18:00", "HH:mm");
  
      var maintStartTime = moment.utc('18:00', 'HH:mm');
      var maintEndTime = moment.utc("18:20", "HH:mm");
    }
    else {
      var currentTime = moment.utc();
      var warnStartTime = moment.utc("16:45", "HH:mm");
      var warnEndTime = moment.utc("17:00", "HH:mm");

      var maintStartTime = moment.utc('17:00', 'HH:mm');
      var maintEndTime = moment.utc("17:20", "HH:mm");
    }

      var warnIsBetween = currentTime.isBetween(warnStartTime, warnEndTime);
      var maintTimeIsBetween = currentTime.isBetween(maintStartTime, maintEndTime);
    
    if(false && warnIsBetween)
    this.snackBar.open('IM3 maintenance will begin at 12pm CST.', 'Close', {
      duration: 3000
    });

    if(false && maintTimeIsBetween)
    this.snackBar.open('IM3 is currently updating from 12pm to 12:20pm CST.', 'Close', {
      //duration: 3000
    });
  }

}
