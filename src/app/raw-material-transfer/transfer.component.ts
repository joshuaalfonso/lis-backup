import { Component, OnDestroy, OnInit } from "@angular/core";
import { TransferRequestModel, TransferService } from "./transfer.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { CheckerService } from "../checker/checker.service";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { WarehouseService } from "../warehouse/warehouse.service";
import { WarehousePartitionService } from "../warehouse-partition/warehouse-partition.service";
import { TruckService } from "../truck/truck.service";
import { DriverService } from "../driver/driver.service";
import { WarehouseLocationService } from "../warehouse-location/warehouse-location.service";
import { WeigherService } from "../weigher/weigher.service";
import { BinloadService } from "../binload/binload.service";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";
import { DispatcherService } from "../dispatcher/dispatcher.service";
import { GuardService } from "../guard/guard.service";
import { Dialog } from "primeng/dialog";


@Component({
    selector: 'app-transfer',
    templateUrl: 'transfer.component.html',
    styleUrls: ['transfer.component.css'],
})
export class TransferComponent implements OnInit, OnDestroy {

    transferRequest: any = [];

    transfer: any = [];

    transferDetails: any = {};

    transferRequestForm!: FormGroup;

    transferForm!: FormGroup;

    sourceCheckerForm!: FormGroup;

    destinationForm!: FormGroup;

    visible: boolean = false;
    visibleTransferRequest: boolean = false;
    visibleCheckerSource: boolean = false;
    visibleDestination: boolean = false;
    partitionModal: boolean = false;
    sidebarVisible2: boolean = false;

    rawMaterials: any[] = [];

    warehouseLocation: any[] = [];

    warehouseName: any[] = [];

    warehousePartition: any[] = [];

    fromWarehouseLocation: any[] = [];
    toWarehouseLocation: any[] = [];

    fromWarehouse: any[] = [];
    toWarehouse: any[] = [];

    fromWarehousePartition: any[] = [];
    toWarehousePartition: any[] = [];

    truck: any[] = [];

    checker: any[] = [];
    driver: any[] = [];
    weigher: any[] = [];
    dispatcher: any[] = [];
    guard: any[] = [];

    isLoading: boolean = false;

    dialogHeader?: string;

    // stateOptions: any[] = [
    //     { label: 'Preparation', value: 0}, 
    //     { label: 'Source', value: 1 }, 
    //     {label: 'Destination', value: 2}, 
    //     {label: 'Completed', value: 3}
    // ];
    stateOptions: any[] = [];

    viewOptions: any[] = [
        { label: 'Off', value: 'table', icon: 'pi pi-list' }, 
        { label: 'On', value: 'card', icon: 'pi pi-table' }    
    ]

    value!: number;

    viewValue: string = 'table';

    status: any[] = [];
    sourceDetail: any[] = [];
    // destinationDetail: any[] = [];
    warehousePartitionStock: any[] = [];
    selectedIndex!: number;

    transferType: any[] = [
        {
            TransferTypeID: 1,
            TransferType: 'Partial'
        },
        {
            TransferTypeID: 2,
            TransferType: 'Full'
        }
    ];

    items: any[] = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Refresh',
                    icon: 'pi pi-refresh'
                },
                {
                    label: 'Export',
                    icon: 'pi pi-upload'
                }
            ]
        }
    ];



    categories: any[] = [
        { name: 'Partial', TransferTypeID: 1 },
        { name: 'Full', TransferTypeID: 2 },
    ];
    

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;
    dispatcherView: boolean = false;
    sourceCheckerView: boolean = false;
    destinationView: boolean = false;
    completedView: boolean = false;

    maxDate!: Date;

    partitionStockQuantity: number = 0;
    partitionStockWeight: number = 0;

    first = 0;
    rows = 5; // Initial number of rows per page
    totalRecords = this.transferRequest.length; // Total number of cards

    paginatedCards: any = [];
 
    userID: string = '';

    private subscription: Subscription = new Subscription();

    constructor(
        private TransferService: TransferService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private CheckerService: CheckerService,
        private RawMaterialService: RawMaterialsService,
        private WarehouseService: WarehouseService,
        private WarehousePartitionService: WarehousePartitionService,
        private TruckService: TruckService,
        private DriverService: DriverService,
        private WarehouseLocationService: WarehouseLocationService,
        private WeigherService: WeigherService,
        private BinloadService: BinloadService,
        private auth: AuthService,
        private UsersService: UsersService,
        private DispatcherService: DispatcherService,
        private GuardService: GuardService
    ) {}

    ngOnInit(): void {
        this.maxDate = new Date();

        this.transferForm = new FormGroup({
            'RawMaterialTransferID': new FormControl(0),
            'DispatcherRequestID': new FormControl(0),
            'TransferCode': new FormControl(0),
            'PO': new FormControl(0),
            'BL': new FormControl(0),
            'DateTransfer': new FormControl(null, Validators.required),
            'TransferTypeID': new FormControl(null, Validators.required),
            'FromWarehouseLocationID': new FormControl(null, Validators.required),
            'ToWarehouseLocationID': new FormControl(null, Validators.required),
            'FromWarehouseID': new FormControl(null),
            'FromWarehousePartitionID': new FormControl(null),
            'ToWarehouseID': new FormControl(null),
            'ToWarehousePartitionID': new FormControl(null),
            'RawMaterialID': new FormControl(null),
            'Quantity': new FormControl(null),
            'Weight': new FormControl(null),
            'LossQuantity': new FormControl(null),
            'OverQuantity': new FormControl(null),
            'LossWeight': new FormControl(null),
            'OverWeight': new FormControl(null),
            'TruckID': new FormControl(null, Validators.required),
            'DriverID': new FormControl(null, Validators.required),
            'DispatcherID': new FormControl(null, Validators.required),
            'CheckerID': new FormControl(null),
            'GuardID': new FormControl(null),
            // 'DepartureWeight': new FormControl(null),
            'ArrivalWeight': new FormControl(null),
            'WeigherIn': new FormControl(null),
            'WeigherOut': new FormControl(null),
            'FeedmixDeparture': new FormControl(null),
            'FeedmixArrival': new FormControl(null),
            'SourceDeparture': new FormControl(null),
            'SourceArrival': new FormControl(null),
            'Status': new FormControl(0),
            'UserID': new FormControl(0),
            'WarehousePartitionStockID': new FormControl(0),
        })

        this.transferRequestForm = new FormGroup({
            'DispatcherRequestID': new FormControl(null),
            'RequestDate': new FormControl(null, Validators.required),
            'FromWarehouseLocationID': new FormControl(null, Validators.required),
            'ToWarehouseLocationID': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null, Validators.required),
            'RequestWeight': new FormControl(null, Validators.required),
            'Status': new FormControl(null, Validators.required),
            'UserID': new FormControl(null, Validators.required),
        })

        this.sourceCheckerForm = new FormGroup({
            'RawMaterialTransferID': new FormControl(0),
            'DispatcherRequestID': new FormControl(0),
            'TransferCode': new FormControl(0),
            'PO': new FormControl(0),
            'BL': new FormControl(0),
            'DateTransfer': new FormControl(null),
            'TransferTypeID': new FormControl(null),
            'FromWarehouseLocationID': new FormControl(null),
            'ToWarehouseLocationID': new FormControl(null),
            'FromWarehouseID': new FormControl(null, Validators.required),
            'FromWarehousePartitionID': new FormControl(null, Validators.required),
            'ToWarehouseID': new FormControl(null),
            'ToWarehousePartitionID': new FormControl(null),
            'RawMaterialID': new FormControl(null),
            'Quantity': new FormControl(null),
            'Weight': new FormControl(null),
            'LossQuantity': new FormControl(null),
            'OverQuantity': new FormControl(null),
            'LossWeight': new FormControl(null),
            'OverWeight': new FormControl(null),
            'TruckID': new FormControl(null),
            'DriverID': new FormControl(null),
            'DispatcherID': new FormControl(null),
            'CheckerID': new FormControl(null, Validators.required),
            'GuardID': new FormControl(null, Validators.required),
            // 'DepartureWeight': new FormControl(null),
            'ArrivalWeight': new FormControl(null),
            'WeigherIn': new FormControl(null),
            'WeigherOut': new FormControl(null),
            'FeedmixDeparture': new FormControl(null),
            'FeedmixArrival': new FormControl(null),
            'SourceDeparture': new FormControl(null),
            'SourceArrival': new FormControl(null),
            'Status': new FormControl(0),
            'UserID': new FormControl(0),
            'WarehousePartitionStockID': new FormControl(0),
        })

        this.destinationForm = new FormGroup({
            'RawMaterialTransferID': new FormControl(0),
            'DispatcherRequestID': new FormControl(0),
            'TransferCode': new FormControl(0),
            'PO': new FormControl(0),
            'BL': new FormControl(0),
            'DateTransfer': new FormControl(null),
            'TransferTypeID': new FormControl(null),
            'FromWarehouseLocationID': new FormControl(null),
            'ToWarehouseLocationID': new FormControl(null),
            'FromWarehouseID': new FormControl(null),
            'FromWarehousePartitionID': new FormControl(null),
            'ToWarehouseID': new FormControl(null, Validators.required),
            'ToWarehousePartitionID': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null),
            'Quantity': new FormControl(null, Validators.required),
            'Weight': new FormControl(null, Validators.required),
            'LossQuantity': new FormControl(null),
            'OverQuantity': new FormControl(null),
            'LossWeight': new FormControl(null),
            'OverWeight': new FormControl(null),
            'TruckID': new FormControl(null),
            'DriverID': new FormControl(null),
            'DispatcherID': new FormControl(null),
            'CheckerID': new FormControl(null),
            'GuardID': new FormControl(null),
            // 'DepartureWeight': new FormControl(null),
            'ArrivalWeight': new FormControl(null),
            'WeigherIn': new FormControl(null),
            'WeigherOut': new FormControl(null),
            'FeedmixDeparture': new FormControl(null, Validators.required),
            'FeedmixArrival': new FormControl(null, Validators.required),
            'SourceDeparture': new FormControl(null),
            'SourceArrival': new FormControl(null),
            'Status': new FormControl(0),
            'UserID': new FormControl(0),
            'WarehousePartitionStockID': new FormControl(0),
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


        this.getTransferRequestData();
        // this.getData();
        this.getRawMaterials();
        this.getWarehouseData();
        this.getWarehousePartition();
        this.getCheckerData();
        this.getTruck();
        this.getDriver();
        this.getWarehouseLocation();
        this.getWeigher();
        this.getDispatcher();
        this.getGuard();
        
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '3.5.1':
                                this.view = true;
                                break;
                            case '3.5.2':
                                this.insert = true;
                                break;
                            case '3.5.3':
                                this.edit = true;
                                break;
                            case '3.5.4':
                                this.generateReport = true;
                                break;
                            case '3.5.5':
                                this.dispatcherView = true;
                                this.stateOptions = [...this.stateOptions, { label: 'Preparation', value: 0 }]
                                break;
                            case '3.5.6':
                                this.sourceCheckerView = true;
                                this.stateOptions = [...this.stateOptions, { label: 'Source', value: 1 }]
                                break;
                            case '3.5.7':
                                this.destinationView = true;
                                this.stateOptions = [...this.stateOptions, { label: 'Destination', value: 2 }]
                                break;
                            case '3.5.8':
                                this.completedView = true;
                                this.stateOptions = [...this.stateOptions, { label: 'Completed', value: 3 }]
                                break;
                            default:
                                break;
                        }
                    }

                    // console.log(this.stateOptions);
                    this.value = this.stateOptions[0].value;
                    this.getData();
                }
            )       
        )
    }


    getTransferRequestData() {
        this.isLoading = true;

        this.subscription.add(
            this.TransferService.getTransferRequest().subscribe(
                response => {
                    this.isLoading = false;
                    this.transferRequest = response;
                    this.paginatedCards = this.transferRequest.slice(this.first, this.first + this.rows);
                }, 
                err => {
                    console.log(err);
                    this.isLoading = false;
                }
            )
        )
    }

    getData() {
        // console.log(this.value);
        this.isLoading = true;
        this.subscription.add(
            this.TransferService.getTransferData(this.value, this.userID).subscribe(
                (response) => {
                    this.transfer = response; 
                    // console.log(response)
                    this.isLoading = false;
                },
                err => {
                    console.error('Error fetching data', err)
                }
            )  
        )
    }

    getStatus(status: number) {
        switch (status) {
            case 0:
                return 'Dispatching';
            case 1:
                return 'Source';
            case 2:
                return 'Destination';
            case 3:
                return 'Completed';
            default: 
                return ''
        }
    }

    getSeverity(status: any) {
        // if (status == 0) {
        //     return 'success'
        // }
        // else if (status > 0) {
        //     return 'OnGoing'
        // } else {
        //     return ''
        // }
        return 'success'
    }

    getRawMaterials() {
        this.subscription.add(
            this.RawMaterialService.getRawMatsData().subscribe(
                (response) => {
                    this.rawMaterials = response;  
                    // console.log(response);
                }
            )
        )
    }

    getWarehouseData() {
        this.subscription.add(
            this.WarehouseService.getWarehouseData().subscribe(
                (response) => {
                    this.warehouseName = response;
                    for (let i = 0; i <= this.warehouseName.length -1; i++) {
                        this.warehouseName[i] = {
                            ...this.warehouseName[i], 
                            LocationName: `${this.warehouseName[i].WarehouseLocation} - ${this.warehouseName[i].Warehouse_Name}`
                        }
                    }
                }
            )
        ) 
    }

    getWarehousePartition() {
        this.subscription.add(
            this.WarehousePartitionService.getWarehousePartitionData().subscribe(
                (response) => {
                    this.warehousePartition = response;
                    // console.log(response);
                }
            )
        )
    }

    getCheckerData() {
        this.subscription.add(
            this.CheckerService.getCheckerData().subscribe(
                (response) => {
                    this.checker = response;
                    // console.log(response);
                }
            )
        )
    }

    getTruck() {
        this.subscription.add(
            this.TruckService.GetTruckData().subscribe(
                response => {
                    this.truck = response;
                }
            )
        )
    }

    getDriver() {
        this.subscription.add(
            this.DriverService.getDriverData().subscribe(
                response => {
                    this.driver = response;
                }
            )
        )
    }

    getWarehouseLocation() {
        this.subscription.add(
            this.WarehouseLocationService.getWarehouseLocationData().subscribe(
                response => {
                    this.warehouseLocation = response;
                }
            )
        )
    }

    getWeigher() {
        this.subscription.add(
            this.WeigherService.getWeigher().subscribe(
                response => {
                    this.weigher = response;
                }
            )
        )
    }

    getDispatcher() {
        this.subscription.add(
            this.DispatcherService.getDispatcherData().subscribe(
                response => {
                    this.dispatcher = response;
                }
            )
        )
    }

    getGuard() {
        this.subscription.add(
            this.GuardService.getAllGuard().subscribe(
                response => {
                    this.guard = response;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Method to handle page change
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.paginatedCards = this.transferRequest.slice(this.first, this.first + this.rows);
    }

    showTransferRequestDialog() {
        this.dialogHeader = 'Add Transfer Request';
        this.clearTransferRequestForm();
        this.visibleTransferRequest = true;
        this.fromWarehousePartition = [];
        this.toWarehousePartition = [];
    }

    clearTransferRequestForm() {
        this.transferRequestForm.reset();
        this.transferRequestForm.patchValue({
            DispatcherRequestID: 0,
            Status: 0,
            UserID: 0
        })
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Transfer';
        this.clearForm();
        this.fromWarehousePartition = [];
        this.toWarehousePartition = [];
    }
    
    clearForm() {
        this.transferForm.reset();
        this.transferForm.patchValue({
            'RawMaterialTransferID': 0,
            'TransferCode': 0,
            'WarehousePartitionStockID': 0,
            'Status': 0,
            'UserID': this.userID
        })
    }

    onAddTransfer(data: any) {
        this.showDialog();
        
        // console.log(data);

        let RawMaterialValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterials);
        let SourceValue = this.findObjectByID(data.FromWarehouseLocationID, 'WarehouseLocationID', this.warehouseLocation);
        let DestinationValue = this.findObjectByID(data.ToWarehouseLocationID, 'WarehouseLocationID', this.warehouseLocation);

        this.transferForm.patchValue({
            DispatcherRequestID: data.DispatcherRequestID,
            RawMaterialID: RawMaterialValue,
            FromWarehouseLocationID: SourceValue,
            ToWarehouseLocationID: DestinationValue
        })

        // console.log(this.transferForm.value);
    }

    onSelectFromLocation(data: any) {
        this.fromWarehouse = [];
        this.onSelectLocation(data, this.fromWarehouse);
    }

    onSelectToLocation(data: any) {
        this.toWarehouse = [];
        this.onSelectLocation(data, this.toWarehouse);
    }

    onSelectLocation(data: any, targetWarehouse: any[]) {
        if (!data) return;

        targetWarehouse.length = 0;

        for (let i = 0; i <= this.warehouseName.length -1; i++) {
            if (data.WarehouseLocationID == this.warehouseName[i].WarehouseLocationID) {
                targetWarehouse.push(this.warehouseName[i]);
            }
        }

    }

    onSelectWarehouse(data: any, targetWarehousePartition: any[]) {
        if (data) {
            targetWarehousePartition.length = 0;

            for (let i = 0; i <= this.warehousePartition.length -1; i++) {
                if (data.WarehouseID === this.warehousePartition[i].WarehouseID) {
                    targetWarehousePartition.push(this.warehousePartition[i])
                }
            }

        }
    }

    onSelectFromWarehouse(data: any) {
        // console.log(data);
        this.fromWarehousePartition = [];
        this.onSelectWarehouse(data, this.fromWarehousePartition);
    }
    
    onSelectToWarehouse(data: any) {
        // console.log(data);
        this.toWarehousePartition = [];
        this.onSelectWarehouse(data, this.toWarehousePartition);
    }

    selectFromWarehouse(data: any) {

        if (!data.value) {
            this.sourceCheckerForm.get('FromWarehousePartitionID')?.setValue(null);
            return;
        };

        if (!this.sourceCheckerForm.value.RawMaterialID) return alert('please select a raw material') ;

        const rawMatsID = this.sourceCheckerForm.value.RawMaterialID.RawMaterialID;
        const warehouseID = data.value.WarehouseID;
        // this.selectedIndex = index;
        // console.log(warehouseID);
        this.subscription.add(
            this.BinloadService.getRawMatsPartitionStock(rawMatsID).subscribe(
                response => {
                    this.warehousePartitionStock = response;
                    this.warehousePartitionStock = this.warehousePartitionStock.filter(s => s.WarehouseID == warehouseID);
                    // console.log(this.warehousePartitionStock);
                    this.showPartitionStockDialog();
                }
            )
        )

    } 

    showPartitionStockDialog() {
        this.partitionModal = !this.partitionModal;
    }

    onSelectPartitionStock(data: any) {
        // console.log(data)
        let PartitionValue = this.findObjectByID(data.WarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);
        this.fromWarehousePartition.push(PartitionValue);
        this.sourceCheckerForm.patchValue({
            PO: data.PO,
            BL: data.BL,
            FromWarehousePartitionID: PartitionValue,
            WarehousePartitionStockID: data.WarehousePartitionStockID
        })

        // console.log(this.sourceCheckerForm.value);
    }

    onSubmitTransactionRequest() {

        if (!this.transferRequestForm.valid) {

            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Warning', 
                detail: 'Please fill all the blanks.', 
                life: 3000 
            });
            
            return
        }
        
        let transferRequestObj: TransferRequestModel = {
            DispatcherRequestID: this.transferRequestForm.value.DispatcherRequestID,
            RequestDate: this.transferRequestForm.value.RequestDate.toLocaleDateString(),
            FromWarehouseLocationID: this.transferRequestForm.value.FromWarehouseLocationID.WarehouseLocationID,
            ToWarehouseLocationID: this.transferRequestForm.value.ToWarehouseLocationID.WarehouseLocationID,
            RawMaterialID: this.transferRequestForm.value.RawMaterialID.RawMaterialID,
            RequestWeight: this.transferRequestForm.value.RequestWeight,
            Status: this.transferRequestForm.value.Status,
            UserID: this.userID
        }

        // console.log(transferRequestObj);

        this.TransferService.insertTransferRequest(transferRequestObj).subscribe(
            response => {
                if( response === 1) {

                    this.visible = false;
                    this.MessageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Successfully recorded', 
                        life: 3000 
                    });

                    this.getTransferRequestData();
                    this.visibleTransferRequest = false;

                } 
                else if ( response === 2) {

                    this.visible = false;
                    this.MessageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Successfully updated', 
                        life: 3000 
                    });

                    this.getTransferRequestData();
                    this.visibleTransferRequest = false;

                }
                else if ( response === 0) {

                    this.MessageService.add({ 
                        severity: 'error', 
                        summary: 'Danger', 
                        detail: 'Item: ' + this.transferForm.value.RawMaterialID.RawMaterial +  ' already exist', 
                        life: 3000 
                    });

                }
            }, error => {
                console.log(error);
            }   
        )

    }

    // export interface TransferRequestModel {
    //     DispatcherRequestID: number,
    //     RequestDate: string,
    //     FromWarehouseLocationID: number,
    //     ToWarehouseLocationID: number,
    //     RawMaterialID: number,
    //     RequestWeight: number,
    //     Status: number,
    //     UserID: number
    // }

    onEditTransferRequest(data: any) {
        this.dialogHeader = 'Edit Transfer Request';
        this.visibleTransferRequest = true;

        let SourceValue = this.findObjectByID(data.FromWarehouseLocationID, 'WarehouseLocationID', this.warehouseLocation);
        let DestinationValue = this.findObjectByID(data.ToWarehouseLocationID, 'WarehouseLocationID', this.warehouseLocation);
        let RawMaterialValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterials);

        this.transferRequestForm.setValue({
            DispatcherRequestID: data.DispatcherRequestID,
            RequestDate: new Date(data.RequestDate.date),
            FromWarehouseLocationID: SourceValue,
            ToWarehouseLocationID: DestinationValue,
            RawMaterialID: RawMaterialValue,
            RequestWeight: data.RequestWeight,
            Status: data.Status,
            UserID: data.UserID
        })



    }
    
    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.TransferService.saveData
        (
            this.transferForm.value.RawMaterialTransferID, 
            this.transferForm.value.DispatcherRequestID, 
            this.transferForm.value.TransferCode ?? "0",
            this.transferForm.value.PO ?? "0",
            this.transferForm.value.BL ?? "0",
            this.transferForm.value.DateTransfer.toLocaleDateString(), 
            this.transferForm.value.TransferTypeID?.TransferTypeID ?? 0, 
            this.transferForm.value.FromWarehouseLocationID?.WarehouseLocationID ?? 0, 
            this.transferForm.value.ToWarehouseLocationID?.WarehouseLocationID ?? 0, 
            this.transferForm.value.FromWarehouseID?.WarehouseID ?? 0, 
            this.transferForm.value.FromWarehousePartitionID?.WarehousePartitionID ?? 0, 
            this.transferForm.value.ToWarehouseID?.WarehouseID ?? 0,
            this.transferForm.value.ToWarehousePartitionID?.WarehousePartitionID ?? 0, 
            this.transferForm.value.RawMaterialID?.RawMaterialID ?? 0, 
            this.transferForm.value.Quantity ?? 0, 
            this.transferForm.value.Weight ?? 0, 
            this.transferForm.value.LossQuantity ?? 0, 
            this.transferForm.value.OverQuantity ?? 0, 
            this.transferForm.value.LossWeight ?? 0, 
            this.transferForm.value.OverWeight ?? 0, 
            this.transferForm.value.TruckID?.TruckID ?? 0, 
            this.transferForm.value.DriverID?.DriverID ?? 0, 
            this.transferForm.value.CheckerID?.CheckerID ?? 0,  
            this.transferForm.value.GuardID?.GuardID ?? 0,  
            this.transferForm.value.DispatcherID?.DispatcherID ?? 0,  
            // this.transferForm.value.DepartureWeight ?? 0,  
            this.transferForm.value.ArrivalWeight ?? 0,  
            this.transferForm.value.WeigherIn ?? 0,  
            this.transferForm.value.WeigherOut ?? 0,  
            this.transferForm.value.FeedmixDeparture?.toLocaleString() ?? null,  
            this.transferForm.value.FeedmixArrival?.toLocaleString() ?? null,  
            this.transferForm.value.SourceDeparture?.toLocaleString() ?? null,  
            this.transferForm.value.SourceArrival?.toLocaleString() ?? null,
            this.transferForm.value.Status ?? 0,
            this.userID,
            this.transferForm.value.WarehousePartitionStockID ?? 0
        )


        authObs.subscribe(response =>{

            if( response === 1) {
                this.visible = false;

                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Item: ' + this.transferForm.value.RawMaterialID.RawMaterial +  ' successfully recorded', 
                    life: 3000 
                });

                this.getData();
                this.getTransferRequestData();
                this.clearForm();

            } 
            else if ( response === 2) {

                this.visible = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Item: ' + this.transferForm.value.RawMaterialID.RawMaterial +  ' successfully updated', 
                    life: 3000 
                });

                this.getData();
                this.getTransferRequestData();
                this.clearForm();

            }
            else if ( response === 0) {

                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.transferForm.value.RawMaterialID.RawMaterial +  ' already exist', 
                    life: 3000 
                });

            }
            
        }, errorMessage => {

            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });

        })
    }

    

    onSubmitSourceForm() {

        this.sourceCheckerForm.patchValue({
            SourceDeparture: new Date(),
            Status: 2
        });

        // console.log(this,this.sourceCheckerForm.value)

        let authObs: Observable<ResponseData>;
        authObs = this.TransferService.saveData
        (
            this.sourceCheckerForm.value.RawMaterialTransferID, 
            this.sourceCheckerForm.value.DispatcherRequestID, 
            this.sourceCheckerForm.value.TransferCode ?? "0",
            this.sourceCheckerForm.value.PO ?? "0",
            this.sourceCheckerForm.value.BL ?? "0",
            this.sourceCheckerForm.value.DateTransfer.toLocaleDateString(), 
            this.sourceCheckerForm.value.TransferTypeID?.TransferTypeID ?? 0, 
            this.sourceCheckerForm.value.FromWarehouseLocationID?.WarehouseLocationID ?? 0, 
            this.sourceCheckerForm.value.ToWarehouseLocationID?.WarehouseLocationID ?? 0, 
            this.sourceCheckerForm.value.FromWarehouseID?.WarehouseID ?? 0, 
            this.sourceCheckerForm.value.FromWarehousePartitionID?.WarehousePartitionID ?? 0, 
            this.sourceCheckerForm.value.ToWarehouseID?.WarehouseID ?? 0,
            this.sourceCheckerForm.value.ToWarehousePartitionID?.WarehousePartitionID ?? 0, 
            this.sourceCheckerForm.value.RawMaterialID?.RawMaterialID ?? 0, 
            this.sourceCheckerForm.value.Quantity ?? 0, 
            this.sourceCheckerForm.value.Weight ?? 0, 
            this.sourceCheckerForm.value.LossQuantity ?? 0, 
            this.sourceCheckerForm.value.OverQuantity ?? 0, 
            this.sourceCheckerForm.value.LossWeight ?? 0, 
            this.sourceCheckerForm.value.OverWeight ?? 0, 
            this.sourceCheckerForm.value.TruckID?.TruckID ?? 0, 
            this.sourceCheckerForm.value.DriverID?.DriverID ?? 0, 
            this.sourceCheckerForm.value.CheckerID?.CheckerID ?? 0,  
            this.sourceCheckerForm.value.GuardID?.GuardID ?? 0,  
            this.sourceCheckerForm.value.DispatcherID?.DispatcherID ?? 0,  
            this.sourceCheckerForm.value.DepartureWeight ?? 0,  
            this.sourceCheckerForm.value.ArrivalWeight ?? 0,  
            this.sourceCheckerForm.value.WeigherIn ?? 0,  
            // this.sourceCheckerForm.value.WeigherOut ?? 0,  
            this.sourceCheckerForm.value.FeedmixDeparture?.toLocaleString() ?? null,  
            this.sourceCheckerForm.value.FeedmixArrival?.toLocaleString() ?? null,  
            this.sourceCheckerForm.value.SourceDeparture?.toLocaleString() ?? null,  
            this.sourceCheckerForm.value.SourceArrival?.toLocaleString() ?? null,
            this.sourceCheckerForm.value.Status,
            this.sourceCheckerForm.value.UserID ?? 0,
            this.sourceCheckerForm.value.WarehousePartitionStockID ?? 0
        )

        authObs.subscribe(response =>{

            if( response === 1) {

                this.visibleCheckerSource = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail:'Successfully recorded!', 
                    life: 3000 
                });

                this.getData();
                this.clearForm();

            } 
            else if ( response === 2) {

                this.visibleCheckerSource = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully updated!', 
                    life: 3000 
                });

                this.getData();
                this.clearForm();

            }
            else if ( response === 0) {

                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.sourceCheckerForm.value.RawMaterialID.RawMaterial +  ' already exist', 
                    life: 3000 
                });

            }
            
        }, errorMessage => {

            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });

        })
    }

    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID === array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    fillForm(data: any, form: any) {

        let TransferTypeValue = this.findObjectByID(data.TransferTypeID, 'TransferTypeID', this.transferType);

        let RawMaterialValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterials);

        let FromLocationValue = this.findObjectByID(data.FromWarehouseLocationID, 'WarehouseLocationID', this.warehouseLocation);

        let FromWarehouseValue = this.findObjectByID(data.FromWarehouseID, 'WarehouseID', this.warehouseName);

        let FromWarehousePartitionValue = this.findObjectByID(data.FromWarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let ToLocationValue = this.findObjectByID(data.ToWarehouseLocationID, 'WarehouseLocationID', this.warehouseLocation);

        let ToWarehouseValue = this.findObjectByID(data.ToWarehouseID, 'WarehouseID', this.warehouseName);

        let ToPartitionValue = this.findObjectByID(data.ToWarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let CheckerValue = this.findObjectByID(data.CheckerID, 'CheckerID', this.checker);

        let GuardValue = this.findObjectByID(data.GuardID, 'GuardID', this.guard);

        let TruckValue = this.findObjectByID(data.TruckID, 'TruckID', this.truck);

        let DriverValue = this.findObjectByID(data.DriverID, 'DriverID', this.driver);

        let DispatcherValue = this.findObjectByID(data.DispatcherID, 'DispatcherID', this.dispatcher);


        form.setValue({
            RawMaterialTransferID: data.RawMaterialTransferID,
            DispatcherRequestID: data.DispatcherRequestID,
            TransferCode: data.TransferCode,
            PO: data.PO,
            BL: data.BL,
            DateTransfer: new Date(data.DateTransfer.date),
            TransferTypeID: TransferTypeValue,
            FromWarehouseLocationID: FromLocationValue,
            ToWarehouseLocationID: ToLocationValue,
            FromWarehouseID: FromWarehouseValue,
            FromWarehousePartitionID: FromWarehousePartitionValue,
            ToWarehouseID: ToWarehouseValue,
            ToWarehousePartitionID: ToPartitionValue,
            WarehousePartitionStockID: data.WarehousePartitionStockID,
            RawMaterialID: RawMaterialValue,
            Quantity: data.Quantity, 
            Weight: data.Weight,
            LossQuantity: data.LossQuantity,
            OverQuantity: data.LossQuantity,
            LossWeight: data.LossWeight,
            OverWeight: data.OverWeight,
            TruckID: TruckValue,
            DriverID: DriverValue,
            CheckerID: CheckerValue,
            GuardID: GuardValue,
            DispatcherID: DispatcherValue,
            // DepartureWeight: data.DepartureWeight,
            ArrivalWeight: data.ArrivalWeight,
            WeigherIn: data.WeigherIn,
            WeigherOut: data.WeigherOut,
            FeedmixDeparture: data.FeedmixDeparture == null ? null : new Date(data.FeedmixDeparture.date),
            FeedmixArrival: data.FeedmixArrival == null ? null : new Date(data.FeedmixArrival.date),
            SourceDeparture: data.SourceDeparture == null ? null : new Date(data.SourceDeparture.date),
            SourceArrival: data.SourceArrival == null ? null : new Date(data.SourceArrival.date),
            Status: data.Status,
            UserID: data.UserID
        })
    }

    viewTransfer(data: any) {
        // this.fillForm(data, this.transferForm);
        this.transferDetails = {};
        this.transferDetails = {...data};

        this.sidebarVisible2 = true;
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Transfer';

        this.fillForm(data, this.transferForm);
    }


    onSourceArrived(data: any) {
        this.fillForm(data, this.transferForm);
        this.transferForm.patchValue({Status: 1, SourceArrival: new Date()})
        this.onSubmit();
        // console.log(this.transferForm.value)
    }

    onSourceCheckerForm(data: any) {
        this.visibleCheckerSource = true;
        this.fromWarehousePartition = [];

        let FromWarehouseValue = this.findObjectByID(data.FromWarehouseID, 'WarehouseID', this.warehouseName);

        // this.onSelectFromWarehouse(FromWarehouseValue);

        this.fillForm(data, this.sourceCheckerForm);
    }

    onDestinationForm(dialog: Dialog,data: any) {
        this.destinationForm.reset();
        this.partitionStockQuantity = 0;
        this.partitionStockWeight = 0; 

        let FromPartitionValue = this.findObjectByID(data.FromWarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);
        this.onSelectFromWarehouse(FromPartitionValue);

        // let ToPartitionValue = this.findObjectByID(data.ToWarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);
        // this.onSelectToWarehouse(ToPartitionValue);

        if (data.TransferTypeID === 2) {
            this.subscription.add(
                this.TransferService.getPartitionStockItem(data.WarehousePartitionStockID).subscribe(
                    response => {
                        this.partitionStockQuantity = response.RawMatsQty;
                        this.partitionStockWeight = response.RawMatsWeight;
                        // console.log(this.partitionStockQuntity,this.partitionStockWeight)
                    }
                )  
            )
        }

        this.fillForm(data, this.destinationForm);

        dialog.maximize();
        this.visibleDestination = true;

    }


    onComputeQuantityLossAndOver(event: any) {
        if(!this.partitionStockQuantity) {
            return;
        }
        
        let DrQuantity = Number(event.target.value);

        let QuantityLossAndOver = this.partitionStockQuantity - DrQuantity;

        if (QuantityLossAndOver > 0) {
            this.destinationForm.patchValue({LossQuantity: QuantityLossAndOver, OverQuantity: 0})
        } else if (QuantityLossAndOver < 0) {
            this.destinationForm.patchValue({OverQuantity: QuantityLossAndOver * -1, LossQuantity: 0})
        }
    }

    onComputeWeightLossAndOver(event: any) {
        if(!this.partitionStockWeight) {
            return;
        }

        let DrNetWeight = Number(event.target.value);

        let WeightLossAndOver = this.partitionStockWeight - DrNetWeight;

        if (WeightLossAndOver > 0) {
            this.destinationForm.patchValue({LossWeight: WeightLossAndOver, OverWeight: 0})
        } else if (WeightLossAndOver < 0) {
            this.destinationForm.patchValue({LossWeight: 0, OverWeight: WeightLossAndOver * -1})
        }
    }


    onSubmitDestinationForm() {

        this.destinationForm.patchValue({
            Status: 3
        })


        let authObs: Observable<ResponseData>;
        authObs = this.TransferService.saveData
        (
            this.destinationForm.value.RawMaterialTransferID, 
            this.destinationForm.value.DispatcherRequestID, 
            this.destinationForm.value.TransferCode ?? "0",
            this.destinationForm.value.PO ?? "0",
            this.destinationForm.value.BL ?? "0",
            this.destinationForm.value.DateTransfer.toLocaleDateString(), 
            this.destinationForm.value.TransferTypeID?.TransferTypeID ?? 0, 
            this.destinationForm.value.FromWarehouseLocationID?.WarehouseLocationID ?? 0, 
            this.destinationForm.value.ToWarehouseLocationID?.WarehouseLocationID ?? 0, 
            this.destinationForm.value.FromWarehouseID?.WarehouseID ?? 0, 
            this.destinationForm.value.FromWarehousePartitionID?.WarehousePartitionID ?? 0, 
            this.destinationForm.value.ToWarehouseID?.WarehouseID ?? 0,
            this.destinationForm.value.ToWarehousePartitionID?.WarehousePartitionID ?? 0, 
            this.destinationForm.value.RawMaterialID?.RawMaterialID ?? 0, 
            this.destinationForm.value.Quantity ?? 0, 
            this.destinationForm.value.Weight ?? 0, 
            this.destinationForm.value.LossQuantity ?? 0, 
            this.destinationForm.value.OverQuantity ?? 0, 
            this.destinationForm.value.LossWeight ?? 0, 
            this.destinationForm.value.OverWeight ?? 0, 
            this.destinationForm.value.TruckID?.TruckID ?? 0, 
            this.destinationForm.value.DriverID?.DriverID ?? 0, 
            this.destinationForm.value.CheckerID?.CheckerID ?? 0,  
            this.destinationForm.value.GuardID?.GuardID ?? 0,  
            this.destinationForm.value.DispatcherID?.DispatcherID ?? 0,  
            // this.destinationForm.value.DepartureWeight ?? 0,  
            this.destinationForm.value.ArrivalWeight ?? 0,  
            this.destinationForm.value.WeigherIn ?? 0,  
            this.destinationForm.value.WeigherOut ?? 0,  
            this.destinationForm.value.FeedmixDeparture?.toLocaleString() ?? null,  
            this.destinationForm.value.FeedmixArrival?.toLocaleString() ?? null,  
            this.destinationForm.value.SourceDeparture?.toLocaleString() ?? null,  
            this.destinationForm.value.SourceArrival?.toLocaleString() ?? null,
            this.destinationForm.value.Status,
            this.destinationForm.value.UserID ?? 0,
            this.destinationForm.value.WarehousePartitionStockID ?? 0
        )


        authObs.subscribe(response =>{

            if( response === 1) {

                this.visibleDestination = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail:'Successfully recorded!', 
                    life: 3000 
                });

                this.getData();
                this.clearForm();

            } 
            else if ( response === 2) {

                this.visibleDestination = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully updated!', life: 3000 
                });

                this.getData();
                this.clearForm();

            }
            else if ( response === 0) {

                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.destinationForm.value.RawMaterialID.RawMaterial +  ' already exist', 
                    life: 3000 
                });

            }
            
        }, errorMessage => {

            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });

        })
    }

    getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
        if (requestWeight === 0) return 0; // Avoid division by zero
        const percentage = (served / requestWeight) * 100;
        return Number(percentage.toFixed(precision)); // Ensures the return type is number
    }



  



































    onDelete(id: any) {
        this.TransferService.onDeleteData(id).subscribe(
            response => {
               if (response === 3 ) {
                    this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                this.getData();
               } 
            } 
        )
    }

    confirm2(event: Event, id: any) {
        this.ConfirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            accept: () => {
                this.onDelete(id);
            },
            reject: () => {
                // this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }

      // ==== INPUT SEARCH DATA====
      onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }


}

interface Transfer {

}

interface ResponseData {

}