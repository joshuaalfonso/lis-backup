import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError, throwError, tap, BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class BinloadService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;


    binloadNotVerified = new BehaviorSubject<number>(0);

    getBinloadData(UserID: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_Binloading.php?id=' + UserID);
    }
    getBinloadUom() {
        return this.http.get<any>( this.baseUrl + '/project/a_BinloadingUom.php');
    }

    saveBinload(binloadOBJ: any) {
        return this.http.post( this.baseUrl + '/project/b_Binloading.php', binloadOBJ);
    }

    verifyBinload(binloadingRequestID: any) {
        return this.http.post( this.baseUrl + '/project/b_BinloadingVerify.php', {BinloadRequestID: binloadingRequestID});
    }

    getWarehousePartitionStock(id: any) {
        return this.http.get<any>( this.baseUrl + '/project/j_WarehouseDetails.php?id=' + id);
    }

    getRawMatsPartitionStock(id: any) {
        return this.http.get<any>( this.baseUrl + '/project/j_WarehouseDetailRawMats.php?id=' + id);
    }

    insertBinloadRequest(binloadRequest: BinloadRequest) {
        return this.http.post( this.baseUrl + '/project/b_BinloadingRequest.php', binloadRequest );
    }

    getBinloadRequest(id: any) {
        return this.http.get<any>( this.baseUrl + '/project/a_BinloadingRequest.php?id=' + id );
    }

    getBinloadVerified() {
        return this.http.get<any>( this.baseUrl + '/project/a_BinloadingVerify.php');
    }

    getRecentBinload() {
        return this.http.get<any>( this.baseUrl + '/project/a_PlantBinload.php' )
    }

    getBinloadDashboard() {
        return this.http.get<any>( this.baseUrl + '/project/a_BinloadDashboard.php')
    }

    saveData(binloadObj: Binload) {
        return this.http.post
        ( this.baseUrl + '/project/b_Binloading.php', binloadObj )
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

export interface BinloadRequest {
    BinloadRequestID: string,
    WarehouseLocationID: number,
    WarehouseID: number,
    WarehousePartitionID: number,
    WarehousePartitionStockID: number,
    PO: string,
    BL: string,
    PlantID: number,
    DriverID: number,
    TruckID: number,
    RequestDate: string,
    RawMaterialID: number,
    Quantity: number,
    BinloadUomID: number,
    Status: number,
    UserID: string
    // BinloadDetail: any[]
}

export interface Binload {
    BinloadingID: number,
    BinloadRequestID: number,
    ControlNo: string,
    PlantID: number,
    CheckerID: number,
    IntakeID: number,
    WarehousePartitionStockID: number,
    WarehouseLocationID: number,
    WarehousePartitionID: number,
    WarehouseID: number,
    BinloadingDate: string,
    BinloadingDateTime: string,
    RawMaterialID: number,
    Quantity: number,
    Weight: number,
    Status: number,
    UserID: string
}