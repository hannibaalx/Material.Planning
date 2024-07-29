import { MeStatus } from './../models/me-status';
import { Forecast } from '../models/forecast';
import { SparesAnalysis } from '../models/spares-analysis';
import { ExpShortage } from '../models/exp-shortage';
import { TesSummary } from '../models/tes-summary';
import { StockDetail } from '../models/stock-detail';
import { StockTotal } from '../models/stock-total';
import { Deferral } from '../models/deferral';
import { Aog } from '../models/aog';
import { Scrap } from '../models/scrap';
import { Usage } from '../models/usage';
import { Stock } from '../models/stock';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, } from 'rxjs/internal/Observable';
import { of, Subject } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';

import { PartNumber } from '../models/partnumber';
import { MessageService } from './message.service';
import { AogTotal } from '../models/aog-total';
import { DeferralTotal } from '../models/deferral-total';
import { ScrapTotal } from '../models/scrap-total';
import { MeNumber } from '../models/me-number';
import { RefreshTime } from '../models/refresh-time';
import { SaGeneralInfo } from '../models/sa-general-info';
import { SaPurchaseOrder } from '../models/sa-purchase-order';
import { SaRepairOrder } from '../models/sa-repair-order';
import { SaHistoricalData } from '../models/sa-historical-data';
import { SaTitleSection } from '../models/sa-title-section';
import { SaImqNotes } from '../models/sa-imq-notes';
import { SaOverallInventory } from '../models/sa-overall-inventory';
import { SaMetrics } from '../models/sa-metrics';
import { SaOpenDiscrepancies } from '../models/sa-open-discrepancies';
import { SaRecommondationsNotes } from '../models/sa-recommondations-notes';
import { SaRecommondationsNotesReq } from '../models/sa-recommondations-notes-req';
import { SaCommentHistory } from '../models/sa-comment-history';
import { SaChartData } from '../models/sa-chart-data';
import { OwnershipDetail } from '../models/ownership-detail';
import { ItsDetail } from '../models/its-detail';
import { ItsTotalDetail } from '../models/its-total-detail';
import { ImqHpfComment } from '../models/imq-hpf-comment';
import { MeSplitMeDetail } from '../models/me-split-me-detail';
import { DeletedInd } from '../models/deleted-ind';
import { DelaysTotal } from '../models/delays-total';
import { CancelsTotal } from '../models/cancels-total';
import { Delays } from '../models/delays';
import { Cancels } from '../models/cancels';
import { environment } from 'src/environments/environment';
import { Mpn } from '../models/mpn';
import { ExcessStatus } from '../models/excess-status';

@Injectable({
  providedIn: 'root',
})
export class PartService {

  private partNumbersUrl = 'api/partNumbers';  // URL to web api
  //private currentMEPartNumber: Observable<MeNumber[]>;

  private spareAnalysis$ = new Subject<any>();
  private _refreshNeeded$ = new Subject<void>();
  private currentMeNumber = new Subject<string>();
  private currentSearchType = new Subject<string>();
  private showChildComponents = new Subject<boolean>();
  private optimalownership$ = new Subject<any>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  setOptimalOwnership(optimalownership: number) { 
    this.optimalownership$.next({ optimalownership: optimalownership })
  }

  getOptimalOwnership(optimalownership: number) {
    return this.optimalownership$.asObservable();
  }

  setSpareAnalysis(meNumber: string) {
    this.spareAnalysis$.next({ meNumber: meNumber });
  }

  getSpareAnalysis(meNumber: string) {
    return this.spareAnalysis$.asObservable();
  }

  clearSpareAnalysis() {
    this.spareAnalysis$.next(undefined);
  }

  getCurrentMeNumber(): Observable<string> {
    //console.log("getting current smRuleSubject")
    return this.currentMeNumber.asObservable();
  }

  setCurrentMeNumber(menumber: string) {
    //console.log("smRuleSubject: setting smRuleSubject " + JSON.stringify(valObj));
    this.currentMeNumber.next(menumber);
  }

  clearCurrentMeNumber() {
    this.currentMeNumber.next(undefined);
  }

  getChildComponents(): Observable<boolean> {
    return this.showChildComponents;
  }

  setChildComponents(val: boolean) {
    this.showChildComponents.next(val);
  }

  clearChildComponents() {
    this.showChildComponents.next(undefined);
  }

  getSearchType(): Observable<string> {
    return this.currentSearchType.asObservable();
  }

  setSearchType(searchtype: string) {
    this.currentSearchType.next(searchtype);
  }

  getSpareAnalysisCommentHistoryByMeNum(menumber: string): Observable<SaCommentHistory[]> {
    if (!menumber) { //zero stock
      return of([]);
    }

    var _result = this.http.get<SaCommentHistory[]>(`${environment.apiEnv}/api/part/getSpareAnalysisCommentHistoryByMeNum?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getSpareAnalysisCommentHistoryByMeNum matching ${menumber}`)),
        catchError(this.handleError<SaCommentHistory[]>('getSpareAnalysisCommentHistoryByMeNum', []))
      );
  }

  deleteSpareAnalysisComment(req) {
    var _result = this.http.post<SaCommentHistory>(`${environment.apiEnv}/api/part/deleteSpareAnalysisComment`, req)
    return _result
      .pipe(
        tap(() => {
          this.log(`deleteSpareAnalysisComment matching ID: "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('deleteSpareAnalysisComment', new SaCommentHistory())
        )
      );
  }

  updateSpareAnalysisCommentHistory(req) {
    return this.http.post<SaCommentHistory>(`${environment.apiEnv}/api/part/updateSpareAnalysisCommentHistory`, req)
      .pipe(
        tap(() => {
          this.log(`found updateSpareAnalysisCommentHistory matching "${req.ID}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError('updateSpareAnalysisCommentHistory', new SaCommentHistory())
        )
      );
  }

  getSAGeneralInfo(menumber: string): Observable<SaGeneralInfo[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaGeneralInfo[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=geninfo`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaGeneralInfo[]>('getSAGeneralInfo', []))
      );
  }

  getPurchaseOrder(menumber: string): Observable<SaPurchaseOrder[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaPurchaseOrder[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=po`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaPurchaseOrder[]>('getPurchaseOrder', []))
      );
  }

  getRepairOrder(menumber: string): Observable<SaRepairOrder[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaRepairOrder[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=ro`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaRepairOrder[]>('getRepairOrder', []))
      );
  }

  getHistoricalData(menumber: string): Observable<SaHistoricalData[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaHistoricalData[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=histdata`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaHistoricalData[]>('getHistoricalData', []))
      );
  }

  getTitleSection(menumber: string): Observable<SaTitleSection[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaTitleSection[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=title`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaTitleSection[]>('getTitleSection', []))
      );
  }

  getImqNotes(menumber: string): Observable<SaImqNotes[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaImqNotes[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=imqnotes`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaImqNotes[]>('getImqNotes', []))
      );
  }

  getOverallInventory(menumber: string): Observable<SaOverallInventory[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaOverallInventory[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=oi`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaOverallInventory[]>('getOverallInventory', []))
      );
  }

  getMetrics(menumber: string): Observable<SaMetrics[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaMetrics[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=metrics`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaMetrics[]>('getMetrics', []))
      );
  }

  getOpenDiscrepancies(menumber: string): Observable<SaOpenDiscrepancies[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaOpenDiscrepancies[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=od`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaOpenDiscrepancies[]>('getOpenDiscrepancies', []))
      );
  }

  getRecommendationsNotes(menumber: string): Observable<SaRecommondationsNotes[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    var _result = this.http.get<SaRecommondationsNotes[]>(`${environment.apiEnv}/api/part/getSAData?menumber=${menumber}&type=recommendnotes`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaRecommondationsNotes[]>('getRecommendationsNotes', []))
      );
  }

  getSparesAnalysisChart(menumber: string): Observable<SaChartData> {
    if (!menumber.trim()) {
      return null;
    }

    var _result = this.http.get<SaChartData>(`${environment.apiEnv}/api/part/getSparesAnalysisChart?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found menumber matching "${menumber}"`)),
        catchError(this.handleError<SaChartData>('getSparesAnalysisChart', null))
      );
  }

  getOwnershipDetailByMeNum(menumber: string, typefilter?: string, orderby?: string, sorttype?: string): Observable<OwnershipDetail[]> {
    if (!menumber.trim()) {
      return of([]);
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<OwnershipDetail[]>(`${environment.apiEnv}/api/part/getOwnershipDetailByMeNum?menumber=${menumber}&typefilter=${typefilter}&orderby=${orderby}&sorttype=${sorttype}`);
    //var _result = this.http.get<OwnershipDetail[]>(`https://im-api.maverick.aa.com/api/part/getOwnershipDetailByMeNum?menumber=${menumber}&orderby=${orderby}&sorttype=${sorttype}`);
    console.log("environment ==>" + environment.apiEnv);
    return _result
      .pipe(
        tap(_ => this.log(`found ownership detail - menumber matching "${menumber}"`)),
        catchError(this.handleError<OwnershipDetail[]>('getOwnershipDetailByMeNum', []))
      );
  }

  insertSpareAnalysisComment(comments: SaRecommondationsNotesReq) {
    if (!comments) {
      return;
    }

    var _result = this.http.post<SaRecommondationsNotesReq>(`${environment.apiEnv}/api/part/insertSpareAnalysisComment`, comments)
    return _result
      .pipe(
        tap(() => {
          this.log(`found insertSpareAnalysisComment matching "${comments.ME_PART_NUMBER}"`);
          this._refreshNeeded$.next();
        }),
        catchError(
          this.handleError(`insertSpareAnalysisComment "${comments.ME_PART_NUMBER}"`, new SaRecommondationsNotesReq())
        )
      );
  }

  getPartNumbers(): Observable<PartNumber[]> {
    return this.http.get<PartNumber[]>(this.partNumbersUrl)
      .pipe(
        tap(_ => this.log('fetched partnumbers')),
        catchError(this.handleError<PartNumber[]>('getPartNumbers', []))
      );
  }

  getPartNumber(id: number): Observable<PartNumber> {
    const url = `${this.partNumbersUrl}/${id}`;
    this.messageService.add('part.service.getPartNumber --> getting id: ' + id);
    return this.http.get<PartNumber>(url).pipe(
      tap(_ => this.log(`fetched partnumber id=${id}`)),
      catchError(this.handleError<PartNumber>(`getPartNumbers id=${id}`))
    );
  }

  /* GET parts whose name contains search term */
  searchParts(partnum: string): Observable<PartNumber[]> {
    if (!partnum) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<PartNumber[]>(`${environment.apiEnv}/api/part/getPartAttributes?menumber=${partnum}`);
    return _result
      .pipe(
        tap(() => {
          this.log(`found getPartAttributes matching "${partnum}"`)
          //this._refreshNeeded$.next();
        }),
        catchError(this.handleError<PartNumber[]>('getPartAttributes', []))
      );
  }

  searchMeByMPN(partnum: string): Observable<PartNumber[]> {
    if (!partnum.trim()) {
      return of([]);
    }

    var _result = this.http.get<PartNumber[]>(`${environment.apiEnv}/api/part/searchMeByMPN?mpn=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found searchMeByMPN matching "${partnum}"`)),
        catchError(this.handleError<PartNumber[]>('searchMeByMPN', []))
      );
  }

  getStock(partnum: string, orderby?: string, sorttype?: string): Observable<Stock[]> {

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    if (!partnum) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<Stock[]>(`${environment.apiEnv}/api/part/getStock?menumber=${partnum}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found stock number matching "${partnum}"`)),
        catchError(this.handleError<Stock[]>('getStock', []))
      );
  }

  getRefreshTime(): Observable<RefreshTime[]> {
    var _result = this.http.get<RefreshTime[]>(`${environment.apiEnv}/api/part/getRefreshTime`);
    return _result
      .pipe(
        tap(_ => this.log(`got refreshtime`)),
        catchError(this.handleError<RefreshTime[]>('getRefreshTime', []))
      );
  }

  getMeStatus(val: string) {
    if (!val) {
      return of(null);
    }

    var _result = this.http.get<MeStatus[]>(`${environment.apiEnv}/api/part/getMeStatus?menumber=${val}`);
    return _result
      .pipe(
        tap(_ => this.log(`got getMeStatus ${val}`)),
        catchError(this.handleError<MeStatus[]>('getMeStatus', null))
      );
  }

  getStockTotals(partnum: string): Observable<StockTotal[]> {
    if (!partnum) {
      return of(null); // if no search term, return empty partnumber null.
    }

    var _result = this.http.get<StockTotal[]>(`${environment.apiEnv}/api/part/getStockTotals?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found stock totals matching "${partnum}"`)),
        catchError(this.handleError<StockTotal[]>('stockTotal', null))
      );
  }

  getItsDetails(partnum: string, station: string, orderby?: string, sorttype?: string): Observable<ItsDetail[]> {
    if (!partnum) {
      return of(null);
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<ItsDetail[]>(`${environment.apiEnv}/api/part/getItsDetails?menumber=${partnum}&station=${station}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found its detail matching "${partnum}"`)),
        catchError(this.handleError<ItsDetail[]>('itsDetail', null))
      );
  }

  getItsTotalDetails(partnum: string, orderby?: string, sorttype?: string): Observable<ItsTotalDetail[]> {
    if (!partnum) {
      return of(null);
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<ItsTotalDetail[]>(`${environment.apiEnv}/api/part/getItsTotalDetails?menumber=${partnum}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found its totals matching "${partnum}"`)),
        catchError(this.handleError<ItsTotalDetail[]>('getItsTotalDetails', null))
      );
  }

  getStockDetails(partnum: string, station: string, category: string, reqpostatus: string, orderby?: string, sorttype?: string): Observable<StockDetail[]> {
    if (!partnum) {
      return of(null); // if no search term, return empty partnumber null.
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<StockDetail[]>(`${environment.apiEnv}/api/part/getStockDataDetail?menumber=${partnum}&station=${station}&category=${category}&orderby=${orderby}&sorttype=${sorttype}&reqpostatus=${reqpostatus}`);
    return _result
      .pipe(
        tap(_ => this.log(`found stock totals matching "${partnum}"`)),
        catchError(this.handleError<StockDetail[]>('stockTotal', null))
      );
  }

  getStockTotalDetails(partnum: string, category: string, reqpostatus: string, orderby?: string, sorttype?: string): Observable<StockDetail[]> {
    if (!partnum) {
      return of(null); // if no search term, return empty partnumber null.
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<StockDetail[]>(`${environment.apiEnv}/api/part/getStockDataTotalDetail?menumber=${partnum}&category=${category}&reqpostatus=${reqpostatus}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found stock totals matching "${partnum}"`)),
        catchError(this.handleError<StockDetail[]>('stockTotalDetails', null))
      );
  }

  getUsage(partnum: string, rangetype: string, usagetype?: string): Observable<Usage[]> {
    if (!partnum) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<Usage[]>(`${environment.apiEnv}/api/part/getUsage?menumber=${partnum}&rangetype=${rangetype}&usageType=${usagetype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found usage number matching "partnum ${partnum} rangetype ${rangetype} usageType ${usagetype}"`)),
        catchError(this.handleError<Usage[]>('getUsage', []))
      );
  }

  getDeletedMeNumber(menumber: string): Observable<DeletedInd[]> {
    if (!menumber) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<DeletedInd[]>(`${environment.apiEnv}/api/part/getDeletedMeNumber?menumber=${menumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found mennuber number matching "menumber=${menumber}`)),
        catchError(this.handleError<DeletedInd[]>('getDeletedMeNumber', []))
      );
  }

  getForecast(partnum: string, rangetype: string): Observable<Forecast[]> {
    if (!partnum) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<Forecast[]>(`${environment.apiEnv}/api/part/getUsage?menumber=${partnum}&rangetype=${rangetype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found usage number matching "${partnum}"`)),
        catchError(this.handleError<Forecast[]>('getUsage', []))
      );
  }

  getScrap(partnum: string): Observable<Scrap[]> {
    if (!partnum) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<Scrap[]>(`${environment.apiEnv}/api/part/getScrap?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found scrap number matching "${partnum}"`)),
        catchError(this.handleError<Scrap[]>('getScrap', []))
      );
  }

  getScrapTotals(partnum: string): Observable<ScrapTotal[]> {
    if (!partnum) {
      return of(null); // if no search term, return empty partnumber null.
    }

    var _result = this.http.get<ScrapTotal[]>(`${environment.apiEnv}/api/part/getScrapTotals?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found aog totals matching "${partnum}"`)),
        catchError(this.handleError<ScrapTotal[]>('stockTotal', null))
      );
  }

  getExcessStatus(meNumber: string): Observable<ExcessStatus[]> {
    if (!meNumber) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<ExcessStatus[]>(`${environment.apiEnv}/api/part/getExcessStatus?meNumber=${meNumber}`);
    return _result
      .pipe(
        tap(_ => this.log(`found excessStatus number matching "${meNumber}"`)),
        catchError(this.handleError<ExcessStatus[]>('getExcessStatus', []))
      );
  }

  getAOG(partnum: string): Observable<Aog[]> {
    if (!partnum) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<Aog[]>(`${environment.apiEnv}/api/part/getAog?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found AOG number matching "${partnum}"`)),
        catchError(this.handleError<Aog[]>('getAog', []))
      );
  }

  getAogTotals(partnum: string): Observable<AogTotal[]> {
    if (!partnum.trim()) {
      return of(null); // if no search term, return empty partnumber null.
    }

    var _result = this.http.get<AogTotal[]>(`${environment.apiEnv}/api/part/getAogTotals?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found aog totals matching "${partnum}"`)),
        catchError(this.handleError<AogTotal[]>('stockTotal', null))
      );
  }

  getDeferral(partnum: string): Observable<Deferral[]> {
    if (!partnum.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<Deferral[]>(`${environment.apiEnv}/api/part/getDeferral?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found deferral number matching "${partnum}"`)),
        catchError(this.handleError<Deferral[]>('getDeferral', []))
      );
  }

  getDeferralTotals(partnum: string): Observable<DeferralTotal[]> {
    if (!partnum.trim()) {
      return of(null); // if no search term, return empty partnumber null.
    }

    var _result = this.http.get<DeferralTotal[]>(`${environment.apiEnv}/api/part/getDeferralTotals?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found deferral totals matching "${partnum}"`)),
        catchError(this.handleError<DeferralTotal[]>('stockTotal', null))
      );
  }

  getDelays(partnum: string): Observable<Delays[]> {
    if (!partnum.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<Delays[]>(`${environment.apiEnv}/api/part/getDelays?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found delays number matching "${partnum}"`)),
        catchError(this.handleError<Delays[]>('getDelays', []))
      );
  }

  getDelaysTotals(partnum: string): Observable<DelaysTotal[]> {
    if (!partnum.trim()) {
      return of(null);
    }

    var _result = this.http.get<DelaysTotal[]>(`${environment.apiEnv}/api/part/getDelaysTotals?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found deferral totals matching "${partnum}"`)),
        catchError(this.handleError<DelaysTotal[]>('getDelaysTotals', null))
      );
  }

  getCancels(partnum: string): Observable<Cancels[]> {
    if (!partnum.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<Cancels[]>(`${environment.apiEnv}/api/part/getCancels?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getCancels number matching "${partnum}"`)),
        catchError(this.handleError<Cancels[]>('getCancels', []))
      );
  }

  getCancelsTotals(partnum: string): Observable<CancelsTotal[]> {
    if (!partnum.trim()) {
      return of(null);
    }

    var _result = this.http.get<CancelsTotal[]>(`${environment.apiEnv}/api/part/getCancelsTotals?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found deferral totals matching "${partnum}"`)),
        catchError(this.handleError<CancelsTotal[]>('getCancelsTotals', null))
      );
  }

  getSesSummary(partnum: string): Observable<TesSummary[]> {
    if (!partnum.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<TesSummary[]>(`${environment.apiEnv}/api/part/getTesSummary?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found tessummary number matching "${partnum}"`)),
        catchError(this.handleError<TesSummary[]>('getSesSummary', []))
      );
  }

  getSesDetail(partnum: string): Observable<ExpShortage[]> {
    if (!partnum.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<ExpShortage[]>(`${environment.apiEnv}/api/part/getTotalExpShortage?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found expshortage number matching "${partnum}"`)),
        catchError(this.handleError<ExpShortage[]>('getSesDetail', []))
      );
  }

  getSparesAnalysis(partnum: string): Observable<SparesAnalysis[]> {
    if (!partnum.trim()) {
      return of([]); // if no search term, return empty partnumber array.
    }

    var _result = this.http.get<SparesAnalysis[]>(`${environment.apiEnv}/api/part/getSparesAnalysis?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`found spare analysis matching "${partnum}"`)),
        catchError(this.handleError<SparesAnalysis[]>('getSparesAnalysis', []))
      );
  }

  getImqHpfDetail(value: string, commenttype: string, orderby?: string, sorttype?: string) {
    if (!value) {
      return of([]);
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<ImqHpfComment[]>(`${environment.apiEnv}/api/part/getImqHpfDetail?value=${value.trim()}&commenttype=${commenttype}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getImqHpfDetail matching dash8: ${value}`)),
        catchError(this.handleError<ImqHpfComment[]>('getImqHpfDetail', []))
      );
  }

  getSplitMEDetail(value: string, orderby?: string, sorttype?: string) {
    if (!value) {
      return of([]);
    }

    orderby = orderby === undefined ? '' : orderby;
    sorttype = sorttype === undefined ? '' : sorttype;

    var _result = this.http.get<MeSplitMeDetail[]>(`${environment.apiEnv}/api/part/getSplitMEDetail?value=${value.trim()}&orderby=${orderby}&sorttype=${sorttype}`);
    return _result
      .pipe(
        tap(_ => this.log(`found getSplitMEDetail matching me_part_number: ${value}`)),
        catchError(this.handleError<MeSplitMeDetail[]>('getSplitMEDetail', []))
      );
  }

  getAllMpn(partnum: string): Observable<Mpn[]> {
    if (!partnum.trim()) {
      return of(null); // if no search term, return empty partnumber null.
    }

    var _result = this.http.get<Mpn[]>(`${environment.apiEnv}/api/part/getAllMpn?menumber=${partnum}`);
    return _result
      .pipe(
        tap(_ => this.log(`pulled all MPNs for "${partnum}"`)),
        catchError(this.handleError<Mpn[]>('getAllMpn', null))
      );
  }

  /** Log a PartService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PartService: ${message}`);
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
