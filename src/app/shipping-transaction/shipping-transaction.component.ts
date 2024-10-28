import { Component, OnDestroy, OnInit } from "@angular/core";
import { ShippingTransactionService } from "./shipping-transaction.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ShippingLineService } from "../shipping-line/shipping-line.service";
import { Subscription, Observable } from "rxjs";
import { ContainerTypeService } from "../container-type/container-type.service";
import { SupplierService } from "../supplier/supplier.service";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { MessageService } from "primeng/api";
import { BrokerService } from "../broker/broker.service";



@Component({
    selector: 'app-shipping-transaction',
    templateUrl: 'shipping-transaction.component.html',
    styleUrls: ['shipping-transaction.component.css']
})

export class ShippingTransaction implements OnInit, OnDestroy{

    shippingTransaction: any[] = [];

    shippingTransactionForm!: FormGroup;

    shippingLine: any[] = [];

    containerType: any[] = [];

    supplier: any[] = [];

    rawMaterial: any[] = [];

    broker: any[] = [];

    visible: boolean = false;

    dialogHeader: string = '';

    isLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private ShippingTransactionService: ShippingTransactionService,
        private ShippingLineService: ShippingLineService,
        private ContainerTypeService: ContainerTypeService,
        private SupplierService: SupplierService,
        private RawMaterialsService: RawMaterialsService,
        private MessageService: MessageService,
        private BrokerService: BrokerService
    ) {}

    ngOnInit(): void {
        this.shippingTransactionForm = new FormGroup({
            'ShippingTransactionID': new FormControl(0),
            'SPSICNumber': new FormControl(null, Validators.required),
            'Validity': new FormControl(null, Validators.required),
            'BLNumber': new FormControl(null, Validators.required),
            'ShippingLineID': new FormControl(null, Validators.required),
            'ContainerTypeID': new FormControl(null, Validators.required),
            'NoOfContainer': new FormControl(null, Validators.required),
            'SupplierID': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null, Validators.required),
            'PortOfDischargeID': new FormControl(null, Validators.required),
            'EstimatedTimeDeparture': new FormControl(null, Validators.required),
            'EstimatedTimeArrival': new FormControl(null, Validators.required),
            'DocumentStatus': new FormControl(null, Validators.required),
            'DateDocumentReceived': new FormControl(null, Validators.required),
            'BrokerID': new FormControl(null, Validators.required),
            'DateDocsReceivedByBroker': new FormControl(null, Validators.required),
            'ImportClearanceBaiDate': new FormControl(null, Validators.required),
            'ImportClearanceBPIDate': new FormControl(null, Validators.required),
            'BankID': new FormControl(null, Validators.required),
            'AvailabilityDate': new FormControl(null, Validators.required),
            'PickupDate': new FormControl(null, Validators.required),
            'ShipmentPeriod': new FormControl(null, Validators.required),
            'Remarks': new FormControl(null, Validators.required),
            'UserID': new FormControl(0),
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.ShippingTransactionService.getShippingTransactionData().subscribe(
                response => {
                    this.shippingTransaction = response;
                    this.isLoading = false;
                }
            )
        )

        this.subscription.add(
            this.ShippingLineService.getShippingLineData().subscribe(
                response => {
                    this.shippingLine = response;
                }
            )
        )

        this.subscription.add(
            this.ContainerTypeService.getContainerTypeData().subscribe(
                response => {
                    this.containerType = response;
                }
            )
        )

        this.subscription.add(
            this.SupplierService.getSupplierData().subscribe(
                response => {
                    this.supplier = response;
                }
            )
        )

        this.subscription.add(
            this.RawMaterialsService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterial = response;
                }
            )
        )

        this.subscription.add(
            this.BrokerService.getBrokerData().subscribe(
                response => {
                    this.broker = response;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Shipping Transaction';
        this.clearItems();
    }

    clearItems() {
        this.shippingTransactionForm.reset();
        this.shippingTransactionForm.patchValue({ShippingTransactionID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.ShippingTransactionService.saveData
        (
            this.shippingTransactionForm.value.ShippingTransactionID,
            this.shippingTransactionForm.value.SPSICNumber,
            this.shippingTransactionForm.value.Validity,
            this.shippingTransactionForm.value.BLNumber,
            this.shippingTransactionForm.value.ShippingLineID.ShippingLineID,
            this.shippingTransactionForm.value.ContainerTypeID.ContainerTypeID,
            this.shippingTransactionForm.value.NoOfContainer,
            this.shippingTransactionForm.value.SupplierID.SupplierID,
            this.shippingTransactionForm.value.RawMaterialID.RawMaterialID,
            this.shippingTransactionForm.value.PortOfDischargeID,
            this.shippingTransactionForm.value.EstimatedTimeDeparture.toLocaleDateString(),
            this.shippingTransactionForm.value.EstimatedTimeArrival.toLocaleDateString(),
            this.shippingTransactionForm.value.DocumentStatus,
            this.shippingTransactionForm.value.DateDocumentReceived.toLocaleDateString(),
            this.shippingTransactionForm.value.BrokerID.BrokerID,
            this.shippingTransactionForm.value.DateDocsReceivedByBroker.toLocaleDateString(),
            this.shippingTransactionForm.value.ImportClearanceBaiDate.toLocaleDateString(),
            this.shippingTransactionForm.value.ImportClearanceBPIDate.toLocaleDateString(),
            this.shippingTransactionForm.value.BankID,
            this.shippingTransactionForm.value.AvailabilityDate.toLocaleDateString(),
            this.shippingTransactionForm.value.PickupDate.toLocaleDateString(),
            this.shippingTransactionForm.value.ShipmentPeriod,
            this.shippingTransactionForm.value.Remarks,
            this.shippingTransactionForm.value.UserID,
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.shippingTransactionForm.value.ShippingTransactionID +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.shippingTransactionForm.value.ShippingTransactionID +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.shippingTransactionForm.value.ShippingTransactionID +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();

        let ShippingLineValue = {};

        for (let i = 0; i <= this.shippingLine.length -1; i++) {
            if (this.shippingLine[i].ShippingLineID == data.ShippingLineID) {
                ShippingLineValue = this.shippingLine[i];
                break;
            }
        }

        let ContainerTypeValue = {};

        for (let i = 0; i <= this.containerType.length -1; i++) {
            if (this.containerType[i].ContainerTypeID == data.ContainerTypeID) {
                ContainerTypeValue = this.containerType[i];
                break;
            }
        }

        let SupplierValue = {};

        for (let i = 0; i <= this.supplier.length -1; i++) {
            if (this.supplier[i].SupplierID == data.SupplierID) {
                SupplierValue = this.supplier[i];
                break;
            }
        }

        let RawMaterialValue = {};

        for (let i = 0; i <= this.rawMaterial.length -1; i++) {
            if (this.rawMaterial[i].RawMaterialID == data.RawMaterialID) {
                RawMaterialValue = this.rawMaterial[i];
                break;
            }
        }

        let BrokerValue = {};

        for (let i = 0; i <= this.broker.length -1; i++) {
            if (this.broker[i].BrokerID == data.BrokerID) {
                BrokerValue = this.broker[i];
                break;
            }
        }

        this.shippingTransactionForm.setValue({
            ShippingTransactionID: data.ShippingTransactionID,
            // ContractPerformaID: data.ContractPerformaID,
            SPSICNumber: data.SPSICNumber,
            Validity: data.Validity,
            BLNumber: data.BLNumber,
            ShippingLineID: ShippingLineValue,
            ContainerTypeID: ContainerTypeValue,
            NoOfContainer: data.NoOfContainer,
            SupplierID: SupplierValue,
            RawMaterialID: RawMaterialValue,
            PortOfDischargeID: data.PortOfDischargeID,
            EstimatedTimeDeparture: new Date(data.EstimatedTimeDeparture.date),
            EstimatedTimeArrival: new Date(data.EstimatedTimeArrival.date),
            DocumentStatus: data.DocumentStatus,
            DateDocumentReceived: new Date(data.DateDocumentReceived.date),
            BrokerID: BrokerValue,
            DateDocsReceivedByBroker: new Date(data.DateDocsReceivedByBroker.date),
            ImportClearanceBaiDate: new Date(data.ImportClearanceBaiDate.date),
            ImportClearanceBPIDate: new Date(data.ImportClearanceBPIDate.date),
            BankID: data.BankID,
            AvailabilityDate: new Date(data.AvailabilityDate.date),
            PickupDate: new Date(data.PickupDate.date),
            ShipmentPeriod: data.ShipmentPeriod,
            Remarks: data.Remarks,
            UserID: data.UserID
        })
    }

}

interface ResponseData {

}