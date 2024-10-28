import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { tap, throwError, catchError } from "rxjs";



@Injectable({providedIn: 'root'})

export class RawMatsPOService {

    constructor( private http: HttpClient){}

    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getData() {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMatsPO.php');
    }

    getRawMatsPODetail(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMatsPORequest.php?id=' + id);
    }

    savedata
    (
        PurchaseOrderID: number,
        PONo: string,
        PODate: string,
        DeliveryDate: string,
        Terms: string,
        PRNumber: string,
        SupplierID: number,
        SupplierAddress: number,
        TotalQuantity: number,
        TotalAmount: number,
        deleted: number,
        UserID: string,
        OrderDetail: any[]
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_RawMatsPO.php',
            {
                PurchaseOrderID: PurchaseOrderID,
                PONo: PONo,
                PODate: PODate,
                DeliveryDate: DeliveryDate,
                Terms: Terms,
                PRNumber: PRNumber,
                SupplierID: SupplierID,
                SupplierAddress: SupplierAddress,
                TotalQuantity: TotalQuantity,
                TotalAmount: TotalAmount,
                deleted: deleted,
                UserID: UserID,
                OrderDetail: OrderDetail
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