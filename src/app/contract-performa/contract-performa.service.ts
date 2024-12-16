import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, catchError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ContractPerformaService {

    constructor( private http: HttpClient){}

     // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;
    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    getContractPerformaData() {
        return this.http.get<any>( this.baseUrl + '/project/a_ContractPerforma.php');
    }

    getShippingTransaction(id: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_ShippingRequest.php?id=' + id);
    }

    getContractPerformaFilter(status: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_ContractPerformaFilter.php?status=' + status);
    }

    getShippingTransactionFilter(status: number, id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_ShippingTransactionFilter.php?status=' + status + '&id=' + id);
    }

    getPullOutDetail(id: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_PullOut.php?mbl=' + id);
    }

    getReceived(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_received.php?id=' + id);
    }

    getUnloadedBL() {
        return this.http.get<any>( this.baseUrl + '/project/a_UnloadBL.php');
    }    

    getUnloadedBL2(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/a_UnloadedBLView.php?id=' + id);
    }  

    getRecentEta() {
        return this.http.get<any>( this.baseUrl + '/project/a_LegalDashboard.php');
    }

    getBalanceAtPort() {
        return this.http.get<any>( this.baseUrl + '/project/a_LegalDashboard1.php');
    }

    BalanceContainer() {
        return this.http.get<any>( this.baseUrl + '/project/a_LegalDashboard2.php');
    }

    getLegalDashboard3() {
        return this.http.get<any>( this.baseUrl + '/project/a_LegalDashboard3.php' )
    }

    getLegalDashboard4() {
        return this.http.get<any>( this.baseUrl + '/project/a_LegalDashboard4.php' )
    }

    getLegalDashboard5() {
        return this.http.get<any>( this.baseUrl + '/project/a_LegalDashboard5.php' )
    }

    getSailingData() {
        return this.http.get<any>( this.baseUrl + '/project/a_LegalDashboard6.php')
    }

    saveData
    (
        ContractPerformaID: number,
        ContractNo: string,
        Quantity: number,
        EstimatedContainer: string,
        Packaging: number,
        PackedInID: number,
        RawMaterialID: number,
        SupplierID: number,
        SupplierAddress: string,
        PortOfDischargeID: string,
        FromShipmentPeriod: string,
        ToShipmentPeriod: string,
        CountryOfOrigin: string,
        Status: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_ContractPerforma.php',
            {
                ContractPerformaID: ContractPerformaID,
                ContractNo: ContractNo,
                Quantity: Quantity,
                EstimatedContainer: EstimatedContainer,
                Packaging: Packaging,
                PackedInID: PackedInID,
                RawMaterialID: RawMaterialID,
                SupplierID: SupplierID,
                SupplierAddress: SupplierAddress,
                PortOfDischargeID: PortOfDischargeID,
                FromShipmentPeriod: FromShipmentPeriod,
                ToShipmentPeriod: ToShipmentPeriod,
                CountryOfOrigin: CountryOfOrigin,
                Status: Status,
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

    saveShippingTransaction 
    (
        ShippingTransactionID: number,
        ContractPerformaID: number,
        Lot: string,
        // Served: number,
        // Balance: number,
        RawMaterialID: number,
        SupplierID: number,
        Packaging: number,
        AdvanceDocumentsReceived: string,
        BAI_SPS_IC: string,
        FromBAIValidity: string,
        ToBAIValidity: string,
        BPI_SPS_IC: string,
        FromBPIValidity: string,
        ToBPIValidity: string,
        MBL: string,
        BL: string,
        ShippingLineID: number,
        Vessel: number,
        HBL: string,
        Forwarder: string,
        ETD: string,
        ETA: string,
        ATA: string,
        ContainerTypeID: number,
        NoOfContainer: number,
        NoOfTruck: number,
        Quantity: number, 
        BrokerID: number,
        DateDocsReceivedByBroker: string,
        BAI_SPS_IC_Date: string,
        BPI_SPS_IC_Date: string,
        OriginalDocsAvailavilityDate: string,
        BankID: number,
        DateOfPickup: string,
        PortOfDischarge: string,
        Status: string,
        DateOfDischarge: string,
        LodgementDate: string,
        LodgementBankID: number,
        GatepassRecieved: string,
        AcknowledgeByLogistics: string,
        StorageLastFreeDate: string,
        DemurrageDate: string,
        DetentionDate: string,
        Remarks: string,
        UserID: string
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_ShippingTransaction.php',
            {
                ShippingTransactionID: ShippingTransactionID,
                ContractPerformaID: ContractPerformaID,
                Lot: Lot,
                // Served: Served,
                // Balance: Balance,
                RawMaterialID: RawMaterialID,
                SupplierID: SupplierID,
                Packaging: Packaging,
                AdvanceDocumentsReceived: AdvanceDocumentsReceived,
                BAI_SPS_IC: BAI_SPS_IC,
                FromBAIValidity: FromBAIValidity,
                ToBAIValidity: ToBAIValidity,
                BPI_SPS_IC: BPI_SPS_IC,
                FromBPIValidity: FromBPIValidity,
                ToBPIValidity: ToBPIValidity,
                MBL: MBL,
                BL: BL,
                ShippingLineID: ShippingLineID,
                Vessel: Vessel,
                HBL: HBL,
                Forwarder: Forwarder,
                ETD: ETD,
                ETA: ETA,
                ATA: ATA,
                ContainerTypeID: ContainerTypeID,
                NoOfContainer: NoOfContainer,
                NoOfTruck: NoOfTruck,
                Quantity: Quantity,
                BrokerID: BrokerID,
                DateDocsReceivedByBroker: DateDocsReceivedByBroker,
                BAI_SPS_IC_Date: BAI_SPS_IC_Date,
                BPI_SPS_IC_Date: BPI_SPS_IC_Date,
                OriginalDocsAvailavilityDate: OriginalDocsAvailavilityDate,
                BankID: BankID,
                DateOfPickup: DateOfPickup,
                PortOfDischarge: PortOfDischarge,
                Status: Status,
                DateOfDischarge: DateOfDischarge,
                LodgementDate: LodgementDate,
                LodgementBankID: LodgementBankID,
                GatepassRecieved: GatepassRecieved,
                AcknowledgeByLogistics: AcknowledgeByLogistics,
                StorageLastFreeDate: StorageLastFreeDate,
                DemurrageDate: DemurrageDate,
                DetentionDate: DetentionDate,
                Remarks: Remarks,
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

    savePullOut
    (
        MBL: String,
        HBL: String,
        UserID: string,
        PullOutDetail: any[]
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_PullOut.php',
            {
                MBL: MBL,
                HBL: HBL,
                UserID: UserID,
                PullOutDetail: PullOutDetail
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