import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  DecodeToken(token: string): string {
    //return jwt_decode(token);
    //console.log(token);
    return token;
    }
}

