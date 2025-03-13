import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { throwError, catchError, tap } from "rxjs";


@Injectable({ providedIn: 'root'})
export class ShippingDocumentService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getShippingDocumentData() {
        return this.http.get<any>( this.baseUrl + '/project/a_ShippingDocument.php');
    }

    saveData
    (
        ShippingDocumentID: string,
        ShippingDocument: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_ShippingDocument.php',
            {
                ShippingDocumentID: ShippingDocumentID,
                ShippingDocument: ShippingDocument,
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