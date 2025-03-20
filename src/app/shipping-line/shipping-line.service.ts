import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class ShippingLineService {

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    constructor( private http: HttpClient){}

    getShippingLineData() {
        return this.http.get<any>( this.baseUrl + '/project/a_ShippingLine.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Shippingline.php?id=' + id); 
    }

    saveData
    (
        ShippingLineID: string,
        ShippingLine: string,
        ContactPerson: string,
        ContactNumber: string,
        UserID: string
    ) {
        return this.http.post
        (
            this.baseUrl + '/project/b_ShippingLine.php',
            {
                ShippingLineID: ShippingLineID,
                ShippingLine: ShippingLine,
                ContactPerson: ContactPerson,
                ContactNumber: ContactNumber,
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