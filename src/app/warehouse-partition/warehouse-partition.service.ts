import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class WarehousePartitionService {

    constructor(private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getWarehousePartitionData(){
        return this.http.get<any>( this.baseUrl + '/project/a_WarehousePartition.php');
    }

    // getWarehouse() {
    //     return this.http.get<any>( this.baseUrl + '/project/d_Warehouse.php'); 
    // }

    onDeleteData(id:string) {
        return this.http.post<any>( this.baseUrl + '/project/d_WarehousePartition.php' , {WarehousePartitionID: id});
    }

    saveData
    (
        WarehousePartitionID: string,
        WarehouseID: string,
        WarehousePartitionName: string,
        MaximumCapacity: string,
        TotalWeight: string,
        TotalQuantity: string,
        UserID: string
    ) 
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_WarehousePartition.php',
            {
                WarehousePartitionID: WarehousePartitionID,
                WarehouseID: WarehouseID,
                WarehousePartitionName: WarehousePartitionName,
                MaximumCapacity: MaximumCapacity,
                TotalWeight: TotalWeight,
                TotalQuantity: TotalQuantity,
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