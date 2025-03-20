import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class CheckerService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    
    baseUrl: string = environment.backend.baseURL;

    getCheckerData() {
        return this.http.get<any>( this.baseUrl + '/project/a_checker.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Checker.php?id=' + id); 
    }

    saveData(
        CheckerID: number,
        CheckerName: string,
        // CheckerTypeID: number,
        UserID: string
    ) 
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Checker.php', 
            {
                CheckerID: CheckerID,
                CheckerName: CheckerName,
                // CheckerTypeID: CheckerTypeID,
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