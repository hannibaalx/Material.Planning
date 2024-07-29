
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, from } from 'rxjs';
import { EcoService } from 'src/app/service/eco.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { switchMap, map, first, take, takeLast, toArray } from 'rxjs/operators';
import { MeDash8Detail } from 'src/app/models/me-dash8-detail';
import { EoPartsAttInv } from 'src/app/models/eo-parts-att-inv';
import { StationInventory } from 'src/app/models/station-inventory';
import { RefreshTime } from 'src/app/models/refresh-time';

declare var $:any;

@Component({
  selector: 'app-eo-me-detail',
  templateUrl: './eo-me-detail.component.html',
  styleUrls: ['./eo-me-detail.component.css']
})
export class EoMeDetailComponent implements OnInit, OnDestroy {
  meDash8Detail$: Observable<MeDash8Detail[]>;
  meDash8Summary$: Observable<MeDash8Detail[]>;
  mepninkit$: Observable<EoPartsAttInv[]>;
  stationinv$: Observable<StationInventory[]>;
  refreshtime$: Observable<RefreshTime[]>;
  summ: MeDash8Detail[];
  private subscription: Subscription;
  private routeSub: Subscription;
  menumber: string;
  timeFrame: string = "";
  menumberid: string;

  sum_dash8: string;
  sum_event: string;
  sum_fleet: string;
  sum_rescode: string;
  sum_atacode: string;
  sum_MT: string;
  sum_CTLG_LT: string;
  sum_CTLG_PRICE: string;
  sum_primempn: string;
  sum_keydesc: string;
  sum_avgcost: string;
  sum_shelflife: string;
  sum_chemind: string;
  sum_ui: string;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.meDash8Detail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.menumberid = params.get('menumberid'),
          this.ecoService.getMeDash8Detail(params.get('id'))
        )
      )
    );

    this.refreshtime$ = this.ecoService.getRefreshTimeEoMeDetail();
    
    this.stationinv$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.ecoService.getMeUsedDetailById(params.get('id').trim())
          )
        )
    );
    
    this.routeSub = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.menumber = params['id'];
        }
      });

    //trying to get the first element in a | async stream
    const example = this.meDash8Detail$.pipe(first());
    //const subscribe = example.subscribe(val => console.log(`First value: ${val[0].KEYWORD_DESCRIPTION}`));
    const subscribe = example.subscribe((val) => {
      this.sum_dash8 = val[0].DASH_8
      this.sum_fleet = val[0].ME_FLEET.toString()
      this.sum_rescode = val[0].ME_RESOURCE_CODE
      this.sum_MT = val[0].MT
      this.sum_ui = val[0].UI
      this.sum_atacode = val[0].ME_ATA_CODE
      this.sum_primempn = val[0].PRIME_MPN
      this.sum_CTLG_PRICE = val[0].CTLG_PRICE
      this.sum_CTLG_LT = val[0].CTLG_LT
      this.sum_shelflife = val[0].SHLF_LIFE.toString()
      this.sum_chemind = val[0].CHEMCL_IND
      this.sum_keydesc = val[0].KEYWORD_DESCRIPTION
      this.sum_avgcost = val[0].AVG_COST.toString()  
    });
  }

  // popMeSummary(event, fleet, rescode, atacode, prime, keydesc, avgcost, shelflife, chemind, ui) {
  //   let summary: string = "";
  //   summary = "<div><b>FLEET: </b>" + fleet + "</div>";
  //   summary += "<div><b>RES CODE:</b> " + rescode + "</div>";
  //   summary += "<div><b>UI</b> " + ui + "</div>";
  //   summary += "<div><b>ATA CODE:</b> " + atacode + "</div>";
  //   summary += "<div><b>PRIME:</b> " + prime + "</div>";
  //   summary += "<div class='nowrap'><b>KEY DESC:</b> " + keydesc + "</div>";
  //   summary += "<div><b>AVG COST</b> " + avgcost + "</div>";
  //   summary += "<div><b>SHELF LIFE</b> " + shelflife + "</div>";
  //   summary += "<div><b>CHEMICAL IND</b> " + chemind + "</div>";
    
  //   event.currentTarget.dataset.content = summary;
  // }
  
  popTitleSummary(event, sum_fleet, sum_rescode, sum_MT, sum_ui, sum_atacode, sum_primempn, sum_CTLG_PRICE, sum_CTLG_LT, sum_shelflife, sum_chemind, sum_keydesc) {
    let summary: string = "";
    summary = "<div><b>FLEET: </b>" + sum_fleet + "</div>";
    summary += "<div><b>RES CODE:</b> " + sum_rescode + "</div>";
    summary += "<div><b>MT</b> " + sum_MT + "</div>";
    summary += "<div><b>UI</b> " + sum_ui + "</div>";
    summary += "<div><b>ATA CODE:</b> " + sum_atacode + "</div>";
    summary += "<div><b>PRIME:</b> " + sum_primempn + "</div>";
    // summary += "<div class='nowrap'><b>KEY DESC:</b> " + sum_keydesc + "</div>";
    summary += "<div><b>CTLG PRICE</b> $" + sum_CTLG_PRICE + "</div>";
    summary += "<div><b>CTLG LT</b> " + sum_CTLG_LT + "</div>";
    summary += "<div><b>SHELF LIFE</b> " + sum_shelflife + "</div>";
    summary += "<div><b>CHEMICAL IND</b> " + sum_chemind + "</div>";
    
    event.currentTarget.dataset.content = summary;
  }

  getKitDetail(dash8, ind) {
    if (ind == 'Y') {
      this.mepninkit$ = this.route.paramMap.pipe(
        switchMap(
          (params: ParamMap) => (
            this.ecoService.getMeKitDetail(dash8, params.get('id').trim())
          )
        )
      );
    }
    else { 
      this.mepninkit$ = null;
    }
   }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
 }

  ngOnDestroy() {
    //this.subscription?.unsubscribe();
  }

  setTimeFrame(obj) {
    this.timeFrame = obj.currentTarget.value;
  }

}
