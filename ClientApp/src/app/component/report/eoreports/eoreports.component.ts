import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

declare var $: any;

@Component({
  selector: 'app-eoreports',
  templateUrl: './eoreports.component.html',
  styleUrls: ['./eoreports.component.css']
})
export class EoreportsComponent implements OnInit {
  // currentUser: string;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(
    
  ) { }

  ngOnInit() {
    $("*").tooltip('dispose'); //had to add this because bootstrap doesn't hide/destroy tooltip if you navigate to another page
    // this.currentUser = this.userService.getUser().displayName;
    //this.tabGroup.selectedIndex = 0;
  }

  ngOnDestroy() {
    
   }

}
