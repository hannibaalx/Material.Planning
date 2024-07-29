import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { eoPlannerService } from 'src/app/service/eoPlanner.service';
import { EoBomDetail } from 'src/app/models/eo-bom-detail';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { EoPartsShortage90 } from 'src/app/models/eo-parts-shortage90';

@Component({
  selector: 'app-part-shortage90',
  templateUrl: './part-shortage90.component.html',
  styleUrls: ['./part-shortage90.component.css']
})
export class PartShortage90Component implements OnInit {
  partShort90$: Observable<EoPartsShortage90[]>;
  bomDetail$: Observable<EoBomDetail[]>;
  currentDash8: string;
  ruleType: string = "90 Days Parts Shortage";
  previousDash8: string;
  planner: string;

  constructor(
    private eoplannerService: eoPlannerService
  ) { }

  ngOnInit() {
    const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    this.partShort90$ = this.eoplannerService.getPartShortage90ByPlanner(plannerName.value);

    // this.eoplannerService.getEoPlannerName().subscribe(planner => {
    //   this.planner = planner;
    //   this.getplanner();
    //  });
  }

  getplanner() { 
    this.partShort90$ = this.eoplannerService.getPartShortage90ByPlanner(this.planner);
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
