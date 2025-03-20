import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";



@Injectable({ providedIn: 'root' })
export class WarehouseService {

    constructor(private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getWarehouseData(){
        return this.http.get<any>( this.baseUrl + '/project/a_Warehouse.php');
    }

    getWarehouseLocation() {
        return this.http.get<any>( this.baseUrl + '/project/a_WarehouseLocation.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_WarehouseID.php?id=' + id);
    }

    saveData(
        WarehouseID: string,
        WarehouseLocationID: string,
        Warehouse_Name: string,
        MaximumCapacity: string,
        MinimumCapacity: string,
        TotalQuantity: string,
        TotalWeight: string,
        Remarks: string,
        UserID: string
    ) {
        return this.http.post( 
            this.baseUrl + '/project/b_Warehouse.php',
            {
                WarehouseID: WarehouseID,
                WarehouseLocationID: WarehouseLocationID,
                Warehouse_Name: Warehouse_Name,
                MaximumCapacity: MaximumCapacity,
                MinimumCapacity: MinimumCapacity,
                TotalQuantity: TotalQuantity,
                TotalWeight: TotalWeight,
                Remarks: Remarks,
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