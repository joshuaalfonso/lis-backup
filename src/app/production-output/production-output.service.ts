import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError, throwError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ProductionOutputService {

    constructor( private http: HttpClient){}

    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getProductionOutputData(){
        return this.http.get<any>( this.baseUrl + '/project/J_ProductionOutput.php');
    }

    getPlant() {
        return this.http.get<any>( this.baseUrl + '/project/a_plant.php'); 
    }

    saveData
    (
        ProductionOutputID: string,
        PlantID: string,
        LineNumber: string,
        FinishProductID: string,
        WarehouseID: string,
        WarehousePartitionID: string,
        DateTimeOutput: string,
        DateOutput: string,
        Quantity: string,
        Weight: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_ProductionOutput.php',
            {
                ProductionOutputID: ProductionOutputID,
                PlantID: PlantID,
                LineNumber: LineNumber,
                FinishProductID: FinishProductID,
                WarehouseID: WarehouseID,
                WarehousePartitionID: WarehousePartitionID,
                DateTimeOutput: DateTimeOutput,
                DateOutput: DateOutput,
                Quantity: Quantity,
                Weight: Weight,
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