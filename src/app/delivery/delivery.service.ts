import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class DeliveryService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getDeliveryData() {
        return this.http.get<any>( this.baseUrl + '/project/a_delivery.php');
    }

    getWarehousePartition() {
        return this.http.get<any>( this.baseUrl + '/project/j_WarehousePartitionStock.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Delivery.php?id=' + id); 
    }

    getOrderDetails(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_DeliveryDetail_tbl.php?id=' + id);
    }

    getWarehousePartitionStock(id: any) {
        // return this.http.get<any>( this.baseUrl + '/project/a_WarehousePartitionStock.php?id=' + id);
        return this.http.get<any>( this.baseUrl + '/project/j_WarehouseDetails.php?id=' + id);
    }
    getDeliverySchedules() {
        // return this.http.get<any>( this.baseUrl + '/project/a_WarehousePartitionStock.php?id=' + id);
        return this.http.get<any>( this.baseUrl + '/project/a_DeliverySchedules')
    }

    saveData
    (
        DeliveryID: string,
        DeliveryNo: string,
        SONumber: string,
        PurchaseOrderNo: string,
        DeliveryDate: string,
        CustomerID: string,
        TotalQty: string,
        DeliveryDetail : string [],
        Status: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_DeliverTransaction.php',
            {
                DeliveryID: DeliveryID,
                DeliveryNo: DeliveryNo,
                SONumber: SONumber,
                PurchaseOrderNo: PurchaseOrderNo,
                DeliveryDate: DeliveryDate,
                CustomerID: CustomerID,
                TotalQty: TotalQty,
                DeliveryDetail : DeliveryDetail ,
                Status: Status,
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