import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { tap, throwError, catchError } from "rxjs";



@Injectable({providedIn: 'root'})
export class WeigherService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getWeigher() {
        return this.http.get<any>( this.baseUrl + '/project/a_Weigher.php')
    }

    saveData
    (
        WeigherID: number,
        WeigherName: string,
        UserID: number
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Weigher.php',
            {
                WeigherID: WeigherID,
                WeigherName: WeigherName,
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