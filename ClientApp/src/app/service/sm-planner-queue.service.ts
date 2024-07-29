import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DropMeNumberReq } from '../models/drop-me-number-req';
import { DropSmMeNumberUsedReq } from '../models/drop-sm-me-number-used-req';
import { RefreshTime } from '../models/refresh-time';
import { RuleCount } from '../models/rule-count';
import { SmCommentHistory } from '../models/sm-comment-history';
import { SmDeferralReview } from '../models/sm-deferral-review';
import { SmDeferralReviewComments } from '../models/sm-deferral-review-comments';
import { SmNewStationsChanges } from '../models/sm-new-stations-changes';
import { SmNewStationsChangesComments } from '../models/sm-new-stations-changes-comments';
import { SmNewStationsChangesDetail } from '../models/sm-new-stations-changes-detail';
import { SmPartNoLongerUsed } from '../models/sm-part-no-longer-used';
import { SmPartNoLongerUsedComments } from '../models/sm-part-no-longer-used-comments';
import { SmPlannerCommentHistory } from '../models/sm-planner-comment-history';
import { SmQueueCommentReq } from '../models/sm-queue-comment-req';
import { SmQueueRule } from '../models/sm-queue-rule';
import { SmQueueRuleReq } from '../models/sm-queue-rule-req';
import { SmRuleCount } from '../models/sm-rule-count';
import { SmScheduledNextDueDateDetail } from '../models/sm-scheduled-next-due-date-detail';
import { SmScheduledRotableBom } from '../models/sm-scheduled-rotable-bom';
import { SmScheduledRotableBomComments } from '../models/sm-scheduled-rotable-bom-comments';
import { UpdateSmPqMasterReq } from '../models/update-sm-pq-master-req';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmPlannerQueueService {
  headers: any;
  private _refreshNeeded$ = new Subject<void>();
  private _refreshCountNeeded$ = new Subject<void>();
  private smRuleSubject = new Subject<SmQueueRule>();
  private smChipList = new Subject<string>();
  private smPlannerSubject = new Subject<string>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  get refreshNeeded$() { 
    return this._refreshNeeded$;
  }

  get refreshCountNeeded$() { 
    return this._refreshCountNeeded$;
  }

  getSmPlannerName(): Observable<string> {
    //console.log("getSmPlannerName: getting current SmPlanner")
    return this.smPlannerSubject.asObservable();
  }
  
  setSmPlannerName(plannerName: string) {
    //console.log("setSmPlannerName: setting plannername " + plannerName);
    this.smPlannerSubject.next(plannerName);
  }

  getChiplist(): Observable<string> { 
    //console.log("getting current chiplist");
    return this.smChipList.asObservable();
  }

  setChiplist(val: string) {
    //console.log("setting smChiplist: " + val)
    this.smChipList.next(val);
  }
  
  getSmQueueRule(): Observable<SmQueueRule> {
    //console.log("getting current smRuleSubject")
    return this.smRuleSubject.asObservable();
  }

  setSmQueueRule(valObj: SmQueueRule){
    //console.log("smRuleSubject: setting smRuleSubject " + JSON.stringify(valObj));
    this.smRuleSubject.next(valObj);
  }

  clearSmPlannerName() { 
    this.smPlannerSubject.next(undefined);
  }

  clearSmQueueRule() { 
    this.smRuleSubject.next(undefined);
  }

  getFilteredFleets(): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/smplannerqueue/getFilteredFleets`);
    return _result
      .pipe(
        tap(_ => this.log(`found getFilteredFleets`)),
        catchError(this.handleError<string[]>('getFilteredFleets', []))
      );
  }

  // getSMQueueRuleCount(fleetcode: string, ruleName: string): Observable<RuleCount[]> {
  //   if (!fleetcode) {
  //     return of([]); 
  //   }
    
  //   var _result = this.http.get<RuleCount[]>(`${environment.apiEnv}/api/smplannerqueue/getSMQueueRuleCount?fleetcode=${fleetcode}&ruleName=${ruleName}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found getSmPlannerRuleCount matching ${fleetcode}" rule ${ruleName}`)),
  //       catchError(this.handleError<RuleCount[]>('getSmPlannerRuleCount', []))
  //     );
  // }

  getSMQueueRuleCount(fleetCode: string) {
    if (!fleetCode) {
      return; 
    }

    var _result = this.http.get<SmRuleCount[]>(`${environment.apiEnv}/api/SMPlannerQueue/getSMQueueRuleCount?fleetCode=${fleetCode.trim()}`);
    return _result
      .pipe(
        tap(_ => this.log(`getSMQueueRuleCount matching "${fleetCode}"`)),
        catchError(this.handleError<SmRuleCount[]>('getSMQueueRuleCount', []))
      );
  }

  getDeferralReviewByFleet(fleet: string, orderby?: string, sorttype?: string): Observable<SmDeferralReview[]> { 
    if (!fleet.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmDeferralReview[]>(`${environment.apiEnv}/api/SMPlannerQueue/getDeferralReviewByFleet?fleet=${fleet.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getDeferralReviewByFleet matching "${fleet}"`)),
        catchError(this.handleError<SmDeferralReview[]>('getDeferralReviewByFleet', []))
      );
  }

  getPartNoLongerUsedByFleet(fleet: string, orderby?: string, sorttype?: string): Observable<SmPartNoLongerUsed[]> { 
    if (!fleet.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmPartNoLongerUsed[]>(`${environment.apiEnv}/api/SMPlannerQueue/getPartNoLongerUsedByFleet?fleet=${fleet.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartNoLongerUsedByFleet matching "${fleet}"`)),
        catchError(this.handleError<SmPartNoLongerUsed[]>('getPartNoLongerUsedByFleet', []))
      );
  }

  getPartNoLongerUsedDetailById(mepartnumberused: string, fleet: string, orderby?: string, sorttype?: string): Observable<SmPartNoLongerUsedComments[]> { 
    if (!mepartnumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmPartNoLongerUsedComments[]>(`${environment.apiEnv}/api/SMPlannerQueue/getPartNoLongerUsedDetailById?mepartnumberused=${mepartnumberused.trim()}&fleet=${fleet.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartNoLongerUsedDetailById matching "${mepartnumberused} - ${fleet}"`)),
        catchError(this.handleError<SmPartNoLongerUsedComments[]>('getPartNoLongerUsedDetailById', []))
      );
  }

  getDeferralReviewDetailById(dash8: string, station: string, aircraft: string, orderby?: string, sorttype?: string): Observable<SmDeferralReviewComments[]> { 
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmDeferralReviewComments[]>(`${environment.apiEnv}/api/SMPlannerQueue/getDeferralReviewDetailById?dash8=${dash8.trim()}&station=${station}&aircraft=${aircraft}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getDeferralReviewDetailById matching "${dash8}"`)),
        catchError(this.handleError<SmDeferralReviewComments[]>('getDeferralReviewDetailById', []))
      );
  }

  getScheduledRotableBomDetailById(mepartnumber: string, orderby?: string, sorttype?: string): Observable<SmScheduledRotableBomComments[]> { 
    if (!mepartnumber) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmScheduledRotableBomComments[]>(`${environment.apiEnv}/api/SMPlannerQueue/getScheduledROTBOMDetailById?mepartnumber=${mepartnumber.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getScheduledRotableBomDetailById matching "${mepartnumber}"`)),
        catchError(this.handleError<SmScheduledRotableBomComments[]>('getScheduledRotableBomDetailById', []))
      );
  }

  getSmRefreshTime(type: string): Observable<RefreshTime[]> {
    var _result = this.http.get<RefreshTime[]>(`${environment.apiEnv}/api/SMPlannerQueue/getSmRefreshTime?type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getSmRefreshTime`)),
        catchError(this.handleError<RefreshTime[]>('getSmRefreshTime', []))
      );
  }

  getScheduledRotableBomByFleet(fleet: string, orderby?: string, sorttype?: string): Observable<SmScheduledRotableBom[]> { 
    if (!fleet.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmScheduledRotableBom[]>(`${environment.apiEnv}/api/SMPlannerQueue/getScheduledRotableBomByFleet?fleet=${fleet.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getScheduledRotableBomByFleet matching "${fleet}"`)),
        catchError(this.handleError<SmScheduledRotableBom[]>('getPartNoLongerUsedByFleet', []))
      );
  }

  insertSMPQComments(req: SmQueueCommentReq) { 
    if (!req) {
      return; 
    }
    
    var _result = this.http.post<SmQueueCommentReq>(`${environment.apiEnv}/api/SMPlannerQueue/insertSMPQComments`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertSMPQComments matching "${req.CHKKEY}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertSMPQComments', new SmQueueCommentReq())
        )
      );
  }

  insertSMDeferralPQComments(req: SmQueueCommentReq) { 
    if (!req) {
      return; 
    }
    
    var _result = this.http.post<SmQueueCommentReq>(`${environment.apiEnv}/api/SMPlannerQueue/insertSMDeferralPQComments`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertSMDeferralPQComments matching "${req.CHKKEY}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertSMDeferralPQComments', new SmDeferralReviewComments(req))
        )
      );
  }


  updateSMPQMaster(updateSmPqMasterReq: UpdateSmPqMasterReq) { 

    return this.http.post<UpdateSmPqMasterReq>(`${environment.apiEnv}/api/SMPlannerQueue/updateSMPQMaster`, updateSmPqMasterReq)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshCountNeeded$.next();
        }),
      catchError(this.handleError('updateSMPQMaster', updateSmPqMasterReq))
    );
  }

  dropOffSMPQDash8(req: DropSmMeNumberUsedReq) {
    
    return this.http.post<DropSmMeNumberUsedReq>(`${environment.apiEnv}/api/SMPlannerQueue/dropOffSMPQDash8`, req)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          this._refreshCountNeeded$.next();
        }),
      catchError(this.handleError('dropOffSMPQDash8', DropSmMeNumberUsedReq))
    );
  }

  getSmPlannerCommentHistoryByType(type: string, dash8: string, mepartnumberused?: string, station?: string, aircraft?: string) { 
    if (!type) { 
      return of([]); 
    }
    
    var _result = this.http.get<SmPlannerCommentHistory[]>(`${environment.apiEnv}/api/SMPlannerQueue/getSmPlannerCommentHistoryByType?type=${type}&dash8=${dash8}&mepartnumberused=${mepartnumberused}&station=${station}&aircraft=${aircraft}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getSmPlannerCommentHistoryByType matching type: ${type}, dash8: ${dash8}, mepartnumberused: ${mepartnumberused} station: ${station} aircraft: ${aircraft}`)),
        catchError(this.handleError<SmCommentHistory[]>('getSmPlannerCommentHistoryByType', []))
      );
  }

  insertSmPlannerQueueAlertComment(req) { 
    return this.http.post<SmPlannerCommentHistory>(`${environment.apiEnv}/api/SMPlannerQueue/insertSmPlannerQueueAlertComment`, req)
      .pipe(
        tap(() => {
          this.log(`found insertschedmaintComment matching DASH_8:"${req.DASH_8}" ME_PART_NUMBER_USED: " ${req.ME_PART_NUMBER_USED}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertschedmaintComment', new SmPlannerCommentHistory())
        )
      );
  }

  updatePlannerQueueAlertComment(req) { 
    return this.http.post<SmPlannerCommentHistory>(`${environment.apiEnv}/api/SMPlannerQueue/updatePlannerQueueAlertComment`, req)
      .pipe(
        tap(() => {
          this.log(`found updatePlannerQueueAlertComment matching "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('updatePlannerQueueAlertComment', new SmPlannerCommentHistory())
        )
      );
  }

  deletePlannerQueueAlertComment(req) {
    var _result = this.http.post<SmPlannerCommentHistory>(`${environment.apiEnv}/api/SMPlannerQueue/deletePlannerQueueAlertComment`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`deletePlannerQueueAlertComment matching ID: "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('deletePlannerQueueAlertComment', new SmPlannerCommentHistory())
        )
      );
  }

  getNewStationsChangesByFleet(fleet: string, orderby?: string, sorttype?: string): Observable<SmNewStationsChanges[]> { 
    if (!fleet) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmNewStationsChanges[]>(`${environment.apiEnv}/api/SMPlannerQueue/getNewStationsChangesByFleet?fleet=${fleet.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getNewStationsChangesByFleet matching "${fleet}"`)),
        catchError(this.handleError<SmNewStationsChanges[]>('getNewStationsChangesByFleet', []))
      );
  }

  getNewStationsChangesDetailById(dash8: string, orderby?: string, sorttype?: string): Observable<SmNewStationsChangesComments[]> { 
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmNewStationsChangesComments[]>(`${environment.apiEnv}/api/SMPlannerQueue/getNewStationsChangesDetailById?dash8=${dash8.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getNewStationsChangesDetailById matching "${dash8}"`)),
        catchError(this.handleError<SmNewStationsChangesComments[]>('getNewStationsChangesDetailById', []))
      );
  }

  getStationsAddedShortageDetails(dash8: string, mepartnumberused: string, orderby?: string, sorttype?: string) { 
    if (!dash8 || !mepartnumberused) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<SmNewStationsChangesDetail[]>(`${environment.apiEnv}/api/SMPlannerQueue/getStationsAddedShortageDetails?dash8=${dash8.trim()}&mepartnumberused=${mepartnumberused.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getStationsAddedShortageDetails matching dash8: ${dash8} mepartnumberused: ${mepartnumberused}`)),
        catchError(this.handleError<SmNewStationsChangesDetail[]>('getStationsAddedShortageDetails', []))
      );
  }

  getScheduleDetail(dash8: string, orderby?: string, sorttype?: string) { 
    if (!dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<SmScheduledNextDueDateDetail[]>(`${environment.apiEnv}/api/SMPlannerQueue/getScheduleDetail?dash8=${dash8.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getScheduleDetail matching dash8: ${dash8}`)),
        catchError(this.handleError<SmScheduledNextDueDateDetail[]>('getScheduleDetail', []))
      );
  }

  private log(message: string) {
    this.messageService.add(`smplannerqueue Service: ${message}`);
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
