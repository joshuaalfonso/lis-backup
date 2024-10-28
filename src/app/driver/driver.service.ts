import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, catchError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class DriverService {

    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    constructor(
        private http: HttpClient
    ) {}

    getDriverData(){
        return this.http.get<any>( this.baseUrl + '/project/a_driver.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Driver.php?id=' + id);
    }

    saveData
    (
        DriverID: string,
        DriverName: string,
        ContactNumber: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_driver.php',
            {
                DriverID: DriverID,
                DriverName: DriverName,
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