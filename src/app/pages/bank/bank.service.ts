import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { tap, catchError, throwError } from "rxjs";


@Injectable({providedIn: 'root'})
export class BankService {

    constructor( private http: HttpClient){}

    
    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    
    baseUrl: string = environment.backend.baseURL;

    getData() {
        return this.http.get<any>( this.baseUrl + '/project/a_bank.php');
    }

    saveData
    (
        BankID: string,
        Bank: string,
        BankName: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_bank.php',
            {
                BankID: BankID,
                Bank: Bank,
                BankName: BankName,
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