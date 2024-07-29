import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { EoPartsShortage120 } from 'src/app/models/eo-parts-shortage120';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';

@Component({
  selector: 'app-part-shortage120',
  templateUrl: './part-shortage120.component.html',
  styleUrls: ['./part-shortage120.component.css']
})
export class PartShortage120Component implements OnInit {
  partShort120$: Observable<EoPartsShortage120[]>;
  bomDetail$: Observable<EoBomDetail[]>;
  currentDash8: string;
  ruleType: string = "120 Days Parts Shortage";
  previousDash8: string;
  planner: string;

  constructor(
    private eoplannerService: eoPlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    this.partShort120$ = this.eoplannerService.getPartShortage120ByPlanner(plannerName.value);
    
    // this.eoplannerService.getEoPlannerName().subscribe(planner => {
    //   this.planner = planner;
    //   this.getplanner();
    //  });
  }

  getplanner() { 
    this.partShort120$ = this.eoplannerService.getPartShortage120ByPlanner(this.planner);
  }

  sendBOMDetails(dash8: string, eonumber: string) { 
    this.currentDash8 = dash8.trim();
    if (this.currentDash8 == this.previousDash8) { 
      this.bomDetail$ = null;
      this.previousDash8 = "";
      this.eoplannerService.clearEoNumberRule;
    }
    else {
      this.previousDash8 = this.currentDash8;
      let _value = new EoNumberRule();
      const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
      _value.PLANNER = plannerName.value.trim();
      _value.DASH_8 = this.currentDash8.trim();
      _value.EO_NUMBER = eonumber.trim();
      _value.RULE = this.ruleType;
      //_value.DESCRIPTION
      this.eoplannerService.setEoNumberRule(_value);
    }
  }
}
