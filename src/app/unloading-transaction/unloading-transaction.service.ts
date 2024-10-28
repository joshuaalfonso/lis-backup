import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { throwError, catchError, tap } from "rxjs";



@Injectable({providedIn: 'root'})
export class UnloadingTransactionService {

    constructor( private http: HttpClient){}

    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getUnloadingTransactionData() {
        return this.http.get<any>( this.baseUrl + '/project/a_UnloadingTransaction.php');
    }

    filterUnloadingTransaction(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_UnloadingTransaction.php?id=' + id);
    }

    fileUpload(files: any) {
        return this.http.post(this.baseUrl + '/project/b_UnloadingTransaction.php', files);
    }

    getImage(tableID: any) {
        return this.http.get<any>( this.baseUrl + '/project/a_ImageTable.php?id=' + tableID);
    }

    getBL() {
        return this.http.get<any>( this.baseUrl + '/project/a_UnloadingBL.php');
    }

    getPO() {
        return this.http.get<any>( this.baseUrl + '/project/a_RawMatsPOUnloading.php');
    }

    saveData
    (        
        file: any
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_UnloadingTransaction.php', file              
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