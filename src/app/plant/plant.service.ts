import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class PlantService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getPlantData() {
        return this.http.get<any>( this.baseUrl + '/project/a_plant.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_Plant.php?id=' + id);
    }

    saveData
    (
        PlantID: string,
        PlantName: string,
        UserID: string
    ) 
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_Plant.php',
            {
                PlantID: PlantID,
                PlantName: PlantName,
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