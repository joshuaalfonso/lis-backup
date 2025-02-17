import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ContractPerformaService } from "./contract-performa.service";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { ShippingLineService } from "../shipping-line/shipping-line.service";
import { ContainerTypeService } from "../container-type/container-type.service";
import { SupplierService } from "../supplier/supplier.service";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { BrokerService } from "../broker/broker.service";
import { Dialog } from "primeng/dialog";
import { TruckingService } from "../trucking/trucking.service";
import { Table } from "primeng/table";
import { BankService } from "../bank/bank.service";
import { PortOfDischargeService } from "../port-of-discharge/port-of-discharge.service";
import { AppComponent } from "../app.component";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";


@Component({
    selector: 'app-contract-performa',
    templateUrl: 'contract-performa.component.html',
    styleUrls: ['contract-performa.component.css'],

})
export class ContractPerformaComponent implements OnInit, OnDestroy{

    contractPerforma: any[] = [];

    contractPerformaform!: FormGroup;

    shippingLineForm!: FormGroup;

    visible: boolean = false;

    visibleShippingModal: boolean = false;

    dialogHeader?: string;

    isLoading: boolean = false;

    isLoading2: boolean = false;

    isLoading3: boolean = false;

    stateOptions: any[] = [{ label: 'Active', value: 'Active' },{ label: 'Completed', value: 'Completed' }, ];

    shippingTransactionFilter: any[] = [
        { label: 'Sailing', value: 1}, 
        { label: 'Landed', value: 2}, 
        // { label: 'Pull Out', value: 3, disabled: true}, 
        { label: 'Received', value: 4}, 
        { label: 'Unloaded', value: 5}, 
    ]

    value: string = 'Active';

    // value: number = 1;

    value2: number = 1;

    private subscription: Subscription = new Subscription();

    shippingTransactionForm!: FormGroup;

    pulloutForm!: FormGroup;

    ShipTranVisible: boolean = false;
    PullOutVisible: boolean = false;

    shippingLine: any[] = [];

    containerType: any[] = [];

    supplier: any[] = [];

    rawMaterial: any[] = [];

    broker: any[] = [];

    shippingTransaction: any[] = [];

    packaging: any[] = [];

    packedIn: any[] = [];

    trucking: any[] = [];

    PullOutDetail: any[] = [];

    received: any[] = [];

    unloadBL: any[] = [];

    unloadBL2: any[] = [];

    bank: any[] = [];

    selectedContractPerformaID: number = 0;

    selectedPackaging!: number;

    selectedRowPackaging: number = 0;

    rangeDates: Date[] | undefined;
    
    portOfDischarge: any[] = [];

    totalServed!: number;

    landedForm!: FormGroup;

    visibleLandedForm: boolean = false;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    userID: string = '';

    constructor(
        private ContractPerformaService: ContractPerformaService,
        private MessageService: MessageService,
        private ShippingLineService: ShippingLineService,
        private ContainerTypeService: ContainerTypeService,
        private SupplierService: SupplierService,
        private RawMaterialsService: RawMaterialsService,
        private BrokerService: BrokerService,
        private ContainerType: ContainerTypeService,
        private ConfirmationService: ConfirmationService,
        private Truckingservice: TruckingService,
        private BankService: BankService,
        private PortOfDischargeService: PortOfDischargeService,
        private AppComponent: AppComponent,
        private UsersService: UsersService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.packaging = [
            {
                PackagingID: 1,
                Packaging: 'Containerized'
            },
            {
                PackagingID: 2,
                Packaging: 'Bulk'
            }
        ]

        this.packedIn = [
            {
                PackedInID: 1,
                PackedIn: 'Bulk in Container'
            },
            {
                PackedInID: 2,
                PackedIn: 'Bag'
            },
            {
                PackedInID: 3,
                PackedIn: 'Big Bags'
            }
        ]

        this.contractPerformaform = new FormGroup({
            'ContractPerformaID': new FormControl(0),
            'ContractNo': new FormControl(null, Validators.required),
            'Quantity': new FormControl(null, Validators.required),
            'EstimatedContainer': new FormControl(null, Validators.required),
            'Packaging': new FormControl(null, Validators.required),
            'PackedInID': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null, Validators.required),
            'SupplierID': new FormControl(null, Validators.required),
            'SupplierAddress': new FormControl(null, Validators.required),
            'PortOfDischargeID': new FormControl(null, Validators.required),
            'FromShipmentPeriod': new FormControl(null, Validators.required),
            'ToShipmentPeriod': new FormControl(null, Validators.required),
            'CountryOfOrigin': new FormControl(null, Validators.required),
            'Status': new FormControl(null), 
            'UserID': new FormControl(0),
        })

        this.shippingTransactionForm = new FormGroup({
            'ShippingTransactionID': new FormControl(0),
            'ContractPerformaID': new FormControl(null),
            'ContractNo': new FormControl(null),
            'Lot': new FormControl(null),
            // 'Served': new FormControl(null),
            // 'Balance': new FormControl(null),
            'RawMaterialID': new FormControl(null),
            'SupplierID': new FormControl(null),
            'SupplierAddress': new FormControl(null),
            'Packaging': new FormControl(null),
            'AdvanceDocumentsReceived': new FormControl(null),
            'BAI_SPS_IC': new FormControl(null),
            'FromBAIValidity': new FormControl(null),
            'ToBAIValidity': new FormControl(null),
            'BPI_SPS_IC': new FormControl(null),
            'FromBPIValidity': new FormControl(null),
            'ToBPIValidity': new FormControl(null),
            'MBL': new FormControl(null),
            'BL': new FormControl(null),
            'ShippingLineID': new FormControl(null),
            'Vessel': new FormControl(null),
            'HBL': new FormControl(null),
            'Forwarder': new FormControl(null),
            'ETD': new FormControl(null),
            'ETA': new FormControl(null),
            'ATA': new FormControl(null),
            'ContainerTypeID': new FormControl(0),
            'NoOfContainer': new FormControl(null),
            'NoOfTruck': new FormControl(null),
            'Quantity': new FormControl(null),
            'BrokerID': new FormControl(null),
            'DateDocsReceivedByBroker': new FormControl(null),
            'BAI_SPS_IC_Date': new FormControl(null),
            'BPI_SPS_IC_Date': new FormControl(null),
            'OriginalDocsAvailavilityDate': new FormControl(null),
            'BankID': new FormControl(null),
            'DateOfPickup': new FormControl(null),
            'PortOfDischarge': new FormControl(null),
            'Status': new FormControl(null),
            'DateOfDischarge': new FormControl(null),
            'LodgementDate': new FormControl(null),
            'LodgementBankID': new FormControl(null),
            'GatepassRecieved': new FormControl(null),
            'AcknowledgeByLogistics': new FormControl(null),
            'StorageLastFreeDate': new FormControl(null),
            'DemurrageDate': new FormControl(null),
            'DetentionDate': new FormControl(null),
            'Remarks': new FormControl(null),
            'UserID': new FormControl(null),
        })

        this.pulloutForm = new FormGroup({
            'MBL': new FormControl(null),
            'HBL': new FormControl(null),
            'Supplier': new FormControl(null),
            'Broker': new FormControl(null),
            'DateOfDischarge': new FormControl(null),
            'StorageLastFreeDate': new FormControl(null),
            'DemurrageDate': new FormControl(null),
            'DetentionDate': new FormControl(null),
            'UserID': new FormControl(0),
        })

        this.shippingLineForm = new FormGroup({
            'ShippingLineID': new FormControl(0),
            'ShippingLine': new FormControl(null, Validators.required),
            'ContactPerson': new FormControl(null),
            'ContactNumber': new FormControl(null),
            'UserID': new FormControl(0)
        });

        this.landedForm = new FormGroup({
            'ATA': new FormControl(null, Validators.required)
        })

        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    if (user) {
                        this.userID = user!.user_id;
                        this.getUserAccess(this.userID);
                    }
                }
            )
        )

        
        this.onSelectFilter();

        // this.getData();
        this.getShippingLine()
        this.getContainerType();
        this.getSupplier();
        this.getRawMaterials();
        this.getBroker();
        this.getTrucking();
        this.getBank();
        this.getPortOfDischarge();

        this.onFilterShippingTransaction();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;
                 
                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '3.2.1':
                                this.view = true;
                                break;
                            case '3.2.2':
                                this.insert = true;
                                break;
                            case '3.2.3':
                                this.edit = true;
                                break;
                            case '3.2.4':
                                this.generateReport = true;
                                break;
                            default:
                                break;
                        }
                    }
                    
                }
            )       
        )
    }
 

    getShippingLine() {
        this.subscription.add(
            this.ShippingLineService.getShippingLineData().subscribe(
                response => {
                    this.shippingLine = response;
                }
            )
        )
    }

    getContainerType() {
        this.subscription.add(
            this.ContainerTypeService.getContainerTypeData().subscribe(
                response => {
                    this.containerType = response;
                }
            )
        )
    }

    getSupplier() {
        this.subscription.add(
            this.SupplierService.getSupplierData().subscribe(
                response => {
                    this.supplier = response;
                }
            )
        )
    }

    getRawMaterials() {
        this.subscription.add(
            this.RawMaterialsService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterial = response;
                }
            )
        )
    }

    getBroker() {
        this.subscription.add(
            this.BrokerService.getBrokerData().subscribe(
                response => {
                    this.broker = response;
                }
            )
        )
    }

    getTrucking() {
        this.subscription.add(
            this.Truckingservice.getTruckingData().subscribe(
                response => {
                    this.trucking = response;
                }
            )
        )
    }

    getReceived() {
        this.isLoading2 = true;
        this.subscription.add(
            this.ContractPerformaService.getReceived(this.selectedContractPerformaID).subscribe(
                response => {
                    this.received = response;
                    this.isLoading2 = false;
                }
            )
        )
    }

    getUnloadBL() {
        this.isLoading2 = true;
        this.subscription.add(
            this.ContractPerformaService.getUnloadedBL().subscribe(
                response => {
                    this.unloadBL = response;
                    this.isLoading2 = false;
                }
            )
        )
    }

    getUnloadBL2() {
        this.isLoading2 = true;
        this.subscription.add(
            this.ContractPerformaService.getUnloadedBL2(this.selectedContractPerformaID).subscribe(
                response => {
                    this.unloadBL2 = response;
                    this.isLoading2 = false;
                }
            )
        )
    }
    
    getBank() {
        this.subscription.add(
            this.BankService.getData().subscribe(
                response => {
                    this.bank = response;
                }
            )
        )
    }

    getPortOfDischarge() {
        this.subscription.add(
            this.PortOfDischargeService.getData().subscribe(
                response => {
                    this.portOfDischarge = response;
                }
            )
        )
    }

    toggleWideScreen() {
        this.AppComponent.onToggleWideScreen();
    }

    getStatus(status: number) {
        switch (status) {
            case 1:
                return 'Sailing';
            case 2:
                return 'Landed';
            case 3:
                return 'PullOut';
            default:
                throw new Error(`Unknown status: ${status}`);
        }
    }

    getSeverity(status: number) {
        switch (status) {
            case 1:
                return 'warning';
            case 2:
                return 'info';
            case 3:
                return 'success';
            default:
                throw new Error(`Unknown status: ${status}`);
        }
    }

    getDate(date: {date: string}) {
        if (!date) return 'No Data';

        let dateValue = new Date(date.date).toLocaleDateString();
        let noDate = new Date('1/1/1900').toLocaleDateString();

        if (dateValue == noDate) {
            return 'No Data'
        }

        return dateValue;
    }


    //show contract dialog
    showDialog() {
        if (!this.insert) {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });
            return;
        }

        this.visible = true;
        this.dialogHeader = 'Add Contract Performa';
        this.clearItems();
    }

    //reset contract dialog form
    clearItems() {
        this.contractPerformaform.reset();
        this.contractPerformaform.patchValue({
            ContractPerformaID: 0, 
            Status: 'Active', 
            UserID: this.userID
        })
    }

    //show shipping transaction dialog 
    showSecondDialog() {
        this.ShipTranVisible = true;
        this.shippingClearItems();
    }

    showPullOutDialog() {
        this.PullOutVisible = !this.PullOutVisible;
        this.PullOutDetail = [];
        // this.addPullOutRow();
    }

    //reset shipping transaction dialog form
    shippingClearItems() {
        this.shippingTransactionForm.reset();
        this.shippingTransactionForm.patchValue({ShippingTransactionID: 0})
    }

    showShippingLineDialog() {
        this.shippingLineClearItems();
        this.visibleShippingModal = true;
    }

    shippingLineClearItems() {
        this.shippingLineForm.reset();
        this.shippingLineForm.patchValue({ShippingLineID: 0})
    }

    
    //submit contract form 
    onSubmit() {
        // console.log(this.contractPerformaform.value)
        let authObs: Observable<ResponseData>;
        authObs = this.ContractPerformaService.saveData
        (
            this.contractPerformaform.value.ContractPerformaID,
            this.contractPerformaform.value.ContractNo,
            this.contractPerformaform.value.Quantity,
            this.contractPerformaform.value.EstimatedContainer,
            this.contractPerformaform.value.Packaging.PackagingID,
            this.contractPerformaform.value.PackedInID.PackedInID,
            this.contractPerformaform.value.RawMaterialID.RawMaterialID,
            this.contractPerformaform.value.SupplierID.SupplierID,
            this.contractPerformaform.value.SupplierAddress,
            this.contractPerformaform.value.PortOfDischargeID.PortOfDischargeID,
            this.contractPerformaform.value.FromShipmentPeriod.toLocaleDateString(),
            this.contractPerformaform.value.ToShipmentPeriod.toLocaleDateString(),
            this.contractPerformaform.value.CountryOfOrigin,
            this.contractPerformaform.value.Status,
            this.userID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Contract ' + this.contractPerformaform.value.ContractNo +  ' successfully recorded', 
                    life: 3000 
                });
                this.clearItems();
                this.onSelectFilter();
            } 

            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Contract ' + this.contractPerformaform.value.ContractNo +  ' successfully updated', 
                    life: 3000 
                });
                this.clearItems();
                this.onSelectFilter();
            }

            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Contract ' + this.contractPerformaform.value.ContractNo +  ' already exist', 
                    life: 3000 
                });
            }
        
        }, 
        errorMessage => {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        })
    }

    // find object for dropdown
    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID === array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    //fill contract form input
    onSelect(event: MouseEvent ,data: any) {
        // this.showDialog();
        event.stopPropagation();
        if (!this.edit) {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });
            return;
        }
        this.visible = true;
        this.clearItems();
        this.dialogHeader = 'Edit Contract Performa';

        let PackagingValue = this.findObjectByID(data.Packaging, 'PackagingID', this.packaging);
        let RawMatsValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterial);
        let SupplierValue = this.findObjectByID(data.SupplierID, 'SupplierID', this.supplier);
        let PortOfDischargeValue = this.findObjectByID(data.PortOfDischargeID, 'PortOfDischargeID', this.portOfDischarge);
        let PackedInValue = this.findObjectByID(data.PackedInID, 'PackedInID', this.packedIn);

        this.contractPerformaform.setValue({
            ContractPerformaID: data.ContractPerformaID,
            ContractNo: data.ContractNo,
            Quantity: data.Quantity,
            EstimatedContainer: data.EstimatedContainer,
            Packaging: PackagingValue,
            PackedInID: PackedInValue,
            RawMaterialID: RawMatsValue,
            SupplierID: SupplierValue,
            SupplierAddress: data.SupplierAddress,
            PortOfDischargeID: PortOfDischargeValue,
            FromShipmentPeriod: new Date(data.FromShipmentPeriod.date),
            ToShipmentPeriod: new Date(data.ToShipmentPeriod.date),
            CountryOfOrigin: data.CountryOfOrigin,
            Status: data.Status,
            UserID: data.UserID,
        })

    }

    // auto fill supplier address
    onSelectSupplier(event: any) {
        if (!event.value) {
            this.contractPerformaform.patchValue({SupplierAddress: null});
            return;
        } 

        this.contractPerformaform.patchValue({
            SupplierAddress: event.value.Address
        })
    }

    // add shipping transaction to contract
    onAddTransaction(event: MouseEvent ,data: any, dialog: Dialog) {
        event.stopPropagation();

        if (!this.insert) {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });
            return;
        }

        dialog.maximize();
        this.showSecondDialog();
        this.selectedPackaging = data.Packaging;

        let RawMatsValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterial);
        let SupplierValue = this.findObjectByID(data.SupplierID, 'SupplierID', this.supplier);
        let PackagingValue = this.findObjectByID(data.Packaging, 'PackagingID', this.packaging);

        this.shippingTransactionForm.patchValue({
            ContractPerformaID: data.ContractPerformaID,
            ContractNo: data.ContractNo,
            EstimatedContainer: data.EstimatedContainer,
            RawMaterialID: RawMatsValue,
            SupplierID: SupplierValue,
            SupplierAddress: data.SupplierAddress,
            Packaging: PackagingValue,
            Status: 1
        })

        // this.totalServed = 0;
        // for (let i = 0; i < this.shippingTransaction.length; i++) {
        //     if (this.shippingTransaction[i].Served) {
        //         this.totalServed += this.shippingTransaction[i].Served;
        //     }
        // }

        // console.log(this.shippingTransactionForm.value.EstimatedContainer - this.totalServed)

    }

    // submit shipping transaction form
    onSubmitShipTran() {

        // console.log(this.shippingTransactionForm.value)
        
        let authObs: Observable<ResponseData>;
        authObs = this.ContractPerformaService.saveShippingTransaction
        (
            this.shippingTransactionForm.value.ShippingTransactionID,
            this.shippingTransactionForm.value.ContractPerformaID,
            this.shippingTransactionForm.value.Lot,
            // this.shippingTransactionForm.value.Served,
            // this.shippingTransactionForm.value.Balance,
            this.shippingTransactionForm.value.RawMaterialID.RawMaterialID,
            this.shippingTransactionForm.value.SupplierID.SupplierID,
            this.shippingTransactionForm.value.Packaging.PackagingID,
            this.shippingTransactionForm.value.AdvanceDocumentsReceived ? this.shippingTransactionForm.value.AdvanceDocumentsReceived.toLocaleDateString() : null,
            this.shippingTransactionForm.value.BAI_SPS_IC,
            this.shippingTransactionForm.value.FromBAIValidity ? this.shippingTransactionForm.value.FromBAIValidity.toLocaleDateString() : null,
            this.shippingTransactionForm.value.ToBAIValidity ? this.shippingTransactionForm.value.ToBAIValidity.toLocaleDateString() : null,
            this.shippingTransactionForm.value.BPI_SPS_IC,
            this.shippingTransactionForm.value.FromBPIValidity ? this.shippingTransactionForm.value.FromBPIValidity.toLocaleDateString() : null,
            this.shippingTransactionForm.value.ToBPIValidity ?  this.shippingTransactionForm.value.ToBPIValidity.toLocaleDateString() : null,
            this.shippingTransactionForm.value.MBL ? this.shippingTransactionForm.value.MBL : null,
            this.shippingTransactionForm.value.BL ? this.shippingTransactionForm.value.BL : null,
            this.shippingTransactionForm.value.ShippingLineID ? this.shippingTransactionForm.value.ShippingLineID.ShippingLineID : null,
            this.shippingTransactionForm.value.Vessel,
            this.shippingTransactionForm.value.HBL,
            this.shippingTransactionForm.value.Forwarder,
            this.shippingTransactionForm.value.ETD ? this.shippingTransactionForm.value.ETD.toLocaleDateString() : null,
            this.shippingTransactionForm.value.ETA ? this.shippingTransactionForm.value.ETA.toLocaleDateString() : null,
            this.shippingTransactionForm.value.ATA ? this.shippingTransactionForm.value.ATA.toLocaleDateString() : null,
            this.shippingTransactionForm.value.ContainerTypeID ? this.shippingTransactionForm.value.ContainerTypeID.ContainerTypeID : null,
            this.shippingTransactionForm.value.NoOfContainer,
            this.shippingTransactionForm.value.NoOfTruck,
            this.shippingTransactionForm.value.Quantity,
            this.shippingTransactionForm.value.BrokerID ? this.shippingTransactionForm.value.BrokerID.BrokerID : null,
            this.shippingTransactionForm.value.DateDocsReceivedByBroker ? this.shippingTransactionForm.value.DateDocsReceivedByBroker.toLocaleDateString() : null,
            this.shippingTransactionForm.value.BAI_SPS_IC_Date ? this.shippingTransactionForm.value.BAI_SPS_IC_Date.toLocaleDateString() : null,
            this.shippingTransactionForm.value.BPI_SPS_IC_Date ? this.shippingTransactionForm.value.BPI_SPS_IC_Date.toLocaleDateString() : null,
            this.shippingTransactionForm.value.OriginalDocsAvailavilityDate ? this.shippingTransactionForm.value.OriginalDocsAvailavilityDate.toLocaleDateString() : null,
            this.shippingTransactionForm.value.BankID ? this.shippingTransactionForm.value.BankID.BankID : 0,
            this.shippingTransactionForm.value.DateOfPickup ? this.shippingTransactionForm.value.DateOfPickup.toLocaleDateString() : null,
            this.shippingTransactionForm.value.PortOfDischarge,
            this.shippingTransactionForm.value.Status,
            this.shippingTransactionForm.value.DateOfDischarge ?  this.shippingTransactionForm.value.DateOfDischarge.toLocaleDateString() : null,
            this.shippingTransactionForm.value.LodgementDate ? this.shippingTransactionForm.value.LodgementDate.toLocaleDateString() : null,
            this.shippingTransactionForm.value.LodgementBankID ? this.shippingTransactionForm.value.LodgementBankID.BankID : 0,
            this.shippingTransactionForm.value.GatepassRecieved ? this.shippingTransactionForm.value.GatepassRecieved.toLocaleDateString() : null,
            this.shippingTransactionForm.value.AcknowledgeByLogistics ? this.shippingTransactionForm.value.AcknowledgeByLogistics.toLocaleDateString() : null,
            this.shippingTransactionForm.value.StorageLastFreeDate ? this.shippingTransactionForm.value.StorageLastFreeDate.toLocaleDateString() : null,
            this.shippingTransactionForm.value.DemurrageDate ? this.shippingTransactionForm.value.DemurrageDate.toLocaleDateString() : null,
            this.shippingTransactionForm.value.DetentionDate ? this.shippingTransactionForm.value.DetentionDate.toLocaleDateString() : null,
            this.shippingTransactionForm.value.Remarks,
            this.userID,
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Item: ' + this.shippingTransactionForm.value.ContractPerformaID +  ' successfully recorded', 
                    life: 3000 
                });
                this.shippingClearItems();
                this.onFilterShippingTransaction()
                this.ShipTranVisible = false;
            } 
            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Item: ' + this.shippingTransactionForm.value.ContractPerformaID +  ' successfully updated', 
                    life: 3000 
                });
                this.shippingClearItems();
                this.onFilterShippingTransaction()
                this.ShipTranVisible = false;
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.shippingTransactionForm.value.ShippingTransactionID +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, 
        errorMessage => {
            this.MessageService.add({ 
                severity: 'error', summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        })
    }

    // fill shipping transaction form inputs
    onSelectShipping(data: any, dialog?: Dialog) {
        
        if (!this.edit) {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });
            return;
        }
        // console.log(data);

        dialog?.maximize();

        this.ShipTranVisible = true;

        this.selectedPackaging = data.Packaging;

        
        this.onUpdateShippingTransaction(data);
    }

    onUpdateShippingTransaction(data: any) {
        

        let containerValue = this.findObjectByID(data.ContainerTypeID, 'ContainerTypeID', this.containerType);

        let supplierValue = this.findObjectByID(data.SupplierID, 'SupplierID', this.supplier);

        let rawMatValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterial);

        let brokerValue = this.findObjectByID(data.BrokerID, 'BrokerID', this.broker);

        let packagingValue = this.findObjectByID(data.Packaging, 'PackagingID', this.packaging);

        let shippingLineValue = this.findObjectByID(data.ShippingLineID, 'ShippingLineID', this.shippingLine);

        let Bankvalue = this.findObjectByID(data.BankID, 'BankID', this.bank);

        let LodgementBankValue = this.findObjectByID(data.LodgementBankID, 'BankID', this.bank);
        
        this.shippingTransactionForm.setValue({
            ShippingTransactionID: data.ShippingTransactionID,
            ContractPerformaID: data.ContractPerformaID,
            ContractNo: data.ContractNo,
            Lot: data.Lot,
            // Served: data.Served,
            // Balance: data.Balance,
            RawMaterialID: rawMatValue,
            SupplierID: supplierValue,
            SupplierAddress: data.SupplierAddress,
            Packaging: packagingValue,
            AdvanceDocumentsReceived: data.AdvanceDocumentsReceived == null ? null : new Date(data.AdvanceDocumentsReceived.date),
            BAI_SPS_IC: data.BAI_SPS_IC,
            FromBAIValidity: data.FromBAIValidity == null ? null : new Date(data.FromBAIValidity.date),
            ToBAIValidity: data.ToBAIValidity == null ? null : new Date(data.ToBAIValidity.date),
            BPI_SPS_IC: data.BPI_SPS_IC,
            FromBPIValidity: data.FromBPIValidity == null ? null : new Date(data.FromBPIValidity.date),
            ToBPIValidity: data.ToBPIValidity == null ? null : new Date(data.ToBPIValidity.date),
            MBL: data.MBL,
            BL: data.BL,
            ShippingLineID: shippingLineValue,
            Vessel: data.Vessel,
            HBL: data.HBL,
            Forwarder: data.Forwarder,
            ETD: data.ETD == null ? null : new Date(data.ETD.date),
            ETA: data.ETA == null ? null : new Date(data.ETA.date),
            ATA: data.ATA == null ? null : new Date(data.ATA.date),
            ContainerTypeID: containerValue,
            NoOfContainer: data.NoOfContainer,
            NoOfTruck: data.NoOfTruck,
            Quantity: data.Quantity,
            BrokerID: brokerValue,
            DateDocsReceivedByBroker: data.DateDocsReceivedByBroker == null ? null : new Date(data.DateDocsReceivedByBroker.date),
            BAI_SPS_IC_Date: data.BAI_SPS_IC_Date == null ? null : new Date(data.BAI_SPS_IC_Date.date),
            BPI_SPS_IC_Date: data.BPI_SPS_IC_Date == null ? null : new Date(data.BPI_SPS_IC_Date.date),
            // BPI_SPS_IC_Date: data.BAI_SPS_IC_Date,
            OriginalDocsAvailavilityDate: data.OriginalDocsAvailavilityDate == null ? null : new Date(data.OriginalDocsAvailavilityDate.date),
            BankID: Bankvalue,
            DateOfPickup: data.DateOfPickup == null ? null : new Date(data.DateOfPickup.date),
            PortOfDischarge: data.PortOfDischarge,
            Status: data.Status,
            DateOfDischarge: data.DateofDischarge == null ? null : new Date(data.DateofDischarge.date),
            LodgementDate: data.LodgementDate === null ? null : new Date(data.LodgementDate.date),
            LodgementBankID: LodgementBankValue,
            GatepassRecieved: data.GatepassRecieved === null ? null : new Date(data.GatepassRecieved.date),
            AcknowledgeByLogistics: data.AcknowledgeByLogistics == null ? null : new Date(data.AcknowledgeByLogistics.date),
            StorageLastFreeDate: data.StorageLastFreeDate == null ? null : new Date(data.StorageLastFreeDate.date),
            DemurrageDate: data.DemurrageDate == null ? null : new Date(data.DemurrageDate.date),
            DetentionDate: data.DetentionDate == null ? null : new Date(data.DetentionDate.date),
            Remarks: data.Remarks,
            UserID: data.UserID
        })
    }

    showLandedForm(data: any) {
        this.visibleLandedForm = true;
        this.clearLandedForm();
        this.onUpdateShippingTransaction(data);
    }

    clearLandedForm() {
        this.landedForm.reset();
    }

    // transfer sailing to landed
    onShippingTransLanded() {
        // this.selectedPackaging = data.Packaging;
        // this.onUpdateShippingTransaction(data);
        // this.shippingTransactionForm.patchValue({Status: 2});
        // this.onSubmitShipTran();

        this.shippingTransactionForm.patchValue({ATA: new Date(this.landedForm.value.ATA), Status: 2})
        this.onSubmitShipTran();
        this.visibleLandedForm = false;
        this.clearItems();
    }

    // transfer landed to pullout
    onPullOut(data: any) {
        this.selectedPackaging = data.Packaging;

        this.onUpdateShippingTransaction(data);
        this.shippingTransactionForm.patchValue({Status: 3});
        this.onSubmitShipTran();
    }

    // select/click contract row
    onSelectContract(data: any) {
        // remove selected contract 
        if (this.selectedContractPerformaID === data.ContractPerformaID)  {
            this.selectedContractPerformaID = 0;
            this.selectedRowPackaging = 0;
            this.shippingTransactionFilter = this.shippingTransactionFilter.filter(index => index.value != 3)
            this.onFilterShippingTransaction();
            return;
        }
        this.selectedContractPerformaID = data.ContractPerformaID;


        if (this.selectedRowPackaging === data.Packaging) {
            this.onFilterShippingTransaction();
            return;
        }
        this.selectedRowPackaging = data.Packaging;

        if (this.selectedRowPackaging === 1) {
            // this.shippingTransactionFilter = [...this.shippingTransactionFilter, { label: 'Pull Out', value: 3}]
            this.shippingTransactionFilter.splice(2, 0, { label: 'Pull Out', value: 3})
            this.shippingTransactionFilter = [...this.shippingTransactionFilter];
        } else if (this.selectedRowPackaging === 2) {
            this.shippingTransactionFilter = this.shippingTransactionFilter.filter(index => index.value != 3)
        }

        if (this.selectedRowPackaging)
        this.onFilterShippingTransaction();
    }

    // contract filter
    onSelectFilter() {
        if (this.value === 'Active') this.value2 = 1;
        if (this.value === 'Completed') this.value2 = 2;
        this.selectedContractPerformaID = 0;
        this.shippingTransaction = [];
        this.isLoading = true;
        this.subscription.add(
            this.ContractPerformaService.getContractPerformaFilter(this.value).subscribe(
                response => {
                    this.isLoading = false;
                    this.contractPerforma = response;
                }
            )
        )
    }

    // shipping transaction filter
    onFilterShippingTransaction() {

        if (this.value2 === 4) {
            this.getReceived();
            return;
        }

        // if (this.value2 === 5) {
        //     this.getUnloadBL();
        //     return;
        // }

        if (this.value2 === 5) {
            this.getUnloadBL2();
            return;
        }

        this.isLoading2 = true;
        this.subscription.add(
            this.ContractPerformaService.getShippingTransactionFilter(this.value2, this.selectedContractPerformaID).subscribe(
                response => {
                    this.isLoading2 = false;
                    this.shippingTransaction = response;

                }
            )
        )
    }

    

    // confirm1(event: Event, data: any) {
    //     this.ConfirmationService.confirm({
    //         target: event.target as EventTarget,
    //         message: 'Are you sure that you want to proceed?',
    //         header: 'Confirmation',
    //         icon: 'pi pi-exclamation-triangle',
    //         rejectButtonStyleClass:"p-button-text",
    //         accept: () => {
    //             this.onShippingTransLanded(data);
    //         }
    //     });
    // }

    // addPullOut(data: any, dialog: Dialog) {
    //     this.showPullOutDialog();
    //     dialog.maximize();

    //     this.pulloutForm.patchValue({
    //         MBL: data.MBL,
    //         HBL: data.HBL,
    //         Supplier: data.Supplier,
    //         Broker: data.Broker
    //     })
    // }

    addPullOutRow() {

        let data = {
            PullOutID: 0,
            PullOutDate: null,
            ContainerNumber: null,
            DateIn: null,
            DateOut: null,
            ReturnDate: null,
            TruckingID: null,
            DateOfDischarge: this.pulloutForm.value.DateOfDischarge == null ? null : new Date(this.pulloutForm.value.DateOfDischarge.date),
            Storage: this.pulloutForm.value.StorageLastFreeDate == null ? null : new Date(this.pulloutForm.value.StorageLastFreeDate.date),
            Demurrage:  this.pulloutForm.value.DemurrageDate == null ? null : new Date(this.pulloutForm.value.DemurrageDate.date),
            Detention:  this.pulloutForm.value.DetentionDate == null ? null : new Date(this.pulloutForm.value.DetentionDate.date),
            Remarks: null,
            deleted: 0
        }
        this.PullOutDetail.push(data)
    }

    removePullOutRow(index: number) {
        this.PullOutDetail.splice(index, 1);
    }

    onSelectPullOut(data: any, dialog: Dialog) {
        // console.log(data);
        dialog.maximize();
        this.showPullOutDialog();
        this.PullOutDetail = [];

        this.pulloutForm.patchValue({
            MBL: data.MBL,
            HBL: data.HBL,
            Supplier: data.Supplier,
            Broker: data.Broker,
            DateOfDischarge: data.DateOfDischarge,
            StorageLastFreeDate: data.StorageLastFreeDate,
            DemurrageDate: data.DemurrageDate,
            DetentionDate: data.DetentionDate
        })

        // console.log(this.pulloutForm.value)


        this.isLoading3 = true;

        this.ContractPerformaService.getPullOutDetail(data.MBL).subscribe(
            response => {
                for (let i = 0; i < response.length; i++) {
                    let TruckingValue = this.findObjectByID(response[i].TruckingID, 'TruckingID', this.trucking);
                    let data = {
                        PullOutID: response[i].PullOutID,
                        PullOutDate: response[i].PullOutDate == null ? null : new Date(response[i].PullOutDate.date),
                        ContainerNumber: response[i].ContainerNumber,
                        DateIn: response[i].DateIn == null ? null : new Date(response[i].DateIn.date),
                        DateOut: response[i].DateOut == null ? null : new Date(response[i].DateOut.date),
                        ReturnDate: response[i].ReturnDate == null ? null : new Date(response[i].ReturnDate.date),
                        TruckingID: TruckingValue,
                        DateOfDischarge: response[i].DateOfDischarge == null ? null : new Date(response[i].DateOfDischarge.date),
                        Storage: response[i].Storage == null ? null : new Date(response[i].Storage.date),
                        Demurrage: response[i].Demurrage == null ? null : new Date(response[i].Demurrage.date),
                        Detention: response[i].Detention == null ? null : new Date(response[i].Detention.date),
                        Remarks: response[i].Remarks,
                        deleted: response[i].deleted
                    }
                    this.PullOutDetail.push(data)
                }
                this.isLoading3 = false;
            }
        )

    }

    onSubmitPullOutForm() {

        let TransformedArray: {
            PullOutID: number,
            PullOutDate: string | null,
            ContainerNumber: number,
            DateIn: string | null,
            DateOut: string | null,
            ReturnDate: string | null,
            TruckingID: any
            Storage: string | null,
            DateOfDischarge: string | null,
            Demurrage: string | null,
            Detention: string | null,
            Remarks: String | null,
            deleted: number
        }[] = [];
        
        this.PullOutDetail.forEach(item => {
            TransformedArray.push({
                PullOutID: item.PullOutID,
                PullOutDate: item.PullOutDate === null ? null : new Date(item.PullOutDate).toLocaleDateString(),
                ContainerNumber: item.ContainerNumber,
                DateIn: item.DateIn === null ? null : new Date(item.DateIn).toLocaleDateString(),
                DateOut: item.DateOut === null ? null : new Date(item.DateOut).toLocaleDateString(),
                ReturnDate: item.ReturnDate === null ? null : new Date(item.ReturnDate).toLocaleDateString(),
                TruckingID: item.TruckingID,
                DateOfDischarge: item.DateOfDischarge === null ? null : new Date(item.DateOfDischarge).toLocaleDateString(),
                Storage: item.Storage === null ? null : new Date(item.Storage).toLocaleDateString(),
                Demurrage: item.Demurrage === null ? null : new Date(item.Demurrage).toLocaleDateString(),
                Detention: item.Detention === null ? null : new Date(item.Detention).toLocaleDateString(),
                Remarks: item.Remarks,
                deleted: item.deleted
            });
        });
        // console.log(TransformedArray);
       
        let authObs: Observable<ResponseData>;
        authObs = this.ContractPerformaService.savePullOut
        (
            this.pulloutForm.value.MBL,
            this.pulloutForm.value.HBL,
            this.pulloutForm.value.UserID,
            TransformedArray
        )

        authObs.subscribe(response => {

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: ' successfully recorded', 
                    life: 3000 
                });
                // this.shippingClearItems();
                this.onFilterShippingTransaction();
                this.showPullOutDialog();
            } 
            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: ' successfully updated', 
                    life: 3000 
                });
                // this.shippingClearItems();
                this.onFilterShippingTransaction();
                this.showPullOutDialog();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.shippingTransactionForm.value.MBL +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, 

        errorMessage => {
            this.MessageService.add({ 
                severity: 'error', summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        })
        
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }

    onSubmitShippingModal() {

    }

    
    
}

interface ResponseData {

}