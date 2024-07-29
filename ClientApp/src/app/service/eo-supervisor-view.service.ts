import { EoPlanner } from './../models/eo-planner';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { RuleCount } from '../models/rule-count';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './message.service';
import { EoNumberRule } from '../models/eo-number-rule';
import { EoSupervisorOverview } from '../models/eo-supervisor-overview';
import { EoSupervisorOverviewTotals } from '../models/eo-supervisor-overview-totals';
import { EoSupervisorQueueSummary } from '../models/eo-supervisor-queue-summary';
import { EoSupervisorQueueDetail } from '../models/eo-supervisor-queue-detail';
import { EoDeferralHistoryReasonDetail } from '../models/eo-deferral-history-reason-detail';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EoSupervisorViewService {
  private eoNumberRuleSubject = new Subject<EoNumberRule>();
  private eoSupervisorSubject = new Subject<string>();
  //private eoPlannerSubject = new Subject<string>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getEoSupervisorName(): Observable<string> {
    console.log("getEoPlannerName: getting current eoPlanner")
    return this.eoSupervisorSubject.asObservable();
  }
  
  // getEoPlannerName(): Observable<string> {
  //   console.log("getEoPlannerName: getting current eoPlanner")
  //   return this.eoPlannerSubject.asObservable();
  //  }

  setEoSupervisorName(supervisorName: string) {
    console.log("setEoSupervisorName: setting supervisor name " + supervisorName);
    this.eoSupervisorSubject.next(supervisorName);
  }

  // setEoPlannerName(plannerName: string) {
  //   console.log("setEoPlannerName: setting plannername " + plannerName);
  //   this.eoPlannerSubject.next(plannerName);
  // }

  clearEoSupervisorName() { 
    this.eoSupervisorSubject.next(undefined);
  }

  // clearEoPlannerName() { 
  //   this.eoPlannerSubject.next();
  // }

  getEoNumberRule(): Observable<EoNumberRule> {
    return this.eoNumberRuleSubject.asObservable();
  }
  
  // getEoNumberRule(): Observable<EoNumberRule> {
  //   return this.eoNumberRuleSubject.asObservable();
  //  }

  setEoNumberRule(eonumberrule: EoNumberRule) { 
    this.eoNumberRuleSubject.next(eonumberrule);
  }

  // setEoNumberRule(eonumberrule: EoNumberRule) { 
  //   this.eoNumberRuleSubject.next(eonumberrule);
  // }

  clearEoNumberRule() { 
    this.eoNumberRuleSubject.next(undefined);
  }

  // clearEoNumberRule() { 
  //   this.eoNumberRuleSubject.next()
  // }

  getEoSupervisorNames(): Observable<EoPlanner[]> {
    var _result = this.http.get<EoPlanner[]>(`${environment.apiEnv}/api/eosupervisor/getEoSupervisorNames`);
    
    return _result
      .pipe(
        tap(_ => this.log(`found plannerNames`)),
        catchError(this.handleError<EoPlanner[]>('getPlannerNames', []))
      );
  }

  getEoSupervisorOverview(supervisor: string): Observable<EoSupervisorOverview[]> {
    var _result = this.http.get<EoSupervisorOverview[]>(`${environment.apiEnv}/api/eosupervisor/getEoSupervisorOverview?supervisor=${supervisor}`);
    return _result
      .pipe(
        tap(_ => this.log(`found supervisor overview for ${supervisor}`)),
        catchError(this.handleError<EoSupervisorOverview[]>('getEoSupervisorOverview', []))
      );
  }

  getEoSupervisorOverviewTotals(supervisor: string): Observable<EoSupervisorOverviewTotals[]> {
    var _result = this.http.get<EoSupervisorOverviewTotals[]>(`${environment.apiEnv}/api/eosupervisor/getEoSupervisorOverviewTotals?supervisor=${supervisor}`);
    return _result
      .pipe(
        tap(_ => this.log(`found supervisor overview totals for ${supervisor}`)),
        catchError(this.handleError<EoSupervisorOverviewTotals[]>('EoSupervisorOverviewTotals', []))
      );
  }

  getEoSupervisorQueueSummary(supervisor: string): Observable<EoSupervisorQueueSummary[]> {
    var _result = this.http.get<EoSupervisorQueueSummary[]>(`${environment.apiEnv}/api/eosupervisor/getEoSupervisorQueueSummary?supervisor=${supervisor}`);
    return _result
      .pipe(
        tap(_ => this.log(`found supervisor queue summary for ${supervisor}`)),
        catchError(this.handleError<EoSupervisorQueueSummary[]>('getEoSupervisorQueueSummary', []))
      );
  }

  getEoSupervisorQueueDetail(supervisor: string, queuetype: string): Observable<EoSupervisorQueueDetail[]> {
    var _result = this.http.get<EoSupervisorQueueDetail[]>(`${environment.apiEnv}/api/eosupervisor/getEoSupervisorQueueDetail?supervisor=${supervisor}&queuetype=${queuetype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found supervisor queue detail for ${supervisor}`)),
        catchError(this.handleError<EoSupervisorQueueDetail[]>('getEoSupervisorQueueDetail', []))
      );
  }

  getEoSupervisorRuleCount(supervisorName: string, ruleName: string): Observable<RuleCount[]> {
    if (!supervisorName) {
      return of([]); 
    }
    
    var _result = this.http.get<RuleCount[]>(`${environment.apiEnv}/api/eosupervisor/getEoSupervisorRuleCount?supervisor=${supervisorName}&ruleName=${ruleName}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getEoSupervisorRuleCount matching ${supervisorName}" rule ${ruleName}`)),
        catchError(this.handleError<RuleCount[]>('getEoSupervisorRuleCount', []))
      );
  }

  getEoDeferralHistoryDetail(dash8: string, reasoncode: string, subfleet: string, orderby?: string, sorttype?: string): Observable<EoDeferralHistoryReasonDetail[]> {
    if (!dash8 || !reasoncode) {
      return of([]); 
    }
    var _result = new Observable<EoDeferralHistoryReasonDetail[]>();

    orderby = orderby === undefined || orderby == '' ? '' : orderby;
    sorttype = sorttype === undefined || sorttype == '' ? '' : sorttype;

    _result = this.http.get<EoDeferralHistoryReasonDetail[]>(`${environment.apiEnv}/api/eosupervisor/getEoDeferralHistoryDetail?dash8=${dash8}&reasoncode=${reasoncode}&subfleet=${subfleet}&orderby=${orderby}&sortype=${sorttype}`);
    
    return _result
      .pipe(
        tap(_ => this.log(`found getEoDeferralHistoryDetail matching ${dash8}" rule ${reasoncode}`)),
        catchError(this.handleError<EoDeferralHistoryReasonDetail[]>('getEoDeferralHistoryDetail', []))
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
