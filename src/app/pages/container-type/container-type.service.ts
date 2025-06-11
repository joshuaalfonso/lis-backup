import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, throwError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ContainerTypeService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getContainerTypeData() {
        return this.http.get<any>( this.baseUrl + '/project/a_ContainerType.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_ContainerType.php?id=' + id);
    }

    saveData
    (
        ContainerTypeID: string,
        Container: string, 
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_ContainerType.php',
            {
                ContainerTypeID: ContainerTypeID,
                Container: Container,
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