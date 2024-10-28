import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class TruckTypeService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getTruckTypeData(){
        return this.http.get<any>( this.baseUrl + '/project/a_TruckType.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_TruckType.php?id=' + id); 
    }

    saveData
    (
        TruckTypeID: string,
        TruckType: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_TruckType.php',
            {
                TruckTypeID: TruckTypeID,
                TruckType: TruckType,
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