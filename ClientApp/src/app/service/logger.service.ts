import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, Subscription, timer } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from '../models/logger';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements HttpInterceptor{
  private apisToTraceRequestTime: Array<string> = ['getRefreshTime', 'getRefreshTimeEoSearch', 'getAtaPlannerRefreshTime', 'getSMRefreshTime', 'getEOPlanners', 'getEoSupervisorNames', 'getFilteredFleets' ];
  // timerSubscription: Subscription;
  public logger$: Observable<Logger>;
  public user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime: Date = new Date();
    
    return next.handle(req).pipe(
      tap((response: HttpResponse<any>): HttpResponse<any> | HttpEvent<any> => {
        if (!(response instanceof HttpResponse) || !response.url) {
          return response;
        }

        const isUrlIncludedinWhitelist = this.apisToTraceRequestTime.some(
          (current) => response.url.includes(current)
        );

        if (!isUrlIncludedinWhitelist) {
          return response;
        }

        this.logRequestTime(req, response, startTime);
      
        return response;
      })
    );
  }

  private logRequestTime(request: HttpRequest<any>,response: HttpResponse<any>,startTime: Date) {
    if (!request || !request.url) {
      return;
    }
    this.user = this.getWithExpiry('userInfo');
    //console.log("logRequestTime user Info =>" + this.user.display_name);

    const endTime: Date = new Date();
    const duration: number = (endTime.valueOf() - startTime.valueOf()) / 1000;
    var aRequest = new Logger();

    aRequest.DURATION = duration;
    aRequest.requestURL = request.url;
    aRequest.USER_ID = this.user.employeenumber;

      var resplogger = this.logRequest(aRequest);
      resplogger.subscribe(data => { 
      // console.log(data);
      });
       
    // /**
    //  * This is just an example, feel free to add/replace any meta information you need
    //  */
    // const dataToLog: Record<string, number | string> = {
    //   duration,
    //   // params: request.params.toString(),
    //   // method: request.method,
    //   requestUrl: request.url,
    //   // this is useful in cases of redirects
    //   //responseUrl: response.url,
    // };
  }

  logRequest(req) { 
    if (!req) { 
      return;
    }

    this.logger$ = this.http.post<Logger>(`${environment.apiEnv}/api/logger/insertRequestLog`, req)
      .pipe(
        tap(() => {
          this.log(`logged "${req.requestURL}"`);
        }),
        // catchError(
        //   this.handleError('insertRequestLog failed')
        // )
        catchError(() => {
          console.log('Caught in CatchError. Throwing error')
          throw new Error(Error.toString())
        })
    );
    return this.logger$;
  }
  
  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)

    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key)
      return null
    }
    return item
  }

  private log(message: string) {
    this.messageService.add(`Logger Service: ${message}`);
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

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
