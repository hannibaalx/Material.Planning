import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { Mel } from 'src/app/models/mel';
import { MeNumberRule } from 'src/app/models/me-number-rule';

@Component({
  selector: 'app-mel',
  templateUrl: './mel.component.html',
  styleUrls: ['./mel.component.css']
})
export class MelComponent implements OnInit {
  mel$: Observable<Mel[]>;

  @Output() setMeRule = new EventEmitter<MeNumberRule>();

  constructor(private plannerService: PlannerService) { }

  ngOnInit() {
    const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;

    this.mel$ = this.plannerService.getMELByPlanner(plannerName.value);
  }

  loadPlannerComment(menumber: string, rule: string) {
    let _value = new MeNumberRule();
    const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;
    _value.PlannerName = plannerName.value;
    _value.ME_PART_NUMBER = menumber;
    _value.Rule = rule;
    this.setMeRule.emit(_value);
  }

}
