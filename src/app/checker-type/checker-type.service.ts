import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { tap, catchError, throwError } from "rxjs";


@Injectable({providedIn: 'root'})
export class CheckerTypeService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getCheckerTypeData() {
        return this.http.get<any>(this.baseUrl + '/project/a_CheckerType.php');
    }

    saveData
    (
        CheckerTypeID: number,
        CheckerType: string,
        UserID: number
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_CheckerType.php', 
            {
                CheckerTypeID: CheckerTypeID,
                CheckerType: CheckerType,
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