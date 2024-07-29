import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { RefreshTime } from 'src/app/models/refresh-time';
import { SmDash8Detail } from 'src/app/models/sm-dash8-detail';
import { SchedmaintService } from 'src/app/service/schedmaint.service';

declare var $:any;

export interface TimeRange { 
  timeValue: string;
  timeViewValue: string;
}

@Component({
  selector: 'app-sm-dash8-detail',
  templateUrl: './sm-dash8-detail.component.html',
  styleUrls: ['./sm-dash8-detail.component.css']
})
export class SmDash8DetailComponent implements OnInit {
  smDash8Detail$: Observable<SmDash8Detail[]>;
  refreshtime$: Observable<RefreshTime[]>;
  dash8id: string;
  public dash8_displayedColumns: string[];
  public staInvent_displayedColumns: string[] = ['STA', 'STA_CTGRY', 'REPL_STA', 'MIN_AQ', 'MAX_QTY', 'AFG', 'AWU', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'STA_SO_OPEN_QTY', 'STA_PO_OPEN_QTY', 'STA_RO_OPEN_QTY'];
  public staInvent0or4or9_displayedColumns: string[] = ['STA', 'STA_CTGRY', 'REPL_STA', 'MIN_AQ', 'AFG', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'STA_SO_OPEN_QTY', 'STA_PO_OPEN_QTY', 'STA_RO_OPEN_QTY'];
  public kitDetails_displayedColumns: string[];
  public kitPartStationInventoryDetails_displayedColumns: string[] = ['STA', 'KITTING_STA', 'REPL_STA', 'MIN_AQ', 'MAX_QTY', 'AFG', 'AWU', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'STA_SO_OPEN_QTY', 'STA_PO_OPEN_QTY', 'STA_RO_OPEN_QTY'];
  public datasource: MatTableDataSource<any>;
  public stainvdatasource: MatTableDataSource<any>;
  public kitdetaildatasource: MatTableDataSource<any>;
  public kitpartstationdetaildatasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  hideResults: boolean = true;
  currentTimeFrame: string = "";
  hideStationInventory: boolean = true;
  hideKitDetails: boolean = true;
  hideKitPartInvDetails: boolean = true;
  mePartNumberUsed: string = "";
  mePartNumberInKit: string = "";

  timeRange: TimeRange[] = [
    { timeValue: '0', timeViewValue: '' },
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
      this.schedMaintService.getSmDash8Detail(this.dash8id)
        .subscribe(data => { 
          this.hideResults = false;
          this.hideStationInventory = true;
          this.refreshtime$ = this.schedMaintService.getSMRefreshTime("dash_8");
          return this.datasource = new MatTableDataSource(data);
        })
    });
  }

  setTimeFrame(val: string) {
    this.currentTimeFrame = val;
    this.hideStationInventory = true;
    this.hideKitDetails = true;
    this.hideKitPartInvDetails = true;
    // this.dash8_displayedColumns = ['ME_PART_NUMBER_USED', 'QTY_REQ', 'REQD_IND', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TTL_REQ_90_DAY', 'TTL_REQ_120_DAY', 'TTL_REQ_180_DAY', 'ME_FLEET', 'ME_RESOURCE_CODE', 'ME_ATA_CODE', 'PRIME', 'KEYWORD_DESCRIPTION', 'UI', 'AVG_COST', 'SHLF_LIFE', 'CTLG_LT', 'CTLG_PRICE', 'MT', 'ESS', 'CHEMCL_IND', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'MATL_STS_365_DAY', 'MATL_STS_30_DAY', 'MATL_STS_60_DAY', 'MATL_STS_90_DAY', 'MATL_STS_120_DAY', 'MATL_STS_180_DAY', 'KIT_IND'];
    switch (this.currentTimeFrame) {
      //TOTAL_30_DAY_REQ, TOTAL_60_DAY_REQ, TOTAL_90_DAY_REQ, TOTAL_120_DAY_REQ,  TOTAL_180_DAY_REQ, TOTAL_365_DAY_REQ, TOTAL_KP_30_DAY_REQ,  TOTAL_KP_60_DAY_REQ,  TOTAL_KP_90_DAY_REQ, TOTAL_KP_120_DAY_REQ, TOTAL_KP_180_DAY_REQ, TOTAL_KP_365_DAY_REQ
      case '90':
        this.dash8_displayedColumns = ['ME_PART_NUMBER_USED', 'KEYWORD_DESCRIPTION','QTY_REQ', 'REQD_IND', 'KIT_IND', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TOTAL_365_DAY_REQ', 'TOTAL_30_DAY_REQ', 'TOTAL_60_DAY_REQ', 'TTL_REQ_90_DAY', 'TOTAL_90_DAY_REQ'];
        this.kitDetails_displayedColumns = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_KP_365_DAY', 'TOTAL_KP_365_DAY_REQ', 'TTL_REQ_KP_30_DAY', 'TTL_REQ_KP_60_DAY', 'TTL_REQ_KP_90_DAY', 'TOTAL_90_DAY_REQ', 'TOTAL_KP_90_DAY_REQ'];
        break;
      case '120':
        this.dash8_displayedColumns = ['ME_PART_NUMBER_USED', 'KEYWORD_DESCRIPTION', 'QTY_REQ', 'REQD_IND', 'KIT_IND', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TOTAL_365_DAY_REQ', 'TOTAL_30_DAY_REQ', 'TOTAL_60_DAY_REQ', 'TTL_REQ_120_DAY', 'TOTAL_120_DAY_REQ'];
        this.kitDetails_displayedColumns = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_KP_365_DAY', 'TOTAL_KP_365_DAY_REQ', 'TTL_REQ_KP_30_DAY', 'TTL_REQ_KP_60_DAY', 'TTL_REQ_KP_120_DAY', 'TOTAL_120_DAY_REQ', 'TOTAL_KP_120_DAY_REQ'];
        break;
      case '180':
        this.dash8_displayedColumns = ['ME_PART_NUMBER_USED', 'KEYWORD_DESCRIPTION', 'QTY_REQ', 'REQD_IND', 'KIT_IND', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TOTAL_365_DAY_REQ', 'TOTAL_30_DAY_REQ', 'TOTAL_60_DAY_REQ', 'TTL_REQ_180_DAY', 'TOTAL_180_DAY_REQ'];
        this.kitDetails_displayedColumns = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_KP_365_DAY', 'TOTAL_KP_365_DAY_REQ', 'TTL_REQ_KP_30_DAY', 'TTL_REQ_KP_60_DAY', 'TTL_REQ_KP_180_DAY', 'TOTAL_180_DAY_REQ', 'TOTAL_KP_180_DAY_REQ'];
        break;
      default:
        this.dash8_displayedColumns = ['ME_PART_NUMBER_USED', 'KEYWORD_DESCRIPTION', 'QTY_REQ', 'REQD_IND', 'KIT_IND', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_365_DAY', 'TTL_REQ_30_DAY', 'TTL_REQ_60_DAY', 'TOTAL_365_DAY_REQ', 'TOTAL_30_DAY_REQ', 'TOTAL_60_DAY_REQ'];
        this.kitDetails_displayedColumns = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO', 'TTL_REQ_KP_365_DAY', 'TOTAL_KP_365_DAY_REQ', 'TTL_REQ_KP_30_DAY', 'TTL_REQ_KP_60_DAY'];
        break;
    }
    this.schedMaintService.getSmDash8Detail(this.dash8id)
        .subscribe(data => { 
          this.hideResults = false;
          this.hideStationInventory = true;
          this.refreshtime$ = this.schedMaintService.getSMRefreshTime("dash_8");
          return this.datasource = new MatTableDataSource(data);
        })
  }
  
  getStationInventory(meUsed: string) {
    //console.log(meUsed);
    this.hideStationInventory = true;
    this.hideKitDetails = true;
    this.hideKitPartInvDetails = true;
    this.stainvdatasource = null;
    this.kitdetaildatasource = null;
    this.kitpartstationdetaildatasource = null;
    this.mePartNumberUsed = meUsed;
    this.schedMaintService.getSmMeUsedDetailById(this.mePartNumberUsed)
      .subscribe(data => {
          // if (data.length > 0)
            this.hideStationInventory = false;
          return this.stainvdatasource = new MatTableDataSource(data);
        });
  }
  
  getKitDetails(mePartNumberUsed: string, dash8: string, kitInd: string) {
    // console.log(mePartNumberUsed + ' - ' + dash8 + ' - ' + kitInd);
    if (kitInd.trim() == 'Y') {
      this.mePartNumberUsed = mePartNumberUsed;
      this.getStationInventory(mePartNumberUsed);
      this.hideKitDetails = true;
      this.hideKitPartInvDetails = true;
      this.kitdetaildatasource = null;
      this.kitpartstationdetaildatasource = null;
      this.schedMaintService.getkitdetails(mePartNumberUsed, dash8)
        .subscribe(data => {
          // if (data.length > 0)
            this.hideKitDetails = false;
          return this.kitdetaildatasource = new MatTableDataSource(data);
        });
    }    
  }

  getKitPartStationInventory(mepartnumberinkit: string) {
    this.hideKitPartInvDetails = true;
    this.mePartNumberInKit = mepartnumberinkit;
      this.schedMaintService.getKitPartStationInventoryDetails(mepartnumberinkit)
        .subscribe(data => {
          // if (data.length > 0)
            this.hideKitPartInvDetails = false;
          return this.kitpartstationdetaildatasource = new MatTableDataSource(data);
        });
  }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
 }

  popSmMeSummary(event, fleet, rescode, atacode, prime, keydesc, cataprice, shelflife, chemind, ui, mt, ctlglt) {
    let summary: string = "";
    
    summary = "<div><b>FLEET: </b>" + fleet + "</div>";
    summary += "<div><b>RES CODE:</b> " + rescode + "</div>";
    summary += "<div><b>MT:</b> " + mt + "</div>";
    summary += "<div><b>UI:</b> " + ui + "</div>";
    summary += "<div><b>ATA CODE:</b> " + atacode + "</div>";
    summary += "<div><b>PRIME:</b> " + prime + "</div>";
    // summary += "<div class='nowrap'><b>KEY DESC:</b> " + keydesc + "</div>";
    summary += "<div><b>CTLG PRICE:</b> $" + cataprice + "</div>";
    summary += "<div><b>CTLG LT:</b> " + ctlglt + "</div>";
    summary += "<div><b>SHELF LIFE:</b> " + shelflife + "</div>";
    summary += "<div><b>CHEMICAL IND:</b> " + chemind + "</div>";
    
    event.currentTarget.dataset.content = summary;
  }

  sortTable(event: Sort, type: string) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

    switch (type) {
      case "dash8":
        this.schedMaintService.getSmDash8Detail(this.dash8id, orderby, sorttype)
          .subscribe(data => {
            this.datasource = new MatTableDataSource(data);
            this.datasource.sort = this.sort;
          });
      break;
      case "staInv":
        this.schedMaintService.getSmMeUsedDetailById(this.mePartNumberUsed, orderby, sorttype)
          .subscribe(data => {
              // if (data.length > 0)
            this.hideStationInventory = false;
            this.stainvdatasource = new MatTableDataSource(data);
            this.stainvdatasource.sort = this.sort;
            });
      break;
      case "kitdet":
        this.schedMaintService.getkitdetails(this.mePartNumberUsed, this.dash8id, orderby, sorttype)
          .subscribe(data => {
            // if (data.length > 0)
            this.hideKitDetails = false;
            this.kitdetaildatasource = new MatTableDataSource(data);
            this.kitdetaildatasource.sort = this.sort;
          });        
      break;
      case "partSta":
        this.schedMaintService.getKitPartStationInventoryDetails(this.mePartNumberInKit, orderby, sorttype)
        .subscribe(data => {
          // if (data.length > 0)
          this.hideKitPartInvDetails = false;
          this.kitpartstationdetaildatasource = new MatTableDataSource(data);
          this.kitpartstationdetaildatasource.sort = this.sort;
        });        
      break;
    }
    
  }
}
