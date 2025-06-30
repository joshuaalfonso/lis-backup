import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "src/app/environments/environment";
import { ActiveContractList } from "src/app/features/importation/active-contract-table/active-contract.model";
import { ContractPost, PullOutPost, ShippingPost } from "./importation.model";





@Injectable({providedIn: 'root'})
export class ImportationService {

    baseUrl = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}
    
    getContractPerformaFilter(status: string) {
        return this.http.get<ActiveContractList[]>( this.baseUrl + '/project/a_ContractPerformaFilter.php?status=' + status);
    }

    getShippingTransactionFilter(status: number, id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_ShippingTransactionFilter.php?status=' + status + '&id=' + id);
    }

    getReceived(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_received.php?id=' + id);
    }

    getUnloadedBL(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_UnloadedBLView.php?id=' + id);
    }  

    saveContract(newContract: ContractPost)
    {
        return this.http.post(
            this.baseUrl + '/project/b_ContractPerforma.php', 
            newContract
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

    saveShippingTransaction(shippingTransactionData: ShippingPost)
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_ShippingTransaction.php', shippingTransactionData
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                return resData;
            })
        );
    }

    deleteContract(id: any) {
        return this.http.post( 
            this.baseUrl + '/project/d_ContractPerforma.php', 
            {
                ContractPerformaID: id
            }
        )
    }

    ActiveToCompleted(id: any) {
        return this.http.post(
            this.baseUrl + '/project/b_ContractCompleted.php', 
            {
                ContractPerformaID: id
            }
        )
    }

    sailingToLanded(data: {ShippingTransactionID: number, ATA: string | null}) {
        return this.http.post(
            this.baseUrl + '/project/b_ShippingSailingToLanded.php', 
            data
        )
    }

    landedToSaling(id: any) {
        return this.http.post(
            this.baseUrl + '/project/b_ShippingLanded.php', 
            {
                ShippingTransactionID: id
            }
        )
    }

    landedToPullout(shippingTransactionID: number) {
        return this.http.post(
            this.baseUrl + '/project/b_ShippingLandedToPullOut.php', 
            {
                ShippingTransactionID: shippingTransactionID
            }
        )
    }


    deleteShippingTransaction(id: any) {
        return this.http.post( 
            this.baseUrl + '/project/d_ShippingTransaction.php', 
            {
                ShippingTransactionID: id
            }
        )
    }

    // for pull out dialog
    getPullOutDetail(id: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_PullOut.php?mbl=' + id);
    }
    
    savePullOut
    (
        data: PullOutPost
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_PullOut.php',
            data
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                return resData;
            })
        );
    }

}

