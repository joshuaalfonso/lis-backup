import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BinloadRequest, BinloadService } from "./binload.service";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { PlantService } from "../plant/plant.service";
import { CheckerService } from "../checker/checker.service";
import { WarehouseService } from "../warehouse/warehouse.service";
import { WarehousePartitionService } from "../warehouse-partition/warehouse-partition.service";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { MessageService } from "primeng/api";
import { DriverService } from "../driver/driver.service";
import { TruckService } from "../truck/truck.service";
import { Table } from "primeng/table";
import { Dialog } from "primeng/dialog";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { WarehouseLocationService } from "../warehouse-location/warehouse-location.service";


@Component({
    selector: 'app-binload',
    templateUrl: 'binload.component.html',
    styleUrls: ['binload.component.css']
})
export class BinloadingComponent implements OnInit, OnDestroy {

    binload: any[] = [];
    binloadRequest: any[] = [];
    binloadDetail: any[] = [];
    plant: any[] = [];
    checker: any[] = [];
    warehouseLocation: any[] = [];
    warehouse: any[] = [];
    selectedWarehouse: any[] = [];
    warehousePartition: any[] = [];
    selectedPartition: any[] = [];
    rawMaterial: any[] = [];
    intake: any[] = [];
    driver: any[] = [];
    truck: any[] = [];
    rawMatsPartitionStock: any[] = [];
    binloadForm!: FormGroup;
    binloadRequestForm!: FormGroup;

    selectedIndex!: number;

    private subscription: Subscription = new Subscription();

    dialogHeader?: string;
    visible: boolean = false;
    partitionModal: boolean = false;
    visibleRequestModal: boolean = false; 
    isLoading: boolean = false;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;
    checkerInsert: boolean = false;

    partitionDetails: any[] = [];
    unitOfMeasure: any[] = [];

    UserID!: string;

    requestSubmitLoading: boolean = false;
    binloadSubmitLoading: boolean = false;

    constructor(
        private BinloadService: BinloadService,
        private PlantService: PlantService,
        private CheckerService: CheckerService,
        private WarehouseService: WarehouseService,
        private WarehousePartitionService: WarehousePartitionService,
        private RawMaterialService: RawMaterialsService,
        private MessageService: MessageService,
        private DriverService: DriverService,
        private TruckService: TruckService,
        private UsersService: UsersService,
        private auth: AuthService,
        private WarehouseLocation: WarehouseLocationService
    )
    {}

    ngOnInit(): void {

        this.intake = [
            { IntakeID: 1},
            { IntakeID: 2},
            { IntakeID: 3}
        ];
        
        this.binloadForm = new FormGroup({
            // 'BinloadingID': new FormControl(0),
            // 'ControlNo': new FormControl(null, Validators.required),
            // 'PlantID': new FormControl(null, Validators.required),
            // 'CheckerID': new FormControl(null, Validators.required),
            // 'WarehouseID': new FormControl(null, Validators.required),
            // 'WarehouseLocationID': new FormControl(null),
            // 'WarehousePartitionID': new FormControl(null, Validators.required),
            // 'WarehousePartitionStockID': new FormControl(null, Validators.required),
            // 'DriverID': new FormControl(null, Validators.required),
            // 'TruckID': new FormControl(null, Validators.required),
            // 'BinloadingDate': new FormControl(new Date, Validators.required),
            // 'BinloadingDateTime': new FormControl(null, Validators.required),
            // 'RawMaterialID': new FormControl(null, Validators.required),
            // 'Quantity': new FormControl(null, Validators.required),
            // 'Weight': new FormControl(null, Validators.required),
            // 'IntakeID': new FormControl(null, Validators.required),
            // 'Status': new FormControl(0),
            // 'UserID': new FormControl(null),

            'BinloadRequestID': new FormControl(null),
            'RequestDate': new FormControl(null),
            'PlantID': new FormControl(null),
            'RawMaterialID': new FormControl(null),
            'WarehouseLocationID': new FormControl(null),
            'WarehouseID': new FormControl(null),
            'WarehousePartitionID': new FormControl(null),
            'WarehousePartitionStockID': new FormControl(null),
            'PO': new FormControl(null),
            'BL': new FormControl(null),
            // 'RequestWeight': new FormControl(null),
            'BinloadUomID': new FormControl(null),
            'RequestQuantity': new FormControl(null),
            'DriverID': new FormControl(null),
            'TruckID': new FormControl(null),
            'BinloadingID': new FormControl(0),
            // 'ControlNo': new FormControl(null, Validators.required),
            'CheckerID': new FormControl(null),
            'IntakeID': new FormControl(null,  Validators.required),
            'BinloadingDate': new FormControl(null, Validators.required),
            'BinloadingDateTime': new FormControl(null, Validators.required),
            'Quantity': new FormControl(null, Validators.required),
            'Weight': new FormControl(null, Validators.required),
            'Status': new FormControl(0),
            'UserID': new FormControl(null),
        })


        this.binloadRequestForm = new FormGroup({
            'BinloadRequestID': new FormControl(0),
            'WarehouseLocationID': new FormControl(null, Validators.required),
            'WarehouseID': new FormControl(null, Validators.required),
            'WarehousePartitionID': new FormControl(null, Validators.required),
            'WarehousePartitionStockID': new FormControl(null, Validators.required),
            'PO': new FormControl(null),
            'BL': new FormControl(null),
            'PlantID': new FormControl(null, Validators.required),
            'DriverID': new FormControl(null, Validators.required),
            'TruckID': new FormControl(null, Validators.required),
            'RequestDate': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null, Validators.required),
            'Quantity': new FormControl(null, Validators.required),
            'BinloadUomID': new FormControl(null, Validators.required),
            'Status': new FormControl(0),
            'UserID': new FormControl(null),
        })



        this.userRights();

        // this.getData();
        this.getBinloadRequest();
        this.getPlant();
        this.getChecker();
        this.getWarehouseLocation();
        this.getWarehouse();
        this.getWarehousePartition();
        this.getRawMaterial();
        this.getDriver();
        this.getTruck();
        this.getUnitOfMeasure();
    }

    userRights() {
        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    if (user) {
                        this.UserID = user.user_id;
                        this.getUserAccess(this.UserID);
                    }
                } 
            )
        )
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;
 
                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '3.4.1':
                                this.view = true;
                                break;
                            case '3.4.2':
                                this.insert = true;
                                break;
                            case '3.4.3':
                                this.edit = true;
                                break;
                            case '3.4.4':
                                this.generateReport = true;
                                break;
                            case '3.4.5':
                                this.checkerInsert = true;
                                break;
                            default:
                                break;
                        }
                    }
                    
                }
            )       
        )
    }

    getUnitOfMeasure() {
        this.subscription.add(
            this.BinloadService.getBinloadUom().subscribe(response => {
                this.unitOfMeasure = response
            })
        )
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
             this.BinloadService.getBinloadData(this.UserID).subscribe(
                 response => {
                     this.isLoading = false;

                     this.binload = response;

                     let unverified: any[] = [];

                     if (response) {
                        unverified = response.filter(
                            (item: any) => item.Status != 3
                        );
                     }
                     

                    this.BinloadService.binloadNotVerified.next(unverified.length);
                 }
             )
        )
    }

    getBinloadRequest() {
        this.subscription.add(
            this.BinloadService.getBinloadRequest(this.UserID).subscribe(
                response => {
                    this.binloadRequest = response;
                }
            )
        )
    }
 
    getPlant() {
        this.subscription.add(
            this.PlantService.getPlantData().subscribe(
                response => {
                    this.plant = response;
                }
            )
        )
    }

    getChecker() {
        this.subscription.add(
            this.CheckerService.getCheckerData().subscribe(
                response => {
                    this.checker = response;
                }
            )
        )
    }

    getWarehouseLocation() {
        this.subscription.add(
            this.WarehouseLocation.getWarehouseLocationData().subscribe(
                response => {
                    this.warehouseLocation = response;
                }
            )
        )
    }

    getWarehouse() {
        this.subscription.add(
            this.WarehouseService.getWarehouseData().subscribe(
                response => {
                    this.warehouse = response;

                    for (let i = 0; i <= this.warehouse.length -1; i++) {
                        this.warehouse[i] = {
                            ...this.warehouse[i], 
                            LocationName: `${this.warehouse[i].WarehouseLocation} - ${this.warehouse[i].Warehouse_Name}`
                        };
                    }
                }
            )
        )
    }

    getWarehousePartition() {
        this.subscription.add(
            this.WarehousePartitionService.getWarehousePartitionData().subscribe(
                response => {
                    this.warehousePartition = response;
                }
            )
        )
    }

    getRawMaterial() {
        this.subscription.add(
            this.RawMaterialService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterial = response;
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

    getTruck() {
        this.subscription.add(
            this.TruckService.GetTruckData().subscribe(
                response => {
                    this.truck = response;
                }
            )
        )
    }

    addRow() {

        let data = {
            BinloadRequestID: 0,
            BinloadingDetailID : 0,
            StockingDate: '',
            WarehouseID: 0,
            WarehousePartitionID: 0,
            WarehousePartitionStockID: 0,
            RawMaterialID: 0,
            Quantity: 0,
            Weight: 0,
            MaxQuantity: 0,
            MaxWeight: 0,
            AveragePerBag: 0,
            Deleted: 0
        }

        this.binloadDetail.push(data);
    }

    removeRow(index: number) {
        this.binloadDetail.splice(index, 1);
    }

    showDialog(dialog: Dialog) {
        dialog.maximize();
        this.clearItems();
        this.dialogHeader = 'Add binloading';
        this.visible = true;
    }

    clearItems() {
        this.binloadForm.reset();
        this.binloadForm.patchValue({BinloadingID: 0, UserID: 0, Status: 0});
        this.binloadDetail = [];
    }


    showRequestDialog(dialog: Dialog) {
        this.clearRequestDialog();
        this.binloadDetail = [];
        this.dialogHeader = 'Add Binload Request';
        dialog.maximize();
        this.visibleRequestModal = true;
        this.addRow();
    }

    clearRequestDialog() {
        this.binloadRequestForm.reset();
        this.binloadRequestForm.patchValue({BinloadRequestID: 0, Status: 0})
    }


    // onSubmit() {

    //     let authObs: Observable<ResponseData>;
    //     authObs = this.BinloadService.saveData
    //     (
    //         this.binloadForm.value.BinloadingID,
    //         // this.binloadForm.value.ControlNo,
    //         this.binloadForm.value.PlantID.PlantID,
    //         this.binloadForm.value.CheckerID.CheckerID,
    //         this.binloadForm.value.WarehouseID.WarehouseID,
    //         this.binloadForm.value.WarehouseLocationID,
    //         this.binloadForm.value.WarehousePartitionID.WarehousePartitionID,
    //         this.binloadForm.value.WarehousePartitionStockID,
    //         this.binloadForm.value.DriverID.DriverID,
    //         this.binloadForm.value.TruckID.TruckID,
    //         this.binloadForm.value.BinloadingDate.toLocaleDateString(),
    //         this.binloadForm.value.BinloadingDateTime.toLocaleDateString(),
    //         this.binloadForm.value.RawMaterialID.RawMaterialID,
    //         this.binloadForm.value.Quantity,
    //         this.binloadForm.value.Weight,
    //         this.binloadForm.value.IntakeID.IntakeID,
    //         this.binloadForm.value.Status,
    //         this.UserID,
    //     )

    //     authObs.subscribe(response =>{

    //         if( response === 1) {

    //             this.MessageService.add({ 
    //                 severity: 'success', 
    //                 summary: 'Success', 
    //                 detail: 'Item: ' + this.binloadForm.value.BinloadingID + ' successfully recorded', 
    //                 life: 3000 
    //             });

    //             this.getData();
    //             this.clearItems;
    //             this.visible = false;
    //         } 

    //         else if ( response === 2) {

    //             this.MessageService.add({ 
    //                 severity: 'success', 
    //                 summary: 'Success', 
    //                 detail: 'Item: ' + this.binloadForm.value.BinloadingID +  ' successfully updated', 
    //                 life: 3000 
    //             });

    //             this.getData();
    //             this.clearItems();
    //             this.visible = false;
    //         }

    //         else if ( response === 0) {

    //             this.MessageService.add({ 
    //                 severity: 'error', 
    //                 summary: 'Danger', 
    //                 detail: 'Item: ' + this.binloadForm.value.BinloadingID +  ' already exist', 
    //                 life: 3000 
    //             });

    //         }
            
    //     }, errorMessage => {
    //         this.MessageService.add({ 
    //             severity: 'error', 
    //             summary: 'Danger', 
    //             detail: errorMessage, 
    //             life: 3000 
    //         });
    //     })

    // }

    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID === array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    onSelect(data: any, dialog: Dialog) {
        this.showDialog(dialog);

        let plantValue = this.findObjectByID(data.PlantID, 'PlantID', this.plant);

        let checkerValue = this.findObjectByID(data.CheckerID, 'CheckerID', this.checker);

        let warehouseValue = this.findObjectByID(data.WarehouseID, 'WarehouseID', this.warehouse);

        let partitionValue = this.findObjectByID(data.WarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let driverValue = this.findObjectByID(data.DriverID, 'DriverID', this.driver);

        let truckValue = this.findObjectByID(data.TruckID, 'TruckID', this.truck);

        let rawMatValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterial);

        let intakeValue = this.findObjectByID(data.IntakeID, 'IntakeID', this.intake);

        this.binloadForm.setValue({
            BinloadingID: data.BinloadingID,
            ControlNo: data.ControlNo,
            PlantID: plantValue,
            CheckerID: checkerValue,
            WarehouseID: warehouseValue,
            WarehouseLocationID: data.WarehouseLocationID,
            WarehousePartitionID: partitionValue,
            WarehousePartitionStockID: data.WarehousePartitionStockID,
            DriverID: driverValue,
            TruckID: truckValue,
            BinloadingDate: new Date(data.BinloadingDate.date),
            BinloadingDateTime: new Date(data.BinloadingDateTime.date),
            RawMaterialID: rawMatValue,
            Quantity: data.Quantity,
            Weight: data.Weight,
            IntakeID: intakeValue,
            Status: data.Status,
            UserID: data.UserID
        })

        // console.log(data)
    }

    onVerified(data: any) {

        let plantValue = this.findObjectByID(data.PlantID, 'PlantID', this.plant);

        let checkerValue = this.findObjectByID(data.CheckerID, 'CheckerID', this.checker);

        let warehouseValue = this.findObjectByID(data.WarehouseID, 'WarehouseID', this.warehouse);

        let partitionValue = this.findObjectByID(data.WarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let driverValue = this.findObjectByID(data.DriverID, 'DriverID', this.driver);

        let truckValue = this.findObjectByID(data.TruckID, 'TruckID', this.truck);

        let rawMatValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterial);

        let intakeValue = this.findObjectByID(data.IntakeID, 'IntakeID', this.intake);

        this.binloadForm.setValue({
            BinloadingID: data.BinloadingID,
            ControlNo: data.ControlNo,
            PlantID: plantValue,
            CheckerID: checkerValue,
            WarehouseID: warehouseValue,
            WarehouseLocationID: data.WarehouseLocationID,
            WarehousePartitionID: partitionValue,
            WarehousePartitionStockID: data.WarehousePartitionStockID,
            DriverID: driverValue,
            TruckID: truckValue,
            BinloadingDate: new Date(data.BinloadingDate.date),
            BinloadingDateTime: new Date(data.BinloadingDateTime.date),
            RawMaterialID: rawMatValue,
            Quantity: data.Quantity,
            Weight: data.Weight,
            IntakeID: intakeValue,
            Status: 3,
            UserID: data.UserID
        })

        // this.onSubmit();
    }

    onSelectLocation(data: any) {

        if (!data) {
            this.selectedWarehouse = [];
            return;
        }

        let warehouseLocationID = data;

        this.selectedWarehouse = this.warehouse.filter(
            item => item.WarehouseLocationID === warehouseLocationID
        );

    }

    onSelectWarehouse(data: any) {
        this.selectedPartition = [];

        if (!data.value) {

            // this.binloadDetail[index] = {
            //     WarehousePartitionStockID: 0,
            //     StockingDate: null,
            //     RawMaterialID: 0,
            //     WarehouseID: 0,
            //     WarehousePartitionID: 0,
            //     Quantity: 0,
            //     Weight: 0,
            //     MaxQuantity: 0,
            //     MaxWeight: 0,
            //     AveragePerBag:  0
            // }

            this.binloadRequestForm.patchValue({
                WarehousePartitionStockID: null,
                WarehousePartitionID: null
            })

            return
        }

        // console.log(data);

        const selectedWarehouse = data.value;

        const selectedRawMaterial = this.binloadRequestForm.value.RawMaterialID;

        if (!selectedRawMaterial) return;

        // this.selectedIndex = index;

        this.showPartitionStockDialog();

        this.subscription.add(
            this.BinloadService.getRawMatsPartitionStock(selectedRawMaterial).subscribe(
                response => {
                    this.rawMatsPartitionStock = response.filter((item: any) => item.WarehouseID === selectedWarehouse);
                }
            )
        )
        
        // this.selectedPartition = this.warehousePartition.filter(i => i.WarehouseID === selectedWarehouse);
       
    }

    // onSelectPartition(data: any) {
    //     this.subscription.add(
    //         this.BinloadService.getWarehousePartitionStock(data.RawMaterialID).subscribe(
    //             response => {
    //                 console.log(response);
    //             }
    //         )
    //     )
    // }

    showPartitionStockDialog() {
        this.partitionModal = !this.partitionModal;
    }

    onSelectRawMaterial(data: any) {
        if (data.value == null) return;
        this.showPartitionStockDialog();

       this.subscription.add(
            this.BinloadService.getRawMatsPartitionStock(data.value.RawMaterialID).subscribe(
                response => {
                    this.rawMatsPartitionStock = response;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSelectPartitionStock(data: any) {

        // console.log(data);
        
        // this.binloadDetail[this.selectedIndex] = {

        //     ...this.binloadDetail[this.selectedIndex],
        //     WarehousePartitionStockID: data.WarehousePartitionStockID,
        //     StockingDate: new Date(data.StockingDate.date).toLocaleDateString(),
        //     RawMaterialID: data.RawMaterialID,
        //     WarehouseID: data.WarehouseID,
        //     WarehousePartitionID: data.WarehousePartitionID,
        //     MaxQuantity: data.RawMatsQty,
        //     MaxWeight: data.RawMatsWeight,
        //     AveragePerBag: data.RawMatsQty > 0 ? data.RawMatsWeight / data.RawMatsQty : 0

        // }

        // console.log(data)

        this.binloadRequestForm.patchValue({
            WarehousePartitionStockID: data.WarehousePartitionStockID,
            WarehousePartitionID: data.WarehousePartitionID,
            PO: data.PO,
            BL: data.BL
        })

        console.log(this.binloadRequestForm.value);

    }

    onComputeTotalQuantity() {
        
        let TotalQuantity = 0;

        this.binloadDetail.forEach(item => {
            if (item.Quantity) {
                TotalQuantity += item.Quantity;
                item.Weight = Math.round(item.Quantity * item.AveragePerBag);
            }
        })

        this.binloadRequestForm.patchValue({
            Quantity: TotalQuantity ? TotalQuantity : 0
        })

        this.onComputeTotalWeight();

    }

    onComputeTotalWeight() {

        let TotalWeight = 0;

        this.binloadDetail.forEach(item => {
            if (item.Weight) {
                TotalWeight += item.Weight;
            }
        })

        this.binloadRequestForm.patchValue({
            Weight: TotalWeight ? TotalWeight : 0
        })

    }


    onSubmitBinloadRequest() {
        // console.log(this.binloadRequestForm.value)
        // console.log(this.binloadDetail);

        this.requestSubmitLoading = true;

        const binloadRequestFormValue: BinloadRequest = {
            BinloadRequestID: this.binloadRequestForm.value.BinloadRequestID,
            WarehouseLocationID: this.binloadRequestForm.value.WarehouseLocationID,
            WarehouseID: this.binloadRequestForm.value.WarehouseID,
            WarehousePartitionID: this.binloadRequestForm.value.WarehousePartitionID,
            WarehousePartitionStockID: this.binloadRequestForm.value.WarehousePartitionStockID,
            PO: this.binloadRequestForm.value.PO,
            BL: this.binloadRequestForm.value.BL,
            PlantID: this.binloadRequestForm.value.PlantID,
            DriverID: this.binloadRequestForm.value.DriverID,
            TruckID: this.binloadRequestForm.value.TruckID,
            RequestDate: this.binloadRequestForm.value.RequestDate.toLocaleDateString(),
            RawMaterialID: this.binloadRequestForm.value.RawMaterialID,
            Quantity: this.binloadRequestForm.value.Quantity,
            BinloadUomID: this.binloadRequestForm.value.BinloadUomID,
            Status: this.binloadRequestForm.value.Status,
            UserID: this.UserID,
            // BinloadDetail: this.binloadDetail
        }

        // console.log(binloadRequestFormValue)

        this.BinloadService.insertBinloadRequest(binloadRequestFormValue).subscribe(
            response => {

                this.requestSubmitLoading = false;

                if( response === 1) {

                    this.MessageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Item: ' + this.binloadForm.value.BinloadingID +  ' successfully recorded', 
                        life: 3000 
                    });

                    this.getBinloadRequest();
                    this.clearRequestDialog;
                    this.visibleRequestModal = false;
                } 

                else if ( response === 2) {

                    this.MessageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Item: ' + this.binloadForm.value.BinloadingID +  ' successfully updated', 
                        life: 3000 
                    });

                    this.getBinloadRequest();
                    this.clearRequestDialog();
                    this.visibleRequestModal = false;
                }
                else if ( response === 0) {

                    this.MessageService.add({ 
                        severity: 'error', 
                        summary: 'Danger', 
                        detail: 'Item: ' + this.binloadForm.value.BinloadingID +  ' already exist', life: 3000 
                    });

                }
                
            }, errorMessage => {                
                this.requestSubmitLoading = false;

                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: errorMessage, 
                    life: 3000 
                });

            }
        )
            
       
    }
    

    onEditBinloadRequest(data: any, dialog: Dialog) {
        this.binloadDetail = [];
        this.dialogHeader = 'Edit binload request'
        this.visibleRequestModal = true;
        dialog.maximize();

        this.onSelectLocation(data.WarehouseLocationID);
        // console.log()

        this.binloadRequestForm.setValue({
            BinloadRequestID: data.BinloadRequestID,
            WarehouseLocationID: data.WarehouseLocationID,
            PlantID: data.PlantID,
            DriverID: data.DriverID,
            TruckID: data.TruckID,
            RequestDate: new Date(data.RequestDate.date),
            RawMaterialID: data.RawMaterialID,
            Quantity: data.Quantity,
            Weight: data.Weight,
            Status: data.Status,
            UserID: data.UserID,
        })

        data.BinloadDetail.forEach((item: any) => {
            let data = {
                BinloadingDetailID: item.BinloadingDetailID,
                BinloadRequestID: item.BinloadRequestID,
                StockingDate: new Date(item.StockingDate.date).toLocaleDateString(),
                WarehouseID: item.WarehouseID,
                WarehousePartitionID: item.WarehousePartitionID,
                WarehousePartitionStockID: item.WarehousePartitionStockID,
                RawMaterialID: item.RawMaterialID,
                Quantity: item.Quantity,
                Weight: item.Weight,
                MaxQuantity: item.MaxQuantity,
                MaxWeight: item.MaxQuantity,
                AveragePerBag: item.AveragePerBag,
                Deleted: item.deleted
            }

            this.binloadDetail.push(data)

        })

        // console.log(data.BinloadDetail)

        // this.binloadDetail = data.BinloadDetail;

        // console.log(this.binloadDetail)

    }


    clearBinloadForm() {
        this.binloadForm.reset();
        this.binloadForm.patchValue({
            BinloadingID: 0,
            Status: 0,
        })
    }

    onAddBinload(data: any, dialog: Dialog) {
        this.binloadDetail = [];
        this.clearBinloadForm();
        this.dialogHeader = 'Add Binload';
        dialog.maximize();
        this.visible = true;

        this.binloadForm.patchValue({
            BinloadRequestID: data.BinloadRequestID,
            RequestDate: new Date(data.RequestDate.date),
            PlantID: data.PlantID,
            RawMaterialID: data.RawMaterialID,
            WarehouseLocationID: data.WarehouseLocationID,
            WarehouseID: data.WarehouseID,
            WarehousePartitionID: data.WarehousePartitionID,
            WarehousePartitionStockID: data.WarehousePartitionStockID,
            PO: data.PO,
            BL: data.BL,
            RequestQuantity: data.Quantity,
            BinloadUomID: data.BinloadUomID,
            DriverID: data.DriverID,
            TruckID: data.TruckID,
        })

        // data.BinloadDetail.forEach((item: any) => {
        //     let data = {
        //         BinloadingDetailID: item.BinloadingDetailID,
        //         WarehouseID: item.WarehouseID,
        //         WarehousePartitionID: item.WarehousePartitionID,
        //         WarehousePartitionStockID: item.WarehousePartitionStockID,
        //         RawMaterialID: item.RawMaterialID,
        //         Quantity: item.Quantity,
        //         Weight: item.Weight,
        //     }

        //         MaxQuantity: item.MaxQuantity,
        //         MaxWeight: item.MaxQuantity,
        //         AveragePerBag: item.AveragePerBag,
        //         Deleted: item.deleted

        //     this.binloadDetail.push(data)

        // })

    }

     // 'BinloadingID': new FormControl(0),
    // 'ControlNo': new FormControl(null, Validators.required),
    // 'CheckerID': new FormControl(null, Validators.required),
    // 'IntakeID': new FormControl(null,  Validators.required),
    // 'BinloadingDate': new FormControl(new Date, Validators.required),
    // 'BinloadingDateTime': new FormControl(null, Validators.required),
    // 'Quantity': new FormControl(null, Validators.required),
    // 'Weight': new FormControl(null, Validators.required),
    // 'Status': new FormControl(0),
    // 'UserID': new FormControl(null),

    onSubmitBinload() {

        if (!this.binloadForm.valid) {
            console.log('form invalid');
            return
        }

        this.binloadSubmitLoading= true;

        // BinloadingID: number,
        // BinloadingRequestID: number,
        // ControlNo: string,
        // PlantID: number,
        // CheckerID: number,
        // IntakeID: number,
        // WarehousePartitionStockID: number,
        // WarehouseLocationID: number,
        // WarehousePartitionID: number,
        // WarehouseID: number,
        // BinloadingDate: string,
        // BinloadingDateTime: string,
        // RawMaterialID: number,
        // Quantity: number,
        // Weight: number,
        // Status: number,
        // UserID: string
        
        const binloadOBJ = {
            BinloadingID: this.binloadForm.value.BinloadingID,
            BinloadRequestID: this.binloadForm.value.BinloadRequestID,
            ControlNo: this.binloadForm.value.ControlNo,
            PlantID: this.binloadForm.value.PlantID,
            CheckerID: this.UserID,
            IntakeID: this.binloadForm.value.IntakeID,
            WarehousePartitionStockID: this.binloadForm.value.WarehousePartitionStockID,
            WarehouseLocationID: this.binloadForm.value.WarehouseLocationID,
            WarehousePartitionID: this.binloadForm.value.WarehousePartitionID,
            WarehouseID: this.binloadForm.value.WarehouseID,
            PO: this.binloadForm.value.PO,
            BL: this.binloadForm.value.BL,
            BinloadingDate: this.binloadForm.value.BinloadingDate.toLocaleDateString(),
            BinloadingDateTime: this.binloadForm.value.BinloadingDateTime.toLocaleString(),
            RawMaterialID: this.binloadForm.value.RawMaterialID,
            Quantity: this.binloadForm.value.Quantity,
            Weight: this.binloadForm.value.Weight,
            Status: this.binloadForm.value.Status,
            UserID: this.UserID,
            // BinloadDetail: this.binloadDetail
        }

        // console.log(binloadOBJ);
        this.BinloadService.saveBinload(binloadOBJ).subscribe(
            response => {

                this.binloadSubmitLoading= false;

                if( response === 1) {
                    this.visible = false;
                    this.MessageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Item: ' + this.binloadForm.value.BinloadingID +  ' successfully recorded', 
                        life: 3000 
                    });

                    this.getBinloadRequest();
                    this.clearRequestDialog;
                    this.visibleRequestModal = false;
                } 

                else if ( response === 2) {

                    this.MessageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Item: ' + this.binloadForm.value.BinloadingID +  ' successfully updated', 
                        life: 3000 
                    });

                    this.getBinloadRequest();
                    this.clearRequestDialog();
                    this.visibleRequestModal = false;
                }
                else if ( response === 0) {

                    this.MessageService.add({ 
                        severity: 'error', 
                        summary: 'Danger', 
                        detail: 'Item: ' + this.binloadForm.value.BinloadingID +  ' already exist', life: 3000 
                    });

                }
                
            }, errorMessage => {
                this.binloadSubmitLoading= false;
                
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: errorMessage, 
                    life: 3000 
                });
            
            }

        )
    }



    // ==== INPUT SEARCH DATA====
    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }

}

interface ResponseData {

}


