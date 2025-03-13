import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class RawMaterialsService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getRawMatsData(){
        return this.http.get<any>( this.baseUrl + '/project/a_rawmaterial.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_RawMaterial.php?id=' + id);
    }

    saveData(
        RawMaterialID: string,
        RawMaterial: string,
        Category: string,
        Packaging: string,
        Quantity: string,
        Weight: string,
        MinimumQuantity: string,
        MinimumWeight: string,
        UserID: string
    ) {
        return this.http.post
        ( 
            this.baseUrl + '/project/b_RawMaterial.php',
            {
                RawMaterialID: RawMaterialID,
                RawMaterial: RawMaterial,
                Category: Category,
                Packaging: Packaging,
                Quantity: Quantity,
                Weight: Weight,
                MinimumQuantity: MinimumQuantity,
                MinimumWeight: MinimumWeight,
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