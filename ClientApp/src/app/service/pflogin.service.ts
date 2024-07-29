import { Injectable } from '@angular/core';
import { pflogin } from '../models/pflogin';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PingAuthenticationService } from '@techops-ui/ping-authentication';

@Injectable({
  providedIn: 'root'
})
export class PfloginService {
  logOutUrl$: any;
  private pingAuth: PingAuthenticationService;

  constructor() { }

  renewSession() { 
    this.pingAuth.renewSession();
  }

  getPFLoginSignOut(): any {
    this.pingAuth.profile$.subscribe(() => {
      {
        this.logOutUrl$ = combineLatest([this.pingAuth.profile$, this.pingAuth.identity$]).pipe(
        map(([profile, identity]) => {
          console.log(`https://pfloginapp.cloud.aa.com/api/logout?id_token_hint=${identity.id_token}&TargetResource=${encodeURIComponent(window.location.origin)}`);
          //return `https://pfloginapp.cloud.aa.com/api/logout?id_token_hint=${identity.id_token}&TargetResource=${encodeURIComponent(window.location.origin)}`;
          return `https://pfloginapp.cloud.aa.com/api/logout?id_token_hint=${identity.id_token}`;
          //return `${profile.iss}/idp/startSLO.ping?id_token_hint=${identity.id_token}&TargetResource=${encodeURIComponent(window.location.origin)}`;
          })
        ); 
      }
    })
  }
  
}
