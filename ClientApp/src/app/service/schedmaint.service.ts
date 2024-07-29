import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MeSoStaDetails } from '../models/me-so-sta-details';
import { RefreshTime } from '../models/refresh-time';
import { SmCommentHistory } from '../models/sm-comment-history';
import { SmDash8Detail } from '../models/sm-dash8-detail';
import { SmKitDetail } from '../models/sm-kit-detail';
import { SmKitPartStationInventoryDetail } from '../models/sm-kit-part-station-inventory-detail';
import { SmMeDetail } from '../models/sm-me-detail';
import { SmMinScheduledDate } from '../models/sm-min-scheduled-date';
import { SmPartNumberTotalRequirement } from '../models/sm-part-number-total-requirement';
import { SmPoDetail } from '../models/sm-po-detail';
import { SmRoDetail } from '../models/sm-ro-detail';
import { SmSearchDetails } from '../models/sm-search-details';
import { SmSearchReq } from '../models/sm-search-req';
import { SmTsxWcnumDetail } from '../models/sm-tsx-wcnum-detail';
import { SmTsxWcnumKitDetail } from '../models/sm-tsx-wcnum-kit-detail';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedmaintService {
  headers: any;
  private _refreshNeeded$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // api/schedmaint/

  get refreshNeeded$() { 
    return this._refreshNeeded$;
  }

  getSmAutoComplete(value: string, type: string) { 
    if (!value) {
      return of([]); 
    }
   
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/schedmaint/getSmAutoComplete?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getSmAutoComplete matching ${value}`)),
        catchError(this.handleError<string[]>('getSmAutoComplete', []))
      );
  }

  smSearch(smSearchReq: SmSearchReq): Observable<SmSearchReq[]>{
    var _result = this.http.post<SmSearchReq[]>(`${environment.apiEnv}/api/schedmaint/smSearch`, smSearchReq)
      .pipe(
      catchError(this.handleError('smSearch', smSearchReq[0]))
  );
  
  return _result;
  }

  searchNewSMList(req: SmSearchDetails): Observable<SmSearchDetails[]> {
    if (!req) {
      return; 
    }

    req.ORDERBY = req.ORDERBY === undefined || req.ORDERBY === null ? '' : req.ORDERBY;
    req.SORTTYPE = req.SORTTYPE === undefined || req.SORTTYPE === null ? '' : req.SORTTYPE;

    var _result = this.http.post<SmSearchDetails>(`${environment.apiEnv}/api/schedmaint/searchNewSMList`, req)
      .pipe(
      catchError(this.handleError('searchNewSMList'),)
      )
    return _result
      .pipe(
        tap(_ => this.log(`searchNewSMList matching "${req}"`)),
        catchError(
          this.handleError('searchNewSMList', req[0])
        )
      );
  }

  getSmPartNumberTotalRequirements(menumber: string) { 
    if (!menumber) { 
      return of([]); 
    }
    
    var _result = this.http.get<SmPartNumberTotalRequirement[]>(`${environment.apiEnv}/api/schedmaint/getSmPartNumberTotalRequirements?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getSmPartNumberTotalRequirements matching menumber: ${menumber}`)),
        catchError(this.handleError<SmPartNumberTotalRequirement[]>('getSmPartNumberTotalRequirements', []))
      );
  }

  getSmCommentHistoryByType(type: string, value: string) { 
    if (!type) { 
      return of([]); 
    }
    
    var _result = this.http.get<SmCommentHistory[]>(`${environment.apiEnv}/api/schedmaint/getSmCommentHistoryByType?type=${type}&value=${value}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getSmCommentHistoryByType matching type: ${type}, value: ${value}`)),
        catchError(this.handleError<SmCommentHistory[]>('getSmCommentHistoryByType', []))
      );
  }

  getMinScheduledDate(dash8: string) { 
    if (!dash8) { 
      return of([]); 
    }
    
    var _result = this.http.get<SmMinScheduledDate[]>(`${environment.apiEnv}/api/schedmaint/getMinScheduledDate?dash8=${dash8}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getMinScheduledDate matching dash8: ${dash8}`)),
        catchError(this.handleError<SmMinScheduledDate[]>('getMinScheduledDate', []))
      );
  }

  deleteSchedMaintComment(req) { 
    var _result = this.http.post<SmCommentHistory>(`${environment.apiEnv}/api/schedmaint/deleteschedmaintComment`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`deleteschedmaintComment matching ID: "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('deleteschedmaintComment', new SmCommentHistory())
        )
      );
  }

  updateSchedMaintComment(req) { 
    return this.http.post<SmCommentHistory>(`${environment.apiEnv}/api/schedmaint/updateschedmaintComment`, req)
      .pipe(
        tap(() => {
          this.log(`found updateschedmaintComment matching "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('updateschedmaintComment', new SmCommentHistory())
        )
      );
  }

  insertSchedMaintComment(req) { 
    return this.http.post<SmCommentHistory>(`${environment.apiEnv}/api/schedmaint/insertschedmaintComment`, req)
      .pipe(
        tap(() => {
          this.log(`found insertschedmaintComment matching DASH_8:"${req.DASH_8}" TSX_WCNUM: " ${req.TSX_WCNUM}" TSX_ALTNUM: " ${req.TSX_ALTNUM}`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('insertschedmaintComment', new SmCommentHistory())
        )
      );
  }

  getSmDash8Detail(dash8: string, orderby?: string, sorttype?: string): Observable<SmDash8Detail[]> {
    if (!dash8) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<SmDash8Detail[]>(`${environment.apiEnv}/api/schedmaint/getSmDash8Detail?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`)
      .pipe(
        catchError(this.handleError('dash8detail', []))
      )
    
    return _result;
  }

  getSmPoDetails(menumberused: string, orderby?: string, sorttype?: string): Observable<SmPoDetail[]> {
    if (!menumberused.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;
    
    var _result = this.http.get<SmPoDetail[]>(`${environment.apiEnv}/api/schedmaint/getSmPoDetails?menumberused=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`)
      .pipe(
        catchError(this.handleError('getSmPoDetails', []))
      )
    
    return _result;
  }

  getSmRoDetails(menumberused: string, orderby?: string, sorttype?: string): Observable<SmRoDetail[]> {
    if (!menumberused.trim()) {
      return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<SmRoDetail[]>(`${environment.apiEnv}/api/schedmaint/getSmRoDetails?menumberused=${menumberused}&orderby=${orderby}&sorttype=${sorttype}`)
      .pipe(
        catchError(this.handleError('getSmRoDetails', []))
      )
    
    return _result;
  }

  getSmPoStationDetails(menumber: string, station: string, orderby?: string, sorttype?: string): Observable<SmPoDetail[]> {
    if (!menumber.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<SmPoDetail[]>(`${environment.apiEnv}/api/eco/getMePoDetails?menumber=${menumber}&station=${station}&orderby=${orderby}&sorttype=${sorttype}`)
      .pipe(
        catchError(this.handleError('getMePoStationDetails', SmPoDetail[0]))
    );
    
    return _result;
  }

  getSmRoStationDetails(menumber: string, station: string): Observable<SmRoDetail[]> {
    if (!menumber.trim()) {
      return of([]); 
    }
    var _result = this.http.get<SmRoDetail[]>(`${environment.apiEnv}/api/eco/getMeRoDetails?menumber=${menumber}&station=${station}`)
      .pipe(
        catchError(this.handleError('getSmRoStationDetails', SmRoDetail[0]))
    );
    
    return _result;
  }

  getSmSoStationDetails(menumber: string, station: string): Observable<MeSoStaDetails[]> {
    if (!menumber.trim()) {
      return of([]); 
    }
    var _result = this.http.get<MeSoStaDetails[]>(`${environment.apiEnv}/api/eco/getMeSoDetails?menumber=${menumber}&station=${station}`)
      .pipe(
        catchError(this.handleError('getSmSoStationDetails', MeSoStaDetails[0]))
    );
    
    return _result;
  }

  getSmMeUsedDetailById(mepartnumberused: string, orderby?: string, sorttype?: string): Observable<SmDash8Detail[]> {
    if (!mepartnumberused.trim()) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<SmDash8Detail[]>(`${environment.apiEnv}/api/schedmaint/getSmMeUsedDetailById?mepartnumberused=${mepartnumberused}&orderby=${orderby}&sorttype=${sorttype}`)
      .pipe(
        catchError(this.handleError('dash8detail', []))
      )
    
    return _result;
  }

  getkitdetails(mepartnumberused: string, dash8: string, orderby?: string, sorttype?: string) {
    if (!mepartnumberused || !dash8) {
      return of([]); 
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<SmKitDetail[]>(`${environment.apiEnv}/api/schedmaint/getkitdetails?mepartnumberused=${mepartnumberused}&dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`)
      .pipe(
        catchError(this.handleError('getkitdetails', []))
      )
    
    return _result;
  }
  
  getKitPartStationInventoryDetails(mepartnumberinkit: string, orderby?: string, sorttype?: string) {
    if (!mepartnumberinkit) {
          return of([]); 
    }
    
    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<SmKitPartStationInventoryDetail[]>(`${environment.apiEnv}/api/schedmaint/getKitPartStationInventoryDetails?mepartnumberinkit=${mepartnumberinkit}&orderby=${orderby}&sorttype=${sorttype}`)
      .pipe(
        catchError(this.handleError('getKitPartStationInventoryDetails', []))
      )
    
    return _result;
  }

  getTsxWcNumDetail(tsxwcnumid: string): Observable<SmTsxWcnumDetail[]> {
    if (!tsxwcnumid.trim()) {
      return of([]); 
  }
    var _result = this.http.get<SmTsxWcnumDetail[]>(`${environment.apiEnv}/api/schedmaint/getTsxWcNumDetail?tsxwcnumid=${tsxwcnumid}`)
      .pipe(
        catchError(this.handleError('getTsxWcNumDetail', []))
      )
    
    return _result;
  }

  getTsxWcMeKitDetail(mepartnumberused: string, tsxwcnum: string) {
    if (!mepartnumberused || !tsxwcnum) {
      return of([]); 
    }
    var _result = this.http.get<SmTsxWcnumKitDetail[]>(`${environment.apiEnv}/api/schedmaint/getTsxWcMeKitDetail?mepartnumberused=${mepartnumberused}&tsxwcnum=${tsxwcnum}`)
      .pipe(
        catchError(this.handleError('getTsxWcMeKitDetail', []))
      )
    
    return _result;
  }

  getSmMeDetail(dash8: string, orderby?: string, sorttype?: string): Observable<SmMeDetail[]> {
    if (!dash8.trim()) {
      return of([]); 
  }
    var _result = this.http.get<SmMeDetail[]>(`${environment.apiEnv}/api/schedmaint/getSmMeDetail?dash8=${dash8}&orderby=${orderby}&sorttype=${sorttype}`)
      .pipe(
        catchError(this.handleError('getSmMeDetail', []))
      )
    
    return _result;
  }

  getSMRefreshTime(type: string): Observable<RefreshTime[]> {
    var _result = this.http.get<RefreshTime[]>(`${environment.apiEnv}/api/schedmaint/getSMRefreshTime?type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getSMRefreshTime`)),
        catchError(this.handleError<RefreshTime[]>('getSMRefreshTime', []))
      );
  }

  private log(message: string) {
    this.messageService.add(`schedmaint Service: ${message}`);
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
