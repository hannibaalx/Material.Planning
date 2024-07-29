import { Injectable } from '@angular/core';
import {HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { PingAuthenticationService } from '@techops-ui/ping-authentication';

@Injectable({
  providedIn: 'root'
})
  

export class CacheControlService implements HttpInterceptor {

  constructor(private _pingAuth: PingAuthenticationService) { }

  // intercept(req: HttpRequest<any>, next: HttpHandler) {
  //   return this._pingAuth.loggedIn$.pipe(
  //   filter(loggedIn => loggedIn),
  //   take(1),
  //   switchMap(() => next.handle(req)),
  // );
    
  
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //this._pingAuth.
    if (sessionStorage.getItem('access_token')) {
      const httpRequest = req.clone({
        headers: new HttpHeaders({
          // 'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
          'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Access-Control-Allow-Origin': '*',
          'environment': environment.apiEnv
        })
      });
    }
    // else { 
    //   this.route.navigate('/');
    // }

    // const httpRequest = req.clone({
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsImtpZCI6InJlZ3VsYXIiLCJwaS5hdG0iOiI2OG5wIn0.eyJzY29wZSI6Im9wZW5pZCIsImF1dGhvcml6YXRpb25fZGV0YWlscyI6W10sImNsaWVudF9pZCI6Ik10bFBsbmdJbnYtNzYxNzIwNC10ZXN0LWxhWWpjIiwiaXNzIjoiaHR0cHM6Ly9pZHB0ZXN0LmFhLmNvbSIsImp0aSI6InczTlNJc1kiLCJzdWIiOiIwMDIzMTg5MiIsImZpcnN0bmFtZSI6IkRleHRlciIsIjhkaWdpdF9lbXBfaWQiOiIwMDIzMTg5MiIsImVtcGxveWVlbnVtYmVyIjoiMjMxODkyIiwiRmlyc3QgTmFtZSI6IkRleHRlciIsIkVtcGxveWVlIElEIjoiMDAyMzE4OTIiLCJ1aWQiOiIwMDIzMTg5MiIsImFtcmNvbXBhbnkiOiJBQSIsImFtcmFwcG1mYSI6IjEiLCJtYW5hZ2VyX2lkIjoiMDA3NTc4MzkiLCJhbXJhY2NvdW50eXBlIjoiY29udHJhY3RvciIsImF1dGhvcml6ZSI6InllcyIsImNvc3RjZW50ZXIiOiIwNjAwLzc3MjkiLCJmaXJzdF9uYW1lIjoiRGV4dGVyIiwiaWF0IjoxNjgxMzkzMDQxLCJsYXN0X25hbWUiOiJCZW5uIiwiZ2l2ZW5fbmFtZSI6IkRleHRlciIsImxhc3RuYW1lIjoiQmVubiIsInNhbWFjY291bnRuYW1lIjoiMjMxODkyIiwiYW1yZW1wbG95ZWVzdGF0dXMiOiIzIiwiYXVkIjoiTXRsUGxuZ0ludi03NjE3MjA0LXRlc3QtbGFZamMiLCJhYWdlbXBsb3llZXN0YXR1cyI6IkEiLCJCYWRnZU5vIjoiMDAyMzE4OTIiLCJMYXN0IE5hbWUiOiJCZW5uIiwiYW1yaGlyZWRhdGUiOiIyMDE5LTEwLTE0IiwiZmFtaWx5X25hbWUiOiJCZW5uIiwiZXhwIjoxNjgxNDA3NDQxfQ.Kq9IMNMIIbV3SSqFx5-C85ryeZXYjLjhQskB2OIMUye-5PSuRzLUcBVg3khTU_wF_zWPnjhe4tELykZ4Fj5UF7W_EkVCJhQAzn-bVTAGjg-qcRPKzwRe9NYw78S2ZtzxRwOmgn_EWe6sqSZAAj01av1_malgLsxdCq6kuuufQG3g0GoFkbV7Pmvcix4ikMUJya8E3q72r_yFEmvZK7PKOVoH112mm84eCqsBxDTSKpyb8rGhr8knJAh72UONVnxIXMpSGZz-HDC_k3K9of4_EsHGc2ZaErKh9f1wNkQFH3wVFji0lgILFvC26ZUrV9-5CsRpmZxDHW_jyHkHNeWFTA',
    //     'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    //     'Pragma': 'no-cache',
    //     'Expires': '0',
    //     'Access-Control-Allow-Origin': '*',
    //     'environment': environment.apiEnv
    //   })
    // });


    return next.handle(req);
  }
}
