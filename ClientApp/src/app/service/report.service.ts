import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { tap, catchError } from 'rxjs/operators';
import { EoReportList } from '../models/eo-report-list';
import { ReportPurchaseOrderReq } from '../models/report-purchase-order-req';
import { ReportRepairOrderReq } from '../models/report-repair-order-req';
import { EoReportCancelledPoReq } from '../models/eo-report-cancelled-po-req';
import { JifReportList } from '../models/jif-report-list';
import { JifReportReq } from '../models/jif-report-req';
import { BerReportList } from '../models/ber-report-list';
import { BerReportReq } from '../models/ber-report-req';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getPoStations(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/report/getPoStations`);
    return _result
      .pipe(
        tap(_ => this.log(`getPoStations found stations`)),
        catchError(this.handleError<EoReportList[]>('getPoStations', []))
      );
  }

  getPoStatus(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/report/getPoStatus`);
    return _result
      .pipe(
        tap(_ => this.log(`getPoStatus found po status`)),
        catchError(this.handleError<EoReportList[]>('getPoStatus', []))
      );
  }

  autoSearchPurchaseOrder(value, type): Observable<string[]> {
    
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/report/autoSearchPurchaseOrder?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchPurchaseOrder found values`)),
        catchError(this.handleError<string[]>('autoSearchPurchaseOrder', []))
      );
  }

  autoSearchCancelledPurchaseOrder(value, type): Observable<string[]> {
    
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/report/autoSearchCancelledPurchaseOrder?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchCancelledPurchaseOrder found values`)),
        catchError(this.handleError<string[]>('autoSearchCancelledPurchaseOrder', []))
      );
  }

  downloadReportPurchaseOrder(req: ReportPurchaseOrderReq) {
    if (!req) {
      return; 
    }

    var _result = this.http.post<ReportPurchaseOrderReq>(`${environment.apiEnv}/api/report/downloadReportPurchaseOrder`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadReportPurchaseOrder matching "${req}"`)),
        catchError(
          this.handleError('downloadReportPurchaseOrder', new ReportPurchaseOrderReq())
        )
      );
  }

  downloadCancelledPurchaseOrder(req: EoReportCancelledPoReq) {
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoReportCancelledPoReq>(`${environment.apiEnv}/api/report/downloadCancelledPurchaseOrder`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadCancelledPurchaseOrder matching "${req}"`)),
        catchError(
          this.handleError('downloadCancelledPurchaseOrder', new EoReportCancelledPoReq())
        )
      );
  }

  getRoStations(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/report/getRoStations`);
    return _result
      .pipe(
        tap(_ => this.log(`getRoStations found stations`)),
        catchError(this.handleError<EoReportList[]>('getRoStations', []))
      );
  }

  getRoStatus(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/report/getRoStatus`);
    return _result
      .pipe(
        tap(_ => this.log(`getRoStatus found po status`)),
        catchError(this.handleError<EoReportList[]>('getRoStatus', []))
      );
  }

  autoSearchRepairOrder(value, type): Observable<string[]> {
    
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/report/autoSearchRepairOrder?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchRepairOrder found values`)),
        catchError(this.handleError<string[]>('autoSearchRepairOrder', []))
      );
  }

  downloadReportRepairOrder(req: ReportRepairOrderReq) {
    if (!req) {
      return; 
    }

    var _result = this.http.post<ReportRepairOrderReq>(`${environment.apiEnv}/api/report/downloadReportRepairOrder`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadReportRepairOrder matching "${req}"`)),
        catchError(
          this.handleError('downloadReportRepairOrder', new ReportRepairOrderReq())
        )
      );
  }

  getJifPlannerName(): Observable<JifReportList[]> {
    
    var _result = this.http.get<JifReportList[]>(`${environment.apiEnv}/api/report/getJifPlannerName`);
    return _result
      .pipe(
        tap(_ => this.log(`found getJifPlannerName`)),
        catchError(this.handleError<JifReportList[]>('getJifPlannerName', []))
      );
  }

  getBerPlannerName(): Observable<BerReportList[]> {
    
    var _result = this.http.get<BerReportList[]>(`${environment.apiEnv}/api/report/getBerPlannerName`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBerPlannerName`)),
        catchError(this.handleError<BerReportList[]>('getBerPlannerName', []))
      );
  }

  getJifStation(): Observable<JifReportList[]> {
    var _result = this.http.get<JifReportList[]>(`${environment.apiEnv}/api/report/getJifStation`);
    return _result
      .pipe(
        tap(_ => this.log(`found getJifStation`)),
        catchError(this.handleError<JifReportList[]>('getJifStation', []))
      );
  }

  getJifAutoSearch(value, type): Observable<string[]> {
    
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/report/getJifAutoSearch?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearch found values`)),
        catchError(this.handleError<string[]>('getJifAutoSearch', []))
      );
  }

  getBerAutoSearch(value, type): Observable<string[]> {
    
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/report/getBerAutoSearch?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`getBerAutoSearch found values`)),
        catchError(this.handleError<string[]>('getBerAutoSearch', []))
      );
  }

  downloadJifReport(req: JifReportReq) {
    // if (!req) {
    //   return; 
    // }

    var _result = this.http.post<JifReportReq>(`${environment.apiEnv}/api/report/downloadJifReport`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadJifReport matching "${req}"`)),
        catchError(
          this.handleError('downloadJifReport', new JifReportReq())
        )
      );
  }

  downloadBerReport(req: BerReportReq) {
    // if (!req) {
    //   return; 
    // }

    var _result = this.http.post<BerReportReq>(`${environment.apiEnv}/api/report/downloadBerReport`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadJifReport matching "${req}"`)),
        catchError(
          this.handleError('downloadJifReport', new BerReportReq())
        )
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
