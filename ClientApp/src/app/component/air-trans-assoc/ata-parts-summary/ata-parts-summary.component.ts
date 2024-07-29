import { toArray } from 'rxjs/operators';
import { MeStatus } from './../../../models/me-status';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PartService } from 'src/app/service/part.service';
import { RefreshTime } from 'src/app/models/refresh-time';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MeImqHpfDetailComponent } from '../me-imq-hpf-detail/me-imq-hpf-detail.component';
import { MeSummarySearchType } from 'src/app/models/me-summary-search-type';
import { MeSummaryMePartNumberDetailsComponent } from '../me-summary-me-part-number-details/me-summary-me-part-number-details.component';
import { MeSplitMeDetailComponent } from '../me-split-me-detail/me-split-me-detail.component';
import * as moment from 'moment';
import { StockTotal } from 'src/app/models/stock-total';
import { Stock } from 'src/app/models/stock';
import { Usage } from 'src/app/models/usage';
import { Forecast } from 'src/app/models/forecast';
import { Aog } from 'src/app/models/aog';
import { AogTotal } from 'src/app/models/aog-total';
import { Deferral } from 'src/app/models/deferral';
import { DeferralTotal } from 'src/app/models/deferral-total';
import { Scrap } from 'src/app/models/scrap';
import { ScrapTotal } from 'src/app/models/scrap-total';
import { TesSummary } from 'src/app/models/tes-summary';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { PartNumber } from 'src/app/models/partnumber';
import { Delays } from 'src/app/models/delays';
import { Cancels } from 'src/app/models/cancels';
import { DelaysTotal } from 'src/app/models/delays-total';
import { CancelsTotal } from 'src/app/models/cancels-total';
import { Mpn } from 'src/app/models/mpn';
import { ExcessStatus } from 'src/app/models/excess-status';
import { MereviewComponent } from '../mereview/mereview.component';

@Component({
  selector: 'app-ata-parts-summary',
  templateUrl: './ata-parts-summary.component.html',
  styleUrls: ['./ata-parts-summary.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  }]
})
export class AtaPartsSummaryComponent implements OnInit, OnDestroy {
  parts$: any;
  excessstatus$: any;
  parts: PartNumber[];
  ipcfleet: string[];
  airbus: string[];
  boeing: string[];
  fleetlabel1: string = "";
  fleetlabel2: string = "";
  airbusitems: string = "";
  boeingitems: string = "";
  planner_fnln: string[];
  displayplanner_fnln: string;
  //parts$: Observable<PartNumber[]>;
  currentMePartNumber: string = "";
  fromUrl: boolean = false;
  dialogValue: string;
  currentSearchType: string = "M&E";
  searchlength: number = 14;
  showBtnOptions: boolean = false;
  showSplitMEBtn: boolean = false;
  showImq: boolean = false;
  showHpf: boolean = false;
  splitmeData: any;
  imqData: any;
  hpfData: any;
  hideLoading: boolean = true;
        
  searchType: MeSummarySearchType[] = [
    {TYPE: 'M&E', VALUE: 'M&E'},
    {TYPE: 'MPN', VALUE: 'MPN'}
  ];
  refreshtime$: Observable<RefreshTime[]>;
  mestatus$: Observable<MeStatus[]>;
  mestatus: string;
  showStatus: boolean;
  private searchTerms = new Subject<string>();
  private mesummary_subscription = new Subscription();
  private stockdata_subscription = new Subscription();
  private usage_subscription = new Subscription();
  private scrap_subscription = new Subscription();
  private tes_subscription = new Subscription();
  
  private subscription: Subscription;
  private subRoute = new Subscription();
  public stockTotal$: Observable<StockTotal[]>;
  public stock$: Observable<Stock[]>;
  public hideStock: boolean = true;
  public hideMeSummary: boolean = false;
  public hideMeReview: boolean = false;
  public menumber: string = "";
  public sesDetailUrl: string = "";
  public detailUrl: string;
  public totalDetailUrl: string;
  public totaldetailurl: string;
  public itsDetailUrl: string;
  public totalItsDetailUrl: string;
  hideMinMax: boolean = false;
  hideAlloc: boolean = false;
  hideAWU: boolean = false;
  dash3_displayedColumns: string[] = ['ALPHA_STATION', 'REPLENISHING_STATION', 'MIN', 'MAX_QTY', 'ON_HAND', 'ANALYST_FIXED_GROUP', 'TOTAL_12M_USAGE', 'ITS', 'SO_Qty', 'PO_REQ_Qty', 'PO_Qty', 'RO_Qty'];
  dash4or9or0_displayedColumns: string[] = ['ALPHA_STATION', 'REPLENISHING_STATION', 'ALLOCATION', 'ON_HAND', 'ANALYST_FIXED_GROUP', 'TOTAL_12M_USAGE', 'ITS', 'SO_Qty', 'PO_REQ_Qty', 'PO_Qty', 'RO_Qty'];
  stock_datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  
  public usage_a_data: Usage[];
  public usage_a_data_total: Usage[] = [];
  public usage_a_data_unscheduled: Usage[] = [];
  public usage_a_data_scheduled: Usage[] = [];
  public usage_a_data_eco: Usage[] = [];

  public usage_s_data: Usage[];
  public usage_s_data_total: Usage[] = [];
  public usage_s_data_unscheduled: Usage[] = [];
  public usage_s_data_scheduled: Usage[] = [];
  public usage_s_data_eco: Usage[] = [];

  public forecast_data: Forecast[];
  public forecast_data_total: Forecast[] = [];
  public forecast_data_unscheduled: Forecast[] = [];
  public forecast_data_scheduled: Forecast[] = [];
  public forecast_data_eco: Forecast[] = [];

  public excessstatus_data: ExcessStatus[];
  public aog_data: Aog[];
  public aog_data_total: AogTotal[];
  public deferral_data: Deferral[];
  public deferral_data_total: DeferralTotal[];
  public delay_data: Delays[];
  public delay_data_total: DelaysTotal[];
  public cancel_data: Cancels[];
  public cancel_data_total: CancelsTotal[];
  public all_other_mpn: Mpn[] = [];
  showAllOtherMpnList: boolean = false;

  hideUsage: boolean = true;
  rdoDefault: boolean = true;
  usage_a: boolean = true;
  usage_s: boolean = false;
  hideScrap: boolean = true;
  public scrap_data: Scrap[];
  public scrap_data_total: ScrapTotal[];
  public ses_data: TesSummary[];
  public hideSes: boolean = true;
  public tesdetailUrl: string;
  public hideFooter: boolean = true;
  currentDate = moment().format('YYYY-DD-MM, hh:mm');
  isLoadingComplete: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private route2: Router,
    private partService: PartService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar    
  ) { } 

  ngOnInit(): void {
   // let usertest = JSON.parse(localStorage.getItem('userInfo')); // getting
    // if (this.getWithExpiry("userInfo") == null)
    //   this.route2.navigateByUrl('/');
    this.refreshtime$ = this.partService.getRefreshTime();
    this.hideMeSummary = true;
    this.hideMeReview = true;
    this.hideStock = true;
    this.hideUsage = true;
    this.hideScrap = true;
    this.hideSes = true;
    this.hideFooter = true;
    //this.isLoadingComplete = false;
    this.mesummary_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          const meInput = document.getElementById('part-search-input') as HTMLFormElement;
          const btnSearch = document.getElementById('btnSearch') as HTMLButtonElement;
          this.hideLoading = false;
          meInput.value = params['id'].trim();
          meInput.innerHTML = params['id'].trim().toString();
          this.hideLoading = false;
          //btnSearch.click();
          this.detectChanges();
          this.fromUrl = true;
          this.searchPartNumber(meInput.value.trim());
          meInput.focus();
          //this.isLoadingComplete = true;
        }
      }
    );
    
    this.subRoute = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.sesDetailUrl = "../ses/detail"
          this.detailUrl = "/ata/stockdatadetail";
          this.totalDetailUrl = "/ata/stockdatatotaldetail";
          this.totaldetailurl = "/ata/stockdatatotaldetail";
          this.itsDetailUrl = "/ata/itsdetail"
          this.totalItsDetailUrl = "/ata/itstotaldetail"
        }
        else {
          this.sesDetailUrl = "./ses/detail";
          this.detailUrl = "./stockdatadetail";
          this.totalDetailUrl = "./stockdatatotaldetail";
          this.totaldetailurl = "./stockdatatotaldetail";
          this.itsDetailUrl = "./itsdetail"
          this.totalItsDetailUrl = "./itstotaldetail"
        }
      });
   
    //let meInput = document.getElementById('part-search-input') as HTMLFormElement;
    let meInput = document.getElementById('currentMeNumber-input') as HTMLFormElement;
    let btnSearch = document.getElementById("btnSearch") as HTMLButtonElement;

    this.detectChanges();
    //stock data
    this.stockdata_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          const sub = fromEvent(window, 'load')
            .subscribe((e: Event) => {

              let _currentMeNumber = this.partService.getCurrentMeNumber();
              _currentMeNumber.subscribe(val => { 
               if (val.length > 0) { 
                 this.searchTerms.next(val);
                 this.hideStock = false;
                 this.menumber = val;
                 if (val.includes('-3-')) {
                   this.hideAlloc = true;
                   this.hideMinMax = false;
                   this.hideAWU = false;
                 }
                 if (val.includes('-4-') || val.includes('-9-')) {
                   this.hideMinMax = true;
                   this.hideAlloc = false;
                   this.hideAWU = true;
                 }
               }
               else {
                 //this.hideStock = true;
                 this.hideMinMax = false;
                 this.hideAlloc = false;
                 this.hideAWU = true;
                 this.stock_datasource = null;
                 this.searchTerms.next('');
                }
              })

              if (meInput.value.length == 14) {
                this.searchTerms.next(meInput.value.trim());
                this.hideStock = false;
                this.menumber = meInput.value.trim();
                if (meInput.value.includes('-3-')) {
                  this.hideAlloc = true;
                  this.hideMinMax = false;
                  this.hideAWU = false;
                }
                if (meInput.value.includes('-4-') || meInput.value.includes('-9-')) {
                  this.hideMinMax = true;
                  this.hideAlloc = false;
                  this.hideAWU = true;
                }
              }
              else {//-0-
                //this.hideStock = true;
                this.hideMinMax = false;
                this.hideAlloc = false;
                this.hideAWU = true;
              }
              this.isLoadingComplete = true;
            })
        }
        else {
          this.isLoadingComplete = false;
          const sub = fromEvent(btnSearch, 'click')
            .subscribe((e: Event) => {
              let _currentMeNumber = this.partService.getCurrentMeNumber();
              _currentMeNumber.subscribe(val => { 
               if (val.length > 0) { 
                 this.searchTerms.next(val);
                 this.hideStock = false;
                 this.menumber = val;
                 if (val.includes('-3-')) {
                   this.hideAlloc = true;
                   this.hideMinMax = false;
                   this.hideAWU = false;
                 }
                 if (val.includes('-4-') || val.includes('-9-')) {
                   this.hideMinMax = true;
                   this.hideAlloc = false;
                   this.hideAWU = true;
                 }
               }
               else {
                 //this.hideStock = true;
                 this.hideMinMax = false;
                 this.hideAlloc = false;
                 this.hideAWU = true;
                 this.stock_datasource = null;
                 this.searchTerms.next('');
                }
              })
                
               if (meInput.value.length == 14) {
                 this.searchTerms.next(meInput.value.trim());
                 this.menumber = meInput.value.trim();
                 if (meInput.value.includes('-3-')) {
                   this.hideAlloc = true;
                   this.hideMinMax = false;
                   this.hideAWU = false;
                 }
                 if (meInput.value.includes('-4-') || meInput.value.includes('-9-')) {
                   this.hideMinMax = true;
                   this.hideAlloc = false;
                   this.hideAWU = true;
                 }

                 this.hideStock = false;
               }
               else {
                 //this.hideStock = true;
                 this.hideMinMax = false;
                 this.hideAlloc = false;
                 this.hideAWU = true;
                 this.stock_datasource = null;
                 this.searchTerms.next('');
              }
              this.isLoadingComplete = true;
            })
         }
      })
    /*   
    this.searchTerms.subscribe(term => {
      this.partService.getStock(term).subscribe(data => {
        this.stock_datasource = new MatTableDataSource(data);
      })
    })
    */

    var event = new Event('click', {
      bubbles: true,
      cancelable: false      
    });
    meInput.dispatchEvent(event);
    meInput.click();
    this.searchTerms.next(meInput.value.trim());

    this.usage_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          meInput.value = params['id'];
          const sub = fromEvent(window, 'load')
            .subscribe((e: Event) => {
              if (meInput.value.length == 14) {
                this.searchTerms.next(meInput.value.trim());
                this.hideUsage = false;
                this.menumber = meInput.value.trim();
              }
              else {
                this.hideUsage = true;
              }
            });
        }
        else {
          const sub = fromEvent(btnSearch, 'click')
          .subscribe((e: Event) => {
            if (meInput.value.length > 0 ) { 
              this.searchTerms.next(meInput.value.trim());
              this.hideUsage = false;
            }
            else {
              this.hideUsage = true;
            }
        });
        }
      });
    
    this.scrap_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          const sub = fromEvent(window, 'load')
            .subscribe((e: Event) => {
              if (meInput.value.length == 14) {
                this.searchTerms.next(meInput.value.trim());
                this.hideScrap = false;
              }
              else {
                this.hideScrap = true;
              }
            });
        }
        else {
          const sub = fromEvent(btnSearch, 'click')
            .subscribe((e: Event) => {
                if (meInput.value.length > 0 ) { 
                  this.searchTerms.next(meInput.value.trim());
                  this.hideScrap = false;
                }
                else {
                  this.hideScrap = true;
                }

                // if (meInput.value.length == 14) {
                //   this.searchTerms.next(meInput.value.trim());
                //   this.hideScrap = false;
                // }
                // else {
                //   this.hideScrap = true;
                // }
            });
          }
      })
  
      this.subRoute = this.route.params.subscribe(
        (params: Params) => {
          if (params['id']) {
            this.tesdetailUrl = "/ata/ses/detail";
          }
          else {
            this.tesdetailUrl = "./ses/detail";
          }
        });

      this.tes_subscription = this.route.params.subscribe(
        (params: Params) => {
          if (params['id']) {
            const sub = fromEvent(window, 'load')
              .subscribe((e: Event) => {
                if (meInput.value.length > 0) {
                  this.searchTerms.next(meInput.value.trim());
                  this.hideSes = false;
                }
                else {
                  this.hideSes = true;
                }
              });
          }
          else { 
            fromEvent(btnSearch, 'click')
              .subscribe((e: Event) => {            
                if (meInput.value.length > 0 ) { 
                  this.searchTerms.next(meInput.value.trim());
                  this.hideSes = false;
                }
                else {
                  this.hideSes = true;
                }
              });
          }
        })
      this.isLoadingComplete = true;
  }

  sortStockData(event: Sort) {
    let sorttype: string;
    let orderby: string;
    let partNumberVal: HTMLFormElement;

    orderby = event.active;
    sorttype = event.direction;
    
    this.isLoadingComplete = false;
    switch (this.currentSearchType) { 
      case "M&E":
        partNumberVal = document.getElementById('part-search-input') as HTMLFormElement;
        break;
      case "MPN":
        partNumberVal = document.getElementById('currentMeNumber-input') as HTMLFormElement;
        break
    }

    this.partService.getStock(partNumberVal.value, orderby, sorttype)
    .subscribe(data => { 
      this.stock_datasource = new MatTableDataSource(data);
      this.stock_datasource.sort = this.sort;
      this.hideStock = false;
    });
  }

  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)

    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }

  detectChanges() {
    if (this.cdr && !(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  searchPartNumber(val: string) {
    // if (this.fromUrl == false  && )
    //   window.location.href = './..';
    this.hideMeSummary = true;
    this.hideMeReview = true;
    this.hideStock = true;
    this.hideUsage = true;
    this.hideScrap = true;
    this.hideSes = true;
    this.hideFooter = true;
    this.isLoadingComplete = true;
    this.hideLoading = false;
   
    // this.openPPAMMaintSnackBar();
    this.searchTerms.next(val.trim());
    // this.refreshtime$ = this.partService.getRefreshTime();
    this.partService.setSearchType(this.currentSearchType);
    //const meInput = document.getElementById('part-search-input') as HTMLFormElement;
    this.showBtnOptions = true;

    this.partService.getMeStatus(val.trim())
      .subscribe(x => {
        if (x.length > 0) {
          this.mestatus = x[0].STATUS_NM;
          this.showStatus = true;
        }
        else {
          this.mestatus = null;
          this.showStatus = false;
        }
    });
    
    this.partService.getStock(val)
    .subscribe(data => {
      this.stock_datasource = new MatTableDataSource(data);
      this.hideStock = false;
    });

    this.partService.getUsage(val, 'U', 'A')
    .subscribe(result => {
      this.usage_a_data = result;
      this.segregateUsageActivityData(this.usage_a_data);
    });

    this.partService.getUsage(val, 'U', 'S')
    .subscribe(result => {
      this.usage_s_data = result;
      this.segregateUsageStationData(this.usage_s_data);
    });

    this.partService.getForecast(val, 'F')
    .subscribe(result => {
      this.forecast_data = result;
      this.segregateForecastData(this.forecast_data);
    });

    this.partService.getExcessStatus(val)
    .subscribe(result => {
      this.excessstatus_data = result;
    });

    this.partService.getAOG(val)
    .subscribe(result => {
      this.aog_data = result;
    });

    this.partService.getAogTotals(val)
    .subscribe(result => {
      this.aog_data_total = result;
    });

    this.partService.getDeferral(val)
    .subscribe(result => {
      this.deferral_data = result;
    });

    this.partService.getDeferralTotals(val)
    .subscribe(result => {
      this.deferral_data_total = result;
    });
    

    this.partService.getDelays(val)
    .subscribe(result => {
      this.delay_data = result;
    });

    this.partService.getDelaysTotals(val)
    .subscribe(result => {
      this.delay_data_total = result;
    });

    this.partService.getCancels(val)
    .subscribe(result => {
      this.cancel_data = result;
    });

    this.partService.getCancelsTotals(val)
    .subscribe(result => {
      this.cancel_data_total = result;
    });

    this.partService.getScrap(val)
    .subscribe(result => {
      this.scrap_data = result;
    });

    this.partService.getScrapTotals(val)
    .subscribe(result => {
      this.scrap_data_total = result;
    });

    this.partService.getSesSummary(val)
    .subscribe(result => {
      this.ses_data = result;
    });

    //Gets All MPNs associated with a part number and filter it, use only Non-Prime MPN. Modify below logic per requirements.
       this.partService.getAllMpn(val)
    .subscribe(result => {
      this.all_other_mpn = result?.filter(x => x.MFG_TYPE.trim().toUpperCase() !== 'P');
      this.showAllOtherMpnList = this.all_other_mpn?.length>0 ? true: false;
    });

    this.hideLoading = true;

    switch (this.currentSearchType) {
      case "M&E":
        this.partService.setCurrentMeNumber(val.trim());
        this.currentMePartNumber = val.trim();
        //this.parts$ = this.partService.searchParts(val);
        this.hideLoading = false;
        this.partService.searchParts(val.trim())
          .subscribe(result => {            
            if (result.length > 0) {
              //result[0].IPC_DESCRIPTION = result[0].IPC_DESCRIPTION?.trim();
              this.parts$= result;
              this.parts = result;
              this.partService.setOptimalOwnership(this.parts[0].OPTIMAL_OWNERSHIP);
              this.parts[0].Sched_Mntnc?.toString()?.trim().includes('NO') ? this.parts[0].Sched_Mntnc = 'N/A' : this.parts[0].Sched_Mntnc;
              this.ipcfleet = [];
              this.airbus = [];
              this.boeing = [];

              if (result[0].PLANNER) {
                this.planner_fnln = result[0].PLANNER.split(',');
              if (this.planner_fnln.length > 1)
                this.displayplanner_fnln = this.planner_fnln[1].toString().trim() + " " + this.planner_fnln[0].toString()
              }

              if (result[0].IPC_FLEET != null) {
                this.ipcfleet = result[0].IPC_FLEET.split(',');               
                this.airbus = this.ipcfleet.filter(x => x.startsWith('A'));
                this.boeing = this.ipcfleet.filter(x => x.startsWith('B'));
                if (this.airbus.length > 0)
                  this.fleetlabel1 = "Airbus";
                if (this.boeing.length > 0)
                  this.fleetlabel2 = " Boeing";
                // else if (this.airbus.length == 0)
                //   this.fleetlabel += "Boeing";
                this.airbus.forEach(x => this.airbusitems += x + ", ");
                this.boeing.forEach(x => this.boeingitems += x + ", ");
                this.airbusitems = this.airbusitems.substring(0, this.airbusitems.lastIndexOf(", "));
                this.boeingitems = this.boeingitems.substring(0, this.boeingitems.lastIndexOf(", "));
              }
              this.hideMeSummary = false;
              this.hideMeReview = false;
              this.hideStock = false;
              this.hideUsage = false;
              this.hideScrap = false;
              this.hideSes = false;
              this.hideFooter = false;
            }
            else {
              this.parts$ = null;
              this.hideMeSummary = true;
              this.hideMeReview = true;
              //this.hideStock = true;
              this.hideUsage = true;
              this.hideScrap = true;
              this.hideSes = true;
              this.hideFooter = true;
            }
            this.hideLoading = true;
          });
        
        this.partService.getSplitMEDetail(val.trim())
          .subscribe(results => {
            if (results.length > 0){
              this.showSplitMEBtn = true;
              this.splitmeData = results;
            }
            else
              this.showSplitMEBtn = false;
          });
          // this.showSplitMEBtn

        this.partService.getImqHpfDetail(val.trim(), "IMQ")
          .subscribe(results => {
            if (results.length > 0) {
              this.showImq = true;
              this.imqData = results;
            }
            else
              this.showImq = false;
          });

        this.partService.getImqHpfDetail(val.trim(), "HPF")
        .subscribe(results => {
          if (results.length > 0) {
            this.showHpf = true;
            this.hpfData = results;
          }
          else
            this.showHpf = false;   
        });
        break;
      case "MPN":
        this.partService.searchMeByMPN(val.trim())
          .subscribe(data => {           
            if (data.length > 0) {
              if (data.length > 1) {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = true;
                dialogConfig.width = '375px';
                dialogConfig.maxWidth = '375px';
                dialogConfig.data = { mpn: val.trim() }

                let dialogRef = this.dialog.open(
                  MeSummaryMePartNumberDetailsComponent, dialogConfig
                );

                dialogRef.afterClosed().subscribe(result => {
                  this.dialogValue = result.data;
                  
                  this.partService.setCurrentMeNumber(this.dialogValue.trim());
                  this.currentMePartNumber = this.dialogValue.trim();
                  //this.parts$ = this.partService.searchParts(this.dialogValue.trim());
                  this.hideLoading = false;
                  this.partService.searchParts(this.dialogValue.trim())
                    .subscribe(result => {
                      if (result.length > 0) {
                        this.parts$ = result;
                      this.parts = result;

                      this.partService.getStock(this.dialogValue.trim())
                      .subscribe(data => {
                        this.stock_datasource = new MatTableDataSource(data);
                        this.hideStock = false;
                      });

                      //Gets All MPNs associated with a part number and filter it, use only Non-Prime MPN. Modify below logic per requirements.
                      this.partService.getAllMpn(val)
                      .subscribe(result => {
                        this.all_other_mpn = result.filter(x => x.MFG_TYPE.trim().toUpperCase() !== 'P');
                        this.showAllOtherMpnList = this.all_other_mpn.length>0 ? true: false;
                      });

                      this.ipcfleet = [];
                      this.airbus = [];
                      this.boeing = [];

                      if (result[0].IPC_FLEET != null) {
                        this.ipcfleet = result[0].IPC_FLEET.split(',');               
                        this.airbus = this.ipcfleet.filter(x => x.startsWith('A'));
                        this.boeing = this.ipcfleet.filter(x => x.startsWith('B'));
                        if (this.airbus.length > 0)
                          this.fleetlabel1 = "Airbus";
                        if (this.boeing.length > 0)
                          this.fleetlabel2 = " Boeing";
                        // else if (this.airbus.length == 0)
                        //   this.fleetlabel += "Boeing";
                        this.airbus.forEach(x => this.airbusitems += x + ", ");
                        this.boeing.forEach(x => this.boeingitems += x + ", ");
                        this.airbusitems = this.airbusitems.substring(0, this.airbusitems.lastIndexOf(", "));
                        this.boeingitems = this.boeingitems.substring(0, this.boeingitems.lastIndexOf(", "));
                      }
                        this.hideMeSummary = false;
                        this.hideMeReview = false;
                        this.hideStock = false;
                        this.hideUsage = false;
                        this.hideScrap = false;
                        this.hideSes = false;
                        this.hideFooter = false;
                      }
                      else {
                        this.parts$ = null;
                        this.hideMeSummary = true;
                        this.hideMeReview = true;
                        //this.hideStock = true;
                        this.hideUsage = true;
                        this.hideScrap = true;
                        this.hideSes = true;
                        this.hideFooter = true;
                      }
                      this.hideLoading = true;
                    });
                  this.partService.getSplitMEDetail(this.dialogValue.trim())
                    .subscribe(results => {
                      if (results.length > 0){
                        this.showSplitMEBtn = true;
                        this.splitmeData = results;
                      }
                      else
                        this.showSplitMEBtn = false;
                    })
                  // this.search(this.dialogValue.trim());
                  // meInput.value = this.dialogValue.trim();
                });
              }
              else {
                this.partService.setCurrentMeNumber(data[0].ME_PART_NUMBER.trim());
                this.currentMePartNumber = data[0].ME_PART_NUMBER.trim();
                //this.parts$ = this.partService.searchParts(data[0].ME_PART_NUMBER);
                this.hideLoading = false;
                this.partService.searchParts(data[0].ME_PART_NUMBER.trim())
                  .subscribe(result => {
                    this.parts$ = result;
                    this.hideLoading = true;
                  });
                this.partService.getSplitMEDetail(data[0].ME_PART_NUMBER.trim())
                .subscribe(results => {
                  if (results.length > 0) {
                    this.showSplitMEBtn = true;
                    this.splitmeData = results;
                  }                    
                  else
                    this.showSplitMEBtn = false;
                })
              }
            }
            else {
              // this.partService.setCurrentMeNumber(data[0].ME_PART_NUMBER);
              // this.currentMePartNumber = data[0].ME_PART_NUMBER;
              // this.parts$ = this.partService.searchParts(data[0].ME_PART_NUMBER);
              this.parts$ = null;
              this.hideMeSummary = true;
              this.hideMeReview = true;
              //this.hideStock = true;
              this.hideUsage = true;
              this.hideScrap = true;
              this.hideSes = true;
              this.hideFooter = true;
            }
          })
        
        break;
    }
    this.hideFooter = false;
    this.isLoadingComplete = true;
  }

  searchChanged() {
    //this.partService.clearCurrentMeNumber();
    const meInput = document.getElementById('part-search-input') as HTMLFormElement;
    this.partService.setCurrentMeNumber(meInput.value.trim());
    meInput.value = '';
    switch (this.currentSearchType) {
      case "M&E":
        this.searchlength = 14;
        break;
      case "MPN":
        this.searchlength = 20;
        break;
    }
    this.showBtnOptions = false;
    this.showSplitMEBtn = false;
    this.showImq = false;
    this.showHpf = false;

    this.hideMeSummary = true;
    this.hideMeReview = true;
    this.hideStock = true;
    this.hideUsage = true;
    this.hideScrap = true;
    this.hideSes = true;
    this.hideFooter = true;
    this.fleetlabel1 = "";
    this.fleetlabel2 = "";
    this.airbusitems = "";
    this.boeingitems = "";
  }

  searchPartNumberClick(val: string) {
    this.stock_datasource = null;
    this.forecast_data = null;
    this.usage_a_data = null;
    this.usage_s_data = null;
    this.forecast_data = null;
    this.aog_data = null;
    this.deferral_data = null;
    this.deferral_data_total = null;
    this.delay_data = null;
    this.delay_data_total = null;
    this.cancel_data = null;
    this.cancel_data_total = null;
    this.scrap_data = null;
    this.scrap_data_total = null;
    this.ses_data = null;
    this.all_other_mpn = null;
    this.hideMeSummary = true;
    this.hideMeReview = true;
    this.hideStock = true;
    this.hideUsage = true;
    this.hideScrap = true;
    this.hideSes = true;
    this.hideFooter = true;
    this.showImq = false;
    this.showHpf = false;
    this.hideLoading = false;
    this.partService.setChildComponents(false);
    // this.openPPAMMaintSnackBar();
    this.openDeletedPartNumber(val);
    this.partService.getMeStatus(val)
      .subscribe(x => {
        if (x.length > 0) {
          this.mestatus = x[0].STATUS_NM;
          this.showStatus = true;
        }
        else {
          this.mestatus = null;
          this.showStatus = false;
        }
    });
    this.route.url.subscribe((params: Params) => {
      if (params.length > 1 && params[1].path) {
        window.location.href = 'ata/' + val.trim();
      }
      else {
        this.searchTerms.next(val.trim());
        // this.refreshtime$ = this.partService.getRefreshTime();
        this.partService.setSearchType(this.currentSearchType);

        switch (this.currentSearchType) {
          case "M&E":

            this.partService.getStock(val)
              .subscribe(data => {
                this.stock_datasource = new MatTableDataSource(data);
                this.hideStock = false;
              });

            //Gets All MPNs associated with a part number and filter it, use only Non-Prime MPN. Modify below logic per requirements.
            this.partService.getAllMpn(val)
            .subscribe(result => {
              this.all_other_mpn = result.filter(x => x.MFG_TYPE?.trim().toUpperCase() !== 'P');
              this.showAllOtherMpnList = this.all_other_mpn.length>0 ? true: false;
            });

            this.partService.getUsage(val, 'U', 'A')
              .subscribe(result => {
                this.usage_a_data = result;
                this.segregateUsageActivityData(this.usage_a_data);
              });

            this.partService.getUsage(val, 'U', 'S')
              .subscribe(result => {
                this.usage_s_data = result;
                this.segregateUsageStationData(this.usage_s_data);
              });

            this.partService.getForecast(val, 'F')
              .subscribe(result => {
                this.forecast_data = result;
                this.segregateForecastData(this.forecast_data);
              });
            
              this.partService.getExcessStatus(val)
              .subscribe(result => {
                this.excessstatus_data = result;
              });

            this.partService.getAOG(val)
              .subscribe(result => {
                this.aog_data = result;
              });
            
            this.partService.getAogTotals(val)
              .subscribe(result => {
                this.aog_data_total = result;
              });

            this.partService.getDeferral(val)
              .subscribe(result => {
                this.deferral_data = result;
              });
            
            this.partService.getDeferralTotals(val)
              .subscribe(result => {
                this.deferral_data_total= result;
              });

            this.partService.getDelays(val)
              .subscribe(result => {
                this.delay_data= result;
              });

            this.partService.getDelaysTotals(val)
              .subscribe(result => {
                this.delay_data_total= result;
              });
            
            this.partService.getCancels(val)
              .subscribe(result => {
                this.cancel_data = result;
              });
            
            this.partService.getCancelsTotals(val)
              .subscribe(result => {
                this.cancel_data_total = result;
              });

            this.partService.getScrap(val)
              .subscribe(result => {
                this.scrap_data = result;
              });

            this.partService.getScrapTotals(val)
              .subscribe(result => {
                this.scrap_data_total = result;
              });

            this.partService.getSesSummary(val)
              .subscribe(result => {
                this.ses_data = result;
              });

            this.partService.setCurrentMeNumber(val.trim());
            this.currentMePartNumber = val.trim();
            this.hideLoading = false;
            this.partService.searchParts(val.trim())
              .subscribe(result => {
                if (result.length == 0)
                  this.notFoundMessage(val.trim());
                
                if (result.length > 0) {
                  this.parts$ = result;
                  this.parts = result;
                  this.parts[0].Sched_Mntnc?.toString()?.includes('NO') ? this.parts[0].Sched_Mntnc = 'N/A' : this.parts[0].Sched_Mntnc;
                  this.planner_fnln = [];
                  this.displayplanner_fnln = "";
                  this.ipcfleet = [];
                  this.airbus = [];
                  this.boeing = [];
                  this.fleetlabel1 = "";
                  this.fleetlabel2 = "";
                  this.airbusitems = "";
                  this.boeingitems = "";
                  if (result[0].PLANNER) {
                    this.planner_fnln = result[0].PLANNER.split(',');
                  if (this.planner_fnln.length > 1)
                    this.displayplanner_fnln = this.planner_fnln[1]?.toString().trim() + " " + this.planner_fnln[0]?.toString()
                  }

                  if (result[0].IPC_FLEET != null) {
                    this.ipcfleet = result[0].IPC_FLEET.split(',');
                    this.airbus = this.ipcfleet.filter(x => x.startsWith('A'));
                    this.boeing = this.ipcfleet.filter(x => x.startsWith('B'));
                    if (this.airbus.length > 0)
                      this.fleetlabel1 = "Airbus";
                    if (this.boeing.length > 0)
                      this.fleetlabel2 = " Boeing";
                    // else if (this.airbus.length == 0)
                    //   this.fleetlabel += "Boeing";
                    this.airbus.forEach(x => this.airbusitems += x + ", ");
                    this.boeing.forEach(x => this.boeingitems += x + ", ");
                    this.airbusitems = this.airbusitems.substring(0, this.airbusitems.lastIndexOf(", "));
                    this.boeingitems = this.boeingitems.substring(0, this.boeingitems.lastIndexOf(", "));
                  }
                  this.hideMeSummary = false;
                  this.hideMeReview = false;
                  this.hideStock = false;
                  this.hideUsage = false;
                  this.hideScrap = false;
                  this.hideSes = false;
                  this.hideFooter = false;
                  this.showBtnOptions = true;
                  this.partService.setChildComponents(true);
                }
                else {
                  this.parts$ = null;
                  this.hideMeSummary = true;
                  this.hideMeReview = true;
                  //this.hideStock = true;
                  this.hideUsage = true;
                  this.hideScrap = true;
                  this.hideSes = true;
                  this.hideFooter = true;
                  this.showBtnOptions = false;
                  // if (val != '' && val !== undefined)
                  //   this.notFoundMessage(val.trim());
                }
                this.hideLoading = true;
              });

            this.partService.getSplitMEDetail(val.trim())
              .subscribe(results => {
                if (results.length > 0){
                  this.showSplitMEBtn = true;
                  this.splitmeData = results;
                }
                else
                  this.showSplitMEBtn = false;
              });
              // this.showSplitMEBtn

            this.partService.getImqHpfDetail(val.trim(), "IMQ")
              .subscribe(results => {
                if (results.length > 0) {
                  this.showImq = true;
                  this.imqData = results;
                }
                else
                  this.showImq = false;
              });

            this.partService.getImqHpfDetail(val.trim(), "HPF")
            .subscribe(results => {
              if (results.length > 0) {
                this.showHpf = true;
                this.hpfData = results;
              }
              else
                this.showHpf = false;   
            });
            break;
          case "MPN":
            this.showBtnOptions = false;
            this.hideLoading = false;
            this.partService.searchMeByMPN(val.trim())
              .subscribe(data => {           
                if (data.length > 0) {
                  this.partService.setChildComponents(true);
                  if (data.length > 0) {
                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.disableClose = true;
                    dialogConfig.width = '375px';
                    dialogConfig.maxWidth = '375px';
                    dialogConfig.data = { mpn: val.trim() }

                    let dialogRef = this.dialog.open(
                      MeSummaryMePartNumberDetailsComponent, dialogConfig
                    );

                    dialogRef.afterClosed().subscribe(result => {
                      this.dialogValue = result.data;
                      
                      // console.log(this.dialogValue.trim());
                      this.partService.setCurrentMeNumber(this.dialogValue.trim());
                      this.currentMePartNumber = this.dialogValue.trim();
                      
                      this.partService.getStock(this.dialogValue.trim())
                        .subscribe(data => {
                          this.stock_datasource = new MatTableDataSource(data);
                          this.hideStock = false;
                        });
                      
                              //this.parts$ = this.partService.searchParts(this.dialogValue.trim());
                      this.hideLoading = false;
                      this.partService.searchParts(this.dialogValue.trim())
                        .subscribe(result => {
                          if (result.length > 0) {
                            this.parts$ = result;

                            //Gets All MPNs associated with a part number and filter it, use only Non-Prime MPN. Modify below logic per requirements.
                            this.partService.getAllMpn(val)
                              .subscribe(result => {
                              this.all_other_mpn = result.filter(x => x.MFG_TYPE.trim().toUpperCase() !== 'P');
                              this.showAllOtherMpnList = this.all_other_mpn.length>0 ? true: false;
                            });

                            this.partService.getUsage(this.currentMePartNumber, 'U', 'A')
                              .subscribe(result => {
                                this.usage_a_data = result;
                                this.segregateUsageActivityData(this.usage_a_data);
                            });

                            this.partService.getUsage(this.currentMePartNumber, 'U', 'S')
                              .subscribe(result => {
                                this.usage_s_data = result;
                                this.segregateUsageStationData(this.usage_s_data);
                            });

                            this.partService.getForecast(this.currentMePartNumber, 'F')
                              .subscribe(result => {
                                this.forecast_data = result;
                                this.segregateForecastData(this.forecast_data);
                            });

                            this.partService.getAOG(this.currentMePartNumber)
                              .subscribe(result => {
                                this.aog_data = result;
                            });
                            
                            this.partService.getAogTotals(this.currentMePartNumber)
                              .subscribe(result => {
                                this.aog_data_total = result;
                            });

                            this.partService.getDeferral(this.currentMePartNumber)
                              .subscribe(result => {
                                this.deferral_data = result;
                            });
                            
                            this.partService.getDeferralTotals(this.currentMePartNumber)
                              .subscribe(result => {
                                this.deferral_data_total= result;
                            });

                            this.partService.getDelays(this.currentMePartNumber)
                              .subscribe(result => {
                                this.delay_data= result;
                            });

                            this.partService.getDelaysTotals(this.currentMePartNumber)
                              .subscribe(result => {
                                this.delay_data_total= result;
                            });

                            this.partService.getCancels(this.currentMePartNumber)
                              .subscribe(result => {
                                this.cancel_data = result;
                            });

                            this.partService.getCancelsTotals(this.currentMePartNumber)
                              .subscribe(result => {
                                this.cancel_data_total = result;
                            });

                            this.partService.getScrap(this.currentMePartNumber)
                              .subscribe(result => {
                                this.scrap_data = result;
                            });

                            this.partService.getScrapTotals(this.currentMePartNumber)
                              .subscribe(result => {
                                this.scrap_data_total = result;
                            });

                            this.partService.getSesSummary(this.currentMePartNumber)
                              .subscribe(result => {
                                this.ses_data = result;
                            });

                            this.partService.getImqHpfDetail(this.currentMePartNumber, "IMQ")
                              .subscribe(results => {
                                if (results.length > 0) {
                                  this.showImq = true;
                                  this.imqData = results;
                                }
                                else
                                  this.showImq = false;
                            });

                            this.partService.getImqHpfDetail(this.currentMePartNumber, "HPF")
                              .subscribe(results => {
                                if (results.length > 0) {
                                  this.showHpf = true;
                                  this.hpfData = results;
                                }
                                else
                                  this.showHpf = false;   
                            });
                            
                            this.ipcfleet = [];
                            this.airbus = [];
                            this.boeing = [];
                            this.fleetlabel1 = "";
                            this.fleetlabel2 = "";
                            this.airbusitems = "";
                            this.boeingitems = "";
                            if (result[0].PLANNER) {
                              this.planner_fnln = result[0].PLANNER.split(',');
                            if (this.planner_fnln.length > 1)
                              this.displayplanner_fnln = this.planner_fnln[1]?.toString().trim() + " " + this.planner_fnln[0]?.toString()
                            }
          
                            if (result[0].IPC_FLEET != null) {
                              this.ipcfleet = result[0].IPC_FLEET.split(',');
                              this.airbus = this.ipcfleet.filter(x => x.startsWith('A'));
                              this.boeing = this.ipcfleet.filter(x => x.startsWith('B'));
                              if (this.airbus.length > 0)
                                this.fleetlabel1 = "Airbus";
                              if (this.boeing.length > 0)
                                this.fleetlabel2 = " Boeing";
                              // else if (this.airbus.length == 0)
                              //   this.fleetlabel += "Boeing";
                              this.airbus.forEach(x => this.airbusitems += x + ", ");
                              this.boeing.forEach(x => this.boeingitems += x + ", ");
                              this.airbusitems = this.airbusitems.substring(0, this.airbusitems.lastIndexOf(", "));
                              this.boeingitems = this.boeingitems.substring(0, this.boeingitems.lastIndexOf(", "));
                            }

                            this.hideMeSummary = false;
                            this.hideMeReview = false;
                            this.hideStock = false;
                            this.hideUsage = false;
                            this.hideScrap = false;
                            this.hideSes = false;
                            this.hideFooter = false;
                            this.showBtnOptions = true;
                            this.partService.setChildComponents(true);
                            this.planner_fnln = [];
                            this.displayplanner_fnln = "";
                            if (result[0].PLANNER) {
                              this.planner_fnln = result[0].PLANNER.split(',');
                            if (this.planner_fnln.length > 1)
                              this.displayplanner_fnln = this.planner_fnln[1]?.toString().trim() + " " + this.planner_fnln[0]?.toString()
                            }
                          }
                          else {
                            this.parts$ = null;
                            //this.usage_a$ = null;
                            this.usage_a_data = null;
                            //this.usage_s$ = null;
                            this.usage_s_data = null;
                            this.hideMeSummary = true;
                            this.hideMeReview = true;
                            //this.hideStock = true;
                            this.hideUsage = true;
                            this.hideScrap = true;
                            this.hideSes = true;
                            this.hideFooter = true;
                            this.showBtnOptions = false;
                          }
                          this.hideLoading = true;
                        });
                      
                      this.partService.getSplitMEDetail(this.dialogValue.trim())
                        .subscribe(results => {
                          if (results.length > 0) {
                            this.showSplitMEBtn = true;
                            this.splitmeData = results;
                          }
                          else
                            this.showSplitMEBtn = false;
                        })
                      // this.search(this.dialogValue.trim());
                      // meInput.value = this.dialogValue.trim();
                    });
                  }
                  else {
                    this.partService.setCurrentMeNumber(data[0].ME_PART_NUMBER.trim());
                    this.currentMePartNumber = data[0].ME_PART_NUMBER.trim();
                    //this.parts$ = this.partService.searchParts(data[0].ME_PART_NUMBER);
                    this.hideLoading = false;
                    this.partService.searchParts(data[0].ME_PART_NUMBER.trim())
                      .subscribe(result => {
                        if (result.length > 0) {
                          this.parts$ = result;
                          this.hideMeSummary = false;
                          this.hideMeReview = false;
                          this.hideStock = false;
                          this.hideUsage = false;
                          this.hideScrap = false;
                          this.hideSes = false;
                          this.hideFooter = false;
                          this.showBtnOptions = true;
                          this.partService.setChildComponents(true);
                          this.planner_fnln = [];
                          this.displayplanner_fnln = "";
                          if (result[0].PLANNER) {
                            this.planner_fnln = result[0].PLANNER.split(',');
                          if (this.planner_fnln.length > 1)
                            this.displayplanner_fnln = this.planner_fnln[1]?.toString().trim() + " " + this.planner_fnln[0]?.toString()
                          }
                        }
                        else {
                          this.parts$ = null;
                          this.usage_a_data = null;
                          this.usage_s_data = null;
                          this.hideMeSummary = true;
                          this.hideMeReview = true;
                          this.hideUsage = true;
                          this.hideScrap = true;
                          this.hideSes = true;
                          this.hideFooter = true;
                          this.showBtnOptions = false;
                        }
                        this.hideLoading = true;
                      });
                    this.partService.getSplitMEDetail(data[0].ME_PART_NUMBER.trim())
                      .subscribe(results => {
                        if (results.length > 0) {
                          this.showSplitMEBtn = true;
                          this.splitmeData = results;
                        }
                        else
                          this.showSplitMEBtn = false;
                      })
                  }
                }
                else {
                  this.parts$ = data;
                  this.partService.setChildComponents(false);
                }
              })
              this.hideLoading = true;
            break;
        } 
      }  
    });
  }

  openImqHpfModal(value: string) {
   
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.maxWidth = '600px';
    dialogConfig.data = { value: value.trim() };
    //dialogConfig.data = { value: value, data1: this.imqData, data2: this.hpfData };

    let dialogRef = this.dialog.open(
      MeImqHpfDetailComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      //this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
      this.dialogValue = result.data;
    });
  }

  openMEReviewModal(value: string) {
    // let toArray: any = (value);
    let arrmenumber: string[0] = value;
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '1124px';
    dialogConfig.height = '150px';
    //dialogConfig.height = '300px';
    //dialogConfig.maxWidth = '250px';
    dialogConfig.data = { value: value.trim(), arrmenumber };
    //dialogConfig.data = { value: value, data1: this.imqData, data2: this.hpfData };

    let dialogRef = this.dialog.open(
      MereviewComponent, dialogConfig
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      //this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
      this.dialogValue = result.data;
    });
  }

  openSplitMEModal(value: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '300px';
    dialogConfig.maxWidth = '300px';
    //dialogConfig.data = { value: value };
     dialogConfig.data = this.splitmeData;

    let dialogRef = this.dialog.open(
      MeSplitMeDetailComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      //this.smPlannerQueueService.setSmQueueRule(this.newSmObj);
      this.dialogValue = result.data;
    });
  }

  notFoundMessage(value: string) {
    this.snackBar.open('Part ' + value + ' was not found.  Enter a valid M&E', 'Close', {
      duration: 5000
    });
   }

  openDeletedPartNumber(menumber) {
    this.partService.getDeletedMeNumber(menumber).subscribe(
      x => {
        if (x.length != 0 && x[0].DELETED_IND == 'Y') {
          this.snackBar.open(menumber + ' has been deleted.', 'Close', { verticalPosition: 'top' });
        }
      });
  }

  setUsageType(type: string) {
    // this.ngOnInit();
    switch (type) {
      case "A":
        this.usage_a = true;
        this.usage_s = false;
        break;
      case "S":
        this.usage_a = false;
        this.usage_s = true;
        break;
     }
  }

  setHeaderMonth(_month: number): string{
    let result = moment().subtract(_month, 'months').format('MMM-YY');
    return result;
  }

  setHeaderMonthAdd(_month: number): string{
    let result = moment().add(_month, 'months').format('MMM-YY');
    return result;
  }

  ngOnDestroy() {
    this.searchTerms.unsubscribe(); // unsubscribe to ensure no memory leaks
    this.mesummary_subscription.unsubscribe();
    this.stockdata_subscription.unsubscribe();
    this.usage_subscription.unsubscribe();
    this.scrap_subscription.unsubscribe();
    this.tes_subscription.unsubscribe();
  }

  segregateUsageActivityData(arg_usage_a_data: Usage[]) {
    this.usage_a_data_total = [];
    this.usage_a_data_unscheduled = [];
    this.usage_a_data_scheduled = [];
    this.usage_a_data_eco = [];

    arg_usage_a_data.forEach(
      data => {
        switch (data.CATEGORY.toLowerCase()){
          case "total":
            this.usage_a_data_total.push(data);
            break;
          case "unscheduled":
            this.usage_a_data_unscheduled.push(data);
            break;
          case "scheduled":
            this.usage_a_data_scheduled.push(data);
            break;
          case "eco":
            this.usage_a_data_eco.push(data);
            break;
          //default case is not included as it is optional and no strict validation implementation needed here
          //but it can be used and pushed data to usage_a_data_total, if needed.
        }
      }
    );
    }

    segregateUsageStationData(arg_usage_s_data: Usage[]) {
      this.usage_s_data_total = [];
      this.usage_s_data_unscheduled = [];
      this.usage_s_data_scheduled = [];
      this.usage_s_data_eco = [];

      arg_usage_s_data.forEach(
        data => {
          switch (data.CATEGORY.toLowerCase()){
            case "total":
              this.usage_s_data_total.push(data);
              break;
            case "unscheduled":
              this.usage_s_data_unscheduled.push(data);
              break;
            case "scheduled":
              this.usage_s_data_scheduled.push(data);
              break;
            case "eco":
              this.usage_s_data_eco.push(data);
              break;
            //default case is not included as it is optional and no strict validation implemention needed here
            //but it can be used and pushed data to usage_s_data_total, if needed.
          }
        }
      );
    }

    segregateForecastData(arg_forecast_data: Forecast[]) {
      this.forecast_data_total = [];
      this.forecast_data_unscheduled = [];
      this.forecast_data_scheduled = [];
      this.forecast_data_eco = [];

      arg_forecast_data.forEach(
        data => {
          switch (data.CATEGORY.toLowerCase()){
            case "total":
              this.forecast_data_total.push(data);
              break;
            case "unscheduled":
              this.forecast_data_unscheduled.push(data);
              break;
            case "scheduled":
              this.forecast_data_scheduled.push(data);
              break;
            case "eco":
              this.forecast_data_eco.push(data);
              break;
            //default case is not included as it is optional and no strict validation implemention needed here
            //but it can be used and pushed data to forecast_data_total, if needed.
          }
        }
      );
    }

}
