import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/service/user.service';
import { SchedmaintService } from 'src/app/service/schedmaint.service';
import { Observable } from 'rxjs';
import { SmSearchDetails } from 'src/app/models/sm-search-details';
import { SmCommentHistoryComponent } from '../sm-comment-history/sm-comment-history.component';
import { SmMinScheduledDateComponent } from '../sm-min-scheduled-date/sm-min-scheduled-date.component';
import { RefreshTime } from 'src/app/models/refresh-time';
import { Router, UrlTree } from '@angular/router';
import { User } from 'src/app/models/user';
import { MatProgressBar } from '@angular/material/progress-bar';

declare var $:any;

@Component({
  selector: 'app-sm-search',
  templateUrl: './sm-search.component.html',
  styleUrls: ['./sm-search.component.css']
})
  
export class SmSearchComponent implements OnInit {
  sForm: FormGroup;
  refreshtime$: Observable<RefreshTime[]>;
  filteredFleet$: Observable<string[]>;
  filteredDash8$: Observable<string[]>;
  filteredDash8Desc$: Observable<string[]>;
  // filteredCheckType$: Observable<string[]>;
  filteredWorkCard$: Observable<string[]>;
  filteredAltNum$: Observable<string[]>;
  // filteredStaReq$: Observable<string[]>;
  filteredMeBOM$: Observable<string[]>;
  hideFleet: boolean = false;
  hideDash8: boolean = false;
  hideDash8Desc: boolean = false;
  // hideCheckType: boolean = false;
  hideWorkCard: boolean = false;
  hideAltNumber: boolean = false;
  // hideStaReq: boolean = false;
  hideMeBOM: boolean = false;
  hideResults: boolean = true;
  hidePartNumberTotalRequirement: boolean = true;
  plannerName: string= "";
  resp: any;
  dialogValue: string;
  refreshForm: NgForm;
  refreshType: string;
  smSearchReq = new SmSearchDetails();
  
  public smSearchDetails$: Observable<SmSearchDetails[]>;
  public sm_displayedColumns: string[] = ['FLEET', 'DASH_8', 'DASH8_DESC', 'TSX_CHECKTYPE', 'TSX_WCNUM', 'TSX_ALTNUM', 'TSX_WCTITLE', 'STATION_REQUIREMENT', 'AUTH_STA', 'MIN_SCHDLD_DATE'];
  public datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;  
  public partNumberTotalRequirementDataSource: MatTableDataSource<any>;
  public partNumberTotalRequirement_displayColumns: string[] = ['ME_PART_NUMBER', 'COUNT_DASH_8', 'NO_OF_AC', 'KEYWORD', 'AVG_COST', 'TOTAL_365_DAY_REQ', 'TOTAL_30_DAY_REQ', 'TOTAL_60_DAY_REQ', 'TOTAL_90_DAY_REQ', 'TOTAL_120_DAY_REQ', 'TOTAL_180_DAY_REQ', 'TOTAL_ONHAND', 'TOTAL_ITS', 'TOTAL_OPEN_PO', 'TOTAL_OPEN_RO', 'SYS_STATUS']; //, 'ME_FLEET', 'ME_RESOURCE_CODE', 'MT', 'UI', 'ME_ATA_CODE', 'PRIME_MPN', 'CTLG_PRICE', 'CTLG_LT', 'SHLF_LIFE', 'CHEMCL_IND'
  public searchSMType: UrlTree;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  hideLoading: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private schedMaintService: SchedmaintService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.searchForm();
    this.user = JSON.parse(localStorage.getItem('userInfo'));

    this.searchSMType = this.router.parseUrl(this.router.url);
     if (this.searchSMType.root.children.primary.segments.length > 3) {
       switch (this.searchSMType.root.children.primary.segments[2].path) {
         case "ata":
          this.sForm.controls.meOnBom.setValue(this.searchSMType.root.children.primary.segments[3].path);
           break;
         case "dash8":
           this.sForm.controls.dash8.setValue(this.searchSMType.root.children.primary.segments[3].path);
           break;
       }
      
      this.submitSearchForm(this.sForm, "url");
    }
  }

  searchForm() {
    // this.sForm = this.fb.group({
    //   fleet: [null],
    //   dash8: [null],
    //   dash8Desc: [null],
    //   checkType: [null],
    //   workCard: [null],
    //   altNumber: [null],
    //   meOnBom: [null]
    // });
    this.sForm = this.fb.group({
      fleet: new FormControl(),
      dash8: new FormControl(),
      dash8Desc: new FormControl(),
      checkType: new FormControl(),
      workCard: new FormControl(),
      altNumber: new FormControl(),
      meOnBom: new FormControl()
    });
  }

  autoSearch(value, type: string) {
    switch (type) {
      case "FLEET":
        if (value.target.value.length > 1) {
          this.filteredFleet$ = this.schedMaintService.getSmAutoComplete(value.target.value, type);
          this.hideFleet = true;
        }
        else {
          this.hideFleet = false;
        }
        break;
      case "DASH_8":
        if (value.target.value.length > 9) {
          this.filteredDash8$ = this.schedMaintService.getSmAutoComplete(value.target.value, type);
          this.hideDash8 = true;
        }
        else {
          this.hideDash8 = false;
        }
        break;
      // case "DASH8_DESC":
      //   if (value.target.value.length > 3) {
      //     this.filteredDash8Desc$ = this.schedMaintService.getSmAutoComplete(value.target.value, type);
      //     this.hideDash8Desc = true;
      //   }
      //   else { 
      //     this.hideDash8Desc = false;
      //   }
      //   break;
      // case "TSX_CHECKTYPE":
      //   if (value.target.value.length > 1) {
      //     this.filteredCheckType$ = this.schedMaintService.getSmAutoComplete(value.target.value, type);
      //     this.hideCheckType = true;
      //   }
      //   else { 
      //     this.hideCheckType = false;
      //   }
      //   break;
      case "TSX_WCNUM":
        if (value.target.value.length > 3) {
          this.filteredWorkCard$ = this.schedMaintService.getSmAutoComplete(value.target.value, type);
          this.hideWorkCard = true;
        }
        else { 
          this.hideWorkCard = false;
        }
        break;
      // case "TSX_ALTNUM":
      //   if (value.target.value.length > 1) {
      //     this.filteredAltNum$ = this.schedMaintService.getSmAutoComplete(value.target.value, type);
      //     this.hideAltNumber = true;
      //   }
      //   else { 
      //     this.hideAltNumber = false;
      //   }
      //   break;
      // case "STATION_REQUIREMENT":
      //   if (value.target.value.length > 2) {
      //     this.filteredStaReq$ = this.schedMaintService.getSmAutoComplete(value.target.value, type);
      //     this.hideStaReq = true;
      //   }
      //   else { 
      //     this.hideStaReq = false;
      //   }
      //   break;
      case "NEW_SM_PARTS_TTL_REQ":
        if (value.target.value.length > 8) {
          this.filteredMeBOM$ = this.schedMaintService.getSmAutoComplete(value.target.value, type);
          this.hideMeBOM = true;
        }
        else { 
          this.hideMeBOM = false;
        }
        break;      
    }
  }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
 }

  submitStatus(searchForm: NgForm) {
    // let obj = searchForm.form.controls;
    // if (obj.fleet.value && (obj.dash8.value || obj.dash8Desc.value || obj.checkType.value || obj.workCard.value || obj.altNumber.value || obj.meOnBom.value)
    //   || (obj.dash8.value || obj.dash8Desc.value || obj.checkType.value || obj.workCard.value || obj.altNumber.value || obj.meOnBom.value))
    //   return false;
    // else
    //   return true;
    return false;
     }

  clearSearchForm() {
    this.sForm.reset();
    this.partNumberTotalRequirementDataSource = null;
    this.datasource = null;
    this.hideResults = true;
    this.hidePartNumberTotalRequirement = true;
    this.filteredFleet$ = null;
    this.hideFleet = true;
    this.filteredDash8$ = null;
    this.hideDash8 = true;
    this.filteredDash8Desc$ = null;
    this.hideDash8Desc = true;
    // this.filteredCheckType$ = null;
    // this.hideCheckType = true;
    this.filteredWorkCard$ = null;
    this.hideWorkCard = true;
    this.filteredAltNum$ = null;
    this.hideAltNumber = true;
    // this.filteredStaReq$ = null;
    // this.hideStaReq = true;
    this.filteredMeBOM$ = null;
    this.hideMeBOM = true;
    this.refreshtime$ = null;
  }

  submitSearchForm(searchForm, type) {
    //console.log(searchForm.form.controls);
    // this.openPPAMMaintSnackBar();
    if (this.searchSMType.root.children.primary.segments.length > 3) {
      switch (this.searchSMType.root.children.primary.segments[2].path) {
        case "ata":
          if (this.searchSMType.root.children.primary.segments[3].path != this.sForm.controls.meOnBom.value)
            window.location.href = 'sm/sm-search/ata/' + this.sForm.controls.meOnBom.value;
         //this.sForm.controls.meOnBom.setValue(this.searchSMType.root.children.primary.segments[3].path);
          break;
        case "dash8":
          if (this.searchSMType.root.children.primary.segments[3].path != this.sForm.controls.dash8.value)
            window.location.href = 'sm/sm-search/dash8/' + this.sForm.controls.dash8.value;
          //this.sForm.controls.dash8.setValue(this.searchSMType.root.children.primary.segments[3].path);
          break;
      }
    }

    this.refreshType = type;
    
    switch (type) {
      case "url":
        // console.log(searchForm.controls);
        this.refreshForm = searchForm;
        this.datasource = null;
        this.partNumberTotalRequirementDataSource = null;
        
        this.smSearchReq.FLEET = searchForm.controls.fleet.value;
        this.smSearchReq.DASH_8 = searchForm.controls.dash8.value;
        this.smSearchReq.DASH8_DESC = searchForm.controls.dash8Desc.value;
        this.smSearchReq.TSX_CHECKTYPE = searchForm.controls.checkType.value;
        this.smSearchReq.TSX_WCNUM = searchForm.controls.workCard.value;
        this.smSearchReq.NEW_SM_PARTS_TTL_REQ = searchForm.controls.meOnBom.value;
        break;
      case "form":
        // console.log(searchForm.form.controls);
        this.refreshForm = searchForm;
        this.datasource = null;
        this.partNumberTotalRequirementDataSource = null;
        
        this.smSearchReq.FLEET = searchForm.form.controls.fleet.value;
        this.smSearchReq.DASH_8 = searchForm.form.controls.dash8.value;
        this.smSearchReq.DASH8_DESC = searchForm.form.controls.dash8Desc.value;
        this.smSearchReq.TSX_CHECKTYPE = searchForm.form.controls.checkType.value;
        this.smSearchReq.TSX_WCNUM = searchForm.form.controls.workCard.value;
        this.smSearchReq.NEW_SM_PARTS_TTL_REQ = searchForm.form.controls.meOnBom.value;
        break;
     }
   
    //if (smSearchReq.FLEET != null || smSearchReq.DASH_8 != null || smSearchReq.DASH8_DESC != null || smSearchReq.DASH8_DESC != null || smSearchReq.TSX_CHECKTYPE != null || smSearchReq.TSX_WCNUM != null || smSearchReq.NEW_SM_PARTS_TTL_REQ != null) {
    this.hideLoading = false;
    this.schedMaintService.searchNewSMList(this.smSearchReq)
      .subscribe(data => {
        this.refreshtime$ = this.schedMaintService.getSMRefreshTime("");
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
        this.hideResults = false;
        return this.datasource;
      });
       
    if (this.smSearchReq.NEW_SM_PARTS_TTL_REQ) { 
        this.hideLoading = false;
        this.schedMaintService.getSmPartNumberTotalRequirements(this.smSearchReq.NEW_SM_PARTS_TTL_REQ)
          .subscribe(data => {
            this.hidePartNumberTotalRequirement = false;
            this.partNumberTotalRequirementDataSource = new MatTableDataSource(data);
            this.hideLoading = true;
            this.hideResults = false;
            return this.partNumberTotalRequirementDataSource;
          });
    }
    //}   
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

  openHistory(type: string, value: string) {
    // console.log('type: ' + type);
    // console.log('value: ' + value);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '620px';
    dialogConfig.maxWidth = '620px';
    dialogConfig.data = { type: type, value: value, plannerName: this.user.display_name }

    let dialogRef = this.dialog.open(
      SmCommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.dialogValue = result.data;
      this.submitSearchForm(this.refreshForm, this.refreshType);
    });
  }
  
  openMinSchDate(dash8: string) {
    // console.log('dash8: ' + dash8);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '620px';
    dialogConfig.maxWidth = '620px';
    dialogConfig.data = { dash8: dash8 }

    let dialogRef = this.dialog.open(
      SmMinScheduledDateComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.dialogValue = result.data;
      // this.submitSearchForm(this.refreshForm);
    });
  }
  
  sortSearchResults(event: Sort) {
    this.smSearchReq.ORDERBY = event.active;
    this.smSearchReq.SORTTYPE = event.direction;

    this.hideLoading = false;
    this.schedMaintService.searchNewSMList(this.smSearchReq)
      .subscribe(data => {
        //this.refreshtime$ = this.schedMaintService.getSMRefreshTime("");
        this.datasource = new MatTableDataSource(data);
        this.hideLoading = true;
        this.datasource.sort = this.sort;
      });
  }
}
