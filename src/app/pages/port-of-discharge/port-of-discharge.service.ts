import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap, catchError, throwError } from "rxjs";
import { environment } from "src/app/environments/environment";


@Injectable({providedIn: 'root'})
export class PortOfDischargeService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getData() {
        return this.http.get<any>(this.baseUrl + '/project/a_PortOfDischarge.php')
    }

    saveData
    (
        PortOfDischargeID: number,
        PortOfDischarge: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_PortOfDischarge.php',
            {
                PortOfDischargeID: PortOfDischargeID,
                PortOfDischarge: PortOfDischarge,
                UserID: UserID,
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