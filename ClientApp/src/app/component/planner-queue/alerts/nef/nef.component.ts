import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { PlannerService } from 'src/app/service/planner.service';
import { Nef } from 'src/app/models/nef';
import { MeNumberRule } from 'src/app/models/me-number-rule';

@Component({
  selector: 'app-nef',
  templateUrl: './nef.component.html',
  styleUrls: ['./nef.component.css']
})
export class NefComponent implements OnInit {
  nef$: Observable<Nef[]>;

  @Output() setMeRule = new EventEmitter<MeNumberRule>();

  constructor(private plannerService: PlannerService) { }

  ngOnInit() {
    const plannerName = document.getElementById('ddlPlanner') as HTMLFormElement;

    this.nef$ = this.plannerService.getNEFByPlanner(plannerName.value);
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

