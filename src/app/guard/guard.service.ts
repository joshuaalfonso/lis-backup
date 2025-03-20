import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { catchError, tap, throwError } from "rxjs";




@Injectable({providedIn: 'root'})
export class GuardService {

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}

    getAllGuard() {
        return this.http.get<any>(this.baseUrl + '/project/a_guard.php');
    }

    saveData
    (
        GuardID: string,
        GuardName: string,
        UserID: string
    ) {
        return this.http.post
        (
            this.baseUrl + '/project/b_Guard.php',
            {
                GuardID: GuardID,
                GuardName: GuardName,
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