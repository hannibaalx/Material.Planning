import { MePoDetails } from './../models/me-po-details';
import { AircraftAccomplished } from 'src/app/models/aircraft-accomplished';
import { EoMePart } from './../models/eo-me-part';
import { MeNumberRule } from './../models/me-number-rule';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject, } from 'rxjs';
import { MessageService } from './message.service';
import { EcoInfoReq } from './../models/eco-info-req';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { EcoInfo } from '../models/eco-info';
import { EonumberCommentReq } from '../models/eonumber-comment-req';
import { Dash8CommentReq } from '../models/dash8-comment-req';
import { Dash8detail } from '../models/dash8detail';
import { MeUsedDetail } from '../models/me-used-detail';
import { MeDash8Detail } from '../models/me-dash8-detail';
import { EoPartsAttInv } from '../models/eo-parts-att-inv';
import { AircraftScheduled } from '../models/aircraft-scheduled';
import { MePoStaDetails } from '../models/me-po-sta-details';
import { MeRoDetails } from '../models/me-ro-details';
import { MeSoStaDetails } from '../models/me-so-sta-details';
import { MeRoStaDetails } from '../models/me-ro-sta-details';
import { ManageEoNoDash8Req } from '../models/manage-eo-no-dash8-req';
import { EoKitPartStationInventory } from '../models/eo-kit-part-station-inventory';
import { RefreshTime } from '../models/refresh-time';
import { EoManageEoNoDash8Step2 } from '../models/eo-manage-eo-no-dash8-step2';
import { EoManageEoNoDash8Step3 } from '../models/eo-manage-eo-no-dash8-step3';
import { EoDeleteEoNumberByEoNumberReq } from '../models/eo-delete-eo-number-by-eo-number-req';
import { EoUpdateEditManageEoNoDash8Req } from '../models/eo-update-edit-manage-eo-no-dash8-req';
import { EcoReviewReasonNotification } from '../models/eco-review-reason-notification';
import { EoNumberRule } from '../models/eo-number-rule';
import { EoExistingDash8 } from '../models/eo-existing-dash8';
import { EoManageAlternativePartStep2Child } from '../models/eo-manage-alternative-part-step2-child';
import { EoSummary } from '../models/eo-summary';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EcoService {
  private eoDash8RuleSubject = new Subject<EoNumberRule>();

  constructor(private http: HttpClient, private messageService: MessageService) { }

  // QJ07301264
  // QJ07301264

  getDash8Rule(): Observable<EoNumberRule> {
    return this.eoDash8RuleSubject.asObservable();
   }

  setDash8Rule(eonumberrule: EoNumberRule) { 
    this.eoDash8RuleSubject.next(eonumberrule);
  }

  clearDash8Rule() { 
    this.eoDash8RuleSubject.next(undefined);
  }

  searchNewEOList(ecoInfoReq: EcoInfoReq): Observable<EcoInfo[]> {
    var _result = this.http.post<EcoInfo[]>(`${environment.apiEnv}/api/eco/searchNewEOList`, ecoInfoReq)
      .pipe(
        shareReplay(),
        catchError(this.handleError('searchNewEOList', EcoInfo[0]))
      );
    
    return _result;
  }

  getEOSummary(term: string, type: string): Observable<EoSummary[]> {
    if (!term.trim()) {
      return of([]); 
    }
    var _result = this.http.get<EoSummary[]>(`${environment.apiEnv}/api/eco/getEOSummary?term=${term}&type=${type}`)
      .pipe(
        catchError(this.handleError('getEOSummary', []))
    );
    
    return _result;
  }

  insertEoNumberComment(eoncommentreq: EonumberCommentReq): Observable<EonumberCommentReq[]> {
    var _result = this.http.post<EonumberCommentReq[]>(`${environment.apiEnv}/api/eco/insertEoNumberComment`, eoncommentreq)
      .pipe(
        catchError(this.handleError('insertEoNumberComment', EonumberCommentReq[0]))
      );
  
    return _result;
  }

  test2(): Observable<string> {
    var _result = this.http.get<string>(`${environment.apiEnv}/api/eco/gettestmessage`)
      .pipe(
        catchError(this.handleError('insertManageEoNoDash8', ManageEoNoDash8Req[0]))
    );
    return _result;
  }

  getManageEoNoDash8EoNumber(eonumber: string): Observable<string[]> {
    if (!eonumber.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eco/getManageEoNoDash8EoNumber?eonumber=${eonumber}`)
      .pipe(
        catchError(this.handleError('getManageEoNoDash8EoNumber', []))
    );
    
    return _result;
  }

  getManageEoNoDash8FormDataStep2(eonumber: string): Observable<EoManageEoNoDash8Step2[]> {
    if (!eonumber.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }
    var _result = this.http.get<EoManageEoNoDash8Step2[]>(`${environment.apiEnv}/api/eco/getManageEoNoDash8FormDataStep2?eonumber=${eonumber}`)
      .pipe(
        catchError(this.handleError('getManageEoNoDash8FormDataStep2', []))
    );
    
    return _result;
  }

  getManageEoNoDash8FormDataStep3(eonumber: string): Observable<EoManageEoNoDash8Step3[]> {
    if (!eonumber.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }
    var _result = this.http.get<EoManageEoNoDash8Step3[]>(`${environment.apiEnv}/api/eco/getManageEoNoDash8FormDataStep3?eonumber=${eonumber}`)
      .pipe(
        catchError(this.handleError('getManageEoNoDash8FormDataStep3', []))
    );
    
    return _result;
  }

  deleteEoNumber(req: EoDeleteEoNumberByEoNumberReq) { 
    var _result = this.http.post<EoDeleteEoNumberByEoNumberReq>(`${environment.apiEnv}/api/eco/deleteEoNumber`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`deleteEoNumber matching EO Number: "${req.EO_NUMBER}"`);
        }),
        catchError(
          this.handleError('deleteEoNumber', null)
        )
      );
  }

  deleteEoByID(req: number) { 
    var _result = this.http.post<number>(`${environment.apiEnv}/api/eco/deleteEoByID`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`deleteEoByID matching ID: "${req}"`);
        }),
        catchError(
          this.handleError('deleteEoByID', 0)
        )
      );
  }

  updateManageEoNoDash8(req: EoUpdateEditManageEoNoDash8Req): Observable<EoUpdateEditManageEoNoDash8Req>{
    var _result = this.http.post<EoUpdateEditManageEoNoDash8Req>(`${environment.apiEnv}/api/eco/updateManageEoNoDash8`, req)
      .pipe(
        tap(val =>
          console.log(`value returned: ${val}`)
        ),
        catchError(this.handleError('updateManageEoNoDash8', EoUpdateEditManageEoNoDash8Req[0]))
    );
    return _result;
  }
  
  insertManageEoNoDash8(manageeonodashreq: ManageEoNoDash8Req): Observable<ManageEoNoDash8Req>{
    var _result = this.http.post<ManageEoNoDash8Req>(`${environment.apiEnv}/api/eco/insertManageEoNoDash8`, manageeonodashreq)
      .pipe(
        tap(val =>
          console.log(`value returned: ${val}`)
        ),
        catchError(this.handleError('insertManageEoNoDash8', ManageEoNoDash8Req[0]))
    );
    return _result;
  }
  
  insertDash8Comment(eoncommentreq: Dash8CommentReq): Observable<Dash8CommentReq[]>{
    var _result = this.http.post<Dash8CommentReq[]>(`${environment.apiEnv}/api/eco/insertDash8Comment`, eoncommentreq)
      .pipe(
      catchError(this.handleError('insertDash8Comment', Dash8CommentReq[0]))
  );
  
  return _result;
  }

  getDash8Detail(meNumber: string): Observable<Dash8detail[]> {
    if (!meNumber.trim()) {
      return of([]); // if no search term, return empty partnumber array.
  }
    var _result = this.http.get<Dash8detail[]>(`${environment.apiEnv}/api/eco/dash8detail?menumber=${meNumber}`)
      .pipe(
        catchError(this.handleError('dash8detail', Dash8detail[0]))
    );
    
    return _result;
  }

  getEoMeDetail(meNumber: string): Observable<EoMePart[]> {
    if (!meNumber.trim()) {
      return of([]); 
  }
    var _result = this.http.get<EoMePart[]>(`${environment.apiEnv}/api/eco/getEoMeDetail?menumber=${meNumber}`)
      .pipe(
        catchError(this.handleError('getEoMeDetail', EoMePart[0]))
    );
    
    return _result;
  }

  getEoMeDetailMPN(mpn: string): Observable<EoMePart[]> {
    if (!mpn.trim()) {
      return of([]); 
  }
    var _result = this.http.get<EoMePart[]>(`${environment.apiEnv}/api/eco/getEoMeDetailMPN?mpn=${mpn}`)
      .pipe(
        catchError(this.handleError('getEoMeDetailMPN', EoMePart[0]))
    );
    
    return _result;
  }

  getMeDash8Detail(meNumber: string): Observable<MeDash8Detail[]> {
    if (!meNumber.trim()) {
      return of([]); 
  }
    var _result = this.http.get<MeDash8Detail[]>(`${environment.apiEnv}/api/eco/getMeDash8Detail?menumber=${meNumber}`)
      .pipe(
        catchError(this.handleError('getMeDash8Detail', MeDash8Detail[0]))
    );
    
    return _result;
  }

    getMeUsedDetailById(meUsedNumber: string): Observable<MeUsedDetail[]> {
    if (!meUsedNumber.trim()) {
      return of([]); 
    }
    var _result = this.http.get<MeUsedDetail[]>(`${environment.apiEnv}/api/eco/getMeUsedDetailById?meusednumber=${meUsedNumber}`)
      .pipe(
        catchError(this.handleError('getMeUsedDetailById', MeUsedDetail[0]))
    );
    
    return _result;
    }
  
  getKitPartStationInventory(meUsedNumber: string): Observable<EoKitPartStationInventory[]> {
    if (!meUsedNumber.trim()) {
      return of([]); 
    }
    var _result = this.http.get<EoKitPartStationInventory[]>(`${environment.apiEnv}/api/eco/getKitPartStationInventory?meusednumber=${meUsedNumber}`)
      .pipe(
        catchError(this.handleError('getMeUsedDetailById', EoKitPartStationInventory[0]))
    );
    
    return _result;
    }
  
    getMeKitDetail(dash8: string, menumber: string): Observable<[EoPartsAttInv]> {
      var _result = this.http.get<EoPartsAttInv[]>(`${environment.apiEnv}/api/eco/getMeKitDetail?dash8=${dash8}&menumber=${menumber}`)
      .pipe(
        catchError(this.handleError('getMeKitDetail', EoPartsAttInv[0]))
    );
    
    return _result;
    }
  
  getAircraftScheduled(dash8: string) { 
    var _result = this.http.get<AircraftScheduled[]>(`${environment.apiEnv}/api/eco/getAircraftScheduled?dash8=${dash8}`)
      .pipe(
        catchError(this.handleError('getAircraftScheduled', AircraftScheduled[0]))
    );
    
    return _result;
  }

  getAircraftScheduledInWork(dash8: string) { 
    var _result = this.http.get<AircraftScheduled[]>(`${environment.apiEnv}/api/eco/getAircraftScheduledInWork?dash8=${dash8}`)
      .pipe(
        catchError(this.handleError('getAircraftScheduledInWork', AircraftScheduled[0]))
    );
    
    return _result;
  }

  getAircraftAccomplished(dash8: string) { 
    var _result = this.http.get<AircraftAccomplished[]>(`${environment.apiEnv}/api/eco/getAircraftAccomplished?dash8=${dash8}`)
      .pipe(
        catchError(this.handleError('getAircraftAccomplished', AircraftAccomplished[0]))
    );
    
    return _result;
  }

  getMePoDetails(menumber: string): Observable<MePoDetails[]> {
    if (!menumber) {
      return of([]); 
    }
    var _result = this.http.get<MePoDetails[]>(`${environment.apiEnv}/api/eco/getMePoDetails?menumber=${menumber}`)
      .pipe(
        catchError(this.handleError('getMePoDetails', MePoDetails[0]))
    );
    
    return _result;
  }

  getMeRoDetails(menumber: string): Observable<MeRoDetails[]> {
    if (!menumber.trim()) {
      return of([]); 
    }
    var _result = this.http.get<MeRoDetails[]>(`${environment.apiEnv}/api/eco/getMeRoDetails?menumber=${menumber}`)
      .pipe(
        catchError(this.handleError('getMeRoDetails', MeRoDetails[0]))
    );
    
    return _result;
  }
 
  getMePoStationDetails(menumber: string, station: string): Observable<MePoStaDetails[]> {
    if (!menumber.trim()) {
      return of([]); 
    }
    var _result = this.http.get<MePoStaDetails[]>(`${environment.apiEnv}/api/eco/getMePoDetails?menumber=${menumber}&station=${station}`)
      .pipe(
        catchError(this.handleError('getMePoStationDetails', MePoStaDetails[0]))
    );
    
    return _result;
  }

  getMeRoStationDetails(menumber: string, station: string): Observable<MeRoStaDetails[]> {
    if (!menumber.trim()) {
      return of([]); 
    }
    var _result = this.http.get<MeRoStaDetails[]>(`${environment.apiEnv}/api/eco/getMeRoDetails?menumber=${menumber}&station=${station}`)
      .pipe(
        catchError(this.handleError('getMeRoStationDetails', MeRoStaDetails[0]))
    );
    
    return _result;
  }

  getMeSoStationDetails(menumber: string, station: string): Observable<MeSoStaDetails[]> {
    if (!menumber.trim()) {
      return of([]); 
    }
    var _result = this.http.get<MeSoStaDetails[]>(`${environment.apiEnv}/api/eco/getMeSoDetails?menumber=${menumber}&station=${station}`)
      .pipe(
        catchError(this.handleError('getMeSoStationDetails', MeSoStaDetails[0]))
    );
    
    return _result;
  }

  getRefreshTimeEoSearch(): Observable<RefreshTime[]> {
    var _result = this.http.get<RefreshTime[]>(`${environment.apiEnv}/api/eco/getRefreshTimeEoSearch`); 
    return _result
    .pipe(
      tap(_ => this.log(`got getRefreshTimeEoSearch`)),
      catchError(this.handleError<RefreshTime[]>('getRefreshTimeEoSearch', []))
    );
  }

  getRefreshTimeDash8Detail(): Observable<RefreshTime[]> {
    var _result = this.http.get<RefreshTime[]>(`${environment.apiEnv}/api/eco/getRefreshTimeDash8Detail`); 
    return _result
    .pipe(
      tap(_ => this.log(`got getRefreshTimeDash8Detail`)),
      catchError(this.handleError<RefreshTime[]>('getRefreshTimeDash8Detail', []))
    );
  }

  getRefreshTimeEoMeDetail(): Observable<RefreshTime[]> {
    var _result = this.http.get<RefreshTime[]>(`${environment.apiEnv}/api/eco/getRefreshTimeEoMeDetail`); 
    return _result
    .pipe(
      tap(_ => this.log(`got getRefreshTimeEoMeDetail`)),
      catchError(this.handleError<RefreshTime[]>('getRefreshTimeEoMeDetail', []))
    );
  }

  getReviewReasonQueuesByDash8(dash8: string, planner: string): Observable<EcoReviewReasonNotification[]> { 
    if (!dash8) {
      return of([]); 
    }
    
    var _result = this.http.get<EcoReviewReasonNotification[]>(`${environment.apiEnv}/api/eco/getReviewReasonQueuesByDash8?dash8=${dash8}&planner=${planner}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getReviewReasonQueuesByDash8 matching "${dash8}"`)),
        catchError(this.handleError<EcoReviewReasonNotification[]>('getReviewReasonQueuesByDash8', []))
      );
  }

  getReviewReasonAlertsByDash8(dash8: string, planner: string): Observable<EcoReviewReasonNotification[]> { 
    if (!dash8) {
      return of([]); 
    }
    
    var _result = this.http.get<EcoReviewReasonNotification[]>(`${environment.apiEnv}/api/eco/getReviewReasonAlertsByDash8?dash8=${dash8}&planner=${planner}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getReviewReasonAlertsByDash8 matching "${dash8}"`)),
        catchError(this.handleError<EcoReviewReasonNotification[]>('getReviewReasonAlertsByMeNumber', []))
      );
  }

  getManageAlternativeDash8(dash8: string): Observable<string[]> {
    if (!dash8.trim()) {
      return of([]); 
    }
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eco/getManageAlternativeDash8?dash8=${dash8}`)
      .pipe(
        catchError(this.handleError('getManageAlternativeDash8', []))
    );
    
    return _result;
  }
  
  getExistingDash8Step2(dash8: string): Observable<EoExistingDash8[]> {
    if (!dash8.trim()) {
      return of([]);
    }
    var _result = this.http.get<EoExistingDash8[]>(`${environment.apiEnv}/api/eco/getExistingDash8Step2?dash8=${dash8}`)
      .pipe(
        catchError(this.handleError('getExistingDash8Step2', []))
    );
    
    return _result;
  }

  getExistingMePartNumberChildren(dash8: string, mePartNumberUsed: string): Observable<EoManageAlternativePartStep2Child[]> {
    if (!dash8.trim()) {
      return of([]);
    }
    var _result = this.http.get<EoManageAlternativePartStep2Child[]>(`${environment.apiEnv}/api/eco/getExistingMePartNumberChildren?dash8=${dash8}&mePartNumberUsed=${mePartNumberUsed}`)
      .pipe(
        catchError(this.handleError('getExistingMePartNumberChildren', []))
    );
    
    return _result;
  }
  
  private log(message: string) {
    this.messageService.add(`Planner Service: ${message}`);
  }

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
