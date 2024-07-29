import { EoReportReq } from './../models/eo-report-req';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EoReportList } from './../models/eo-report-list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { tap, catchError } from 'rxjs/operators';
import { EoReportPartShortageReq } from '../models/eo-report-part-shortage-req';
import { EoReportRepairOrderReq } from '../models/eo-report-repair-order-req';
import { EoReportPurchaseOrderReq } from '../models/eo-report-purchase-order-req';
import { EoInventoryReportReq } from '../models/eo-inventory-report-req';
import { EoReportBomInventoryReq } from '../models/eo-report-bom-inventory-req';
import { EoReportPoDiscrepancyReq } from '../models/eo-report-po-discrepancy-req';
import { EoReportEcoStationReadinessReq } from '../models/eo-report-eco-station-readiness-req';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EoReportService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getBOMInventoryPlanners(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getBOMInventoryPlanners`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOMInventoryPlanners`)),
        catchError(this.handleError<EoReportList[]>('getBOMInventoryPlanners', []))
      );
  }

  getBOMInventoryRequirement(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getBOMInventoryRequirement`);
    return _result
      .pipe(
        tap(_ => this.log(`found getBOMInventoryRequirement`)),
        catchError(this.handleError<EoReportList[]>('getBOMInventoryRequirement', []))
      );
  }

  autoSearchBOMInventory(value, type): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/autoSearchBOMInventory?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchBOMInventory found values`)),
        catchError(this.handleError<string[]>('autoSearchBOMInventory', []))
      );
  }

  getPartShortagePlanners(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getPartShortagePlanners`);
    return _result
      .pipe(
        tap(_ => this.log(`found plannerNames`)),
        catchError(this.handleError<EoReportList[]>('getPlannerNames', []))
      );
  }

  getPartShortageRequirement(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getPartShortageRequirement`);
    return _result
      .pipe(
        tap(_ => this.log(`found getPartShortageRequirement`)),
        catchError(this.handleError<EoReportList[]>('getPartShortageRequirement', []))
      );
  }

  autoSearchPartShortage(value, type): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/autoSearchPartShortage?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchPartShortage found values`)),
        catchError(this.handleError<string[]>('autoSearchPartShortage', []))
      );
  }

  autoSearchRepairOrder(value, type): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/autoSearchRepairOrder?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchRepairOrder found values`)),
        catchError(this.handleError<string[]>('autoSearchRepairOrder', []))
      );
  }

  autoSearchPurchaseOrder(value, type): Observable<string[]> {
    
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/autoSearchPurchaseOrder?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchPurchaseOrder found values`)),
        catchError(this.handleError<string[]>('autoSearchPurchaseOrder', []))
      );
  }

  autoSearchEcoStationReadiness(value, type): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/autoSearchEcoStationReadiness?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchEcoStationReadiness found values`)),
        catchError(this.handleError<string[]>('autoSearchEcoStationReadiness', []))
      );
  }

  getFullSchedulePlannerNames(): Observable<EoReportList[]> {
    
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getFullSchedulePlanners`);
    return _result
      .pipe(
        tap(_ => this.log(`found plannerNames`)),
        catchError(this.handleError<EoReportList[]>('getPlannerNames', []))
      );
  }

  getFleets(): Observable<EoReportList[]> {
    
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getFleets`);
    return _result
      .pipe(
        tap(_ => this.log(`found fleets`)),
        catchError(this.handleError<EoReportList[]>('getFleets', []))
      );
  }

  getStations(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getStations`);
    return _result
      .pipe(
        tap(_ => this.log(`found stations`)),
        catchError(this.handleError<EoReportList[]>('getStations', []))
      );
  }

  getRoStations(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getRoStations`);
    return _result
      .pipe(
        tap(_ => this.log(`getRoStations found stations`)),
        catchError(this.handleError<EoReportList[]>('getRoStations', []))
      );
  }

  getRoStatus(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getRoStatus`);
    return _result
      .pipe(
        tap(_ => this.log(`getRoStatus found ro status`)),
        catchError(this.handleError<EoReportList[]>('getRoStatus', []))
      );
  }

  getPoStations(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getPoStations`);
    return _result
      .pipe(
        tap(_ => this.log(`getPoStations found stations`)),
        catchError(this.handleError<EoReportList[]>('getPoStations', []))
      );
  }

  getPoStatus(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getPoStatus`);
    return _result
      .pipe(
        tap(_ => this.log(`getPoStatus found po status`)),
        catchError(this.handleError<EoReportList[]>('getPoStatus', []))
      );
  }

  // getCarriers(): Observable<EoReportList[]> {
    
  //   var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getCarriers`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found carriers`)),
  //       catchError(this.handleError<EoReportList[]>('getCarriers', []))
  //     );
  // }

  getDataResource(): Observable<EoReportList[]> {
    
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getDataResource`);
    return _result
      .pipe(
        tap(_ => this.log(`found data resource`)),
        catchError(this.handleError<EoReportList[]>('getDataResource', []))
      );
  }

  getAutoSearch(value, type): Observable<string[]> {
    
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/getAutoSearch?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearch found values`)),
        catchError(this.handleError<string[]>('getAutoSearch', []))
      );
  }

  getECOStationPlanners(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getECOStationPlanners`);
    return _result
      .pipe(
        tap(_ => this.log(`found ecoStationPlannerNames`)),
        catchError(this.handleError<EoReportList[]>('getECOStationPlanners', []))
      );
  }

  getEcoStationDataSource(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getEcoStationDataSource`);
    return _result
      .pipe(
        tap(_ => this.log(`found getEcoStationDataSource`)),
        catchError(this.handleError<EoReportList[]>('getEcoStationDataSource', []))
      );
  }

  downloadReport(req: EoReportReq) {//for full schedule
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoReportReq>(`${environment.apiEnv}/api/eoreport/downloadReport`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadReport matching "${req}"`)),
        catchError(
          this.handleError('downloadReport', new EoReportReq())
        )
      );
  }

  downloadReportBOMInventory(req: EoReportBomInventoryReq) {//for part shortage
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoReportBomInventoryReq>(`${environment.apiEnv}/api/eoreport/downloadReportBOMInventory`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadReportBOMInventory matching "${req}"`)),
        catchError(
          this.handleError('downloadReportBOMInventory', new EoReportBomInventoryReq())
        )
      );
  }
  
  downloadReportPartShortage(req: EoReportPartShortageReq) {//for part shortage
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoReportPartShortageReq>(`${environment.apiEnv}/api/eoreport/downloadReportPartShortage`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadReportPartShortage matching "${req}"`)),
        catchError(
          this.handleError('downloadReportPartShortage', new EoReportPartShortageReq())
        )
      );
  }
  
  downloadReportRepairOrder(req: EoReportRepairOrderReq) {//for repair order
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoReportRepairOrderReq>(`${environment.apiEnv}/api/eoreport/downloadReportRepairOrder`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadReportRepairOrder matching "${req}"`)),
        catchError(
          this.handleError('downloadReportRepairOrder', new EoReportRepairOrderReq())
        )
      );
  }
  
  downloadReportPurchaseOrder(req: EoReportPurchaseOrderReq) {//for repair order
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoReportPurchaseOrderReq>(`${environment.apiEnv}/api/eoreport/downloadReportPurchaseOrder`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadReportPurchaseOrder matching "${req}"`)),
        catchError(
          this.handleError('downloadReportPurchaseOrder', new EoReportPurchaseOrderReq())
        )
      );
  }
  
  downloadEoInventoryReport(req: EoInventoryReportReq) { 
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoInventoryReportReq>(`${environment.apiEnv}/api/eoreport/downloadEoInventoryReport`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadEoInventoryReport matching "${req}"`)),
        catchError(
          this.handleError('downloadEoInventoryReport', new EoInventoryReportReq())
        )
      );
  }

  downloadReportEcoStationReadiness(req: EoReportEcoStationReadinessReq) {//for eco station readiness report
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoReportEcoStationReadinessReq>(`${environment.apiEnv}/api/eoreport/downloadReportEcoStationReadiness`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadReportEcoStationReadiness matching "${req}"`)),
        catchError(
          this.handleError('downloadReportEcoStationReadiness', new EoReportEcoStationReadinessReq())
        )
      );
  }

  getPoDiscrepancyPlanners(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getPoDiscrepancyPlanners`);
    return _result
      .pipe(
        tap(_ => this.log(`getPoDiscrepancyPlanners found po planners`)),
        catchError(this.handleError<EoReportList[]>('getPoDiscrepancyPlanners', []))
      );
  }

  getRoutingGroups(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getRoutingGroups`);
    return _result
      .pipe(
        tap(_ => this.log(`getRoutingGroups found routing groups`)),
        catchError(this.handleError<EoReportList[]>('getRoutingGroups', []))
      );
  }

  getExceptionReasons(): Observable<EoReportList[]> {
    var _result = this.http.get<EoReportList[]>(`${environment.apiEnv}/api/eoreport/getExceptionReasons`);
    return _result
      .pipe(
        tap(_ => this.log(`getExceptionReasons found exceptions`)),
        catchError(this.handleError<EoReportList[]>('getExceptionReasons', []))
      );
  }

  autoSearchPoDiscrepancy(value, type): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/autoSearchPoDiscrepancy?value=${value}&type=${type}`);
    return _result
      .pipe(
        tap(_ => this.log(`autoSearchPoDiscrepancy found values`)),
        catchError(this.handleError<string[]>('autoSearchPoDiscrepancy', []))
      );
  }

  downloadPoDiscrepancyReport(req: EoReportPoDiscrepancyReq) {//for repair order
    if (!req) {
      return; 
    }

    var _result = this.http.post<EoReportPoDiscrepancyReq>(`${environment.apiEnv}/api/eoreport/downloadPoDiscrepancyReport`, req)
    return _result
      .pipe(
        tap(_ => this.log(`downloadPoDiscrepancyReport matching "${req}"`)),
        catchError(
          this.handleError('downloadPoDiscrepancyReport', new EoReportPoDiscrepancyReq())
        )
      );
  }

  getFilteredDash8s(): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/getFilteredDash8s`);
    return _result
      .pipe(
        tap(_ => this.log(`found getFilteredDash8s`)),
        catchError(this.handleError<string[]>('getFilteredDash8s', []))
      );
  }

  getFilteredEoNumbers(): Observable<string[]> {
    var _result = this.http.get<string[]>(`${environment.apiEnv}/api/eoreport/getFilteredEoNumbers`);
    return _result
      .pipe(
        tap(_ => this.log(`found getFilteredEoNumbers`)),
        catchError(this.handleError<string[]>('getFilteredEoNumbers', []))
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
