import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError, throwError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class SalesAgentService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getSalesAgentData(){
        return this.http.get<any>( this.baseUrl + '/project/a_SalesAgent.php');
    }

    saveData
    (
        SalesAgentID: string,
        SalesAgent: string,
        ContactNo: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_SalesAgent.php',
            {
                SalesAgentID: SalesAgentID,
                SalesAgent: SalesAgent,
                ContactNo: ContactNo,
                UserID: UserID
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                return resData;
            })
        );
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        return throwError(errorMessage);
    }

}