import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { tap, throwError, catchError } from "rxjs";


@Injectable({providedIn: 'root'})
export class DispatcherService {

    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    constructor(
        private http: HttpClient
    ) {}

    getDispatcherData() {
        return this.http.get<any>( this.baseUrl + '/project/a_Dispatcher.php')
    }

    saveData
    (
        DispatcherID: number,
        Dispatcher: string,
        UserID: number
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Dispatcher.php',
            {
                DispatcherID: DispatcherID,
                Dispatcher: Dispatcher,
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