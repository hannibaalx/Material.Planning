import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  
  constructor() { }

  ngOnInit() {
    //this.tabGroup.selectedIndex = 0;
  }

}
