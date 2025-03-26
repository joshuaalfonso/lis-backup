import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { tap, throwError, catchError } from "rxjs";
import { RawMaterialPO } from "./rawmats-po.model";



@Injectable({providedIn: 'root'})

export class RawMatsPOService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getData() {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMatsPO.php');
    }

    getRawMatsPOCompleted() {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMatsPOCompleted.php');
    }

    getRawMatsPODetail(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMatsPORequest.php?id=' + id);
    }

    poCompleted(id: any) {
        return this.http.post(
            this.baseUrl + '/project/b_RawMatsStatus.php', 
            {
                PurchaseOrderID: id
            }
         )
    }

    savedata(data: RawMaterialPO)
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_RawMatsPO.php',
            data
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