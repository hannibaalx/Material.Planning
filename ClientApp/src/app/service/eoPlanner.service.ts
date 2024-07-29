import { EoCapableStationShortage } from './../models/eo-capable-station-shortage';
import { EoNewDash8WithNoBom } from 'src/app/models/eo-new-dash8-with-no-bom';
import { EoNewStationsChanges } from 'src/app/models/eo-new-stations-changes';
import { EoNumberRule } from './../models/eo-number-rule';
import { EoPlanner } from '../models/eo-planner';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { RuleCount } from '../models/rule-count';
import { EoPartsShortage30 } from '../models/eo-parts-shortage30';
import { EoBomDetail } from '../models/eo-bom-detail';
import { EoPqCommentReq } from '../models/eo-pq-comment-req';
import { DropEoPqDash8Req } from '../models/drop-eo-pq-dash8-req';
import { UpdateEoPqMasterReq } from '../models/update-eo-pq-master-req';
import { Eo30DayKitDetail } from '../models/eo-30-day-kit-detail';
import { EoPartsShortage60 } from '../models/eo-parts-shortage60';
import { Eo60DayKitDetail } from '../models/eo-60-day-kit-detail';
import { Eo90DayKitDetail } from '../models/eo-90-day-kit-detail';
import { Eo120DayKitDetail } from '../models/eo-120-day-kit-detail';
import { Eo180DayKitDetail } from '../models/eo-180-day-kit-detail';
import { Eo180PlusDayKitDetail } from '../models/eo-180-plus-day-kit-detail';
import { EoPartsShortage90 } from '../models/eo-parts-shortage90';
import { EoPartsShortage120 } from '../models/eo-parts-shortage120';
import { EoPartsShortage180 } from '../models/eo-parts-shortage180';
import { EoPartsShortage180Plus } from '../models/eo-parts-shortage180-plus';
import { EoPartsInDiscrepancy } from '../models/eo-parts-in-discrepancy';
import { OverdueEoKitWorkOrder } from '../models/overdue-eo-kit-work-order';
import { OverduePoRo } from '../models/overdue-po-ro';
import { EoPartInDiscrepancyDetail } from '../models/eo-part-in-discrepancy-detail';
import { EoOverdueKitWorkOrderDetail } from '../models/eo-overdue-kit-work-order-detail';
import { EoOverduePosRosDetail } from '../models/eo-overdue-pos-ros-detail';
import { EoAdPartsShortage } from '../models/eo-ad-parts-shortage';
import { EoBomNewStationsChangesDetail } from '../models/eo-bom-new-stations-changes-detail';
import { EoBomAdPartsShortageDetail } from '../models/eo-bom-ad-parts-shortage-detail';
import { EoAdPartsShortageKitDetails } from '../models/eo-ad-parts-shortage-kit-details';
import { EoNewStationsChangesKitDetails } from '../models/eo-new-stations-changes-kit-details';
import { EoYesterdayDeferrals } from '../models/eo-yesterday-deferrals';
import { EoPartsShortage6090 } from '../models/eo-parts-shortage6090';
import { EoPartsShortage120180 } from '../models/eo-parts-shortage120180';
import { Eo6090DayKitDetail } from '../models/eo-6090-day-kit-detail';
import { Eo120180DayKitDetail } from '../models/eo-120180-day-kit-detail';
import { EoCapableStationShortageKitDetails } from '../models/eo-capable-station-shortage-kit-details';
import { EoStationShortage } from '../models/eo-station-shortage';
import { QARuleCount } from '../models/q-a-rule-count';
import { EoOnHoldEos } from '../models/eo-on-hold-eos';
import { EoOnHoldEosDetail } from '../models/eo-on-hold-eos-detail';
import { environment } from 'src/environments/environment';
import { PlannerSupervisor } from '../models/planner-supervisor';

@Injectable({
  providedIn: 'root'
})
export class eoPlannerService {
  private eoNumberRuleSubject = new Subject<EoNumberRule>();
  private eoPlannerSubject: string = ""; //= new Subject<string>();
  private _refreshNeeded$ = new Subject<void>();
  private _refreshEoPlannerCountNeeded$ = new Subject<void>();
  private _eoDash8RuleSubject = new Subject<EoNumberRule>();
  eoDash8RuleSubject$ = this._eoDash8RuleSubject.asObservable();
  currentEoDash8 = new Subject<EoNumberRule>();
  

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  get refreshNeeded$() { 
    return this._refreshNeeded$;
  }

  get refreshEoPlannerCountNeeded$() { 
    return this._refreshEoPlannerCountNeeded$;
  }

  getEoPlannerName(): string {
    console.log("getEoPlannerName: getting current eoPlanner")
    //return this.eoPlannerSubject.asObservable();
    return this.eoPlannerSubject;
   }

  setEoPlannerName(plannerName: string) {
    console.log("setEoPlannerName: setting plannername " + plannerName);
    //this.eoPlannerSubject.next(plannerName);
    this.eoPlannerSubject = plannerName;
  }
  
  clearEoPlannerName() { 
    //this.eoPlannerSubject.next();
    this.eoPlannerSubject = "";
  }

  getEoNumberRule(): Observable<EoNumberRule> {
    return this.eoNumberRuleSubject.asObservable();
   }

  setEoNumberRule(eonumberrule: EoNumberRule) { 
    this.eoNumberRuleSubject.next(eonumberrule);
  }

  clearEoNumberRule() { 
    this.eoNumberRuleSubject.next(undefined)
  }

  // getDash8Rule(): Observable<EoNumberRule> {
  //   return this.eoDash8RuleSubject.asObservable();
  //  }

  // setDash8Rule(eonumberrule: EoNumberRule) { 
  //   this.eoDash8RuleSubject.next(eonumberrule);
  // }

  // clearDash8Rule() { 
  //   this.eoDash8RuleSubject.next();
  // }

  getPlannerNames(): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoplannerqueue/getEOPlanners`);
    return _result
      .pipe(
        tap(_ => this.log(`found plannerNames`)),
        catchError(this.handleError<string[]>('getPlannerNames', []))
      );
  }


  getEOPlannerRuleCount(plannerName: string): Observable<QARuleCount[]> { //, ruleName: string
    if (!plannerName) {
      return of([]); 
    }
    
    var _result = this.http.get<QARuleCount[]>(`${environment.apiEnv}/api/eoplannerqueue/getEOPlannerRuleCount?planner=${plannerName}`);  //&ruleName=${ruleName}
    return _result
      .pipe(
        tap(_ => this.log(`found getEOPlannerRuleCount matching ${plannerName}"`)), //rule ${ruleName}
        catchError(this.handleError<QARuleCount[]>('getEOPlannerRuleCount', []))
      );
  }

  getNewStationsChangesByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoNewStationsChanges[]>(`${environment.apiEnv}/api/eoplannerqueue/getNewStationsChangesByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getNewStationsChangesByPlanner matching ${planner}`)),
        catchError(this.handleError<EoNewStationsChanges[]>('getNewStationsChangesByPlanner', []))
      );
  }

  getCapableStationShortageByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoCapableStationShortage[]>(`${environment.apiEnv}/api/eoplannerqueue/getCapableStationShortageByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCapableStationShortageByPlanner matching ${planner}`)),
        catchError(this.handleError<EoCapableStationShortage[]>('getCapableStationShortageByPlanner', []))
      );
  }

  getAdPartsShortageByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoAdPartsShortage[]>(`${environment.apiEnv}/api/eoplannerqueue/getAdPartsShortageByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getAdPartsShortageByPlanner matching ${planner}`)),
        catchError(this.handleError<EoAdPartsShortage[]>('getAdPartsShortageByPlanner', []))
      );
  }

  getPartShortage30ByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsShortage30[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartShortage30ByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortage30ByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsShortage30[]>('getPartShortage30ByPlanner', []))
      );
  }

  getBOMAdPartsShortageDetailById(dash8: string, orderby?: string, sorttype?: string){
    if (!dash8) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOMAdPartsShortageDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOMAdPartsShortageDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoBomDetail[]>('getBOMAdPartsShortageDetailById', []))
    );
  }

  getBOMNewStationsChangesDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<EoBomNewStationsChangesDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOMNewStationsChangesDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOMNewStationsChangesDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoBomNewStationsChangesDetail[]>('getBOMNewStationsChangesDetailById', []))
      );
  }

  getCapableStationShortageDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getCapableStationShortageDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCapableStationShortageDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoBomDetail[]>('getCapableStationShortageDetailById', []))
      );
  }

  getBOM30DayDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOM30DayDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOM30DayDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoBomDetail[]>('getBOM30DayDetailById', []))
      );
  }

  // getBOM60DayDetailById(dash8: string) {
  //   if (!dash8) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOM60DayDetailById?dash8=${dash8}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getBOM60DayDetailById matching dash8: ${dash8}`)),
  //       catchError(this.handleError<EoBomDetail[]>('getBOM60DayDetailById', []))
  //     );
  // }

  // getBOM90DayDetailById(dash8: string) {
  //   if (!dash8) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOM90DayDetailById?dash8=${dash8}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getBOM90DayDetailById matching dash8: ${dash8}`)),
  //       catchError(this.handleError<EoBomDetail[]>('getBOM90DayDetailById', []))
  //     );
  // }

  getBOM6090DayDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOM6090DayDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOM6090DayDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoBomDetail[]>('getBOM6090DayDetailById', []))
      );
  }

  // getBOM120DayDetailById(dash8: string) {
  //   if (!dash8) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOM120DayDetailById?dash8=${dash8}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getBOM120DayDetailById matching dash8: ${dash8}`)),
  //       catchError(this.handleError<EoBomDetail[]>('getBOM120DayDetailById', []))
  //     );
  // }

  // getBOM180DayDetailById(dash8: string) {
  //   if (!dash8) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOM180DayDetailById?dash8=${dash8}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getBOM180DayDetailById matching dash8: ${dash8}`)),
  //       catchError(this.handleError<EoBomDetail[]>('getBOM180DayDetailById', []))
  //     );
  // }

  getBOM120180DayDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOM120180DayDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOM120180DayDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoBomDetail[]>('getBOM120180DayDetailById', []))
      );
  }

  getBOM180PlusDayDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getBOM180PlusDayDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOM180PlusDayDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoBomDetail[]>('getBOM180PlusDayDetailById', []))
      );
  }

  getNewDash8WithNoBOMDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoBomDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getNewDash8WithNoBOMDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getNewDash8WithNoBOMDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoBomDetail[]>('getNewDash8WithNoBOMDetailById', []))
      );
  }

  getBOMPartsInDiscrepancyDetailById(dash8: string, tail: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !tail) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<[EoPartInDiscrepancyDetail]>(`${environment.apiEnv}/api/eoplannerqueue/getBOMPartsInDiscrepancyDetailById?dash8=${dash8}&tail=${tail}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOMPartsInDiscrepancyDetailById matching dash8: ${dash8} - tail: ${tail}`)),
        catchError(this.handleError<EoPartInDiscrepancyDetail[]>('getBOMPartsInDiscrepancyDetailById', []))
      );
  }

  getBOMYesterdayDeferralsDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<[EoPartInDiscrepancyDetail]>(`${environment.apiEnv}/api/eoplannerqueue/getBOMYesterdayDeferralsDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOMPartsInDiscrepancyDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoPartInDiscrepancyDetail[]>('getBOMPartsInDiscrepancyDetailById', []))
      );
  }

  getBOMOverdueEoKitWorkOrderDetailById(menumber: string, ponumber: string, orderby?: string, sorttype?: string) {
    if (!menumber || !ponumber) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<[EoOverdueKitWorkOrderDetail]>(`${environment.apiEnv}/api/eoplannerqueue/getBOMOverdueEoKitWorkOrderDetailById?menumber=${menumber}&ponumber=${ponumber}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOMOverdueEoKitWorkOrderDetailById matching menumber: ${menumber} - ponumber: ${ponumber}`)),
        catchError(this.handleError<EoOverdueKitWorkOrderDetail[]>('getBOMOverdueEoKitWorkOrderDetailById', []))
      );
  }

  getBOMOverduePosRosDetailById(menumber: string, ordernumber: string, orderby?: string, sorttype?: string) {
    if (!menumber || !ordernumber) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<[EoOverduePosRosDetail]>(`${environment.apiEnv}/api/eoplannerqueue/getBOMOverduePosRosDetailById?menumber=${menumber}&ordernumber=${ordernumber}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOMOverduePosRosDetailById matching menumber: ${menumber} - order number: ${ordernumber}`)),
        catchError(this.handleError<EoOverduePosRosDetail[]>('getBOMOverduePosRosDetailById', []))
      );
  }

  getOnHoldEosDetailById(dash8: string, orderby?: string, sorttype?: string) {
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<[EoOnHoldEosDetail]>(`${environment.apiEnv}/api/eoplannerqueue/getOnHoldEosDetailById?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getOnHoldEosDetailById matching dash8: ${dash8}`)),
        catchError(this.handleError<EoOnHoldEosDetail[]>('getOnHoldEosDetailById', []))
      );
  }

  insertEoDash8Comment(eoPqCommentReq: EoPqCommentReq): Observable<EoPqCommentReq[]>{
    var _result = this.http.post<EoPqCommentReq[]>(`${environment.apiEnv}/api/eoplannerqueue/insertEoDash8Comment`, eoPqCommentReq)
      .pipe(
      catchError(this.handleError('insertEoDash8Comment', EoPqCommentReq[0]))
  );
  
  return _result;
  }

  dropOffEOPQDash8(dropEoPqDash8Req: DropEoPqDash8Req) { 
    
    return this.http.post<DropEoPqDash8Req>(`${environment.apiEnv}/api/eoplannerqueue/dropOffEOPQDash8`, dropEoPqDash8Req)
    .pipe(
      catchError(this.handleError('dropOffEOPQDash8', dropEoPqDash8Req))
    );
  }

  updateEOPQMaster(updateeopqmasterreq: UpdateEoPqMasterReq) {
    return this.http.post<UpdateEoPqMasterReq>(`${environment.apiEnv}/api/eoplannerqueue/updateEOPQMaster`, updateeopqmasterreq)
    .pipe(
      catchError(this.handleError('updateEOPQMaster', UpdateEoPqMasterReq))
    );
  }
  
  getKit30DayDetail(dash8: string, menumberused: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !menumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<Eo30DayKitDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/get30DayKitDetailById?dash8=${dash8}&menumber=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getKit30DayDetail matching dash8: ${dash8}" - menumber:${menumberused}`)),
        catchError(this.handleError<Eo30DayKitDetail[]>('getKit30DayDetail', []))
      );
  }
    
  // getKit60DayDetail(dash8: string, menumberused: string) {
  //   if (!dash8 || !menumberused) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<Eo60DayKitDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/get60DayKitDetailById?dash8=${dash8}&menumber=${menumberused}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getKit60DayDetail matching dash8: ${dash8}" - menumber:${menumberused}`)),
  //       catchError(this.handleError<Eo60DayKitDetail[]>('getKit60DayDetail', []))
  //     );
  // }
      
  // getKit90DayDetail(dash8: string, menumberused: string) {
  //   if (!dash8 || !menumberused) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<Eo90DayKitDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/get90DayKitDetailById?dash8=${dash8}&menumber=${menumberused}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getKit90DayDetail matching dash8: ${dash8}" - menumber:${menumberused}`)),
  //       catchError(this.handleError<Eo90DayKitDetail[]>('getKit90DayDetail', []))
  //     );
  // }

  getKit6090DayDetailById(dash8: string, menumberused: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !menumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<Eo6090DayKitDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/get6090DayKitDetailById?dash8=${dash8}&menumber=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getKit6090DayDetailById matching dash8: ${dash8}" - menumber:${menumberused}`)),
        catchError(this.handleError<Eo6090DayKitDetail[]>('getKit6090DayDetailById', []))
      );
  }
        
  // getKit120DayDetail(dash8: string, menumberused: string) {
  //   if (!dash8 || !menumberused) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<Eo120DayKitDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/get120DayKitDetailById?dash8=${dash8}&menumber=${menumberused}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getKit120DayDetail matching dash8: ${dash8}" - menumber:${menumberused}`)),
  //       catchError(this.handleError<Eo120DayKitDetail[]>('getKit120DayDetail', []))
  //     );
  // }
          
  // getKit180DayDetail(dash8: string, menumberused: string) {
  //   if (!dash8 || !menumberused) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<Eo180DayKitDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/get180DayKitDetailById?dash8=${dash8}&menumber=${menumberused}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getKit180DayDetail matching dash8: ${dash8}" - menumber:${menumberused}`)),
  //       catchError(this.handleError<Eo120DayKitDetail[]>('getKit180DayDetail', []))
  //     );
  // }

  getKit120180DayDetail(dash8: string, menumberused: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !menumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<Eo120180DayKitDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/getKit120180DayDetail?dash8=${dash8}&menumber=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getKit120180DayDetail matching dash8: ${dash8}" - menumber:${menumberused}`)),
        catchError(this.handleError<Eo120180DayKitDetail[]>('getKit180DayDetail', []))
      );
  }  

  getKit180PlusDayDetail(dash8: string, menumberused: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !menumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<Eo180PlusDayKitDetail[]>(`${environment.apiEnv}/api/eoplannerqueue/get180PlusDayKitDetailById?dash8=${dash8}&menumber=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getKit180PlusDayDetail matching dash8: ${dash8}" - menumber:${menumberused}`)),
        catchError(this.handleError<Eo180PlusDayKitDetail[]>('getKit180PlusDayDetail', []))
      );
  }

  getAdPartsKitDetailById(dash8: string, menumberused: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !menumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoAdPartsShortageKitDetails[]>(`${environment.apiEnv}/api/eoplannerqueue/getAdPartsKitDetailById?dash8=${dash8}&menumber=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getAdPartsKitDetailById matching dash8: ${dash8}" - menumber:${menumberused}`)),
        catchError(this.handleError<EoAdPartsShortageKitDetails[]>('getAdPartsKitDetailById', []))
      );
  }

  getNewStationsChangesKitDetailById(dash8: string, menumberused: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !menumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoNewStationsChangesKitDetails[]>(`${environment.apiEnv}/api/eoplannerqueue/getNewStationsChangesKitDetailById?dash8=${dash8}&menumber=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getNewStationsChangesKitDetailById matching dash8: ${dash8}" - menumber:${menumberused}`)),
        catchError(this.handleError<EoNewStationsChangesKitDetails[]>('getNewStationsChangesKitDetailById', []))
      );
  }

  getYesterdayDeferralsKitDetailById(dash8: string, menumberused: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !menumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoNewStationsChangesKitDetails[]>(`${environment.apiEnv}/api/eoplannerqueue/getYesterdayDeferralsKitDetailById?dash8=${dash8}&menumberused=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getYesterdayDeferralsKitDetailById matching dash8: ${dash8}" - menumber:${menumberused}`)),
        catchError(this.handleError<EoNewStationsChangesKitDetails[]>('getYesterdayDeferralsKitDetailById', []))
      );
  }

  getCapableStationShortageKitDetailById(dash8: string, menumberused: string, orderby?: string, sorttype?: string) {
    if (!dash8 || !menumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoCapableStationShortageKitDetails[]>(`${environment.apiEnv}/api/eoplannerqueue/getCapableStationShortageKitDetailById?dash8=${dash8}&menumber=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCapableStationShortageKitDetailById matching dash8: ${dash8}" - menumber:${menumberused}`)),
        catchError(this.handleError<EoCapableStationShortageKitDetails[]>('getCapableStationShortageKitDetailById', []))
      );
  }

  getPartShortage60ByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsShortage60[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartShortage60ByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortage60ByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsShortage60[]>('getPartShortage60ByPlanner', []))
      );
  }

  getPartShortage90ByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsShortage90[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartShortage90ByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortage90ByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsShortage90[]>('getPartShortage90ByPlanner', []))
      );
  }

    getPartShortage6090ByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsShortage6090[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartShortage6090ByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortage6090ByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsShortage6090[]>('getPartShortage6090ByPlanner', []))
      );
  }

  getPartShortage120ByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsShortage120[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartShortage120ByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortage120ByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsShortage120[]>('getPartShortage120ByPlanner', []))
      );
  }
  
  getPartShortage180ByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsShortage180[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartShortage180ByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortage180ByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsShortage120[]>('getPartShortage180ByPlanner', []))
      );
  }

    getPartShortage120180ByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }
      
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsShortage120180[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartShortage120180ByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortage120180ByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsShortage120180[]>('getPartShortage120180ByPlanner', []))
      );
  }
    
  getPartShortage180PlusByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsShortage180Plus[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartShortage180PlusByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortage180PlusByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsShortage180Plus[]>('getPartShortage180PlusByPlanner', []))
      );
  }

  getDash8NoBomByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoNewDash8WithNoBom[]>(`${environment.apiEnv}/api/eoplannerqueue/getDash8NoBomByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getDash8NoBomByPlanner matching ${planner}`)),
        catchError(this.handleError<EoNewDash8WithNoBom[]>('getDash8NoBomByPlanner', []))
      );
  }

  getPartsDiscrepancyByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoPartsInDiscrepancy[]>(`${environment.apiEnv}/api/eoplannerqueue/getPartsDiscrepancyByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartsDiscrepancyByPlanner matching ${planner}`)),
        catchError(this.handleError<EoPartsInDiscrepancy[]>('getPartsDiscrepancyByPlanner', []))
      );
  }

  getYesterdayDeferralsByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoYesterdayDeferrals[]>(`${environment.apiEnv}/api/eoplannerqueue/getYesterdayDeferralsByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getYesterdayDeferralsByPlanner matching ${planner}`)),
        catchError(this.handleError<EoYesterdayDeferrals[]>('getYesterdayDeferralsByPlanner', []))
      );
  }

  getOnHoldEosByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<EoOnHoldEos[]>(`${environment.apiEnv}/api/eoplannerqueue/getOnHoldEosByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getOnHoldEosByPlanner matching ${planner}`)),
        catchError(this.handleError<EoOnHoldEos[]>('getOnHoldEosByPlanner', []))
      );
  }

  getOverdueEOKitWorkOrderByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<OverdueEoKitWorkOrder[]>(`${environment.apiEnv}/api/eoplannerqueue/getOverdueEOKitWorkOrderByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getOverdueEOKitWorkOrderByPlanner matching ${planner}`)),
        catchError(this.handleError<OverdueEoKitWorkOrder[]>('getOverdueEOKitWorkOrderByPlanner', []))
      );
  }

  getOverduePoRoByPlanner(planner: string, orderby?: string, sorttype?: string) { 
    if (!planner) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<OverduePoRo[]>(`${environment.apiEnv}/api/eoplannerqueue/getOverduePoRoByPlanner?planner=${planner}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getOverduePoRoByPlanner matching ${planner}`)),
        catchError(this.handleError<OverduePoRo[]>('getOverduePoRoByPlanner', []))
      );
  }

  getStationShortageByMePartNumberUsed(mepartnumberused: string) { 
    if (!mepartnumberused) {
      return of([]); 
    }
    
    var _result = this.http.get<EoStationShortage[]>(`${environment.apiEnv}/api/eoplannerqueue/getStationShortageByMePartNumberUsed?mepartnumberused=${mepartnumberused}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getStationShortageByMePartNumberUsed matching ${mepartnumberused}`)),
        catchError(this.handleError<EoStationShortage[]>('getStationShortageByMePartNumberUsed', []))
      );
  }

  getEoPlannerSupervisor(): Observable<PlannerSupervisor[]> {
    var _result = this.http.get<PlannerSupervisor[]>(`${environment.apiEnv}/api/eoplannerqueue/getEOPlannerSupervisor`);
    return _result
      .pipe(
        tap(_ => this.log(`found planner-supervisor mapping`)),
        catchError(this.handleError<PlannerSupervisor[]>('getEOPlannerSupervisor', []))
      );
  }

  private log(message: string) {
    this.messageService.add(`Planner Service: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error.error); // log to console instead
      console.error(error.message);
      console.error(result);
      //alert(error.message);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
