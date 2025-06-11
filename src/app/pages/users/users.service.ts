import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { catchError, throwError, tap } from "rxjs";


@Injectable({providedIn: 'root'})
export class UsersService {

    constructor(private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getData() {
        return this.http.get<any>( this.baseUrl + '/project/a_UserAccount.php');
    }

    getUserAccess(UserID: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_Access.php?UserID=' + UserID );
    }

    getModuleAccess() {
        return this.http.get<any>( this.baseUrl + '/project/a_ModuleAccess.php');
    }

    getDepartment() {
        return this.http.get<any>( this.baseUrl + '/project/a_Department.php');
    }

    saveData
    (
        UserID: number,
        UName: string,
        // PWord: string,
        DepartmentID: number,
        ULevel: number,
        Name: string,
        ContactNo: string,
        EmailAdd: string,
    ) {
        return this.http.post(
            this.baseUrl + '/project/b_UserAccount.php',
            {
                UserID: UserID,
                UName: UName,
                // PWord: PWord,
                DepartmentID: DepartmentID,
                ULevel: ULevel,
                Name: Name,
                ContactNo: ContactNo,
                EmailAdd: EmailAdd,
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                return resData;
            })
        );
    }

    saveUserAccess
    (
        UserID: number,
        AdminID: number,
        AccessDetail: any[]
    ) 
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Access.php',
            {
                UserID: UserID,
                AdminID: AdminID,
                AccessDetail: AccessDetail
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                return resData;
            })
        );
    }

    resetPassword
    (
        UserID: number,
        UName: string,

    ) {
        return this.http.post
        (
            this.baseUrl + '/project/b_UserAccountReset.php',
            {
                UserID: UserID,
                UName: UName
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