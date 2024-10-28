import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError, catchError, tap } from "rxjs";
import { environment } from "../environments/environment";



@Injectable({ providedIn: 'root' })
export class FinishProductInventoryService {

    constructor(
        private http: HttpClient
    ) {}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getInventoryData() {
        return this.http.get<any>( this.baseUrl + '/project/a_FinishProductInventory.php');
    }

    FilterData(fromDate: any, toDate: any) {
        return this.http.get<any> ( 
            this.baseUrl + '/project/f_FinishProduct.php?',
            {
                params: {
                    date: fromDate,
                    date1: toDate
                }
            } 
        );
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_FinishProductInventory.php?id=' + id);
    }

    saveData
    (
        FinishProductInventoryID: string,
        FinishProductID: string,
        InventoryDate: string,
        BeginQty: string,
        ProductionOutput: string,
        OutgoingQty: string,
        Condemned: string,
        EndingQty: string,
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_FinishProductInventory.php',
            {
                FinishProductInventoryID: FinishProductInventoryID,
                FinishProductID: FinishProductID,
                InventoryDate: InventoryDate,
                BeginQty: BeginQty,
                ProductionOutput: ProductionOutput,
                OutgoingQty: OutgoingQty,
                Condemned: Condemned,
                EndingQty: EndingQty
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