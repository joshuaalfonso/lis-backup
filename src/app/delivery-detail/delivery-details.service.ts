import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class DeliveryDetailService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getDeliveryDetailData() {
        return this.http.get<any>( this.baseUrl + '/project/a_DeliveryDetail.php');
    }

    saveData
    (
        DeliveryDetailID: string,
        DeliveryID: string,
        FinishProductID: string,
        Quantity: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_DeliveryDetail.php',
            {
                DeliveryDetailID: DeliveryDetailID,
                DeliveryID: DeliveryID,
                FinishProductID: FinishProductID,
                Quantity: Quantity
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