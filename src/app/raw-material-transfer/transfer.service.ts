import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class TransferService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    insertTransferRequest(transferRequest: TransferRequestModel) {
        return this.http.post( this.baseUrl + '/project/b_DispatcherRequest.php', transferRequest);
    }

    getTransferRequest() {
        return this.http.get<any>( this.baseUrl + '/project/a_DispatcherRequest.php');
    }

    getTransferData(status: number, user_id?: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMaterialTransfer.php?status=' + status + '&UserID=' + user_id);
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_RawMaterialTransfer.php?id=' + id);
    }

    getPartitionStockItem(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMaterialTransferStocking.php?id=' + id);
    }

    getRecentTransfer() {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMaterialTransferDashboard.php')
    }

    // 'LossQuantity': new FormControl(null),
    // 'OverQuantity': new FormControl(null),
    // 'LossWeight': new FormControl(null),
    // 'OverWeight': new FormControl(null),

    saveData
    (
        RawMaterialTransferID: number,
        DispatcherRequestID: number,
        TransferCode: string,
        PO: number,
        BL: number,
        DateTransfer: string,
        TransferTypeID: number,
        FromWarehouseLocationID: number,
        ToWarehouseLocationID: number,
        FromWarehouseID: number,
        FromWarehousePartitionID: number,
        ToWarehouseID: number,
        ToWarehousePartitionID: number,
        RawMaterialID: number,
        Quantity: number,
        Weight: number,
        LossQuantity: number,
        OverQuantity: number,
        LossWeight: number,
        OverWeight: number,
        TruckID: number,
        DriverID: number,
        CheckerID: number,
        GuardID: number,
        DispatcherID: number,
        // DepartureWeight: number,
        ArrivalWeight: number,
        WeigherIn: number,
        WeigherOut: number,
        FeedmixDeparture: string,
        FeedmixArrival: string,
        SourceDeparture: string,
        SourceArrival: string,
        Status: number,
        UserID: string,
        WarehousePartitionStockID: number
    ) 
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_RawMaterialTransfer.php', 
            {
                RawMaterialTransferID: RawMaterialTransferID,
                DispatcherRequestID: DispatcherRequestID,
                TransferCode: TransferCode,
                PO: PO,
                BL: BL,
                DateTransfer: DateTransfer,
                TransferTypeID: TransferTypeID,
                FromWarehouseLocationID: FromWarehouseLocationID,
                ToWarehouseLocationID: ToWarehouseLocationID,
                FromWarehouseID: FromWarehouseID,
                FromWarehousePartitionID: FromWarehousePartitionID,
                ToWarehouseID: ToWarehouseID,
                ToWarehousePartitionID: ToWarehousePartitionID,
                RawMaterialID: RawMaterialID,
                Quantity: Quantity,
                Weight: Weight,
                LossQuantity: LossQuantity,
                OverQuantity: OverQuantity,
                LossWeight: LossWeight,
                OverWeight: OverWeight,
                TruckID: TruckID,
                DriverID: DriverID,
                CheckerID: CheckerID,
                GuardID: GuardID,
                DispatcherID: DispatcherID,
                // DepartureWeight: DepartureWeight,
                ArrivalWeight: ArrivalWeight,
                WeigherIn: WeigherIn,
                WeigherOut: WeigherOut,
                FeedmixDeparture: FeedmixDeparture,
                FeedmixArrival: FeedmixArrival,
                SourceDeparture: SourceDeparture,
                SourceArrival: SourceArrival,
                Status: Status,
                UserID: UserID,
                WarehousePartitionStockID: WarehousePartitionStockID
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


export interface TransferRequestModel {
    DispatcherRequestID: number,
    RequestDate: string,
    FromWarehouseLocationID: number,
    ToWarehouseLocationID: number,
    RawMaterialID: number,
    RequestWeight: number,
    Status: number,
    UserID: string
}