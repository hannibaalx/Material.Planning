import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from "rxjs";
import { UserRole } from "../models/user-role";
import { environment } from "src/environments/environment";
import { ROLES } from '../models/roles';

@Injectable({
    providedIn: 'root'
})
    
export class UserRoleService {
    // Simulate user roles (replace with actual user roles from authentication)
    private userRoles: string[] = ['Admin','Viewer','Supervisor','User'];


    addUserIdFromRole(userId: string, imRole: string, currentuser: string) {
        return this.http.get<UserRole[]>(`${environment.apiEnv}/api/UserRole/addUserIdToRole?userId=${userId}&imRole=${imRole}&currentuser=${currentuser}`);
    }

    deleteUserIdFromRole(userId: string, imRole: string) {
        return this.http.get<UserRole[]>(`${environment.apiEnv}/api/UserRole/deleteUserIdFromRole?userId=${userId}&imRole=${imRole}`);
    }

    constructor(private http: HttpClient) { }

    getUserRole(userId: string): Observable<UserRole[]> {
        return this.http.get<UserRole[]>(`${environment.apiEnv}/api/UserRole/getUserRole?userId=${userId}`);
    }

    getAllUserRoles(): Observable<UserRole[]>{
        return this.http.get<UserRole[]>(`${environment.apiEnv}/api/UserRole/getAllUserRoles`);
    }

    getIsAdminUserRole(userId: string): Observable<string> {
        let userval: Observable<string>;
        userval = this.http.get<string>(`${environment.apiEnv}/api/UserRole/getIsAdminUserRole?userId=${userId}`);
        return userval;
     }
}
