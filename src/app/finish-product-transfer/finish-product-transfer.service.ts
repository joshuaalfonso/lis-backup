import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class FinishProductTransferService {

    constructor(
        private http: HttpClient
    ) {}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getTransferData() {
        return this.http.get<any>( this.baseUrl + '/project/j_FinishProductTransfer.php');
    }

    // getWarehousePartitionData(){
    //     return this.http.get<any>( this.baseUrl + '/project/d_WarehousePartition.php');
    // }

    getCheckerData(){
        return this.http.get<any>( this.baseUrl + '/project/J_Checker.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_FinishProductTransfer.php?id=' + id); 
    }

    saveData
    (
        FinishProductTransferID: string,
        DateTransfer: string,
        FromWarehouseID: string,
        FromWarehousePartitionID: string,
        ToWarehouseID: string,
        ToWarehousePartitionID: string,
        FinishProductID: string,
        Quantity: string,
        CheckerID: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_FinishProductTransfer.php',
            {
                FinishProductTransferID: FinishProductTransferID,
                DateTransfer: DateTransfer,
                FromWarehouseID: FromWarehouseID,
                FromWarehousePartitionID: FromWarehousePartitionID,
                ToWarehouseID: ToWarehouseID,
                ToWarehousePartitionID: ToWarehousePartitionID,
                FinishProductID: FinishProductID,
                Quantity: Quantity,
                CheckerID: CheckerID,
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