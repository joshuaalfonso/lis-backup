import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError, throwError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class CustomerService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getCustomerData() {
        return this.http.get<any>( this.baseUrl + '/project/a_customer.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Customer.php?id=' + id); 
    }

    saveData
    (
        CustomerID: string,
        SalesAgentID: string,
        CustomerName: string,
        Address: string,
        ContactNo: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Customer.php',
            {
                CustomerID: CustomerID,
                SalesAgentID: SalesAgentID,
                CustomerName: CustomerName,
                Address: Address,
                ContactNo: ContactNo,
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