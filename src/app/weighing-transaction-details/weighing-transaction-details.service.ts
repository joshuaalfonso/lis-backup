import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { catchError, throwError, tap } from "rxjs";



@Injectable({providedIn: 'root'})
export class WeighingTransactionDetailsService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getWeighingTransDetialData() {
        return this.http.get<any>( this.baseUrl + '/project/j_WeighingTransactionDetails.php');
    }

    saveData
    (
        WeighingTransDetailID: string,
        weighingTransactionID: string,
        FinishProductID: string,
        RawMaterialID: string,
        CustomerID: string,
        NoOfBags: string,
        isTransaction: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_WeighingTransactionDetails.php',
            {
                WeighingTransDetialID: WeighingTransDetailID,
                WeighingTransactionID: weighingTransactionID,
                FinishProductID: FinishProductID,
                RawMaterialID: RawMaterialID,
                CustomerID: CustomerID,
                NoofBags: NoOfBags,
                isTransaction: isTransaction   
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