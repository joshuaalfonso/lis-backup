import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class RawMaterialInventoryService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getInventoryData() {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMaterialInventory.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_RawMaterialInventory.php?id=' + id);
    }

    FilterData(fromDate: any, toDate: any) {
        return this.http.get<any> ( 
            this.baseUrl + '/project/f_RawMaterial.php?',
            {
                params: {
                    date: fromDate,
                    date1: toDate
                }
            } 
        );
    }

    saveData(
        RawMaterialInventoryID: string,
        RawMaterialID: string,
        InventoryDate: string,
        BeginQty: string,
        BeginWeight: string,
        BeginPrice: string,
        IncomingQty: string,
        IncomingWeight: string,
        IncomingPrice: string,
        BinloadingQty: string,
        BinloadingWeight: string,
        BinloadingPrice: string,
        CondemQty: string,
        CondemWeight: string,
        CondemPrice: string,
        EndingQty: string,
        EndingWeight: string,
        EndingPrice: string,
    ) 
    {
        return this.http.post
        (
        this.baseUrl + '/project/b_RawMaterialInventory.php',
            {
                RawMaterialInventoryID: RawMaterialInventoryID,
                RawMaterialID: RawMaterialID,
                InventoryDate: InventoryDate,
                BeginQty: BeginQty,
                BeginWeight: BeginWeight,
                BeginPrice: BeginPrice,
                IncomingQty: IncomingQty,
                IncomingWeight: IncomingWeight,
                IncomingPrice: IncomingPrice,
                BinloadingQty: BinloadingQty,
                BinloadingWeight: BinloadingWeight,
                BinloadingPrice: BinloadingPrice,
                CondemQty: CondemQty,
                CondemWeight: CondemWeight,
                CondemPrice: CondemPrice,
                EndingQty: EndingQty,
                EndingWeight: EndingWeight,
                EndingPrice: EndingPrice
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