import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { throwError, catchError, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class ShippingTransactionService {

    constructor( private http: HttpClient){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    getShippingTransactionData() {
        return this.http.get<any>(this.baseUrl + '/project/j_ShippingTransaction.php')
    }

    saveData
    (
        ShippingTransactionID: string,
        SPSICNumber: string,
        Validity: string,
        BLNumber: string,
        ShippingLineID: string,
        ContainerTypeID: string,
        NoOfContainer: string,
        SupplierID: string,
        RawMaterialID: string,
        PortOfDischargeID: string,
        EstimatedTimeDeparture: string,
        EstimatedTimeArrival: string,
        DocumentStatus: string,
        DateDocumentReceived: string,
        BrokerID: string,
        DateDocsReceivedByBroker: string,
        ImportClearanceBaiDate: string,
        ImportClearanceBPIDate: string,
        BankID: string,
        AvailabilityDate: string,
        PickupDate: string,
        ShipmentPeriod: string,
        Remarks: string,
        UserID: string,
    )
    {
        return this.http.post
        (
            this.baseUrl + '/project/b_ShippingTransaction.php',
            {
                ShippingTransactionID: ShippingTransactionID,
                SPSICNumber: SPSICNumber,
                Validity: Validity,
                BLNumber: BLNumber,
                ShippingLineID: ShippingLineID,
                ContainerTypeID: ContainerTypeID,
                NoOfContainer: NoOfContainer,
                SupplierID: SupplierID,
                RawMaterialID: RawMaterialID,
                PortOfDischargeID: PortOfDischargeID,
                EstimatedTimeDeparture: EstimatedTimeDeparture,
                EstimatedTimeArrival: EstimatedTimeArrival,
                DocumentStatus: DocumentStatus,
                DateDocumentReceived: DateDocumentReceived,
                BrokerID: BrokerID,
                DateDocsReceivedByBroker: DateDocsReceivedByBroker,
                ImportClearanceBaiDate: ImportClearanceBaiDate,
                ImportClearanceBPIDate: ImportClearanceBPIDate,
                BankID: BankID,
                AvailabilityDate: AvailabilityDate,
                PickupDate: PickupDate,
                ShipmentPeriod: ShipmentPeriod,
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

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        return throwError(errorMessage);
    }
}