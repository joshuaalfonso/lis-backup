import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";
import { RawMaterial } from "./raw-materials.model";


@Injectable({ providedIn: 'root' })
export class RawMaterialsService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getRawMatsData(){
        return this.http.get<any>( this.baseUrl + '/project/a_rawmaterial.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_RawMaterial.php?id=' + id);
    }

    saveData(
        rawMaterial: RawMaterial
        // RawMaterialID: number, 
        // RawMaterial: string,
        // Category: string,
        // Quantity: string,
        // Weight: string,
        // MinimumQuantity: string, 
        // MinimumWeight: string,
        // UserID: string
    ) {
        return this.http.post
        ( 
            this.baseUrl + '/project/b_RawMaterial.php',
            rawMaterial
            // {
            //     RawMaterialID: RawMaterialID,
            //     RawMaterial: RawMaterial,
            //     Category: Category,
            //     // Packaging: Packaging,
            //     Quantity: Quantity,
            //     Weight: Weight,
            //     MinimumQuantity: MinimumQuantity,
            //     MinimumWeight: MinimumWeight,
            //     UserID: UserID
            // }
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