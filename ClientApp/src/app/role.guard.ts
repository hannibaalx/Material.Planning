import { UserService } from './service/user.service';
import { UserRoleService } from 'src/app/service/userrole.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ROLES } from './models/roles';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  _userRoleFromService: string;
  _role: string;
  _user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role: "" };
  constructor(private userRoleService: UserRoleService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRole : string[] = route.data.requiredRole;
    this._user = JSON.parse(localStorage.getItem('userInfo')); //userInfo
    //Add a check for feature flag
   //if feature flag is yes, then return true 
    if (requiredRole.includes(this._user.role))
    {
      return true;
    }
    else
    {
      this.router.navigate(['/ata']);
      return false;
      }
  }
}
