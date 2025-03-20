import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class TruckService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    GetTruckData() {
        return this.http.get<any>( this.baseUrl + '/project/J_Truck.php');
    }
    
    GetTruckTypeData() {
        return this.http.get<any>( this.baseUrl + '/project/a_TruckType.php');
    }

    GetTruckingData() {
        return this.http.get<any>( this.baseUrl + '/project/a_Trucking.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Truck.php?id=' + id); 
    }


    saveData
    (
        TruckID: string,
        TruckingID: string,
        // TruckTypeID: string,
        PlateNo: string,
        Description: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Truck.php',
            {
                TruckID: TruckID,
                TruckingID: TruckingID,
                // TruckTypeID: TruckTypeID,
                PlateNo: PlateNo,
                Description: Description,
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