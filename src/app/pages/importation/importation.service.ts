import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { environment } from "src/app/environments/environment";
import { ActiveContractList } from "src/app/features/importation/active-contract-table/active-contract.model";
import { ContractPost } from "./importation.model";





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


}

