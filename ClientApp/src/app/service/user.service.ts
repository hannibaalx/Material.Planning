import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { PersonnelInfo } from '../models/personnel-info';
import { environment } from 'src/environments/environment';
//import { PingAuthenticationService } from "@techops-ui/ping-authentication";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly authURL = 'http://QJ07303032/auth/api/winauth';
  // private readonly winauthURL = 'http://QJ07301264/winauth/api/WinAuth';
  private options = { withCredentials: true };
  private userSubject = new Subject<any>();
  // private userSubject = this.pingAuth.profile$;
  //private personnelSubject = new Subject<PersonnelInfo>();
  private personnelSubject = new Subject<User>();
  

  private user: User[];
  userChanged = new Subject<User>();

  constructor(private http: HttpClient, private messageService: MessageService) {
  //constructor(private http: HttpClient, private messageService: MessageService, private pingAuth: PingAuthenticationService) {
    // this.pingAuth.profile$.subscribe(user => {
    //   this.user = user;
    //   console.log(this.user);
    // })

    // this.http.get<User>(this.authURL, this.options).subscribe(data => {
    //   //this.user = new User(data);
    //   //this.userChanged.next(data);
    //  this.updateUser(data);
    // });

    // this.http.get<User>(this.winauthURL, this.options)
    //   .subscribe(data => {
    //     this.updateUser(data);
    //   })
  }
 
  winAuthUserChanged(id: string): Observable<User[]> {
    if (!id.trim()) {
      return of([]); 
    }
    //http://qj07312408/auth/api/WinAuth/231892
    //http://QJ07301264/winauth/api/WinAuth/231892
    //http://QJ07301264/winauth/api/WinAuth/${id}
    var _result = this.http.get<User[]>(`http://QJ07301264/winauth/api/WinAuth/${id}`)
      .pipe(
        tap(_ => this.log(`user matching "${id}"`)),
        catchError(this.handleError('winAuthUserChanged', []))
    );
    
    return _result;
  }

  getPersonnelInfo(): Observable<User> {
    return this.personnelSubject.asObservable();
   }

  setPersonnelInfo(valObj: User){
    this.personnelSubject.next(valObj);
  }

  getTimeData(userid: number): Observable<PersonnelInfo[]> { 

    var _result = this.http.get<PersonnelInfo[]>(`${environment.apiEnv}/api/mpadmin/getTimeData`);
    return _result
      .pipe(
        tap(_ => this.log(`found current date time`)),
        catchError(this.handleError<PersonnelInfo[]>('getPersonnelInfo', []))
      );
  }

  // getPersonnelInfoData(userid: number): Observable<PersonnelInfo[]> { //teradata sandbox
  //   if (userid === null || userid < 0) {
  //     return of([]);
  //   }
    
  //   var _result = this.http.get<PersonnelInfo[]>(`${this.domain.apiEnv}/api/mpadmin/getPersonnelInfoData?userid=${userid}`);
  //   return _result
  //     .pipe(
  //       tap(_ => this.log(`found userid matching "${userid}"`)),
  //       catchError(this.handleError<PersonnelInfo[]>('getPersonnelInfo', []))
  //     );
  // }

  getADLSPersonnelInfoData(userid: number): Observable<PersonnelInfo> { //ADLS
    if (userid === null || userid < 0) {
      return of(new PersonnelInfo);
    }
    //${this.domain.apiEnv}
    //var location = window.location;
    
    
    var _result = this.http.get<PersonnelInfo>(`${environment.apiEnv}/api/MPAdmin/getADLSPersonnelInfoData?userid=${userid}`);
    return _result
      .pipe(
        tap(_ => this.log(`found userid matching "${userid}"`)),
        catchError(this.handleError<PersonnelInfo>('getPersonnelInfo', new PersonnelInfo))
      );    
  }

  //getADLSPersonnelInfoAllData(): Observable<PersonnelInfo[]> { //ADLS
   
  //  var _result = this.http.get<PersonnelInfo[]>(`${this.domain.apiEnv}/api/mpadmin/getADLSPersonnelInfoAllData`);
  //  return _result
  //    .pipe(
  //      tap(_ => this.log(`found retrieved all user data`)),
  //      catchError(this.handleError<PersonnelInfo[]>('getADLSPersonnelInfoAllData', []))
  //    );
  //}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error.error); // log to console instead
      console.error(error.message);
      console.error(result);
      alert(error.message);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`Planner Service: ${message}`);
  }

  setUser(user: any) {
    //console.log("setSmPlannerName: setting plannername " + plannerName);
    this.userSubject.next({ user });
    //this.user = user;
  }

  getUser(): Observable<any> {
    //console.log('the user is - > ' + this.userSubject);
    return this.userSubject.asObservable();
  }

  clearUser() {
    this.userSubject.next();
  }

  updateUser(userObj: User[]) {
    this.user = userObj;
    this.userChanged.next(this.user[0]);
   }

  findUser(id: string): Observable<User> {
    const url = this.authURL + '/' + id;
    return this.http.get<User>(url, this.options);
  }
}
