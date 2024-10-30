import { Component, OnDestroy, OnInit } from "@angular/core";
import { UnloadingTransactionService } from "./unloading-transaction.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CheckerService } from "../checker/checker.service";
import { Observable, Subscription } from "rxjs";
import { TruckService } from "../truck/truck.service";
import { MessageService } from "primeng/api";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { WarehouseService } from "../warehouse/warehouse.service";
import { WarehousePartitionService } from "../warehouse-partition/warehouse-partition.service";
import { SupplierService } from "../supplier/supplier.service";
import { Dialog } from "primeng/dialog";
import { Table } from "primeng/table";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { FileSelectEvent, FileUploadEvent, UploadEvent } from "primeng/fileupload";

@Component({
    selector: 'app-unloading-transaction',
    templateUrl: 'unloading-transaction.component.html',
    styleUrls: ['unloading-transaction.component.css'],
})
export class UnloadingTransactionComponent implements OnInit, OnDestroy{

    unloadingTransaction: any[] = [];

    checker: any[] = [];

    truck: any[] = [];

    rawMaterial: any[] = [];

    warehouse: any[] = [];

    selectedWarehouse: any[] = [];

    warehousePartition: any[] = [];

    supplier: any[] = [];

    trucking: any[] = [];

    truckType: any[] = [];

    bl: any[] = [];
    po: any[] = [];

    containerNumber: any[] = [];

    transaction: any[] = [];

    unloadingFilter: any[] = [
        { label: 'Local', value: 1}, 
        { label: 'Import', value: 2}, 
    ];

    value: number = 1;

    selectedTransaction: number = 0;

    unloadingTransactionForm!: FormGroup;

    truckForm!: FormGroup;

    visible: boolean = false;
    visibleTruckModal: boolean = false;

    dialogHeader?: string;

    isLoading: boolean = false;

    mouseValue: string = '';

    selectedPackaging: number = 0;

    maxDate!: Date;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;
    approval: boolean = false;

    uploadedFiles: any[] = [];

    files: any[] = [];
    images: any[] | undefined;

    displayBasic: boolean = false;
    loading: boolean = false;

    userID: string = '';

    responsiveOptions: any[] = [
        {
            breakpoint: '1500px',
            numVisible: 1
        },
        {
            breakpoint: '1024px',
            numVisible: 1
        },
        {
            breakpoint: '768px',
            numVisible: 1
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    BeforeImage?:string;

    selectedOption: number = 1;

    submitLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private UnloadingTransactionService: UnloadingTransactionService,
        private CheckerService: CheckerService,
        private TruckService: TruckService,
        private MessageService: MessageService, 
        private RawMaterialService: RawMaterialsService,
        private WarehouseService: WarehouseService,
        private WarehousePartitionService: WarehousePartitionService,
        private SupplierService: SupplierService,
        private TruckingService: TruckService,
        private UsersService: UsersService,
        private auth: AuthService,
    ) {}

    ngOnInit(): void {
        this.maxDate = new Date();
        this.transaction = [
            {
                TransactionID: 1,
                Label: 'Local'
            },
            {
                TransactionID: 2,
                Label: 'Import'
            },
        ]

        this.unloadingTransactionForm = new FormGroup({
            'UnloadingTransactionID': new FormControl(0),
            'isTransactionID': new FormControl(0),
            'PO': new FormControl(null),
            'BL': new FormControl(null),
            'ContainerNumber': new FormControl(null),
            'DateTimeUnload': new FormControl(null),
            'DateUnload': new FormControl(null, Validators.required),
            'DrNumber': new FormControl(null, Validators.required),
            // 'CheckerID': new FormControl(null, Validators.required),
            'TruckID': new FormControl(null, Validators.required),
            'RawMaterialID': new FormControl(null, Validators.required),
            'WarehouseLocationID': new FormControl(null), 
            'WarehouseID': new FormControl(null, Validators.required),
            'WarehousePartitionID': new FormControl(null, Validators.required),
            'Quantity': new FormControl(null, Validators.required),
            'Weight': new FormControl(null, Validators.required),
            'SupplierID': new FormControl(null, Validators.required),
            'Status': new FormControl(0),
            // 'file': new FormControl(null),
            'UserID': new FormControl(0),
        })

        this.truckForm = new FormGroup({
            'TruckID': new FormControl(0),
            'TruckingID': new FormControl(null, Validators.required),
            'TruckTypeID': new FormControl(null, Validators.required),
            'PlateNo': new FormControl(null, Validators.required),
            'Description': new FormControl(null),
            'UserID': new FormControl
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
        
        // this.getData();
        this.onFilterUnloading();
        this.getWarehousePartition();
        this.getWarehouse();
        this.getRawMats();
        this.getTruck();
        this.getChecker();
        this.getSupplier();
        this.getBL();
        this.getPO();
        this.getTrucking();
        this.getTruckType();

    }


    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;
                    // console.log(userRights)
                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight) {
                            case 23.1:
                                this.view = true;
                                break;
                            case 23.2:
                                this.insert = true;
                                break;
                            case 23.3:
                                this.edit = true;
                                break;
                            case 23.4:
                                this.generateReport = true;
                                break;
                            case 23.5:
                                this.approval = true;
                                break;
                            default:
                                break;
                        }
                    }
                    
                }
            )       
        )
    }

    onFilterUnloading() {
        this.isLoading = true;
        this.subscription.add(
            this.UnloadingTransactionService.filterUnloadingTransaction(this.value).subscribe(
                response => {
                    this.isLoading = false;
                    this.unloadingTransaction = response;
                }
            )
        )
    }
    
    getChecker() {
        this.subscription.add(
            this.CheckerService.getCheckerData().subscribe(
                response => {
                    this.checker = response
                }
            )
        )
    }

    getTruck() {
        this.subscription.add(
            this.TruckService.GetTruckData().subscribe(
                response => {
                    this.truck = response
                }
            )
        )
    }

    getRawMats() {
        this.subscription.add(
            this.RawMaterialService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterial = response;
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
                        }
                    }
                }
            )
        )
    }

    getWarehousePartition() {
        this.WarehousePartitionService.getWarehousePartitionData().subscribe(
            response => {
                this.warehousePartition = response;
            }
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

    getBL() {
        this.subscription.add(
            this.UnloadingTransactionService.getBL().subscribe(
                response => {
                    this.bl = response;
                    for (let i = 0; i < this.bl.length; i++) {
                        this.bl[i] = {
                            ...this.bl[i], 
                            BlPackaging: `${this.bl[i].MBL} - ${this.bl[i].Packaging == 1 ? 'Containerized' : 'Bulk'}`
                        }
                    }
                }
            )
        )
    }

    getPO() {
        this.subscription.add(
            this.UnloadingTransactionService.getPO().subscribe(
                response => {
                    this.po = response;
                }
            )
        )
    }

    getTrucking() {
        this.subscription.add(
            this.TruckingService.GetTruckingData().subscribe(
                response => {
                    this.trucking = response;
                }
            )
        )
    }

    getTruckType() {
        this.subscription.add(
            this.TruckingService.GetTruckTypeData().subscribe(
                response => {
                    this.truckType = response;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog(dialog: Dialog) {
        if (!this.insert) {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized', 
                life: 3000 
            });
        }


        console.log(this.value);

        // onSelectTransaction()
        // console.log(this.value)
        this.onSelectTransaction(this.value)

        dialog.maximize();
        this.clearItems();
        this.visible = true;
        this.dialogHeader = 'Add Unloading Transaction';
    }

    showTruckDialog() {
        this.clearTruckForm();
        this.visibleTruckModal = true;
    }

    clearItems() {
        this.unloadingTransactionForm.reset();
        this.unloadingTransactionForm.patchValue({
            UnloadingTransactionID: 0, 
            Status: 0
        })
        this.selectedTransaction = 0;
        this.BeforeImage = '';

        this.files = [];
    }

    clearTruckForm() {
        this.truckForm.reset();
        this.truckForm.patchValue({TruckID: 0})
    }

    onUpload(event: any) {
        const file = [...event.currentFiles];

        this.files = file;

        // console.log(this.files)
        

        // if (file) {
        //     this.unloadingTransactionForm.patchValue({
        //       file: file
        //     });
        //   } else {
        //     console.error('No file selected');
        // }

        
        // const file = event.files[0];

        // this.unloadingTransactionForm.patchValue({file: file})

        // const formData = new FormData();
        // formData.append('file', file);

        // this.UnloadingTransactionService.fileUpload(formData).subscribe(
        //     response => {
        //         console.log(response)
        //     }, err => {
        //         console.log(err);
        //     }
        // )

        // console.log(formData);
    }


    // if (data.BeforeImage){
    //     this.BeforeImage = 'http://10.10.2.110/project/'+ data.BeforeImage;
    //     // this.BeforeImage = data.BeforeImage;
    // }

    getImage(data: any) {
        this.images = [];
        this.loading = true;
        let selectedID = data.UnloadingTransactionID;

        this.UnloadingTransactionService.getImage(selectedID).subscribe(
            response => {
                this.loading = false;
                this.images = [...response];

                if (this.images.length === 0) {
                    // alert('No images uploaded');
                    this.MessageService.add({ severity: 'info', summary: 'No Image', detail: 'No image was found.' });
                    return
                }
                
                this.displayBasic = true;
                
            }, err => {
                console.error(err)
                this.loading = false
            }
        )
    }

    onSubmit() {


        this.submitLoading = true;

        const formData = new FormData();

        const data = { 
            UnloadingTransactionID: this.unloadingTransactionForm.value.UnloadingTransactionID,
            isTransactionID:  this.selectedTransaction,
            PO:  this.unloadingTransactionForm.value.PO === null ? null : this.unloadingTransactionForm.value.PO.PurchaseOrderID,
            BL :this.unloadingTransactionForm.value.BL === null ? null : this.unloadingTransactionForm.value.BL.ShippingTransactionID,
            BLNumber:this.unloadingTransactionForm.value.BL === null ? null : this.unloadingTransactionForm.value.BL.MBL,
            ContainerNumber: this.unloadingTransactionForm.value.ContainerNumber === null ? null : this.unloadingTransactionForm.value.ContainerNumber.PullOutID,
            DateTimeUnload: this.unloadingTransactionForm.value.DateTimeUnload.toLocaleString(),
            DateUnload: this.unloadingTransactionForm.value.DateUnload.toLocaleDateString(),
            DrNumber: this.unloadingTransactionForm.value.DrNumber,
            // CheckerID:this.unloadingTransactionForm.value.CheckerID.CheckerID,
            TruckID: this.unloadingTransactionForm.value.TruckID.TruckID,
            RawMaterialID: this.unloadingTransactionForm.value.RawMaterialID.RawMaterialID,
            WarehouseLocationID:this.unloadingTransactionForm.value.WarehouseLocationID,
            WarehouseID:this.unloadingTransactionForm.value.WarehouseID.WarehouseID,
            WarehousePartitionID: this.unloadingTransactionForm.value.WarehousePartitionID.WarehousePartitionID,
            Quantity: this.unloadingTransactionForm.value.Quantity,
            Weight:this.unloadingTransactionForm.value.Weight,
            SupplierID: this.unloadingTransactionForm.value.SupplierID.SupplierID,
            Status:this.unloadingTransactionForm.value.Status,
            UserID: this.userID
        }
 
        formData.append('data', JSON.stringify({data:data}));

        this.files.forEach(file => {
            formData.append('files[]', file);
        })


        let authObs: Observable<ResponseData>;
        authObs = this.UnloadingTransactionService.saveData
        (           
            formData
        )

        authObs.subscribe(response =>{
            this.submitLoading = false;

            if( response == 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: ' successfully recorded', 
                    life: 3000 
                });
                this.onFilterUnloading();
                this.clearItems();
                this.visible = false;
            } 
            else if ( response == 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: ' successfully updated', 
                    life: 3000 
                });
                this.onFilterUnloading();
                this.clearItems();
                this.visible = false;
            }
            else if ( response == 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.unloadingTransactionForm.value.UnloadingTransactionID +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.submitLoading = false;
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }


    onSubmitTruckDialog() {
        let authObs2: Observable<ResponseData>;
        authObs2 = this.TruckService.saveData(
            this.truckForm.value.TruckID,
            this.truckForm.value.TruckingID.TruckingID,
            // this.truckForm.value.TruckTypeID.TruckTypeID,
            this.truckForm.value.PlateNo,
            this.truckForm.value.Description,
            this.userID,
        )

        authObs2.subscribe(response =>{

            if( response == 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: ' successfully recorded', 
                    life: 3000 
                });
                this.getTruck();
                this.clearTruckForm();
                this.visibleTruckModal = false;
            } 
            else if ( response == 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: ' successfully updated', 
                    life: 3000 
                });
                this.getTruck();
                this.clearTruckForm();
                this.visibleTruckModal = false;
            }
            else if ( response == 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.unloadingTransactionForm.value.UnloadingTransactionID +  ' already exist', 
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

    // this.unloadingTransactionForm = new FormGroup({
    //     'UnloadingTransactionID': new FormControl(0),
    //     'isTransactionID': new FormControl(0),
    //     'PO': new FormControl(null),
    //     'BL': new FormControl(null),
    //     'ContainerNumber': new FormControl(null),
    //     'DateTimeUnload': new FormControl(null),
    //     'DateUnload': new FormControl(null, Validators.required),
    //     'DrNumber': new FormControl(null, Validators.required),
    //     'CheckerID': new FormControl(null, Validators.required),
    //     'TruckID': new FormControl(null, Validators.required),
    //     'RawMaterialID': new FormControl(null, Validators.required),
    //     'WarehouseID': new FormControl(null, Validators.required),
    //     'WarehousePartitionID': new FormControl(null, Validators.required),
    //     'Quantity': new FormControl(null, Validators.required),
    //     'Weight': new FormControl(null, Validators.required),
    //     'SupplierID': new FormControl(null, Validators.required),
    //     'UserID': new FormControl(0),
    // })

    onSelectTransaction(event: any) {

        if (event.value === null) {
            this.clearItems();
            this.selectedTransaction = 0; 
            return;
        }

        // console.log(dialog.maximize())
        // this.selectedTransaction = event.value.TransactionID;

        this.unloadingTransactionForm.get('BL')?.clearValidators();
        this.unloadingTransactionForm.get('ContainerNumber')?.clearValidators();
        this.unloadingTransactionForm.get('PO')?.clearValidators();

        if (this.value == 1) {

            this.unloadingTransactionForm.get('PO')?.setValidators(Validators.required);
            // this.unloadingTransactionForm.get('BL')?.clearValidators();
            // this.unloadingTransactionForm.get('ContainerNumber')?.clearValidators();

        } else if (this.value == 2) {

            this.unloadingTransactionForm.get('BL')?.setValidators(Validators.required);
            // this.unloadingTransactionForm.get('ContainerNumber')?.setValidators(Validators.required);
            // this.unloadingTransactionForm.get('PO')?.clearValidators();
        }

         // Update the form control states
         this.unloadingTransactionForm.get('PO')?.updateValueAndValidity();
         this.unloadingTransactionForm.get('BL')?.updateValueAndValidity();
         this.unloadingTransactionForm.get('ContainerNumber')?.updateValueAndValidity();
        
    }

    onSelectPO(data: any) {
        // console.log(data);
    }


    onSelectBL(data: any) {
        // this.unloadingTransactionForm.get('BL')?.clearValidators();
        // this.unloadingTransactionForm.get('ContainerNumber')?.clearValidators();
        // console.log(data);
        this.containerNumber = [];

        if (data == null) {
            this.selectedPackaging = 0;
            this.unloadingTransactionForm.patchValue({SupplierID: null, RawMaterialID: null});
            this.unloadingTransactionForm.get('BL')?.setValidators(Validators.required);
            this.unloadingTransactionForm.get('ContainerNumber')?.clearValidators();
            return
        };

        // console.log(data.Packaging)

        this.unloadingTransactionForm.get('BL')?.clearValidators();
        this.unloadingTransactionForm.get('ContainerNumber')?.clearValidators();

        if (data.Packaging === 1) {
            this.unloadingTransactionForm.get('BL')?.setValidators(Validators.required);
            this.unloadingTransactionForm.get('ContainerNumber')?.setValidators(Validators.required);
        } else if (data.Packaging === 2) {
            this.unloadingTransactionForm.get('BL')?.setValidators(Validators.required);
        }

        // Update the form control states
        this.unloadingTransactionForm.get('BL')?.updateValueAndValidity();
        this.unloadingTransactionForm.get('ContainerNumber')?.updateValueAndValidity();

        
        this.containerNumber = [...data.PullOutDetail];
        this.selectedPackaging = data.Packaging;

        let SupplierValue = this.findObjectByID(data.SupplierID, 'SupplierID' , this.supplier);
        let RawMatsValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterial);

        this.unloadingTransactionForm.patchValue({SupplierID: SupplierValue, RawMaterialID: RawMatsValue});
        // console.log(this.containerNumber);
    }


    displayImage(imageName: string) {
        return 'http://10.10.2.110/project/'+ imageName;
    }

    onSelect(data: any, dialog: Dialog) {
        if(!this.edit) {
            this.MessageService.add({ severity: 'error', summary: 'Warning', detail: 'You are not authorized!', life: 3000 });
        }

        // console.log(data);
        dialog.maximize();
        this.clearItems();
        this.visible = true;
        this.dialogHeader = 'Edit Unloading Transaction';
        // this.showDialog(dialog);
        this.selectedTransaction = data.isTransactionID;

        let POValue = this.findObjectByID(+data.PO, 'PurchaseOrderID', this.po);

        let BlValue = this.findObjectByID(+data.BL, 'ShippingTransactionID', this.bl);

        this.onSelectBL(BlValue);

        let ContainerValue = this.findObjectByID(+data.ContainerID, 'PullOutID', this.containerNumber);

        let TransactionValue = this.findObjectByID(data.isTransactionID, 'TransactionID', this.transaction);

        let CheckerValue = this.findObjectByID(data.CheckerID, 'CheckerID', this.checker);

        let TruckValue = this.findObjectByID(data.TruckID, 'TruckID', this.truck);

        let RawMaterialValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterial);

        let WarehouseValue = this.findObjectByID(data.WarehouseID, 'WarehouseID', this.warehouse);

        this.onSelectWarehouse(WarehouseValue);

        let WarehousePartitionValue = this.findObjectByID(data.WarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let SupplierValue = this.findObjectByID(data.SupplierID, 'SupplierID', this.supplier);

        if (data.BeforeImage){
            this.BeforeImage = 'http://10.10.2.110/project/'+ data.BeforeImage;
            // this.BeforeImage = data.BeforeImage;
        }


        this.unloadingTransactionForm.setValue({
            UnloadingTransactionID: data.UnloadingTransactionID,
            isTransactionID: TransactionValue,
            PO: POValue,
            BL: BlValue,
            ContainerNumber: ContainerValue,
            DateTimeUnload: new Date(data.DateTimeUnload.date),
            DateUnload: new Date(data.DateUnload.date),
            DrNumber: data.DrNumber,
            CheckerID: CheckerValue,
            TruckID: TruckValue,
            RawMaterialID: RawMaterialValue,
            WarehouseLocationID: data.WarehouseLocationID,
            WarehouseID: WarehouseValue,
            WarehousePartitionID: WarehousePartitionValue,
            Quantity: data.Quantity,
            Weight: data.Weight,
            SupplierID: SupplierValue,
            Status: data.Status,
            UserID: data.UserID,            
        });


    }

    onAprrove(data: any) {
        this.selectedTransaction = data.isTransactionID;

        let POValue = this.findObjectByID(+data.PO, 'PurchaseOrderID', this.po);

        let BlValue = this.findObjectByID(+data.BL, 'ShippingTransactionID', this.bl);

        this.onSelectBL(BlValue)

        let ContainerValue = this.findObjectByID(+data.ContainerID, 'PullOutID', this.containerNumber);

        let TransactionValue = this.findObjectByID(data.isTransactionID, 'TransactionID', this.transaction);

        let CheckerValue = this.findObjectByID(data.CheckerID, 'CheckerID', this.checker);

        let TruckValue = this.findObjectByID(data.TruckID, 'TruckID', this.truck);

        let RawMaterialValue = this.findObjectByID(data.RawMaterialID, 'RawMaterialID', this.rawMaterial);

        let WarehouseValue = this.findObjectByID(data.WarehouseID, 'WarehouseID', this.warehouse);

        let WarehousePartitionValue = this.findObjectByID(data.WarehousePartitionID, 'WarehousePartitionID', this.warehousePartition);

        let SupplierValue = this.findObjectByID(data.SupplierID, 'SupplierID', this.supplier);


        this.unloadingTransactionForm.setValue({
            UnloadingTransactionID: data.UnloadingTransactionID,
            isTransactionID: TransactionValue,
            PO: POValue,
            BL: BlValue,
            ContainerNumber: ContainerValue,
            DateTimeUnload: new Date(data.DateTimeUnload.date),
            DateUnload: new Date(data.DateUnload.date),
            DrNumber: data.DrNumber,
            CheckerID: CheckerValue,
            TruckID: TruckValue,
            RawMaterialID: RawMaterialValue,
            WarehouseLocationID: data.WarehouseLocationID,
            WarehouseID: WarehouseValue,
            WarehousePartitionID: WarehousePartitionValue,
            Quantity: data.Quantity,
            Weight: data.Weight,
            SupplierID: SupplierValue,
            Status: 3,
            UserID: data.UserID
        });

        this.onSubmit();
    }

    onSelectWarehouse(data: any) {

        this.selectedWarehouse = [];
        if (data == null) {
            return;
        }

        this.unloadingTransactionForm.patchValue({WarehouseLocationID: data.WarehouseLocationID});

        for (let i = 0; i <= this.warehousePartition.length -1; i++) {
            if (data.WarehouseID == this.warehousePartition[i].WarehouseID) {
                this.selectedWarehouse.push(this.warehousePartition[i])
                // this.selectedWarehouse = [...this.selectedWarehouse, this.warehousePartition[i]]
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }
}

interface ResponseData {

}