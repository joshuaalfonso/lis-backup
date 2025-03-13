import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class BrokerService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getBrokerData(){
        return this.http.get<any>( this.baseUrl + '/project/a_broker.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Broker.php?id=' + id); 
    }

    saveData(
        BrokerID: string,
        Broker: string,
        ContactPerson: string,
        ContactNumber: string,
        UserID: string
    ) {
        return this.http.post
        ( 
            this.baseUrl + '/project/b_Broker.php',
            {
                BrokerID: BrokerID,
                Broker: Broker,
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