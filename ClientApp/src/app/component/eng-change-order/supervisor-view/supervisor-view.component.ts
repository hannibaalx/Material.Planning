import { EoSupervisorViewService } from './../../../service/eo-supervisor-view.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { RuleCount } from 'src/app/models/rule-count';
import { UserService } from 'src/app/service/user.service';
import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { EoPlanner } from 'src/app/models/eo-planner';
import { EoSupervisorOverview } from 'src/app/models/eo-supervisor-overview';
import { EoSupervisorOverviewTotals } from 'src/app/models/eo-supervisor-overview-totals';
import { EoSupervisorQueueSummary } from 'src/app/models/eo-supervisor-queue-summary';
import { EoSupervisorQueueDetail } from 'src/app/models/eo-supervisor-queue-detail';
import { EoDeferralHistoryReasonDetail } from 'src/app/models/eo-deferral-history-reason-detail';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-supervisor-view',
  templateUrl: './supervisor-view.component.html',
  styleUrls: ['./supervisor-view.component.css']
})
export class SupervisorViewComponent implements OnInit, OnDestroy {
  currentDate = moment().format('YYYY-MM-DD');
  currentUser: string;
  supervisor: string;
  supervisor$: Observable<EoPlanner[]>;
  supervisoroverviewtotals$: Observable<EoSupervisorOverviewTotals[]>;
  supervisoroverview$: Observable<EoSupervisorOverview[]>;
  supervisorqueuesummary$: Observable<EoSupervisorQueueSummary[]>;
  supervisorqueuedetail$: Observable<EoSupervisorQueueDetail[]>;
  ad_parts_shortage$: Observable<RuleCount[]>;
  parts_shortage_30$: Observable<RuleCount[]>;
  parts_shortage_60$: Observable<RuleCount[]>;
  parts_shortage_90$: Observable<RuleCount[]>;
  parts_shortage_120$: Observable<RuleCount[]>;
  parts_shortage_180$: Observable<RuleCount[]>;
  parts_shortage_180plus$: Observable<RuleCount[]>;
  new_dash8_no_bom$: Observable<RuleCount[]>;
  new_station_changes$: Observable<RuleCount[]>;
  capable_station_shortage$: Observable<RuleCount[]>;
  yesterday_deferral$: Observable<RuleCount[]>;
  last_year_deferral_history$: Observable<RuleCount[]>;
  deferral_history_reason_detail$: Observable<EoDeferralHistoryReasonDetail[]>;
  deferral_history_reason_detail_displayedColumns: string[] = ['SCHEDULED_DATE', 'STATION', 'NOSE', 'INBASE', 'PRIORITY', 'DATA_SOURCE'];
  reasoncodesave: string;
  currentdash8: string;
  currentsubfleet: string;
  datasource: MatTableDataSource<any>;
   
  @ViewChild(MatSort) sort: MatSort;
    
  detailheader: string = '';
  public NewEoDash8Obj: EoNumberRule; //from the dynamic queue/alerts list components
  selectedRule: string;
  ruleHeader: string;
  deferral_history_reason_title: string;
  fileName= 'ExcelReport.xlsx';

  constructor(
    private userService: UserService,
    private eoSupervisorViewService: EoSupervisorViewService
  ) { }

  ngOnInit() {
    //this.currentUser = this.userService.getUser().displayName;
    this.supervisor$ = this.eoSupervisorViewService.getEoSupervisorNames();
  }

  ngOnDestroy() {

  }

  setRule(rule2set: string) {
    if (this.supervisor == "")
      return;
    
    this.detailheader = rule2set;
    this.NewEoDash8Obj = new EoNumberRule;
    this.NewEoDash8Obj.RULE = rule2set;
    this.selectedRule = rule2set;
    this.ruleHeader = rule2set;
    this.eoSupervisorViewService.setEoSupervisorName(this.supervisor);
    this.supervisorqueuedetail$ = this.eoSupervisorViewService.getEoSupervisorQueueDetail(this.supervisor, rule2set);
}
  getRuleCountsForSupervisor(event: any) { //supervisor: string
    if ((event != null || event !== undefined)) {
      this.supervisor = event.value;
      this.detailheader = null;
      this.supervisorqueuedetail$ = null;
      this.supervisoroverviewtotals$ = this.eoSupervisorViewService.getEoSupervisorOverviewTotals(this.supervisor);
      this.supervisoroverview$ = this.eoSupervisorViewService.getEoSupervisorOverview(this.supervisor);
      this.supervisorqueuesummary$ = this.eoSupervisorViewService.getEoSupervisorQueueSummary(this.supervisor);
      this.ad_parts_shortage$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "AD Parts Shortage");
      this.parts_shortage_30$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "30 Days Parts Shortage");
      this.parts_shortage_60$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "60 Or 90 Days Parts Shortage");
      //this.parts_shortage_90$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "90 Days Parts Shortage");
      this.parts_shortage_120$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "120 Or 180 Days Parts Shortage");
      // this.parts_shortage_120$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "120 Days Parts Shortage");
      // this.parts_shortage_180$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "180 Days Parts Shortage");
      this.parts_shortage_180plus$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "180 Plus Days Parts Shortage");
      this.new_dash8_no_bom$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "New Dash 8 With No BOM");
      this.new_station_changes$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "New Stations Changes");
      this.capable_station_shortage$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "Capable Station Shortage");
      this.yesterday_deferral$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "Yesterday Deferrals");
      this.last_year_deferral_history$ = this.eoSupervisorViewService.getEoSupervisorRuleCount(this.supervisor, "Last 12 Months Deferrals History");
    }    
  }
 
  sortDeferral(event: Sort) {
    let reasoncode: string;
    let subfleet: string;
    let sorttype: string;
    let orderby: string;

    switch (event.active) {
      case "SCHEDULED DATE":
        orderby = "SCHEDULED_DATE";
        break;
      case "DATA SOURCE":
        orderby = "DATA_SOURCE";
        break;
      default:
        orderby = event.active;
        break
     }

    sorttype = event.direction;

    if (this.deferral_history_reason_title.includes('INSUFFICIENT MANPOWER'))
      reasoncode = 'IM';
    if (this.deferral_history_reason_title.includes('PARTS NIS ALLOCATED'))
      reasoncode = 'PA';
    if (this.deferral_history_reason_title.includes('ALLOCATED TOOLING NIS USV'))
      reasoncode = 'TA';
    if (this.deferral_history_reason_title.includes('TOTAL DEFERRALS'))
      reasoncode = 'TOTAL';    
    
    this.eoSupervisorViewService.getEoDeferralHistoryDetail(this.currentdash8, reasoncode, this.currentsubfleet, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
    });
    this.reasoncodesave = reasoncode;
  }

  exportexcel(tblName: string): void 
  {
     /* table id is passed over here */   
    let element = document.getElementById(tblName); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, this.fileName);
  }

  setDeferralHistoryModal(dash8: string, reasoncode: string, subfleet: string, orderby?: string, sorttype?: string) {
    if (reasoncode.length == 0)
      reasoncode = this.reasoncodesave;
    
    if (dash8.length == 0)
      dash8 = this.currentdash8;
    
    if (subfleet.length == 0)
      subfleet = this.currentsubfleet;
    
    switch (reasoncode) {
      case 'IM':
        this.deferral_history_reason_title = dash8 + " - INSUFFICIENT MANPOWER";
        this.eoSupervisorViewService.getEoDeferralHistoryDetail(dash8, reasoncode, subfleet, orderby, sorttype)
        .subscribe(data => { 
          this.datasource = new MatTableDataSource(data);
        });
        this.reasoncodesave = reasoncode;
        break;
      case 'PA':
        this.deferral_history_reason_title = dash8 + " - PARTS NIS ALLOCATED";
        this.eoSupervisorViewService.getEoDeferralHistoryDetail(dash8, reasoncode, subfleet, orderby, sorttype)
        .subscribe(data => { 
          this.datasource = new MatTableDataSource(data);
        });
        this.reasoncodesave = reasoncode;
        break;
      case 'TA':
        this.deferral_history_reason_title = dash8 + " - ALLOCATED TOOLING NIS USV";
        this.eoSupervisorViewService.getEoDeferralHistoryDetail(dash8, reasoncode, subfleet, orderby, sorttype)
        .subscribe(data => { 
          this.datasource = new MatTableDataSource(data);
        });
        this.reasoncodesave = reasoncode;
        break;
      case 'TOTAL':
        this.deferral_history_reason_title = dash8 + " - TOTAL DEFERRALS";
        this.eoSupervisorViewService.getEoDeferralHistoryDetail(dash8, reasoncode, subfleet, orderby, sorttype)
        .subscribe(data => { 
          this.datasource = new MatTableDataSource(data);
        });
        this.reasoncodesave = reasoncode;
        break;
    }
    this.currentdash8 = dash8;
    this.currentsubfleet = subfleet;
  }
}
