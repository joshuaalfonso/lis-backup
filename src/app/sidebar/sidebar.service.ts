import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";



@Injectable({providedIn: 'root'})
export class SidebarService {

    constructor(private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getUserAccessRequest(UserID: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_UserAccess.php?UserID=' + UserID)
    }

}