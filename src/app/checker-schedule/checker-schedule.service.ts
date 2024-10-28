import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { catchError, tap, throwError } from "rxjs";




@Injectable({
    providedIn: 'root'
})
export class CheckerScheduleService {

    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    constructor(
        private http: HttpClient
    ) {}

    displayData() {
        return this.http.get<any>(this.baseUrl + '/project/a_checkerSchedule.php');
    }

    checkerData() {
        return this.http.get<any>(this.baseUrl + '/project/a_checkerList.php');
    }

    saveData(
        ScheduleRotationID: string,
        UserID: string,
        WarehouseLocationID: number,
        DateRotation: string,
        AdminUserID: string
    )
    {
        return this.http.post(
            this.baseUrl + '/project/b_checkerSchedule.php', 
            {
                ScheduleRotationID: ScheduleRotationID,
                UserID: UserID,
                WarehouseLocationID: WarehouseLocationID,
                DateRotation: DateRotation,
                AdminUserID: AdminUserID
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