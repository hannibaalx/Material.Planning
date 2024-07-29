import { EoNumberRule } from 'src/app/models/eo-number-rule';
import { Mel } from 'src/app/models/mel';
import { UsageNoAllocationAlert } from './../models/usage-no-allocation-alert';
import { UpdatePqMasterReq } from './../models/update-pq-master-req';
import { MeNumber } from './../models/me-number';
import { DropZeroStockReq } from './../models/drop-zero-stock-req';
import { UserInfo } from './../models/user-info';
import { SoPendingReviewComment } from './../models/so-pending-review-comment';
import { KitShortageByPartsComment } from './../models/kit-shortage-by-parts-comment';
import { TesCriticalComments } from './../models/tes-critical-comments';
import { CommentReq } from '../models/comment-req';
import { ZeroStockComment } from './../models/zero-stock-comment';
import { OutingStationBalancing } from '../models/outing-station-balancing';
import { MainStationBalancing } from '../models/main-station-balancing';
import { UsageNoAllocation } from '../models/usage-no-allocation';
import { OwnerNoAllocation } from '../models/owner-no-allocation';
import { VendorWoAssignment } from '../models/vendor-wo-assignment';
import { CatalogExpiration } from '../models/catalog-expiration';
import { OpenDiscrepancy } from '../models/open-discrepancy';
import { AosReview } from '../models/aos-review';
import { AgingPoRo } from '../models/aging-po-ro';
import { SystemLowStock } from '../models/system-low-stock';
import { SoPendingReview } from '../models/so-pending-review';
import { RepOhAq } from '../models/rep-oh-aq';
import { KitShortagePart } from '../models/kit-shortage-part';
import { PartShortageKit } from '../models/part-shortage-kit';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import { PlannerType } from '../models/planner-type';
import { MessageService } from './message.service';
import { ZeroStock } from '../models/zero-stock';
import { RuleCount } from '../models/rule-count';
import { BaseStaShort } from '../models/base-sta-short';
import { TesCritical } from '../models/tes-critical';
import { PqZeroStock } from '../models/pq-zero-stock';
import { MeNumberRule } from '../models/me-number-rule';
import { ReviewReasonNotification } from '../models/review-reason-notification';
import { BaselineStationShortageComment } from '../models/baseline-station-shortage-comment';
import { CommentNumberReq } from '../models/comment-number-req';
import { PartShortageKitComment } from '../models/part-shortage-kit-comment';
import { RepOhAqComment } from '../models/rep-oh-aq-comment';
import { DropMeNumberReq } from '../models/drop-me-number-req';
import { SystemLowStockAlert } from '../models/system-low-stock-alert';
import { AgingPoRoAlert } from '../models/aging-po-ro-alert';
import { AosReviewAlert } from '../models/aos-review-alert';
import { OpenDiscrepancyAlert } from '../models/open-discrepancy-alert';
import { CatalogExpirationAlert } from '../models/catalog-expiration-alert';
import { VendorWoAssignmentAlert } from '../models/vendor-wo-assignment-alert';
import { OwnershipNoAllocationAlert } from '../models/ownership-no-allocation-alert';
import { MainStationBalancingAlert } from '../models/main-station-balancing-alert';
import { OutStationBalancingAlert } from '../models/out-station-balancing-alert';
import { UnderStationBalancingAlert } from '../models/under-station-balancing-alert';
import { Nef } from '../models/nef';
import { RefreshTime } from '../models/refresh-time';
import { CommentHistory } from '../models/comment-history';
import { MeEcoComments } from '../models/me-eco-comments';
import { SmBaselineStationShortageComment } from '../models/sm-baseline-station-shortage-comment';
import { SmDash8CommentDetail } from '../models/sm-dash8-comment-detail';
import { QARuleCount } from '../models/q-a-rule-count';
import { ScheduledRotRepShortage } from '../models/scheduled-rot-rep-shortage';
import { ScheduledRotRepShortageComment } from '../models/scheduled-rot-rep-shortage-comment';
import { ZeroStockDetail } from '../models/zero-stock-detail';
import { BaseStaShortDetail } from '../models/base-sta-short-detail';
import { TesCriticalDetails } from '../models/tes-critical-details';
import { PartShortageKitDetails } from '../models/part-shortage-kit-details';
import { KitShortagePartDetails } from '../models/kit-shortage-part--details';
import { SoPendingReviewDetail } from '../models/so-pending-review-detail';
import { ScheduledRotRepShortageDetail } from '../models/scheduled-rot-rep-shortage-detail';
import { VendorWoAssignmentDetail } from '../models/vendor-wo-assignment-detail';
import { UsageNoAllocationDetail } from '../models/usage-no-allocation-detail';
import { OpenDiscrepancyDetail } from '../models/open-discrepancy-detail';
import { SystemLowStockDetail } from '../models/system-low-stock-detail';
import { OwnerNoAllocationDetail } from '../models/owner-no-allocation-detail';
import { OutingStationBalancingDetail } from '../models/outing-station-balancing-detail';
import { MainStationBalancingDetail } from '../models/main-station-balancing-detail';
import { CatalogExpirationDetail } from '../models/catalog-expiration--detail';
import { AosReviewDetail } from '../models/aos-review-detail';
import { AgingPoRoDetail } from '../models/aging-po-ro-detail';
import { AssociatedMeNoStock } from '../models/associated-me-no-stock';
import { AssociatedMeNoStockComment } from '../models/associated-me-no-stock-comment';
import { NewMeSetupOrChanges } from '../models/new-me-setup-or-changes';
import { NewMeSetupOrChangesComments } from '../models/new-me-setup-or-changes-comments';
import { NewMeSetupOrChangesDetail } from '../models/new-me-setup-or-changes-detail';
import { ScrapsPq } from '../models/scraps-pq';
import { ScrapsPqDetail } from '../models/scraps-pq-detail';
import { ScrapsPqComments } from '../models/scraps-pq-comments';
import { environment } from 'src/environments/environment';
import { PlannerSupervisor } from '../models/planner-supervisor';

@Injectable({
  providedIn: 'root'
})
export class PlannerService {
  private currentMeNumber: string = "";
  private currentRefreshTime: string = "";
  private meNumberSubject = new Subject<MeNumberRule>();
  private ataPlannerNameSubject : string = "";// new Subject<string>();
  private _refreshNeeded$ = new Subject<void>();
  private _refreshPlannerCountNeeded$ = new Subject<void>();
  private ataPlannerComments: boolean;

  private _reviewReasonNotification = new Subject<string>();
  reviewReasonNotification$ = this._reviewReasonNotification.asObservable();

  reviewReasonQueue = new Subject<string>();
  reviewReasonAlert = new Subject<string>();

  headers: any;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  get refreshNeeded$() { 
    return this._refreshNeeded$;
  }

  get refreshPlannerCountNeeded$() { 
    return this._refreshPlannerCountNeeded$;
  }
  
  sendReviewReasonNotification(notification: string) { 
    this._reviewReasonNotification.next(notification);
  }
 
  getLoggedOnUser(): Observable<UserInfo[]> { 
    ///api/MPAdmin/userinfo
    var _result = this.http.get<UserInfo[]>(`${environment.apiEnv}/api/MPAdmin/userinfo`);
    return _result
      .pipe(
        tap(_ => this.log(`found getLoggedOnUser`)),
        catchError(this.handleError<UserInfo[]>('getLoggedOnUser', null))
      );
  }

  searchPlannerName(plannerName: string): Observable<PlannerType[]> {
    if (!plannerName.trim()) {
      return of([]);
    }
    
    var _result = this.http.get<PlannerType[]>(`${environment.apiEnv}/api/plannerqueue/getPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(_ => this.log(`found plannerName matching "${plannerName}"`)),
        catchError(this.handleError<PlannerType[]>('searchPlannerName', []))
      );
  }

  getPlannerNames(): Observable<PlannerType[]> {
    var _result = this.http.get<PlannerType[]>(`${environment.apiEnv}/api/plannerqueue/getPlanners`);
    return _result
      .pipe(
        tap(_ => this.log(`found plannerNames`)),
        catchError(this.handleError<PlannerType[]>('getPlannerNames', []))
      );
  }

  getFilteredPlanners(): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/plannerqueue/getFilteredPlanners`);
    return _result
      .pipe(
        tap(_ => this.log(`found plannerNames`)),
        catchError(this.handleError<string[]>('getPlannerNames', []))
      );
  }

  getPlannerSupervisor(): Observable<PlannerSupervisor[]> {
    var _result = this.http.get<PlannerSupervisor[]>(`${environment.apiEnv}/api/plannerqueue/getPlannerSupervisor`);
    return _result
      .pipe(
        tap(_ => this.log(`found planner-supervisor mapping`)),
        catchError(this.handleError<PlannerSupervisor[]>('getPlannerSupervisor', []))
      );
  }

  meNumberUpdate(val: string): void {
    this.currentMeNumber = val.trim();
  }

  getMeNumber(): Observable<MeNumberRule> {
    return this.meNumberSubject.asObservable();
   }

  setMeNumber(valObj: MeNumberRule){
    this.meNumberSubject.next(valObj);
  }

  getAtaPlannerComments(): boolean{
    return this.ataPlannerComments;
  }

  setAtaPlannerComments(val: boolean) {
    this.ataPlannerComments= val;
  }

  getAtaPlannerName(): string { 
    //var ataPlannerName : string = "";
    //this.ataPlannerNameSubject.forEach(x => {ataPlannerName = x;});
    return this.ataPlannerNameSubject;
  }

  setAtaPlannerName(plannerName: string) {
    this.ataPlannerNameSubject = plannerName;
  }

  clearMeNumber() { 
    this.meNumberSubject.next(undefined);
  }
 
  getRuleCountForPlanner(plannerName: string): Observable<QARuleCount[]> { //, ruleName: string
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    var _result = this.http.get<QARuleCount[]>(`${environment.apiEnv}/api/plannerqueue/getPlannerRuleCount?planner=${plannerName.trim()}`); //&ruleName=${ruleName}
    return _result
      .pipe(
        tap(_ => this.log(`found getPlannerRuleCount matching "${plannerName}" `)), //rule "${ruleName}
        catchError(this.handleError<QARuleCount[]>('getPlannerRuleCount', []))
      );
  }

  getZeroStockByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<ZeroStock[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<ZeroStock[]>(`${environment.apiEnv}/api/plannerqueue/getZeroStockByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getZeroStockByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<ZeroStock[]>('getZeroStockByPlanner', []))
      );
  }

  getZeroStockDetailByPlanner(plannerName: string): Observable<ZeroStockDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
  
    var _result = this.http.get<ZeroStockDetail[]>(`${environment.apiEnv}/api/plannerqueue/getZeroStockDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getZeroStockDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<ZeroStockDetail[]>('getZeroStockDetailByPlanner', []))
      );
  }

  getBaselineStationShortageByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<BaseStaShort[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<BaseStaShort[]>(`${environment.apiEnv}/api/plannerqueue/getBaselineStationShortageByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => { this.log(`found getBaselineStationShortageByPlanner matching "${plannerName}"`)
        //this._refreshNeeded$.next();
          }),
        catchError(this.handleError<BaseStaShort[]>('getBaselineStationShortageByPlanner', []))
      );
  }

  getAllAssociatedMeNoStockByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<AssociatedMeNoStock[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<AssociatedMeNoStock[]>(`${environment.apiEnv}/api/plannerqueue/getAllAssociatedMeNoStockByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => { this.log(`found getAllAssociatedMeNoStockByPlanner matching "${plannerName}"`)
        //this._refreshNeeded$.next();
          }),
        catchError(this.handleError<AssociatedMeNoStock[]>('getAllAssociatedMeNoStockByPlanner', []))
      );
  }

  getAllNewMeSetupOrChangesByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<NewMeSetupOrChanges[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<NewMeSetupOrChanges[]>(`${environment.apiEnv}/api/plannerqueue/getAllNewMeSetupOrChangesByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => { this.log(`found getAllNewMeSetupOrChangesByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<NewMeSetupOrChanges[]>('getAllNewMeSetupOrChangesByPlanner', []))
      );
  }

  getAllScrapsByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<ScrapsPq[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<ScrapsPq[]>(`${environment.apiEnv}/api/plannerqueue/getAllScrapsByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllScrapsByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<ScrapsPq[]>('getAllScrapsByPlanner', []))
      );
  }

  getSMBaselineStationShortageByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<BaseStaShort[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<BaseStaShort[]>(`${environment.apiEnv}/api/plannerqueue/getSMBaselineStationShortageByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => { this.log(`found getSMBaselineStationShortageByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<BaseStaShort[]>('getSMBaselineStationShortageByPlanner', []))
      );
  }

  getSMBaselineStationShortageDetailByPlanner(plannerName: string): Observable<BaseStaShortDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    var _result = this.http.get<BaseStaShortDetail[]>(`${environment.apiEnv}/api/plannerqueue/getSMBaselineStationShortageDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => { this.log(`found getSMBaselineStationShortageDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<BaseStaShortDetail[]>('getSMBaselineStationShortageDetailByPlanner', []))
      );
  }

  getTESCriticalByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<TesCritical[]> { 
    if (!plannerName) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<TesCritical[]>(`${environment.apiEnv}/api/plannerqueue/getTESCriticalByPlanner?planner=${plannerName}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getTESCriticalByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<TesCritical[]>('getTESCriticalByPlanner', []))
      );
  }

  getAllTESCriticalDetailByPlanner(plannerName: string): Observable<TesCriticalDetails[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
   
    var _result = this.http.get<TesCriticalDetails[]>(`${environment.apiEnv}/api/plannerqueue/getAllTESCriticalDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllTESCriticalDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<TesCriticalDetails[]>('getAllTESCriticalDetailByPlanner', []))
      );
  }

  getMELByPlanner(plannerName: string): Observable<Mel[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    var _result = this.http.get<Mel[]>(`${environment.apiEnv}/api/plannerqueue/getMELByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getMELByPlanner matching "${plannerName}"`)),
        catchError(this.handleError<Mel[]>('getMELByPlanner', []))
      );
  }

  getNEFByPlanner(plannerName: string): Observable<Nef[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    var _result = this.http.get<Nef[]>(`${environment.apiEnv}/api/plannerqueue/getNEFByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getNEFByPlanner matching "${plannerName}"`)),
        catchError(this.handleError<Nef[]>('getNEFByPlanner', []))
      );
  }
  
  getPartShortageKitByPlanner(plannerName: string, orderby?:string, sorttype?:string): Observable<PartShortageKit[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<PartShortageKit[]>(`${environment.apiEnv}/api/plannerqueue/getPartShortageKitByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getPartShortageKitByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<PartShortageKit[]>('getPartShortageKitByPlanner', []))
      );
  }

  getAllPartShortageKitDetailByPlanner(plannerName: string): Observable<PartShortageKitDetails[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
   
    var _result = this.http.get<PartShortageKitDetails[]>(`${environment.apiEnv}/api/plannerqueue/getAllPartShortageKitDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllPartShortageKitDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<PartShortageKitDetails[]>('getAllPartShortageKitDetailByPlanner', []))
      );
  }

  getKitShortagePartByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<KitShortagePart[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<KitShortagePart[]>(`${environment.apiEnv}/api/plannerqueue/getKitShortagePartByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getPartShortageKitByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<KitShortagePart[]>('getPartShortageKitByPlanner', []))
      );
  }

  getAllKitShortagePartDetailByPlanner(plannerName: string): Observable<KitShortagePartDetails[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
   
    var _result = this.http.get<KitShortagePartDetails[]>(`${environment.apiEnv}/api/plannerqueue/getAllKitShortagePartDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllKitShortagePartDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<KitShortagePartDetails[]>('getAllKitShortagePartDetailByPlanner', []))
      );
  }

  getRepOhtoAQByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<RepOhAq[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<RepOhAq[]>(`${environment.apiEnv}/api/plannerqueue/getRepOhtoAQByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getRepOhtoAQByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<RepOhAq[]>('getRepOhtoAQByPlanner', []))
      );
  }

  getAllRepOhtoAQDetailByPlanner(plannerName: string): Observable<RepOhAq[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    var _result = this.http.get<RepOhAq[]>(`${environment.apiEnv}/api/plannerqueue/getAllRepOhtoAQDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllRepOhtoAQDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<RepOhAq[]>('getAllRepOhtoAQDetailByPlanner', []))
      );
  }

  getSoPendingReviewByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<SoPendingReview[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SoPendingReview[]>(`${environment.apiEnv}/api/plannerqueue/getSoPendingReviewByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getSoPendingReviewByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<SoPendingReview[]>('getSoPendingReviewByPlanner', []))
      );
  }

  getAllSoPendingReviewDetailByPlanner(plannerName: string): Observable<SoPendingReviewDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    var _result = this.http.get<SoPendingReviewDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllSoPendingReviewDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllSoPendingReviewDetailByPlanner matching "${plannerName}"`)
         //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<SoPendingReviewDetail[]>('getAllSoPendingReviewDetailByPlanner', []))
      );
  }

  getScheduledRotRepShortageByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<ScheduledRotRepShortage[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<ScheduledRotRepShortage[]>(`${environment.apiEnv}/api/plannerqueue/getScheduledRotRepShortageByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getScheduledRotRepShortageByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<ScheduledRotRepShortage[]>('getScheduledRotRepShortageByPlanner', []))
      );
  }

  getScheduledRotRepShortageDetailByPlanner(plannerName: string): Observable<ScheduledRotRepShortageDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
   
    var _result = this.http.get<ScheduledRotRepShortageDetail[]>(`${environment.apiEnv}/api/plannerqueue/getScheduledRotRepShortageDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => { this.log(`found getScheduledRotRepShortageDetailByPlanner matching "${plannerName}"`) }),
        catchError(this.handleError<ScheduledRotRepShortageDetail[]>('getScheduledRotRepShortageDetailByPlanner', []))
      );
  }
  
  getSystemLowStockByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<SystemLowStock[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SystemLowStock[]>(`${environment.apiEnv}/api/plannerqueue/getSystemLowStockByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getSystemLowStockByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<SystemLowStock[]>('getSystemLowStockByPlanner', []))
      );
  }

  getAllSystemLowStockDetailByPlanner(plannerName: string): Observable<SystemLowStockDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<SystemLowStockDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllSystemLowStockDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllSystemLowStockDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<SystemLowStockDetail[]>('getAllSystemLowStockDetailByPlanner', []))
      );
  }

  getAgingPoRoByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<AgingPoRo[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<AgingPoRo[]>(`${environment.apiEnv}/api/plannerqueue/getAgingPoRoByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAgingPoRoByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<AgingPoRo[]>('getAgingPoRoByPlanner', []))
      );
  }

  getAllAgingPoRoDetailByPlanner(plannerName: string): Observable<AgingPoRoDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<AgingPoRoDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllAgingPoRoDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllAgingPoRoDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<AgingPoRoDetail[]>('getAllAgingPoRoDetailByPlanner', []))
      );
  }

  getAOSReviewByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<AosReview[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<AosReview[]>(`${environment.apiEnv}/api/plannerqueue/getAOSReviewByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAOSReviewByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<AosReview[]>('getAOSReviewByPlanner', []))
      );
  }

  getAllAOSReviewDetailByPlanner(plannerName: string): Observable<AosReviewDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<AosReviewDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllAOSReviewDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllAOSReviewDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<AosReviewDetail[]>('getAllAOSReviewDetailByPlanner', []))
      );
  }

  getOpenDiscrepancyByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<OpenDiscrepancy[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<OpenDiscrepancy[]>(`${environment.apiEnv}/api/plannerqueue/getOpenDiscrepancyByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getOpenDiscrepancyByPlanner matching "${plannerName}"`)
         //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<OpenDiscrepancy[]>('getOpenDiscrepancyByPlanner', []))
      );
  }

  getAllOpenDiscrepancyDetailByPlanner(plannerName: string): Observable<OpenDiscrepancyDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<OpenDiscrepancyDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllOpenDiscrepancyDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllOpenDiscrepancyDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<OpenDiscrepancyDetail[]>('getAllOpenDiscrepancyDetailByPlanner', []))
      );
  }

  getCatalogExpirationByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<CatalogExpiration[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<CatalogExpiration[]>(`${environment.apiEnv}/api/plannerqueue/getCatalogExpirationByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getCatalogExpirationByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<CatalogExpiration[]>('getCatalogExpirationByPlanner', []))
      );
  }

  getAllCatalogExpirationDetailByPlanner(plannerName: string): Observable<CatalogExpirationDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<CatalogExpirationDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllCatalogExpirationDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllCatalogExpirationDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<CatalogExpirationDetail[]>('getAllCatalogExpirationDetailByPlanner', []))
      );
  }

  getVendorWoAssignmentByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<VendorWoAssignment[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<VendorWoAssignment[]>(`${environment.apiEnv}/api/plannerqueue/getVendorWoAssignmentByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getVendorWoAssignmentByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<VendorWoAssignment[]>('getVendorWoAssignmentByPlanner', []))
      );
  }

  getAllVendorWoAssignmentDetailByPlanner(plannerName: string): Observable<VendorWoAssignmentDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
   
    var _result = this.http.get<VendorWoAssignmentDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllVendorWoAssignmentDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllVendorWoAssignmentDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<VendorWoAssignmentDetail[]>('getAllVendorWoAssignmentDetailByPlanner', []))
      );
  }

  getOwnershipNoAllocationByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<OwnerNoAllocation[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<OwnerNoAllocation[]>(`${environment.apiEnv}/api/plannerqueue/getOwnershipNoAllocationByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getOwnershipNoAllocationByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<OwnerNoAllocation[]>('getOwnershipNoAllocationByPlanner', []))
      );
  }

  getAllOwnershipNoAllocationDetailByPlanner(plannerName: string): Observable<OwnerNoAllocationDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }
    
    var _result = this.http.get<OwnerNoAllocationDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllOwnershipNoAllocationDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllOwnershipNoAllocationDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<OwnerNoAllocationDetail[]>('getAllOwnershipNoAllocationDetailByPlanner', []))
      );
  }

  getUsageNoAllocationByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<UsageNoAllocation[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<UsageNoAllocation[]>(`${environment.apiEnv}/api/plannerqueue/getUsageNoAllocationByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getUsageNoAllocationByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<UsageNoAllocation[]>('getUsageNoAllocationByPlanner', []))
      );
  }

  getAllUsageNoAllocationDetailByPlanner(plannerName: string): Observable<UsageNoAllocationDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<UsageNoAllocationDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllUsageNoAllocationDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllUsageNoAllocationDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<UsageNoAllocationDetail[]>('getAllUsageNoAllocationDetailByPlanner', []))
      );
  }

  getAllNewMeSetupOrChangesDetailByPlanner(plannerName: string): Observable<NewMeSetupOrChangesDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<NewMeSetupOrChangesDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllNewMeSetupOrChangesDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllNewMeSetupOrChangesDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<NewMeSetupOrChangesDetail[]>('getAllNewMeSetupOrChangesDetailByPlanner', []))
      );
  }

  getAllScrapsDetailByPlanner(plannerName: string): Observable<ScrapsPqDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<ScrapsPqDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllScrapsDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllScrapsDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<ScrapsPqDetail[]>('getAllScrapsDetailByPlanner', []))
      );
  }

  getMainStationBalancingByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<MainStationBalancing[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<MainStationBalancing[]>(`${environment.apiEnv}/api/plannerqueue/getMainStationBalancingByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getMainStationBalancingByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<MainStationBalancing[]>('getMainStationBalancingByPlanner', []))
      );
  }

  getAllMainStationBalancingDetailPlanner(plannerName: string): Observable<MainStationBalancingDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<MainStationBalancingDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllMainStationBalancingDetailPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllMainStationBalancingDetailyPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<MainStationBalancingDetail[]>('getAllMainStationBalancingDetailyPlanner', []))
      );
  }

  getOutingStationBalancingByPlanner(plannerName: string, orderby?: string, sorttype?: string): Observable<OutingStationBalancing[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<OutingStationBalancing[]>(`${environment.apiEnv}/api/plannerqueue/getOutingStationBalancingByPlanner?planner=${plannerName.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getOutingStationBalancingByPlanner matching "${plannerName}"`)
         //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<OutingStationBalancing[]>('getOutingStationBalancingByPlanner', []))
      );
  }

  getAllOutingStationBalancingDetailByPlanner(plannerName: string): Observable<OutingStationBalancingDetail[]> { 
    if (!plannerName.trim()) {
      return of([]); 
    }

    var _result = this.http.get<OutingStationBalancingDetail[]>(`${environment.apiEnv}/api/plannerqueue/getAllOutingStationBalancingDetailByPlanner?planner=${plannerName.trim()}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getAllOutingStationBalancingDetailByPlanner matching "${plannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<OutingStationBalancingDetail[]>('getAllOutingStationBalancingDetailByPlanner', []))
      );
  }

  getPQZeroStockByPlanner(pqz: MeNumberRule): Observable<PqZeroStock[]> { 
    if (!pqz.ME_PART_NUMBER.trim()) {
      return of([]); 
    }
    
    var _result = this.http.get<PqZeroStock[]>(`${environment.apiEnv}/api/plannerqueue/getPQZeroStockByPlanner?planner=${pqz.PlannerName.trim()}&menumber=${pqz.ME_PART_NUMBER}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getPQZeroStockByPlanner matching "${pqz.PlannerName}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<PqZeroStock[]>('getZeroStockByPlanner', []))
      );
  }

  getReviewReasonQueuesByMeNumber(meNumber: string): Observable<ReviewReasonNotification[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<ReviewReasonNotification[]>(`${environment.apiEnv}/api/plannerqueue/getReviewReasonQueuesByMeNumber?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getReviewReasonQueuesByMeNumber matching "${meNumber}"`)),
        catchError(this.handleError<ReviewReasonNotification[]>('getReviewReasonQueuesByMeNumber', []))
      );
  }

  getReviewReasonAlertsByMeNumber(meNumber: string): Observable<ReviewReasonNotification[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<ReviewReasonNotification[]>(`${environment.apiEnv}/api/plannerqueue/getReviewReasonAlertsByMeNumber?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getReviewReasonAlertsByMeNumber matching "${meNumber}"`)),
        catchError(this.handleError<ReviewReasonNotification[]>('getReviewReasonAlertsByMeNumber', []))
      );
  }

  getPQLowSystemAlertByME(meNumber: string): Observable<SystemLowStockAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<SystemLowStockAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQLowSystemAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQLowSystemAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<SystemLowStockAlert[]>('getPQLowSystemAlertByME', []))
      );
  }

  getPQAgingPoRoAlertByME(meNumber: string): Observable<AgingPoRoAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<AgingPoRoAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQAgingPoRoAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQAgingPoRoAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<AgingPoRoAlert[]>('getPQAgingPoRoAlertByME', []))
      );
  }

  getPQAosReviewAlertByME(meNumber: string): Observable<AosReviewAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<AosReviewAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQAosReviewAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQAosReviewAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<AosReviewAlert[]>('getPQAosReviewAlertByME', []))
      );
  }

  getPQOpenDiscrepancyAlertByME(meNumber: string): Observable<OpenDiscrepancyAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<OpenDiscrepancyAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQOpenDiscrepancyAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQOpenDiscrepancyAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<OpenDiscrepancyAlert[]>('getPQOpenDiscrepancyAlertByME', []))
      );
  }

  getPQCatalogExpirationAlertByME(meNumber: string): Observable<CatalogExpirationAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CatalogExpirationAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQCatalogExpirationAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQOpenDiscrepancyAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<CatalogExpirationAlert[]>('getPQOpenDiscrepancyAlertByME', []))
      );
  }

  getPQOwnerNoAllocAlertByME(meNumber: string): Observable<OwnershipNoAllocationAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<OwnershipNoAllocationAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQOwnerNoAllocAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQOwnerNoAllocAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<OwnershipNoAllocationAlert[]>('getPQOwnerNoAllocAlertByME', []))
      );
  }

  getPQOutStationBalancingAlertByME(meNumber: string): Observable<OutStationBalancingAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<OutStationBalancingAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQOutStationBalancingAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQOutStationBalancingAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<OutStationBalancingAlert[]>('getPQOutStationBalancingAlertByME', []))
      );
  }

  getPQUnderStationBalancingAlertByME(meNumber: string): Observable<UnderStationBalancingAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<UnderStationBalancingAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQUnderStationBalancingAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQUnderStationBalancingAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<UnderStationBalancingAlert[]>('getPQOutStationBalancingAlertByME', []))
      );
  }

  getPQZeroStockCommentByME(meNumber: string): Observable<ZeroStockComment[]> { 
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<ZeroStockComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQZeroStockCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQZeroStockCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<ZeroStockComment[]>('getPQZeroStockCommentByME', []))
      );
  }
  
  getPQBaselineStationShortageCommentByME(meNumber: string): Observable<BaselineStationShortageComment[]> {
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<BaselineStationShortageComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQBaselineStationShortageCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQBaselineStationShortageCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<BaselineStationShortageComment[]>('getPQBaselineStationShortageCommentByME', []))
      );
  }

  getPQSMBaselineStationShortageCommentByME(meNumber: string): Observable<SmBaselineStationShortageComment[]> {
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<SmBaselineStationShortageComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQSMBaselineStationShortageCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQSMBaselineStationShortageCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<SmBaselineStationShortageComment[]>('getPQSMBaselineStationShortageCommentByME', []))
      );
  }

  getAllScrapsByMEComments(meNumber: string): Observable<ScrapsPqComments[]> {
    if (!meNumber) {
      return of([]); 
    }
    
    var _result = this.http.get<ScrapsPqComments[]>(`${environment.apiEnv}/api/plannerqueue/getAllScrapsByMEComments?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getAllScrapsByMEComments matching "${meNumber}"`)),
        catchError(this.handleError<ScrapsPqComments[]>('getAllScrapsByMEComments', []))
      );
  }

  getPQTesCriticalCommentByME(meNumber: string): Observable<TesCriticalComments[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<TesCriticalComments[]>(`${environment.apiEnv}/api/plannerqueue/getPQTesCriticalCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQTesCriticalCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<TesCriticalComments[]>('getPQTesCriticalCommentByME', []))
      );
  }

  getPQPartShortageCommentByME(meNumber: string): Observable<PartShortageKitComment[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<PartShortageKitComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQPartShortageCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQPartShortageCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<PartShortageKitComment[]>('getPQPartShortageCommentByME', []))
      );
  }

  getPQKitShortageByPartsCommentByME(meNumber: string): Observable<KitShortageByPartsComment[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<KitShortageByPartsComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQKitShortageByPartsCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQKitShortageByPartsCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<KitShortageByPartsComment[]>('getPQKitShortageByPartsCommentByME', []))
      );
  }

  getPQRepOhAQCommentByME(meNumber: string): Observable<RepOhAqComment[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<RepOhAqComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQRepOhAQCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQRepOhAQCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<RepOhAqComment[]>('getPQRepOhAQCommentByME', []))
      );
  }

  getPQSOPendingReviewCommentByME(meNumber: string): Observable<SoPendingReviewComment[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<SoPendingReviewComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQSOPendingReviewCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQSOPendingReviewCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<SoPendingReviewComment[]>('getPQSOPendingReviewCommentByME', []))
      );
  }

  getPQScheduledRotRepShortageCommentByME(meNumber: string): Observable<ScheduledRotRepShortageComment[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<ScheduledRotRepShortageComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQScheduledRotRepShortageCommentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQScheduledRotRepShortageCommentByME matching "${meNumber}"`)),
        catchError(this.handleError<ScheduledRotRepShortageComment[]>('getPQScheduledRotRepShortageCommentByME', []))
      );
  }

  getPQVendorWoAssignmentByME(meNumber: string): Observable<VendorWoAssignmentAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<VendorWoAssignmentAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQVendorWoAssignmentByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQVendorWoAssignmentByME matching "${meNumber}"`)),
        catchError(this.handleError<VendorWoAssignmentAlert[]>('getPQVendorWoAssignmentByME', []))
      );
  }

  getPQUsageNoAllocAlertByME(meNumber: string, station: string): Observable<UsageNoAllocationAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<UsageNoAllocationAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQUsageNoAllocAlertByME?menumber=${meNumber}&station=${station}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQUsageNoAllocAlertByME matching "${meNumber} - ${station}"`)),
        catchError(this.handleError<UsageNoAllocationAlert[]>('getPQSOPendingReviewCommentByME', []))
      );
  }

  getPQAssociatedMeNoStockByME(meNumber: string): Observable<AssociatedMeNoStockComment[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<AssociatedMeNoStockComment[]>(`${environment.apiEnv}/api/plannerqueue/getPQAssociatedMeNoStockByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQAssociatedMeNoStockByME matching "${meNumber}"`)),
        catchError(this.handleError<AssociatedMeNoStockComment[]>('getPQAssociatedMeNoStockByME', []))
      );
  }

  getAllNewMeSetupOrChangesByME(meNumber: string): Observable<NewMeSetupOrChangesComments[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<NewMeSetupOrChangesComments[]>(`${environment.apiEnv}/api/plannerqueue/getAllNewMeSetupOrChangesByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getAllNewMeSetupOrChangesByME matching "${meNumber}"`)),
        catchError(this.handleError<NewMeSetupOrChangesComments[]>('getAllNewMeSetupOrChangesByME', []))
      );
  }

  getAllScrapsByME(meNumber: string): Observable<ScrapsPqComments[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<ScrapsPqComments[]>(`${environment.apiEnv}/api/plannerqueue/getAllScrapsByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getAllScrapsByME matching "${meNumber}"`)),
        catchError(this.handleError<ScrapsPqComments[]>('getAllScrapsByME', []))
      );
  }

  getPQMainStationBalAlertByME(meNumber: string): Observable<MainStationBalancingAlert[]> { 
    if (!meNumber) {
      return of([]); 
    }
    var _result = this.http.get<MainStationBalancingAlert[]>(`${environment.apiEnv}/api/plannerqueue/getPQMainStationBalAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQMainStationBalAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<MainStationBalancingAlert[]>('getPQMainStationBalAlertByME', []))
      );
  }

  getPQMainStationBalInfoAlertByME(meNumber: string): Observable<MainStationBalancingAlert> { 
    if (!meNumber) {
      return of(); 
    }
    var _result = this.http.get<MainStationBalancingAlert>(`${environment.apiEnv}/api/plannerqueue/getPQMainStationBalInfoAlertByME?menumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQMainStationBalInfoAlertByME matching "${meNumber}"`)),
        catchError(this.handleError<MainStationBalancingAlert>('getPQMainStationBalInfoAlertByME', null))
      );
  }

  updatePQMaster(UpdatePqMasterReq) { 

    return this.http.post<UpdatePqMasterReq>(`${environment.apiEnv}/api/plannerqueue/updatePQMaster`, UpdatePqMasterReq)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        }),
      catchError(this.handleError('updatePQMaster', UpdatePqMasterReq))
    );
  }

  dropOffPQZeroStock(menumber: string) {
    let reqObj = new DropZeroStockReq();
    reqObj.MENumber = menumber;
    
    return this.http.post<DropZeroStockReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQZeroStock`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQZeroStock', DropZeroStockReq))
    );
  }

  dropOffPQBaselineStationShortage(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQBaselineStationShortage`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQBaselineStationShortage', DropMeNumberReq))
    );
  }

  dropOffPQSMBaselineStationShortage(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQSMBaselineStationShortage`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQSMBaselineStationShortage', DropMeNumberReq))
    );
  }

  dropOffPQTESCritical(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQTESCritical`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQTESCritical', DropMeNumberReq))
    );
  }

  dropOffPQPartShortageForKit(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQPartShortageForKit`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQPartShortageForKit', DropZeroStockReq))
    );
  }

  dropOffPQKitShortageForParts(menumber: string) { 
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQKitShortageForParts`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQKitShortageForParts', DropZeroStockReq))
    );
  }

  dropOffPQOnHandAllocationReview(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQOnHandAllocationReview`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQOnHandAllocationReview', DropMeNumberReq))
    );
  }

  dropOffPQScheduledRotRepShortage(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQScheduledRotRepShortage`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQScheduledRotRepShortage', DropMeNumberReq))
    );
  }

  dropOffSOPendingReviewComment(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffSOPendingReviewComment`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffSOPendingReviewComment', DropMeNumberReq))
    );
  }
  
  insertPQAlert(comments: CommentReq) {
    if (!comments) {
      return; 
    }
    
    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQAlert`, comments);
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQAlert matching "${comments.MENumber}" - "${comments.REVIEW_REASON}`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError(`insertPQAlert "${comments.MENumber}" - "${comments.REVIEW_REASON}`, new CommentReq())
        )
      );
  }

  dropOffPQSysLowStockReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQSysLowStockReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQSysLowStockReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQAgingPoRoAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQAgingPoRoAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQAgingPoRoAlert', DropMeNumberReq))
    );
  }

  dropOffPQAosReviewAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQAosReviewAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQAosReviewAlert', DropMeNumberReq))
    );
  }

  dropOffPQOpenDiscAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQOpenDiscAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQOpenDiscAlert', DropMeNumberReq))
    );
  }

  dropOffPQCatalogExpirationReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQCatalogExpirationReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQCatalogExpirationReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQVendorWoAssignmentReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQVendorWoAssignmentReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQVendorWoAssignmentReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQOwnerNoAllocReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQOwnerNoAllocAlertReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQOwnerNoAllocAlertReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQUsageNoAllocReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQUsageNoAllocReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQOwnerNoAllocAlertReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQAssociatedMeNoStockReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQAssociatedMeNoStockReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQAssociatedMeNoStockReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQNewMeSetupOrChangesReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQNewMeSetupOrChangesReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQNewMeSetupOrChangesReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQScrapsReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQScrapsReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQScrapsReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQMainStationBalReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQMainStationBalReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQMainStationBalReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQOutStockStationReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQOutStockStationReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshPlannerCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffPQOutStockStationReqAlert', DropMeNumberReq))
    );
  }

  dropOffPQUnderStockStationReqAlert(menumber: string) {
    let reqObj = new DropMeNumberReq();
    reqObj.MeNumber = menumber;
    
    return this.http.post<DropMeNumberReq>(`${environment.apiEnv}/api/plannerqueue/dropOffPQUnderStockStationReqAlert`, reqObj)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        }),
        catchError(this.handleError('dropOffPQUnderStockStationReqAlert', DropMeNumberReq))
      );
  }
  
  insertPQZeroStockComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }

    return this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQZeroStockComments`, comments)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        }),
      catchError(this.handleError('insertPQZeroStockComments', CommentReq))
    );
  }

  
  insertPQBaselineStationShortageComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }
    
    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQBaselineStationShortageComments`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQBaselineStationShortageComments matching "${comments.MENumber}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertPQBaselineStationShortageComments', new CommentReq())
        )
      );
  }

  insertPQSMBaselineStationShortageComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }
    
    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQSMBaselineStationShortageComments`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQSMBaselineStationShortageComments matching "${comments.MENumber}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertPQSMBaselineStationShortageComments', new CommentReq())
        )
      );
  }

  insertPQTESCriticalComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }
    
    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQTESCriticalComments`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQTESCriticalComments matching "${comments.MENumber}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertPQTESCriticalComments', new CommentReq())
        )
      );
  }

  insertPQPartShortageForKitComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }
    
    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQPartShortageForKitComments`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQPartShortageForKitComments matching "${comments.MENumber}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertPQPartShortageForKitComments', new CommentReq())
        )
      );
  }

  insertPQKitShortageForPartsComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }
    
    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQKitShortageForPartsComments`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQKitShortageForPartsComments matching "${comments.MENumber}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertPQKitShortageForPartsComments', new CommentReq())
        )
      );
  }

  insertPQOnHandAllocationReviewComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }
    
    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQOnHandAllocationReviewComments`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQOnHandAllocationReviewComments matching "${comments.MENumber}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertPQOnHandAllocationReviewComments', new CommentReq())
        )
      );
  }

  insertPQSOPendingReviewComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }
    
    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQSOPendingReviewComments`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQSOPendingReviewComments matching "${comments.MENumber}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertPQSOPendingReviewComments', new CommentReq())
        )
      );
  }

  insertPQScheduledRotRepShortageComments(comments: CommentReq) { 
    if (!comments) {
      return; 
    }

    var _result = this.http.post<CommentReq>(`${environment.apiEnv}/api/plannerqueue/insertPQScheduledRotRepShortageComments`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertPQScheduledRotRepShortageComments matching "${comments.MENumber}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertPQScheduledRotRepShortageComments', new CommentReq())
        )
      );
  }

  getMeCommentByMeNumber(menumber: string): Observable<MeEcoComments[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<MeEcoComments[]>(`${environment.apiEnv}/api/plannerqueue/getMeCommentByMeNumber?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getMeCommentByMeNumber matching ${menumber}`)),
        catchError(this.handleError<MeEcoComments[]>('getMeCommentByMeNumber', []))
      );
  }

  getEcoCommentByEcoNumber(menumber: string): Observable<MeEcoComments[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<MeEcoComments[]>(`${environment.apiEnv}/api/plannerqueue/getEcoCommentByEcoNumber?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getEcoCommentByEcoNumber matching ${menumber}`)),
        catchError(this.handleError<MeEcoComments[]>('getEcoCommentByEcoNumber', []))
      );
  }

  getCommentHistoryByMeNumSta(menumber: string, station: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumSta?menumber=${menumber}&station=${station}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumSta matching ${menumber}, ${station}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumSta', []))
      );
  }

  getCommentHistoryByMeNumStaBaseline(menumber: string, station: string, dash8: string, nose: string, iag_schd: string): Observable<CommentHistory[]> { 
    if (!menumber) { 
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaBaseline?menumber=${menumber}&station=${station}&dash8=${dash8}&nose=${nose}&iag_schd=${iag_schd}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaBaseline matching ${menumber}, ${station}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaBaseline', []))
      );
  }

  getCommentHistoryByMeNumSMStaBaseline(menumber: string, requirement: string, station: string, capablestation: string): Observable<CommentHistory[]> { 
    if (!menumber) { 
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumSMStaBaseline?menumber=${menumber}&requirement=${requirement}&station=${station}&capablestation=${capablestation}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumSMStaBaseline matching ${menumber}, ${station}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumSMStaBaseline', []))
      );
  }

  getCommentHistoryByMeNumStaOpenDiscrepency(menumber: string, tail: string, logpage: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaOpenDiscrepency?menumber=${menumber}&tail=${tail}&logpage=${logpage}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaOpenDiscrepency matching ${menumber}, ${tail}, ${logpage}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaOpenDiscrepency', []))
      );
  }

  getCommentHistoryByMeNumStaTes(menumber: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaTes?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaTes matching ${menumber}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaTes', []))
      );
  }

  getCommentHistoryByMeNumStaPartShortageKit(menumberInKit: string, buildStation: string, forStation: string, menumber: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaPartShortageKit?menumberInKit=${menumberInKit}&buildStation=${buildStation}&forStation=${forStation}&menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaPartShortageKit matching ${menumber} - ${buildStation} - ${forStation} - ${menumberInKit}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaPartShortageKit', []))
      );
  }

  getCommentHistoryByMeNumStaKitShortageByParts(menumber: string, buildStation: string, forStation: string, menumberInKit: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaKitShortageByParts?menumber=${menumber}&buildStation=${buildStation}&forStation=${forStation}&menumberInKit=${menumberInKit}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaKitShortageByParts matching ${menumber} - ${buildStation} - ${forStation} - ${menumberInKit}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaKitShortageByParts', []))
      );
  }

  getCommentHistoryByMeNumStaRepOhAQ(menumber: string, station: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaRepOhAQ?menumber=${menumber}&station=${station}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaRepOhAQ matching ${menumber} - ${station}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaRepOhAQ', []))
      );
  }

  getCommentHistoryByMeNumStaSOPendingReview(menumber: string, fromStation: string, toStation: string, requestor: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaSOPendingReview?menumber=${menumber}&fromStation=${fromStation}&toStation=${toStation}&requestor=${requestor}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaSOPendingReview matching ${menumber} - ${fromStation} - ${toStation} - ${requestor}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaSOPendingReview', []))
      );
  }

  getCommentHistoryByMeNumScheduledRotRepShortage(menumber: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumScheduledRotRepShortage?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumScheduledRotRepShortage matching ${menumber}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumScheduledRotRepShortage', []))
      );
  }

  getCommentHistoryByAssociatedMENoStock(menumber: string, chkkey: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByAssociatedMENoStock?menumber=${menumber}&chkkey=${chkkey}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByAssociatedMENoStock matching ${menumber} - ${chkkey}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByAssociatedMENoStock', []))
      );
  }

  getCommentHistoryByNewMESetuporChanges(menumber: string, chkkey: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByNewMESetuporChanges?menumber=${menumber}&chkkey=${chkkey}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByNewMESetuporChanges matching ${menumber} - ${chkkey}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByNewMESetuporChanges', []))
      );
  }

  getCommentHistoryByMeScraps(menumber: string, chkkey: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeScraps?menumber=${menumber}&chkkey=${chkkey}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeScraps matching ${menumber} - ${chkkey}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeScraps', []))
      );
  }

  getCommentHistoryByMeNumStaLowSystem(menumber: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaLowSystem?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaLowSystem matching ${menumber}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaLowSystem', []))
      );
  }

  getCommentHistoryByMeNumStaAgingPoRo(menumber: string, ordernumber: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaAgingPoRo?menumber=${menumber}&ordernumber=${ordernumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaAgingPoRo matching ${menumber}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaAgingPoRo', []))
      );
  }

  getCommentHistoryByMeNumStaAosReview(menumber: string, station: string, aogorderid: number): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaAosReview?menumber=${menumber}&station=${station}&aogorderid=${aogorderid}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaAosReview matching ${menumber}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaAosReview', []))
      );
  }

  getCommentHistoryByMeNumStaCatalogExpiration(menumber: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaCatalogExpiration?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaCatalogExpiration matching ${menumber}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaCatalogExpiration', []))
      );
  }

  getCommentHistoryByMeNumStaVendorWoAssignment(menumber: string, station: string, workorder: number): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaVendorWoAssignment?menumber=${menumber}&station=${station}&workorder=${workorder}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaVendorWoAssignment matching ${menumber} - ${station} - ${workorder}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaVendorWoAssignment', []))
      );
  }

  getCommentHistoryByMeNumStaOwnerNoAlloc(menumber: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaOwnerNoAlloc?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaOwnerNoAlloc matching ${menumber}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaOwnerNoAlloc', []))
      );
  }

  getCommentHistoryByMeNumStaUsageNoAlloc(menumber: string, station: string, transcode: string, transdate: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaUsageNoAlloc?menumber=${menumber}&station=${station}&transcode=${transcode}&transdate=${transdate}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaUsageNoAlloc matching ${menumber} - ${station} - ${transcode}- ${transdate}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaUsageNoAlloc', []))
      );
  }

  getCommentHistoryByMeNumStaMainStationBal(menumber: string, station: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaMainStationBal?menumber=${menumber}&station=${station}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaMainStationBal matching ${menumber} - ${station}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaMainStationBal', []))
      );
  }

  getCommentHistoryByMeNumStaOutStationBalancing(menumber: string, station: string): Observable<CommentHistory[]> { 
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaOutStationBalancing?menumber=${menumber}&station=${station}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaOutStationBalancing matching ${menumber} - ${station}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaOutStationBalancing', []))
      );
  }

  getCommentHistoryByMeNumStaUnderStationBalancing(menumber, station): Observable<CommentHistory[]> {
    if (!menumber) {
      return of([]); 
    }
    
    var _result = this.http.get<CommentHistory[]>(`${environment.apiEnv}/api/plannerqueue/getCommentHistoryByMeNumStaUnderStationBalancing?menumber=${menumber}&station=${station}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCommentHistoryByMeNumStaUnderStationBalancing matching ${menumber} - ${station}`)),
        catchError(this.handleError<CommentHistory[]>('getCommentHistoryByMeNumStaUnderStationBalancing', []))
      );    
  }

  getLatestMeComment(menumber): Observable<MeEcoComments[]> {
    if (!menumber) {
      return of(null); 
    }
    
    var _result = this.http.get<MeEcoComments[]>(`${environment.apiEnv}/api/plannerqueue/getLatestMeComment?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getLatestMeComment matching ${menumber}`)),
        catchError(this.handleError<MeEcoComments[]>('getCommentHistoryByMeNumStaUnderStationBalancing', []))
      );    
  }

  getLatestEcoComment(menumber): Observable<MeEcoComments[]> {
    if (!menumber) {
      return of(null); 
    }
    
    var _result = this.http.get<MeEcoComments[]>(`${environment.apiEnv}/api/plannerqueue/getLatestEcoComment?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getLatestEcoComment matching ${menumber}`)),
        catchError(this.handleError<MeEcoComments[]>('getLatestEcoComment', []))
      );    
  }

  insertMeEcoComment(req) { 
    return this.http.post<MeEcoComments>(`${environment.apiEnv}/api/plannerqueue/insertMeEcoComment`, req)
      .pipe(
        tap(() => {
          this.log(`insertMeEcoComment for "${req.ME_PART_NUMBER}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertMeEcoComment', req)
        )
      );
  }
  
  updateMeEcoComment(req) { 
    return this.http.post<MeEcoComments>(`${environment.apiEnv}/api/plannerqueue/updateMeEcoComment`, req)
      .pipe(
        tap(() => {
          this.log(`found updateMeEcoComment matching "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('updateMeEcoComment', new MeEcoComments())
        )
      );
  }

  updatePartAttributes(req) { 
    return this.http.post<MeEcoComments>(`${environment.apiEnv}/api/plannerqueue/updatePartAttributes`, req)
    .pipe(
      tap(() => {
        this.log(`found updatePartAttributes matching "${req.OPTIMAL_OWNERSHIP}"`);
        this._refreshNeeded$.next();
      }),
      catchError(
        this.handleError('updatePartAttributes', new MeEcoComments())
      )
    );  
  }

  updatePlannerQueueComment(req) { 
    return this.http.post<CommentHistory>(`${environment.apiEnv}/api/plannerqueue/updatePlannerQueueComment`, req)
      .pipe(
        tap(() => {
          this.log(`found updatePlannerQueueComment matching "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('updatePlannerQueueComment', new CommentHistory())
        )
      );
  }

  deleteMeEcoComment(req) { 
    var _result = this.http.post<MeEcoComments>(`${environment.apiEnv}/api/plannerqueue/deleteMeEcoComment`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`deleteMeEcoComment matching ID: "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('deleteMeEcoComment', new MeEcoComments())
        )
      );
  }

  deletePlannerQueueComment(req) { 
    var _result = this.http.post<CommentHistory>(`${environment.apiEnv}/api/plannerqueue/deletePlannerQueueComment`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`deletePlannerQueueComment matching ID: "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('deletePlannerQueueComment', new CommentHistory())
        )
      );
  }

  getPQSMBaselineStationShortageSchduleByME(menumber, requirement, station): Observable<SmDash8CommentDetail[]> {
    if (!menumber || !station) {
      return of(null); 
    }
    
    var _result = this.http.get<SmDash8CommentDetail[]>(`${environment.apiEnv}/api/plannerqueue/getPQSMBaselineStationShortageSchduleByME?menumber=${menumber}&requirement=${requirement}&station=${station}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPQSMBaselineStationShortageSchduleByME matching menumber: ${menumber} - requirement: ${requirement} - station: ${station}`)),
        catchError(this.handleError<SmDash8CommentDetail[]>('getPQSMBaselineStationShortageSchduleByME', []))
      );    
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "server error.");
  }

  getAtaPlannerRefreshTime(type: string): Observable<RefreshTime[]> {
    var _result = this.http.get<RefreshTime[]>(`${environment.apiEnv}/api/plannerqueue/getAtaPlannerRefreshTime?type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getAtaPlannerRefreshTime`)),
        catchError(this.handleError<RefreshTime[]>('getAtaPlannerRefreshTime', []))
      );
  }

  private log(message: string) {
    this.messageService.add(`Planner Service: ${message}`);
    //console.log('log message is --> ' + message);
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
