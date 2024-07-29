import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-im3-nav-menu',
  templateUrl: './im3-nav-menu.component.html',
  styleUrls: ['./im3-nav-menu.component.css']
})
export class Im3NavMenuComponent implements OnInit {
  isExpanded = false;
  
  constructor() { }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(): void {
  }

}
