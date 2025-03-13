import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, catchError, tap } from "rxjs";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class FinishProductService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getFinishProductData() {
        return this.http.get<any>( this.baseUrl + '/project/a_FinishProduct.php');
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_FinishProduct.php?id=' + id);
    }

    saveData
    (
        FinishProductID: string,
        FinishProductCode: string,
        FinishProduct: string,
        KiloPerBag: number,
        Quantity: string,
        Weight: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_FinishProduct.php',
            {
                FinishProductID: FinishProductID,
                FinishProductCode: FinishProductCode,
                FinishProduct: FinishProduct,
                KiloPerBag: KiloPerBag,
                Quantity: Quantity,
                Weight: Weight,
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