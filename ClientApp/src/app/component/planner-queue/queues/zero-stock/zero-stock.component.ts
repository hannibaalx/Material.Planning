import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder,FormArray, FormGroup  } from '@angular/forms';
import { PlannerService } from 'src/app/service/planner.service';
import { ZeroStock } from '../../../../models/zero-stock';
import { MeNumberRule } from 'src/app/models/me-number-rule';
// import { PqZeroStock } from '../../../../models/pq-zero-stock';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-zero-stock',
  templateUrl: './zero-stock.component.html',
  styleUrls: ['./zero-stock.component.css']
})
export class ZeroStockComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  //@ViewChild('sort', { read: MatSort }) sort: MatSort;
  //@ViewChild('sort', {static:true}) sort: MatSort;
  zerostock$: Observable<ZeroStock[]> = null;
  receivedMeRule: MeNumberRule;
  plannerName: string;
  plannerQueueForm: FormGroup;
  pqItems: FormArray;
  pqObj: FormGroup;
  hideLoading: boolean = true;

  zero_stock_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'ZERO_STOCK_COUNT', 'MainStaBalancingCount', 'OutStaBalancingCount', 'DAYSINQUEUE', 'COMMENTS', 'LAST_UPDATES'];
  zero_stock_detail_displayedColumns: string[] = ['ME_PART_NUMBER', 'KEYWORD', 'ZERO_STOCK_COUNT', 'DaysInQueue', 'ZERO_STOCK_STATION', 'DASH8_DUE_IN', 'DC', 'ALLOCATION', 'AvailableStockInDC', 'NonAllocation_Station', 'Overstock_Station', 'Overdue_PO', 'WithinTimeFrame_Po', 'Overdue_RO', 'WithinTimeFrame_RO', 'PendingReview_SO', 'LAST_UPDATES', 'COMMENTS'];
  summarydatasource: MatTableDataSource<any>= null;
  detaildatasource: MatTableDataSource<any> = null;

  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  fileName = 'Zero Stock - ' + this.currentDate + '.xlsx';
  
  @Output() setMeRule = new EventEmitter<MeNumberRule>();
  
  constructor(
    private plannerService: PlannerService,
    private fb: FormBuilder
  ) {  //
    this.plannerQueueForm = this.fb.group({
      // pqItems: this.fb.array([
      //   this.AddPQObjs()
      // ])
      id: [''],
      comment: [''] //this.plannerQueueForm.pqObjs[x].comment.length
    });
    // this.plannerQueueForm = this.fb.group({
    //   id: [''],
    //   comment: this.fb.array([
    //     this.fb.control('')
    //   ])
    // })
  }

  AddPQObjs(): FormGroup {
    //const pqItems = this.plannerQueueForm..pqItems as FormArray;
    return this.fb.group({
      id: [''],
      comment: [''] //this.plannerQueueForm.pqObjs[x].comment.length
                    //should be able to check the length of all comments before making me_part_number drop off
    });
   }

  ngOnInit() {
    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    console.log("Planner names from Planner service : " +this.plannerService.getAtaPlannerName());
    const plannerName = this.plannerService.getAtaPlannerName();
    this.plannerService.refreshNeeded$
      .subscribe(() =>
        this.getAllZeroStockByPlanner(plannerName)
      )
    this.getAllZeroStockByPlanner(plannerName);
    this.getAllZeroStockDetailByPlanner(plannerName);
  }

  private getAllZeroStockByPlanner(plannerName) {
    this.hideLoading = false;
    this.plannerService.getZeroStockByPlanner(plannerName)    
    .subscribe(data => { 
      this.summarydatasource = new MatTableDataSource(data);
      this.hideLoading = true;
    });
  }

  getAllZeroStockDetailByPlanner(plannerName) {
    this.plannerService.getZeroStockDetailByPlanner(plannerName)
    .subscribe(data => { 
      this.detaildatasource = new MatTableDataSource(data);
    });
  }

  sendMeDetails(value: string) {
    let valObj = new MeNumberRule();
    valObj.ME_PART_NUMBER = value;
    valObj.Rule = "Zero Stock";
    this.plannerService.setMeNumber(valObj);
  }
  
  ngOnDestroy(): void { 

  }

  loadPlannerComment(menumber: string, description: string, rule: string) {
    const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.zerostock$ = this.plannerService.getZeroStockByPlanner(this.plannerService.getAtaPlannerName());

    let _value = new MeNumberRule();

    _value.PlannerName = plannerName.value;
    _value.ME_PART_NUMBER = menumber;
    _value.Rule = rule;
    _value.Description = description;
    this.receivedMeRule = new MeNumberRule();
    this.receivedMeRule.ME_PART_NUMBER = menumber;
    this.receivedMeRule.Rule = rule;
    this.receivedMeRule.Description = description;
    this.receivedMeRule.PlannerName = plannerName.value;

    // this.pqzerostock$ = this.plannerService.getPQZeroStockByPlanner(_value);
    
    //this.setMeRule.emit(_value);
    //this.setMeRule.next(_value);

    //this.subscription = 
    //this.eventEmit$.subscribe(_value);

    //console.log(menumber + " - " + rule);
    //this.clickEvent.emit(menumber);
  }

  sortZeroStock(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    //const plannerName = document.getElementById('plannerControl') as HTMLFormElement;
    this.hideLoading = false;
    this.plannerService.getZeroStockByPlanner(this.plannerService.getAtaPlannerName(), orderby, sorttype)
    .subscribe(data => { 
      this.summarydatasource = new MatTableDataSource(data);
      this.summarydatasource.sort = this.sort;
      this.hideLoading = true;
    });
  }

  onSaveSubmit() {
    //[disabled]="!plannerQueueForm.valid"
    // TODO: Use EventEmitter with form value
    alert(JSON.stringify(this.plannerQueueForm.value));
    //alert(JSON.stringify(this.pqObj.value));
    console.log(JSON.stringify(this.plannerQueueForm.value));
  }

  ExcelExport() { }

}


