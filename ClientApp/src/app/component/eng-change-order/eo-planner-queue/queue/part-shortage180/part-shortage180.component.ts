import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { EoPartsShortage180 } from 'src/app/models/eo-parts-shortage180';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';

@Component({
  selector: 'app-part-shortage180',
  templateUrl: './part-shortage180.component.html',
  styleUrls: ['./part-shortage180.component.css']
})
export class PartShortage180Component implements OnInit {
  partShort180$: Observable<EoPartsShortage180[]>;
  bomDetail$: Observable<EoBomDetail[]>;
  currentDash8: string;
  ruleType: string = "180 Days Parts Shortage";
  previousDash8: string;
  planner: string;

  constructor(
    private eoplannerService: eoPlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    this.partShort180$ = this.eoplannerService.getPartShortage180ByPlanner(plannerName.value);

    // this.eoplannerService.getEoPlannerName().subscribe(planner => {
    //   this.planner = planner;
    //   this.getplanner();
    //  });
  }

  getplanner() { 
    this.partShort180$ = this.eoplannerService.getPartShortage180ByPlanner(this.planner);
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
