import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class weighingTransactionService {

    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getWeighingTrans(transID: number){
        return this.http.get<any>( this.baseUrl + '/project/J_WeighingTransaction.php?transid=' + transID);
    }

    getWeighingTransDetails(id: any) {
        return this.http.get<any>( this.baseUrl + '/project/a_WeighingTransactionDetail.php?id=' + id);
    }

    onDeleteData(id:string) {
        return this.http.get<any>( this.baseUrl + '/project/c_WeighingTransaction.php?id=' + id);
    }

    getWeigher() {
        return this.http.get<any>( this.baseUrl + '/project/a_Weigher.php');
    }

    saveData
    (
        WeighingTransactionID: string,
        RawMaterialID: string,
        TruckID: string,
        DriverID: string,
        CheckerID: string,
        WeigherID: string,
        SupplierID: string,
        CustomerID: string,
        DrNumber: string,
        GrossWeight: string,
        TareWeight: string,
        NetWeight: string,
        rmGrossWeight: string,
        rmTareWeight: string,
        rmNetWeight: string,
        LossOverWeight: string,
        ShippingID: string,
        DateTimeArrived: string,
        WeighInDate: string,
        WeighOutDate: string,
        Others: string,
        NoOfBags: string,
        isTransaction: string,
        Remarks: string,
        WeighingTransDetailID: string,
        WeighingDetail: string[]
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_WeighingTransaction.php',
            {
                WeighingTransactionID: WeighingTransactionID,
                RawMaterialID: RawMaterialID,
                TruckID: TruckID,
                DriverID: DriverID,
                CheckerID: CheckerID,
                WeigherID: WeigherID,
                SupplierID: SupplierID,
                CustomerID: CustomerID,
                DrNumber: DrNumber,
                GrossWeight: GrossWeight,
                TareWeight: TareWeight,
                NetWeight: NetWeight,
                rmGrossWeight: rmGrossWeight,
                rmTareWeight: rmTareWeight,
                rmNetWeight: rmNetWeight,
                LossOverWeight: LossOverWeight,
                ShippingID: ShippingID,
                DateTimeArrived: DateTimeArrived,
                WeighInDate: WeighInDate,
                WeighOutDate: WeighOutDate,
                Others: Others,
                NoOfBags: NoOfBags,
                isTransaction: isTransaction,
                Remarks: Remarks,
                WeighingTransDetailID: WeighingTransDetailID,
                WeighingDetail: WeighingDetail
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