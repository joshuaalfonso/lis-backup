import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class SupplierService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getSupplierData(){
        return this.http.get<any>( this.baseUrl + '/project/a_supplier.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Supplier.php?id=' + id);
    }

    saveData(
        SupplierID: string,
        Supplier: string,
        Address: string,
        ContactPerson: string,
        ContactNumber: string,
        UserID: string
    ) {
        return this.http.post
        ( 
            this.baseUrl + '/project/b_Supplier.php',
            {
                SupplierID: SupplierID,
                Supplier: Supplier,
                Address: Address,
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
