import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { throwError, catchError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class IndentorService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getIndentorData(){
        return this.http.get<any>( this.baseUrl + '/project/a_indentor.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Indentor.php?id=' + id);
    }

    saveData
    (
        IndentorID: string,
        Indentor: string,
        Address: string,
        ContactPerson: string,
        ContactNumber: string,
        UserID: string,
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Indentor.php',
            {
                IndentorID: IndentorID,
                Indentor: Indentor,
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