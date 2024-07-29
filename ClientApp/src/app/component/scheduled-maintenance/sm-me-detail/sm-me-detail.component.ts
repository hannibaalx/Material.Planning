import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RefreshTime } from 'src/app/models/refresh-time';
import { SmMeDetail } from 'src/app/models/sm-me-detail';
import { SchedmaintService } from 'src/app/service/schedmaint.service';
import { TimeRange } from '../sm-dash8-detail/sm-dash8-detail.component';

declare var $:any;

@Component({
  selector: 'app-sm-me-detail',
  templateUrl: './sm-me-detail.component.html',
  styleUrls: ['./sm-me-detail.component.css']
})
export class SmMeDetailComponent implements OnInit {
  smDash8Detail$: Observable<SmMeDetail[]>;
  refreshtime$: Observable<RefreshTime[]>;
  dash8id: string;
  public dash8_displayedColumns: string[];
  public staInvent_displayedColumns: string[] = ['STA', 'STA_CTGRY', 'REPL_STA', 'MIN_AQ', 'MAX_QTY', 'AFG', 'AWU', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'STA_SO_OPEN_QTY', 'STA_PO_OPEN_QTY', 'STA_RO_OPEN_QTY'];
  public staInvent0or4or9_displayedColumns: string[] = ['STA', 'STA_CTGRY', 'REPL_STA', 'MIN_AQ', 'AFG', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'STA_SO_OPEN_QTY', 'STA_PO_OPEN_QTY', 'STA_RO_OPEN_QTY'];
  // public kitDetails_displayedColumns: string[];
  // public kitPartStationInventoryDetails_displayedColumns: string[] = ['STA', 'KITTING_STA', 'REPL_STA', 'MIN_AQ', 'MAX_QTY', 'AFG', 'AWU', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'STA_SO_OPEN_QTY', 'STA_PO_OPEN_QTY', 'STA_RO_OPEN_QTY'];
  public datasource: MatTableDataSource<any>;
  public stainvdatasource: MatTableDataSource<any>;
  // public kitdetaildatasource: MatTableDataSource<any>;
  // public kitpartstationdetaildatasource: MatTableDataSource<any>;
  hideResults: boolean = true;
  currentTimeFrame: string = "";
  hideStationInventory: boolean = true;
  hideKitDetails: boolean = true;
  hideKitPartInvDetails: boolean = true;
  mePartNumberUsed: string = "";
  mePartNumberInKit: string = "";
  @ViewChild(MatSort) sort: MatSort;

  timeRange: TimeRange[] = [
    { timeValue: '', timeViewValue: '' },
    { timeValue: '90', timeViewValue: '90 Days' },
    { timeValue: '120', timeViewValue: '120 Days' },
    { timeValue: '180', timeViewValue: '180 Days' }
  ] 

  constructor(
    private schedMaintService: SchedmaintService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.setTimeFrame('');
    this.route.params.subscribe(params => {
      this.dash8id = params['id'];
      this.schedMaintService.getSmMeDetail(this.dash8id)
        .subscribe(data => {
          this.getStationInventory(this.dash8id);
          this.hideResults = false;
          this.refreshtime$ = this.schedMaintService.getSMRefreshTime("medetail");
          return this.datasource = new MatTableDataSource(data);
        })
    });
  }

  setTimeFrame(val: string) {
    this.currentTimeFrame = val;
    // this.hideStationInventory = true;
    this.hideKitDetails = true;
    this.hideKitPartInvDetails = true;
    
    switch (this.currentTimeFrame) {
      //DASH_8, TSX_WCNUM, DASH8_DESC, QTY_REQ, REQD_IND, TTL_REQ_SM,TTL_REQ_365_DAY, TTL_REQ_30_DAY, TTL_REQ_60_DAY, 
      //TTL_REQ_90_DAY, TTL_REQ_120_DAY, TTL_REQ_180_DAY, TTL_OH, TTL_ITS, TTL_PO, TTL_RO, MATL_STS_ALL, MATL_STS_365_DAY, MATL_STS_30_DAY, MATL_STS_60_DAY, 
      //MATL_STS_90_DAY, MATL_STS_120_DAY, MATL_STS_180_DAY
      case '90':
        this.dash8_displayedColumns = ['DASH_8', 'TSX_WCNUM', 'DASH8_DESC', 'QTY_REQ', 'REQD_IND', 'TTL_OH', 'TTL_ITS',  'TTL_PO', 'TTL_RO', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TTL_REQ_90_DAY'];
        //this.kitDetails_displayedColumns = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_KP_365_DAY', 'TOTAL_KP_365_DAY_REQ', 'TTL_REQ_KP_30_DAY', 'TTL_REQ_KP_60_DAY', 'TTL_REQ_KP_90_DAY', 'TOTAL_90_DAY_REQ', 'TOTAL_KP_90_DAY_REQ'];
        break;
      case '120':
        this.dash8_displayedColumns = ['DASH_8', 'TSX_WCNUM', 'DASH8_DESC', 'QTY_REQ', 'REQD_IND', 'TTL_OH', 'TTL_ITS',  'TTL_PO', 'TTL_RO', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TTL_REQ_120_DAY'];
        //this.kitDetails_displayedColumns = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_KP_365_DAY', 'TOTAL_KP_365_DAY_REQ', 'TTL_REQ_KP_30_DAY', 'TTL_REQ_KP_60_DAY', 'TTL_REQ_KP_120_DAY', 'TOTAL_120_DAY_REQ', 'TOTAL_KP_120_DAY_REQ'];
        break;
      case '180':
        this.dash8_displayedColumns = ['DASH_8', 'TSX_WCNUM', 'DASH8_DESC', 'QTY_REQ', 'REQD_IND', 'TTL_OH', 'TTL_ITS',  'TTL_PO', 'TTL_RO', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TTL_REQ_180_DAY'];
        //this.kitDetails_displayedColumns = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_KP_365_DAY', 'TOTAL_KP_365_DAY_REQ', 'TTL_REQ_KP_30_DAY', 'TTL_REQ_KP_60_DAY', 'TTL_REQ_KP_180_DAY', 'TOTAL_180_DAY_REQ', 'TOTAL_KP_180_DAY_REQ'];
        break;
      default:
        this.dash8_displayedColumns = ['DASH_8', 'TSX_WCNUM', 'DASH8_DESC', 'QTY_REQ', 'REQD_IND', 'TTL_OH', 'TTL_ITS',  'TTL_PO', 'TTL_RO', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY'];
        //this.kitDetails_displayedColumns = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_KP_365_DAY', 'TOTAL_KP_365_DAY_REQ', 'TTL_REQ_KP_30_DAY', 'TTL_REQ_KP_60_DAY'];
        break;
     }
  }

  getStationInventory(meUsed: string, orderby?: string, sorttype?: string) {
    //console.log(meUsed);
    this.hideStationInventory = true;
    this.hideKitDetails = true;
    this.hideKitPartInvDetails = true;
    this.stainvdatasource = null;
    // this.kitdetaildatasource = null;
    // this.kitpartstationdetaildatasource = null;
    this.mePartNumberUsed = meUsed;
    this.schedMaintService.getSmMeUsedDetailById(this.mePartNumberUsed, orderby, sorttype)
      .subscribe(data => {
          // if (data.length > 0)
            this.hideStationInventory = false;
          return this.stainvdatasource = new MatTableDataSource(data);
        });
  }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
  }
  
  sortTable(event: Sort, type: string) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    switch (type) {
      case "dash8":
        this.schedMaintService.getSmMeDetail(this.dash8id, orderby, sorttype)
        .subscribe(data => {
          this.getStationInventory(this.dash8id, orderby, sorttype);
          this.hideResults = false;
          this.datasource = new MatTableDataSource(data);
          this.datasource.sort = this.sort;
        })
      break;
      case "staInv":
        this.schedMaintService.getSmMeUsedDetailById(this.mePartNumberUsed, orderby, sorttype)
          .subscribe(data => {
            this.hideStationInventory = false;
            this.stainvdatasource = new MatTableDataSource(data);
            this.stainvdatasource.sort = this.sort;
          });
        break;
    }
  }
}
