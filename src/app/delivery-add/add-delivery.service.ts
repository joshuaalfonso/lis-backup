import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { throwError, catchError, tap } from "rxjs";


@Injectable({providedIn: 'root'})
export class AddDeliveryService {

    constructor( private http: HttpClient){}

    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getWarehousePartitionStock(id: any) {
        return this.http.get<any>( this.baseUrl + '/project/a_WarehousePartitionStock.php?id=' + id);
    }

    saveData
    (
        DeliveryID: string,
        DeliveryNo: string,
        PurchaseOrderNo: string,
        DeliveryDate: string,
        CustomerID: string,
        TotalQty: number,
        DeliveryDetail : string [],
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_DeliverTransaction.php',
            {
                DeliveryID: DeliveryID,
                DeliveryNo: DeliveryNo,
                PurchaseOrderNo: PurchaseOrderNo,
                DeliveryDate: DeliveryDate,
                CustomerID: CustomerID,
                TotalQty: TotalQty,
                DeliveryDetail: DeliveryDetail,
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