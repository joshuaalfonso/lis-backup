import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";





@Injectable({
    providedIn: 'root'
})
export class AccountDetailsService {

    
    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    
    baseUrl: string = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}

    getUserDetails(UserID: string) {
        // return this.http.get<any>( `${this.apiUrl}/project/a_UserProfile.php?UserID=${UserID}` );
        return this.http.get<any>( this.baseUrl + '/project/a_UserProfile.php?UserID=' + UserID);
    }

    updateUserDetails(data: AccountDetails) {
        // return this.http.post( `${this.apiUrl}/project/b_UserAccount.php`, data );
        return this.http.post( this.baseUrl + '/project/b_UserProfile.php', data);
    }

    changePassword(data: any) {
        return this.http.post( this.baseUrl + '/project/b_UserChangePassowrd.php', data);
    }

}

export interface AccountDetails {
    UserID: string,
    AvatarUrl: number,
    UName: string,
    Name: string,
    EmailAdd: string,
    ContactNo: string
}