import { Component, OnInit, OnDestroy } from '@angular/core';
import { EcoService } from 'src/app/service/eco.service';
import { Observable } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Dash8detail } from './../../../../models/dash8detail';
import { MeUsedDetail } from 'src/app/models/me-used-detail';
import { EoPartsAttInv } from 'src/app/models/eo-parts-att-inv';
import { StationInventory } from 'src/app/models/station-inventory';
import { EoKitPartStationInventory } from 'src/app/models/eo-kit-part-station-inventory';
import { RefreshTime } from 'src/app/models/refresh-time';

declare var $:any;

@Component({
  selector: 'app-eo-dash8-detail',
  templateUrl: './eo-dash8-detail.component.html',
  styleUrls: ['./eo-dash8-detail.component.css']
})
export class EoDash8DetailComponent implements OnInit, OnDestroy {
  timeFrame: string = "";
  dash8id: string = "";
  dash8idstr: string = "";
  meusedtitle: string = "";
  previousmeusedtitle: string = "";
  kitdetailid: string = "";
  showMaxAwu: boolean = false;

  dash8Detail$: Observable<Dash8detail[]>;
  meUsedDetail$: Observable<MeUsedDetail[]>;
  mepninkit$: Observable<EoPartsAttInv[]>;
  stationinv$: Observable<StationInventory[]>;
  kitpartstationinv$: Observable<EoKitPartStationInventory[]>;
  refreshtime$: Observable<RefreshTime[]>;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.dash8Detail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.dash8id = params.get('id').trim(),
          this.ecoService.getDash8Detail(this.dash8id)
        )
      )
    );
    this.refreshtime$ = this.ecoService.getRefreshTimeDash8Detail();
  }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
 }

  popMeSummary(event, fleet, rescode, atacode, prime, keydesc, cataprice, shelflife, chemind, ui, mt, ctlglt) {
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

  getStationInventory(menumberinkit: string) { 
    this.stationinv$ = this.ecoService.getMeUsedDetailById(menumberinkit.trim());
    this.kitpartstationinv$ = this.ecoService.getKitPartStationInventory(menumberinkit.trim());
    this.kitdetailid = menumberinkit;
  }

  showMEUsed(meusednumber: string) { 
    this.meusedtitle = meusednumber;
    this.showMaxAwu = this.meusedtitle.search('-9-') > 0 || this.meusedtitle.search('-4-') > 0 ? false : true;
    if (this.meusedtitle == this.previousmeusedtitle) { 
      this.meUsedDetail$ = null;
      this.previousmeusedtitle = "";
    }
    else {
      this.meUsedDetail$ = this.ecoService.getMeUsedDetailById(meusednumber);
      this.previousmeusedtitle = this.meusedtitle;
    }
  }

  getKitDetail(dash8, menumberused, ind) {
    if (ind == 'Y') {
      this.mepninkit$ = this.route.paramMap.pipe(
        switchMap(
          (params: ParamMap) => (
            this.ecoService.getMeKitDetail(dash8.trim(), menumberused.trim())
          )
        )
      );
    }
    else { 
      this.mepninkit$ = null;
    }
   }

  setTimeFrame(obj) {
    this.timeFrame = obj.currentTarget.value;
  }
  
  ngOnDestroy(){ 

  }
  

}
