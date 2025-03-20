import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";





@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}

    changePassword(UserID: string, data: ChangePassword) {
        return this.http.post( this.baseUrl + '/project/b_UserChangePassword.php?UserID=' + UserID, data);
    }
    
}


export interface ChangePassword {
    CurrentPassword: string,
    NewPassword: string,
    ConfirmNewPassword: string
}