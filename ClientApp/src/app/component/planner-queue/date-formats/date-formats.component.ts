import { Component, OnInit } from '@angular/core';
      
export const DATE_FORMATS = {
    parse: {
      dateInput: 'YYYY-MM-DD',
    },
    display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
}; 
@Component({
  selector: 'app-date-formats',
  templateUrl: './date-formats.component.html',
  styleUrls: ['./date-formats.component.css']
})
export class DateFormatsComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
