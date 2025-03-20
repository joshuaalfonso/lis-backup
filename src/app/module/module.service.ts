import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class ModuleService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getModuleData() {
        return this.http.get<any>( this.baseUrl + '/project/a_module.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Module.php?id=' + id);
    }

    saveData
    (
        ModuleID: string,
        ModuleName: string,
        UserID: string
    ) 
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Module.php',
            {
                ModuleID: ModuleID,
                ModuleName: ModuleName,
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