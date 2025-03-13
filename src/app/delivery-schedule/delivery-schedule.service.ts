import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError, throwError, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class DeliveryScheduleService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getDeliveryScheduleData() {
        return this.http.get<any>(this.baseUrl + '/project/a_DeliveryScheduleDetails.php');
    }

    getDeliveryScheduleDetailData(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_DeliveryScheduleDetail_tbl.php?id=' + id);
    }
    getDeliveryScheduleFilter(status: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_ScheduleFilter.php?status=' + status);
    }

    saveData
    (
        DeliveryScheduleID: string,
        SONumber: string,
        CustomerID: string,
        Address: string,
        TruckID: string,
        DateSchedule: string,
        TotalQty: string,
        DeliveryScheduleDetail: string [],
        Status: string,
        UserID: string
    )
    {
        return this.http.post
        ( 
            this.baseUrl + '/project/b_DeliverySchedule.php',
            {
                DeliveryScheduleID: DeliveryScheduleID,
                SONumber: SONumber,
                CustomerID: CustomerID,
                Address: Address,
                TruckID: TruckID,
                DateSchedule: DateSchedule,
                TotalQty: TotalQty,
                DeliveryScheduleDetail: DeliveryScheduleDetail,
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

    saveDeliveryData
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