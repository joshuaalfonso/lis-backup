import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, catchError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class TruckingService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getTruckingData(){
        return this.http.get<any>( this.baseUrl + '/project/a_Trucking.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Trucking.php?id=' + id); 
    }

    saveData
    (
        TruckingID: string,
        TruckingName: string,
        ContactPerson: string,
        ContactNumber: string,
        UserID: string,
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Trucking.php',
            {
                TruckingID: TruckingID,
                TruckingName: TruckingName,
                ContactPerson: ContactPerson,
                ContactNumber: ContactNumber,
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