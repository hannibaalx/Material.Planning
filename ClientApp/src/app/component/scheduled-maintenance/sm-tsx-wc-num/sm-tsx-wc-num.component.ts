import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RefreshTime } from 'src/app/models/refresh-time';
import { SmTsxWcnumDetail } from 'src/app/models/sm-tsx-wcnum-detail';
import { SchedmaintService } from 'src/app/service/schedmaint.service';
import { UserService } from 'src/app/service/user.service';

declare var $:any;

@Component({
  selector: 'app-sm-tsx-wc-num',
  templateUrl: './sm-tsx-wc-num.component.html',
  styleUrls: ['./sm-tsx-wc-num.component.css']
})
export class SmTsxWcNumComponent implements OnInit {
  public smDash8Detail$: Observable<SmTsxWcnumDetail[]>;
  refreshtime$: Observable<RefreshTime[]>;
  public tsx_wcnum_displayedColumns: string[] = ['ME_PART_NUMBER_USED', 'TSX_CPN', 'KEYWORD_DESCRIPTION', 'QTY_REQ', 'REQD_IND', 'KIT_IND', 'TTL_OH', 'TTL_PO', 'TTL_RO', 'TTL_ITS'];
  public staSMInvent_displayedColumns: string[] = ['STA', 'STA_CTGRY', 'REPL_STA', 'MIN_AQ', 'MAX_QTY', 'AFG', 'AWU', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'STA_SO_OPEN_QTY', 'STA_PO_OPEN_QTY', 'STA_RO_OPEN_QTY'];
  public sm_tsx_wcnum_kit_displayColumns: string[] = ['ME_PART_NUMBER_IN_KIT', 'KEYWORD_DESCRIPTION', 'QTY_REQ_K', 'REQD_IND_K', 'TTL_OH', 'TTL_ITS', 'TTL_PO', 'TTL_RO'];
  public sm_tsx_wcnum_kit_station_displayColumns: string[] = ['STA', 'KITTING_STA', 'REPL_STA', 'MIN_AQ', 'MAX_QTY', 'AFG', 'AWU', 'STA_OH_QTY', 'STA_INTRANSIT_QTY', 'STA_SO_OPEN_QTY', 'STA_PO_OPEN_QTY', 'STA_RO_OPEN_QTY'];
  public tsxwcnumid: string;
  public datasource: MatTableDataSource<any>;
  public smstainvdatasource: MatTableDataSource<any>;
  public smkitdetaildatasource: MatTableDataSource<any>;
  public smkitpartstationdetaildatasource: MatTableDataSource<any>;
  public hideSMResults: boolean = true;
  public hideSMStationInventory: boolean = true;
  public hideSMKitDetails: boolean = true;
  public hideSMKitPartInvDetails: boolean = true;
  public mePartNumberUsed: string = "";
  public smMePartNumberInKit: string = "";

  constructor(
    private schedMaintService: SchedmaintService,
    private route: ActivatedRoute,
    public dialog: MatDialog    
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tsxwcnumid = params['id'];
      this.schedMaintService.getTsxWcNumDetail(this.tsxwcnumid)
        .subscribe(data => { 
          this.hideSMResults = false;
          this.hideSMKitDetails = true;
          this.hideSMStationInventory = true;
          this.hideSMKitPartInvDetails = true;
          this.refreshtime$ = this.schedMaintService.getSMRefreshTime("tsx_wcnum");
          return this.datasource = new MatTableDataSource(data);
        })
     });
    // this.refreshtime$ = this.schedMaintService.getRefreshTimeSmDash8Detail();
  }

  getSMStationInventory(meUsed: string) {
    //console.log(meUsed);
    this.hideSMStationInventory = true;
    this.hideSMKitDetails = true;
    this.hideSMKitPartInvDetails = true;
    this.smstainvdatasource = null;
    this.smkitdetaildatasource = null;
    this.smkitpartstationdetaildatasource = null;
    this.mePartNumberUsed = meUsed;
    this.schedMaintService.getSmMeUsedDetailById(this.mePartNumberUsed)
      .subscribe(data => {
          // if (data.length > 0)
            this.hideSMStationInventory = false;
          return this.smstainvdatasource = new MatTableDataSource(data);
        });
  }

  getSMKitDetails(mePartNumberUsed: string, tsxwcnum: string) {
    // console.log(mePartNumberUsed + ' - ' + tsxwcnum);

      this.mePartNumberUsed = mePartNumberUsed;
      this.getSMStationInventory(mePartNumberUsed);
      this.hideSMKitDetails = true;
      this.hideSMKitPartInvDetails = true;
      this.smkitdetaildatasource = null;
      this.smkitpartstationdetaildatasource = null;
      this.schedMaintService.getTsxWcMeKitDetail(mePartNumberUsed, tsxwcnum)
        .subscribe(data => {
            this.hideSMKitDetails = false;
          return this.smkitdetaildatasource = new MatTableDataSource(data);
        });
  }

  getSMKitPartStationInventory(mepartnumberinkit: string) {
    this.hideSMKitPartInvDetails = true;
    this.smMePartNumberInKit = mepartnumberinkit;
      this.schedMaintService.getKitPartStationInventoryDetails(mepartnumberinkit)
        .subscribe(data => {
          // if (data.length > 0)
            this.hideSMKitPartInvDetails = false;
          return this.smkitpartstationdetaildatasource = new MatTableDataSource(data);
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

}
