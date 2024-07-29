import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

declare var $: any;

@Component({
  selector: 'app-eo-report',
  templateUrl: './eo-report.component.html',
  styleUrls: ['./eo-report.component.css']
})
export class EoReportComponent implements OnInit, OnDestroy {
  

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    $("*").tooltip('dispose'); //had to add this because bootstrap doesn't hide/destroy tooltip if you navigate to another page

  }

  ngOnDestroy() {
    
   }

}
