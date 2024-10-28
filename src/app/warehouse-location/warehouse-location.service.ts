import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class WarehouseLocationService {

    constructor(private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getWarehouseLocationData(){
        return this.http.get<any>( this.baseUrl + '/project/a_WarehouseLocation.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_WarehouseLocation.php?id=' + id);
    }

    saveData(
        WarehouseLocationID: string,
        WarehouseLocation: string,
        UserID: string
    ) {
        return this.http.post
        ( 
            this.baseUrl + '/project/b_WarehouseLocation.php',
            {
                WarehouseLocationID: WarehouseLocationID,
                WarehouseLocation: WarehouseLocation,
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